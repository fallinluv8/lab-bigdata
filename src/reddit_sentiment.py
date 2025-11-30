import json
import os
import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.types import FloatType
from textblob import TextBlob

def main():
    # 1. Khởi tạo Spark (Cấp 4GB RAM)
    spark = SparkSession.builder \
        .appName("RedditSentimentTimeline") \
        .config("spark.driver.memory", "4g") \
        .getOrCreate()
    
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG ĐỌC DỮ LIỆU ---")
    posts_df = spark.read.csv("hdfs://namenode:8020/input/posts.csv", header=True, inferSchema=True, multiLine=True, escape='"')
    comments_df = spark.read.csv("hdfs://namenode:8020/input/comments.csv", header=True, inferSchema=True, multiLine=True, escape='"')

    # Lọc dữ liệu rác
    clean_posts = posts_df.filter((F.col("selftext").isNotNull()) & (F.col("selftext") != "[deleted]") & (F.col("selftext") != "[removed]"))
    clean_comments = comments_df.filter((F.col("body").isNotNull()) & (F.col("body") != "[deleted]") & (F.col("body") != "[removed]"))

    print("--- ĐANG LẤY MẪU 10% DỮ LIỆU BÌNH LUẬN ---")
    sampled_comments = clean_comments.sample(withReplacement=False, fraction=0.1, seed=42)

    posts_time = clean_posts.withColumn("timestamp", F.from_unixtime("created_utc")) \
                            .withColumn("year_month", F.date_format("timestamp", "yyyy-MM"))
    
    comments_time = sampled_comments.withColumn("timestamp", F.from_unixtime("created_utc")) \
                                    .withColumn("year_month", F.date_format("timestamp", "yyyy-MM"))

    print("--- ĐANG TÍNH ĐIỂM CẢM XÚC (Quá trình này tốn CPU...) ---")
    
    def get_sentiment(text):
        try:
            return TextBlob(str(text)).sentiment.polarity
        except:
            return 0.0

    sentiment_udf = F.udf(get_sentiment, FloatType())

    comments_sent = comments_time.withColumn("sentiment", sentiment_udf(F.col("body")))

    print("--- ĐANG TỔNG HỢP KẾT QUẢ ---")

    posts_stat = posts_time.groupBy("year_month").count().withColumnRenamed("count", "post_count")

    comments_stat = comments_sent.groupBy("year_month") \
        .agg(
            F.count("sentiment").alias("comment_sample_count"),
            F.avg("sentiment").alias("avg_sentiment")
        )

    final_df = posts_stat.join(comments_stat, "year_month", "outer") \
                         .orderBy("year_month") \
                         .na.fill(0)

    timeline_data = [row.asDict() for row in final_df.collect()]

    final_result = {
        "lab_name": "Lab 4: Reddit Timeline Analysis",
        "description": "Biểu đồ phát triển của cộng đồng và diễn biến cảm xúc theo thời gian",
        "data": timeline_data
    }

    output_dir = "/app/src/results/lab2"
    output_file = os.path.join(output_dir, "reddit_timeline.json")
    os.makedirs(output_dir, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(final_result, f, indent=2)

    print(f" Đã xuất kết quả Bài 5 thành công tại: {output_file}")

    spark.stop()

if __name__ == "__main__":
    main()