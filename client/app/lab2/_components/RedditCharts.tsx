'use client';

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
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function RedditCharts({ topPosts, timeline }: any) {
  return (
    <div className='max-w-7xl mx-auto grid grid-cols-1 gap-10 animate-in fade-in duration-500'>
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
