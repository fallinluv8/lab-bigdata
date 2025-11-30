import Link from 'next/link';
import { BookOpen, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className='min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900'>
      {/* Background effects */}
      <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent -z-10' />
      <div className='absolute -top-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10' />
      <div className='absolute top-40 -left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-10' />

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Header */}
        <div className='text-center mb-20 space-y-4'>
          <div className='inline-block px-6 py-2 bg-blue-100 text-blue-700 text-xl font-semibold rounded-full shadow-sm'>
            2001224565 • Nguyễn Như Quang Tùng
          </div>

          <div className='inline-block px-6 py-2 bg-blue-100 text-blue-700 text-xl font-semibold rounded-full shadow-sm'>
            GV: Trần Nguyễn Thanh Lân
          </div>

          <h1 className='text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight'>
            Big Data <span className='text-blue-600'>Dashboard</span>
          </h1>

          <p className='text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed'>
            Hệ thống báo cáo thực hành phân tích dữ liệu lớn sử dụng công nghệ
            <span className='font-semibold text-orange-600 mx-1'>
              Apache Spark
            </span>
            và
            <span className='font-semibold text-yellow-600 mx-1'>
              Hadoop Ecosystem
            </span>
            .
          </p>
        </div>

        {/* Grid Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          {/* Card Lab 2 */}
          <Link
            href='/lab2'
            className='group relative bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden'
          >
            <div className='absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:w-2 transition-all duration-300' />

            <div className='flex items-start justify-between mb-6'>
              <div className='p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm'>
                <BookOpen className='w-8 h-8' />
              </div>
              <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full'>
                Completed
              </span>
            </div>

            <h2 className='text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors'>
              Lab 2: Full Analysis
            </h2>

            <p className='text-slate-500 mb-6 leading-relaxed'>
              Tổng hợp phân tích toàn diện: Đếm từ, Mạng lưới nhân vật, Cảm xúc
              (Harry Potter) và xu hướng cộng đồng Reddit.
            </p>

            <div className='flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all'>
              Xem chi tiết <ArrowRight className='w-4 h-4 ml-1' />
            </div>
          </Link>

          {/* Card Lab 3 */}
          <div className='relative bg-slate-50 p-8 rounded-3xl border border-slate-200 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-not-allowed group'>
            <div className='flex items-start justify-between mb-6'>
              <div className='p-4 bg-white text-slate-400 rounded-2xl shadow-sm group-hover:text-slate-600 transition-colors'>
                <BarChart3 className='w-8 h-8' />
              </div>
              <span className='px-3 py-1 bg-slate-200 text-slate-500 text-xs font-bold uppercase rounded-full'>
                Coming Soon
              </span>
            </div>

            <h2 className='text-2xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors mb-3'>
              Lab 3: Future Work
            </h2>

            <p className='text-slate-400 group-hover:text-slate-500 mb-6 leading-relaxed transition-colors'>
              Nội dung bài thực hành tiếp theo sẽ được cập nhật tại đây. Đang
              chờ dữ liệu từ hệ thống...
            </p>

            <div className='flex items-center text-slate-400 font-medium'>
              Chưa khả dụng
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-20 text-center border-t border-slate-200 pt-8'>
          <p className='text-slate-400 text-sm'>
            Developed by{' '}
            <span className='font-semibold text-slate-600'>
              Your Name / Group Name
            </span>{' '}
            • Powered by Next.js & Recharts
          </p>
        </div>
      </div>
    </main>
  );
}
