import json
import os
import pyspark.sql.functions as F
from pyspark.sql import SparkSession

def main():
    # 1. Khởi tạo Spark Session (Cấp 4GB RAM vì file này nặng)
    spark = SparkSession.builder \
        .appName("RedditAnalysis") \
        .config("spark.driver.memory", "4g") \
        .getOrCreate()
    
    spark.sparkContext.setLogLevel("WARN")

    print("--- 1. ĐANG ĐỌC VÀ LÀM SẠCH DỮ LIỆU ---")
    
    # Đọc file Posts
    posts_df = spark.read.csv("hdfs://namenode:8020/input/posts.csv", header=True, inferSchema=True, multiLine=True, escape='"')
    
    # Lọc bỏ dữ liệu rác
    clean_posts = posts_df.filter(
        (F.col("selftext").isNotNull()) & 
        (F.col("selftext") != "[deleted]") & 
        (F.col("selftext") != "[removed]")
    )

    print(f"Số lượng bài đăng sạch: {clean_posts.count()}")

    print("\n--- 2. TÌM TOP 20 BÀI ĐĂNG TƯƠNG TÁC CAO NHẤT ---")
    # Lấy title, score, ngày tạo
    top_posts = clean_posts.select("title", "score", "created_utc") \
                           .orderBy(F.col("score").desc()) \
                           .limit(20)
    
    # Chuyển đổi dữ liệu Spark DataFrame sang List Python (Dictionary)
    posts_data = [row.asDict() for row in top_posts.collect()]

    # --- CHUẨN BỊ JSON ---
    final_result = {
        "lab_name": "Lab 4: Reddit Analysis",
        "description": "Top 20 bài đăng có điểm số (Score) cao nhất trên r/antiwork",
        "data": posts_data
    }

    # --- LƯU FILE JSON ---
    output_dir = "/app/src/results/lab2"
    output_file = os.path.join(output_dir, "reddit_top_posts.json")
    os.makedirs(output_dir, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(final_result, f, indent=2)

    print(f" Đã xuất kết quả Bài 4 thành công tại: {output_file}")
    spark.stop()

if __name__ == "__main__":
    main()