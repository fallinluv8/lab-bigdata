'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { TrendingUp, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function RedditCharts({ topPosts, timeline }: any) {
  const [commentData, setCommentData] = useState<any>(null);

  useEffect(() => {
    // Tự động load thêm file Top Bình Luận khi Component này được bật
    fetch('/data/reddit_sentiment_extremes.json')
      .then((res) => res.json())
      .then((data) => setCommentData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className='max-w-7xl mx-auto grid grid-cols-1 gap-12 animate-in fade-in duration-500'>
      {/* 1. TOP POSTS (BÀI ĐĂNG) */}
      <section className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
        <h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2'>
          <AlertCircle className='w-5 h-5 text-red-500' /> Top Bài Đăng "Gây
          Bão"
        </h2>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={topPosts.data.slice(0, 10)}
              layout='vertical'
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                horizontal={true}
                vertical={false}
              />
              <XAxis type='number' />
              <YAxis
                type='category'
                dataKey='title'
                width={450}
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={{ maxWidth: '500px' }} />
              <Legend />
              <Bar
                dataKey='score'
                fill='#ea580c'
                name='Điểm Score'
                radius={[0, 4, 4, 0]}
                barSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 2. TOP COMMENTS (BÌNH LUẬN) - PHẦN MỚI */}
      {commentData ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Tích cực */}
          <section className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-[500px]'>
            <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-green-700 border-b pb-2'>
              <ThumbsUp className='w-5 h-5' /> Bình Luận Tích Cực Nhất
            </h2>
            <div className='flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar'>
              {commentData.positive.map((cmt: any, idx: number) => (
                <div
                  key={idx}
                  className='p-4 bg-green-50/50 rounded-lg border border-green-100 text-sm text-gray-700 hover:bg-green-50 transition-colors'
                >
                  <p className='italic mb-2'>"{cmt.body}"</p>
                  <div className='flex justify-end gap-3 text-xs font-bold text-green-800'>
                    <span className='bg-green-200 px-2 py-1 rounded'>
                      Score: {cmt.score}
                    </span>
                    <span className='bg-green-200 px-2 py-1 rounded'>
                      Sentiment: {cmt.sentiment.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tiêu cực */}
          <section className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-[500px]'>
            <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-red-700 border-b pb-2'>
              <ThumbsDown className='w-5 h-5' /> Bình Luận Tiêu Cực Nhất
            </h2>
            <div className='flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar'>
              {commentData.negative.map((cmt: any, idx: number) => (
                <div
                  key={idx}
                  className='p-4 bg-red-50/50 rounded-lg border border-red-100 text-sm text-gray-700 hover:bg-red-50 transition-colors'
                >
                  <p className='italic mb-2'>"{cmt.body}"</p>
                  <div className='flex justify-end gap-3 text-xs font-bold text-red-800'>
                    <span className='bg-red-200 px-2 py-1 rounded'>
                      Score: {cmt.score}
                    </span>
                    <span className='bg-red-200 px-2 py-1 rounded'>
                      Sentiment: {cmt.sentiment.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className='text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400'>
          Đang tải dữ liệu bình luận...
        </div>
      )}

      {/* 3. TIMELINE (BIỂU ĐỒ THỜI GIAN) */}
      <section className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
        <h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2'>
          <TrendingUp className='w-5 h-5 text-blue-600' /> Xu Hướng Cộng Đồng
          Theo Thời Gian
        </h2>
        <div className='h-[500px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={timeline.data}>
              <CartesianGrid stroke='#f5f5f5' />
              <XAxis
                dataKey='year_month'
                tick={{ fontSize: 12 }}
                minTickGap={30}
              />
              <YAxis
                yAxisId='left'
                orientation='left'
                stroke='#8884d8'
                label={{
                  value: 'Số bài đăng',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                stroke='#ff7300'
                domain={[-0.2, 0.2]}
                label={{
                  value: 'Cảm xúc TB',
                  angle: 90,
                  position: 'insideRight',
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId='left'
                dataKey='post_count'
                barSize={20}
                fill='#8884d8'
                name='Số lượng bài viết'
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='avg_sentiment'
                stroke='#ff7300'
                strokeWidth={3}
                name='Cảm xúc trung bình'
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
