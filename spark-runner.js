const { execSync } = require('child_process');

const ALL_SCRIPTS = [
  'word_count.py', // Bài 1: Đếm từ Harry Potter
  'character_analysis.py', // Bài 2: Tương tác nhân vật
  'sentiment_analysis.py', // Bài 3: Cảm xúc nhân vật Harry Potter
  'reddit_analysis.py', // Bài 4: Phân tích Reddit (Top posts)
  'reddit_sentiment.py', // Bài 5: Phân tích Cảm xúc Reddit theo thời gian
];

const scriptName = process.argv[2];

if (!scriptName) {
  console.error(
    ' Lỗi: Thiếu tên file script.\n Cách dùng: node spark-runner.js word_count.py hoặc node spark-runner.js all'
  );
  process.exit(1);
}

let scriptsToRun = [];

if (scriptName === 'all') {
  scriptsToRun = ALL_SCRIPTS;
  console.log(
    `\n BẠN ĐANG CHẠY CHẾ ĐỘ BATCH (LAB 2 FULL): ${scriptsToRun.length} files`
  );
} else {
  scriptsToRun = [scriptName];
}

const runJob = (file, index, total) => {
  const containerPath = `/app/src/${file}`;
  const stepInfo = total > 1 ? `[${index + 1}/${total}] ` : '';

  console.log(`\n===================================================`);
  console.log(`${stepInfo} Đang chuẩn bị chạy file: ${file}`);
  console.log(`===================================================`);

  const memory = file.includes('reddit') ? '4g' : '2g';
  if (memory === '4g')
    console.log('⚡ Phát hiện bài toán lớn (Reddit) -> Tăng RAM lên 4GB');

  const command = [
    `docker exec -i spark-worker-1`,
    `/spark/bin/spark-submit`,
    `--master spark://spark-master:7077`,
    `--driver-memory ${memory}`,
    `--conf spark.pyspark.python=python3`,
    `--conf spark.pyspark.driver.python=python3`,
    containerPath,
  ].join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(` Chạy xong thành công: ${file}`);
  } catch (error) {
    console.error(` Có lỗi xảy ra khi chạy file: ${file}`);
  }
};

scriptsToRun.forEach((file, index) => {
  runJob(file, index, scriptsToRun.length);
});

console.log('\n ĐÃ XỬ LÝ XONG TOÀN BỘ LAB 2!');
