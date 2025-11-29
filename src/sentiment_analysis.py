import json
import os
import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.window import Window
from pyspark.sql.types import ArrayType, StringType, FloatType
from textblob import TextBlob

def main():
    # Khởi tạo Spark
    spark = SparkSession.builder.appName("HarryPotterSentiment").getOrCreate()
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG XỬ LÝ DỮ LIỆU ---")
    df = spark.read.text("hdfs://namenode:8020/input/harrypotter.txt")
    
    # --- ETL: TÁCH CÂU ---
    df = df.withColumn("line_id", F.monotonically_increasing_id())
    w = Window.orderBy("line_id")
    df = df.withColumn("is_chapter_start", F.when(F.col("value").rlike("(?i)^chapter"), 1).otherwise(0))
    df = df.withColumn("chapter_number", F.sum("is_chapter_start").over(w))
    df = df.filter(F.col("chapter_number") > 0)
    
    chapter_df = df.groupBy("chapter_number").agg(
        F.concat_ws(" ", F.collect_list("value")).alias("chapter_text")
    )
    
    sentences_df = chapter_df.select(
        F.col("chapter_number"),
        F.posexplode(F.split(F.col("chapter_text"), "[.!?]+\\s+")).alias("sentence_number", "sentence_text")
    )
    sentences_df = sentences_df.filter(F.length(F.col("sentence_text")) > 10)

    print("--- 2. TÍNH TOÁN ĐIỂM CẢM XÚC (SENTIMENT) ---")

    def get_sentiment(text):
        try:
            return TextBlob(str(text)).sentiment.polarity
        except:
            return 0.0

    sentiment_udf = F.udf(get_sentiment, FloatType())

    target_characters = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]
    
    def get_chars(text):
        found = []
        if not text: return []
        text_lower = text.lower()
        for char in target_characters:
            if char in text_lower:
                found.append(char)
        return found

    chars_udf = F.udf(get_chars, ArrayType(StringType()))

    processed_df = sentences_df \
        .withColumn("sentiment_score", sentiment_udf(F.col("sentence_text"))) \
        .withColumn("characters", chars_udf(F.col("sentence_text")))

    processed_df = processed_df.filter(F.size(F.col("characters")) > 0)
    processed_df.cache()

    char_sentiment = processed_df.select(
        F.explode("characters").alias("character"),
        "sentiment_score"
    )

    avg_sentiment = char_sentiment.groupBy("character") \
        .agg(F.avg("sentiment_score").alias("avg_score"), F.count("sentiment_score").alias("count")) \
        .orderBy(F.desc("avg_score"))
    
    ranking_data = [row.asDict() for row in avg_sentiment.collect()]

    harry_df = processed_df.filter(F.array_contains(F.col("characters"), "harry"))
    harry_trend = harry_df.groupBy("chapter_number") \
        .agg(F.avg("sentiment_score").alias("avg_sentiment")) \
        .orderBy("chapter_number")
    

    trend_data = [row.asDict() for row in harry_trend.collect()]


    final_result = {
        "lab_name": "Lab 2: Sentiment Analysis",
        "description": "Phân tích cảm xúc nhân vật và diễn biến tâm trạng Harry Potter",
        "ranking": ranking_data,
        "trend": trend_data
    }

    output_dir = "/app/src/results/lab2"
    output_file = os.path.join(output_dir, "sentiment_harry.json")
    os.makedirs(output_dir, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(final_result, f, indent=2)

    print(f" Đã xuất kết quả Bài 3 thành công tại: {output_file}")
    spark.stop()

if __name__ == "__main__":
    main()