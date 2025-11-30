import json
import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, split, col, lower, desc

def main():
    # Khởi tạo Spark
    spark = SparkSession.builder.appName("HarryPotterWordCount").getOrCreate()
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG XỬ LÝ DỮ LIỆU ---")
    # Đọc dữ liệu từ HDFS
    df = spark.read.text("hdfs://namenode:8020/input/harrypotter.txt")
    
    words_df = df.select(explode(split(lower(col("value")), "\\s+")).alias("word"))
    words_df = words_df.filter(col("word") != "")
    word_counts = words_df.groupBy("word").count()


    top_20 = word_counts.orderBy(desc("count")).limit(20).collect()
    # Chuyển đổi thành dạng từ điển (Dictionary) để lưu JSON
    top_20_data = [row.asDict() for row in top_20]

    target_words = ["harry", "ron", "hermione", "malfoy", "snape", "dumbledore"]
    characters = word_counts.filter(col("word").isin(target_words)).orderBy(desc("count")).collect()
    characters_data = [row.asDict() for row in characters]

    final_result = {
        "lab_name": "Lab 2: Word Count",
        "description": "Thống kê từ vựng và nhân vật trong Harry Potter",
        "top_words": top_20_data,
        "characters": characters_data
    }

    
    output_dir = "/app/src/results/lab2"
    output_file = os.path.join(output_dir, "word_count.json")
    
    os.makedirs(output_dir, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(final_result, f, indent=2)

    print(f" Đã xuất kết quả thành công tại: {output_file}")
    
    spark.stop()

if __name__ == "__main__":
    main()