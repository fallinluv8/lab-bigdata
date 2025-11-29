'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Database, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import HarryPotterCharts from './_components/HarryPotterCharts';
import RedditCharts from './_components/RedditCharts';

export default function Lab2Page() {
  const [activeTab, setActiveTab] = useState<'harry' | 'reddit'>('harry');

  // Dữ liệu
  const [wordData, setWordData] = useState<any>(null);
  const [interactionData, setInteractionData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [redditTopPosts, setRedditTopPosts] = useState<any>(null);
  const [redditTimeline, setRedditTimeline] = useState<any>(null);

  useEffect(() => {
    // Load dữ liệu Harry Potter
    fetch('/data/word_count.json')
      .then((res) => res.json())
      .then((data) => setWordData(data));
    fetch('/data/interactions.json')
      .then((res) => res.json())
      .then((data) => setInteractionData(data));
    fetch('/data/sentiment_harry.json')
      .then((res) => res.json())
      .then((data) => setSentimentData(data));

    // Load dữ liệu Reddit
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
        <div className='text-xl text-blue-600 animate-pulse font-semibold'>
          Đang tải dữ liệu báo cáo...
        </div>
      </div>
    );

  return (
    <main className='min-h-screen bg-gray-50 p-8 font-sans text-gray-900'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-slate-800 flex items-center gap-2'>
            <Database className='w-8 h-8 text-blue-600' /> Báo cáo Lab 2
          </h1>
          <p className='text-gray-600 mt-2'>
            Tổng hợp các bài tập phân tích Big Data với Spark
          </p>
        </div>
        <Link
          href='/'
          className='px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition flex items-center gap-2'
        >
          <ArrowLeft className='w-4 h-4' /> Quay lại Dashboard
        </Link>
      </div>

      {/* Tabs */}
      <div className='max-w-7xl mx-auto mb-10 flex gap-4 border-b border-gray-200 pb-1'>
        <button
          onClick={() => setActiveTab('harry')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg transition-all ${
            activeTab === 'harry'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className='w-5 h-5' /> Harry Potter
        </button>
        <button
          onClick={() => setActiveTab('reddit')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg transition-all ${
            activeTab === 'reddit'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <AlertCircle className='w-5 h-5' /> Reddit Analysis
        </button>
      </div>

      {/* Nội dung Tab */}
      {activeTab === 'harry' ? (
        <HarryPotterCharts
          wordData={wordData}
          interactionData={interactionData}
          sentimentData={sentimentData}
        />
      ) : (
        <RedditCharts topPosts={redditTopPosts} timeline={redditTimeline} />
      )}
    </main>
  );
}
