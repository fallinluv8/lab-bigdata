import json
import os
import pyspark.sql.functions as F
from pyspark.sql import SparkSession
from pyspark.sql.window import Window
from pyspark.sql.types import ArrayType, StringType
from itertools import combinations

def main():
    # Khởi tạo Spark
    spark = SparkSession.builder.appName("HarryPotterInteraction").getOrCreate()
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG XỬ LÝ DỮ LIỆU ---")
    df = spark.read.text("hdfs://namenode:8020/input/harrypotter.txt")
    
    # --- ETL: TÁCH CÂU ---
    df = df.withColumn("line_id", F.monotonically_increasing_id())
    w = Window.orderBy("line_id")
    df = df.withColumn("is_chapter_start", F.when(F.col("value").rlike("(?i)^chapter"), 1).otherwise(0))
    df = df.withColumn("chapter_number", F.sum("is_chapter_start").over(w))
    df = df.filter(F.col("chapter_number") > 0)
    
    chapter_df = df.groupBy("chapter_number").agg(F.concat_ws(" ", F.collect_list("value")).alias("chapter_text"))
    
    sentences_df = chapter_df.select(
        F.col("chapter_number"),
        F.posexplode(F.split(F.col("chapter_text"), "[.!?]+\\s+")).alias("sentence_number", "sentence_text")
    )
    sentences_df = sentences_df.filter(F.length(F.col("sentence_text")) > 10)

    target_characters = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]
    
    def get_interactions(text):
        found = []
        if not text: return []
        text_lower = text.lower()
        for char in target_characters:
            if char in text_lower:
                found.append(char)
        return list(combinations(sorted(found), 2))

    interaction_udf = F.udf(get_interactions, ArrayType(ArrayType(StringType())))
    interactions_df = sentences_df.withColumn("interactions", interaction_udf(F.col("sentence_text")))
    pairs_df = interactions_df.select(F.explode("interactions").alias("pair"))
    
    result_df = pairs_df.groupBy("pair").count().orderBy(F.desc("count"))

    top_interactions = result_df.limit(30).collect()
    
    interaction_data = []
    for row in top_interactions:
        pair_list = row['pair']
        count = row['count']
        interaction_data.append({
            "character1": pair_list[0].capitalize(),
            "character2": pair_list[1].capitalize(),
            "name": f"{pair_list[0].capitalize()} & {pair_list[1].capitalize()}",
            "count": count
        })


    final_result = {
        "lab_name": "Lab 2: Character Interactions",
        "description": "Mạng lưới các nhân vật xuất hiện cùng nhau trong một câu",
        "data": interaction_data
    }


    output_dir = "/app/src/results/lab2"
    output_file = os.path.join(output_dir, "interactions.json")
    os.makedirs(output_dir, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(final_result, f, indent=2)

    print(f" Đã xuất kết quả Bài 2 (Interactions) thành công tại: {output_file}")
    spark.stop()

if __name__ == "__main__":
    main()