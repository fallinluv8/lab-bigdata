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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  Users,
  HeartPulse,
  TrendingUp,
} from 'lucide-react';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export default function HarryPotterCharts({
  wordData,
  interactionData,
  sentimentData,
}: any) {
  return (
    <div className='max-w-7xl mx-auto grid grid-cols-1 gap-12 animate-in fade-in duration-500'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Top Words */}
        <section className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2'>
            <BarChart3 className='w-5 h-5 text-blue-500' /> Top 20 Từ Phổ Biến
          </h2>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={wordData.top_words}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='word' tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey='count'
                  fill='#3b82f6'
                  name='Số lần'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Nhân vật */}
        <section className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2'>
            <PieIcon className='w-5 h-5 text-purple-500' /> Tỉ lệ Nhân vật chính
          </h2>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={wordData.characters}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey='count'
                  nameKey='word'
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {wordData.characters.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign='bottom' height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Tương tác */}
      <section className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
        <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2'>
          <Users className='w-6 h-6 text-indigo-600' /> Mạng Lưới Tương Tác
        </h2>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={interactionData.data}
              layout='vertical'
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                horizontal={true}
                vertical={false}
              />
              <XAxis type='number' />
              <YAxis
                dataKey='name'
                type='category'
                width={140}
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar
                dataKey='count'
                fill='#6366f1'
                name='Số lần gặp nhau'
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Cảm xúc */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <section className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2'>
            <HeartPulse className='w-5 h-5 text-pink-500' /> Chỉ Số Hạnh Phúc
          </h2>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={sentimentData.ranking}
                layout='vertical'
                margin={{ left: 40 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type='number' domain={['auto', 'auto']} />
                <YAxis dataKey='character' type='category' />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='avg_score'
                  name='Điểm cảm xúc TB'
                  fill='#ec4899'
                  radius={[0, 4, 4, 0]}
                >
                  {sentimentData.ranking.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avg_score > 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2'>
            <TrendingUp className='w-5 h-5 text-orange-500' /> Tâm Trạng Harry
            Theo Chương
          </h2>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={sentimentData.trend}>
                <defs>
                  <linearGradient
                    id='colorSentiment'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#f97316' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#f97316' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='chapter_number'
                  label={{
                    value: 'Chương',
                    position: 'insideBottomRight',
                    offset: -5,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='avg_sentiment'
                  stroke='#f97316'
                  fillOpacity={1}
                  fill='url(#colorSentiment)'
                  name='Cảm xúc'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
