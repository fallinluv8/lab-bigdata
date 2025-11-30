'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Database, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import HarryPotterCharts from './_components/HarryPotterCharts';
import RedditCharts from './_components/RedditCharts';

export default function Lab2Page() {
  const [activeTab, setActiveTab] = useState<'harry' | 'reddit'>('harry');

  const [wordData, setWordData] = useState<any>(null);
  const [interactionData, setInteractionData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [redditTopPosts, setRedditTopPosts] = useState<any>(null);
  const [redditTimeline, setRedditTimeline] = useState<any>(null);

  useEffect(() => {
    fetch('/data/word_count.json')
      .then((res) => res.json())
      .then((data) => setWordData(data));
    fetch('/data/interactions.json')
      .then((res) => res.json())
      .then((data) => setInteractionData(data));
    fetch('/data/sentiment_harry.json')
      .then((res) => res.json())
      .then((data) => setSentimentData(data));

    fetch('/data/reddit_top_posts.json')
      .then((res) => res.json())
      .then((data) => setRedditTopPosts(data));
    fetch('/data/reddit_timeline.json')
      .then((res) => res.json())
      .then((data) => setRedditTimeline(data));
  }, []);

  if (
    !wordData ||
    !interactionData ||
    !sentimentData ||
    !redditTopPosts ||
    !redditTimeline
  )
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-3xl text-blue-600 animate-pulse font-bold'>
          Đang tải dữ liệu báo cáo...
        </div>
      </div>
    );

  return (
    <main className='min-h-screen bg-gray-50 p-8 font-sans text-gray-900'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-12 flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-extrabold text-slate-800 flex items-center gap-3'>
            <Database className='w-10 h-10 text-blue-600' /> Báo cáo Lab 2
          </h1>
          <p className='text-xl text-gray-600 mt-2'>
            Tổng hợp các bài tập phân tích Big Data với Spark
          </p>
        </div>
        <Link
          href='/'
          className='px-6 py-3 text-lg bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 font-semibold'
        >
          <ArrowLeft className='w-6 h-6' /> Quay lại Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto mb-16 flex gap-8 border-b-4 border-gray-200 pb-1 justify-center'>
        <button
          onClick={() => setActiveTab('harry')}
          className={`flex items-center gap-4 px-12 py-8 text-3xl font-bold rounded-t-3xl transition-all duration-300 ${
            activeTab === 'harry'
              ? 'bg-blue-600 text-white shadow-2xl scale-105 translate-y-1'
              : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-blue-600'
          }`}
        >
          <BookOpen className='w-12 h-12' />
          Harry Potter
        </button>
        <button
          onClick={() => setActiveTab('reddit')}
          className={`flex items-center gap-4 px-12 py-8 text-3xl font-bold rounded-t-3xl transition-all duration-300 ${
            activeTab === 'reddit'
              ? 'bg-orange-600 text-white shadow-2xl scale-105 translate-y-1'
              : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-orange-600'
          }`}
        >
          <AlertCircle className='w-12 h-12' />
          Reddit Analysis
        </button>
      </div>

      {/* Nội dung Tab */}
      <div className='mt-8'>
        {activeTab === 'harry' ? (
          <HarryPotterCharts
            wordData={wordData}
            interactionData={interactionData}
            sentimentData={sentimentData}
          />
        ) : (
          <RedditCharts topPosts={redditTopPosts} timeline={redditTimeline} />
        )}
      </div>
    </main>
  );
}
