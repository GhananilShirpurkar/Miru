import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentSeasonalAnime } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export function Seasonal() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'MIRU — Seasonal Anime';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getCurrentSeasonalAnime(1, 24);
        setAnime(res.data);
      } catch (err) {
        setError('Failed to load seasonal anime.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const currentDate = new Date();
  const month = currentDate.getMonth();
  let season = 'Winter';
  if (month >= 2 && month <= 4) season = 'Spring';
  else if (month >= 5 && month <= 7) season = 'Summer';
  else if (month >= 8 && month <= 10) season = 'Fall';

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00f3ff]/10 border border-[#00f3ff]/20">
                <Calendar size={20} className="text-[#00f3ff]" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide uppercase font-bold">
                  {season} {currentDate.getFullYear()}
                </h1>
                <p className="text-xs text-[#5a5a72]">Currently airing anime this season</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13131a] border border-white/5 text-sm text-[#9090a8]">
              <Clock size={14} />
              <span>{anime.length} shows airing</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<span className="text-4xl">😢</span>}
            title="Error"
            description={error}
          />
        ) : anime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {anime.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Calendar size={32} className="text-[#5a5a72]" />}
            title="No Seasonal Anime"
            description="There are no anime airing this season at the moment."
            action={
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-all"
              >
                Browse All Anime <ChevronRight size={16} />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}

export default Seasonal;
