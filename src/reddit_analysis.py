import json
import os
import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.types import FloatType
from textblob import TextBlob

def main():
    spark = SparkSession.builder \
        .appName("RedditAnalysis_Full") \
        .config("spark.driver.memory", "4g") \
        .getOrCreate()
    
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG ĐỌC DỮ LIỆU ---")
    posts_df = spark.read.csv("hdfs://namenode:8020/input/posts.csv", header=True, inferSchema=True, multiLine=True, escape='"')
    comments_df = spark.read.csv("hdfs://namenode:8020/input/comments.csv", header=True, inferSchema=True, multiLine=True, escape='"')
    
    print("\n--- 2. XỬ LÝ TOP BÀI ĐĂNG ---")
    clean_posts = posts_df.filter(
        (F.col("selftext").isNotNull()) & 
        (F.col("selftext") != "[deleted]") & 
        (F.col("selftext") != "[removed]")
    )
    
    top_posts = clean_posts.select("title", "score", "created_utc") \
                           .orderBy(F.col("score").desc()) \
                           .limit(20)
    
    posts_data = [row.asDict() for row in top_posts.collect()]

    print("\n--- 3. XỬ LÝ TOP BÌNH LUẬN (SENTIMENT) ---")
    
    clean_comments = comments_df.filter(
        (F.col("body").isNotNull()) & 
        (F.col("body") != "[deleted]") & 
        (F.col("body") != "[removed]") &
        (F.length(F.col("body")) > 20)
    )

    print("... Đang lấy mẫu 5% bình luận để chấm điểm ...")
    sampled_comments = clean_comments.sample(withReplacement=False, fraction=0.05, seed=99)

    def get_sentiment(text):
        try:
            return TextBlob(str(text)).sentiment.polarity
        except:
            return 0.0
            
    sentiment_udf = F.udf(get_sentiment, FloatType())

    scored_comments = sampled_comments.withColumn("sentiment", sentiment_udf(F.col("body"))) \
                                      .select("body", "sentiment")

    top_positive = scored_comments.orderBy(F.col("sentiment").desc()).limit(10)
    pos_data = [row.asDict() for row in top_positive.collect()]
    top_negative = scored_comments.orderBy(F.col("sentiment").asc()).limit(10)
    neg_data = [row.asDict() for row in top_negative.collect()]


    output_dir = "/app/src/results/lab2"
    os.makedirs(output_dir, exist_ok=True)
    
    # File 1: Top Posts 
    final_posts = {
        "lab_name": "Lab 4: Reddit Top Posts",
        "description": "Những bài đăng có điểm tương tác cao nhất",
        "data": posts_data
    }
    with open(f"{output_dir}/reddit_top_posts.json", "w") as f:
        json.dump(final_posts, f, indent=2)

    # File 2: Top Comments Sentiment 
    final_comments = {
        "lab_name": "Lab 4: Reddit Sentiment Extremes",
        "description": "Những bình luận mang tính tích cực nhất và tiêu cực nhất",
        "positive": pos_data,
        "negative": neg_data
    }
    with open(f"{output_dir}/reddit_sentiment_extremes.json", "w") as f:
        json.dump(final_comments, f, indent=2)

    print(f" HOÀN TẤT! Đã xuất 2 file:\n 1. {output_dir}/reddit_top_posts.json\n 2. {output_dir}/reddit_sentiment_extremes.json")
    spark.stop()

if __name__ == "__main__":
    main()