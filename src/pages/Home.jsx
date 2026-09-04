import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ChevronRight, RotateCcw, AlertTriangle, Sparkles, LayoutGrid, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTopAnime, getCurrentSeasonalAnime } from '../lib/api';
import HeroSection from '../components/HeroSection';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export function Home() {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState('');

  const [seasonal, setSeasonal] = useState([]);
  const [seasonalLoading, setSeasonalLoading] = useState(true);
  const [seasonalError, setSeasonalError] = useState('');

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'MIRU — Editorial Anime Showcase';
    setVisible(true);
  }, []);

  const loadTrending = useCallback(async () => {
    try {
      setTrendingLoading(true);
      setTrendingError('');
      const trendingRes = await getTopAnime(1, 12);
      const data = trendingRes.data || [];
      setTrending(data);
    } catch (err) {
      console.error('Failed to load trending anime:', err);
      setTrendingError(err.message || 'Failed to load trending anime.');
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const loadSeasonal = useCallback(async () => {
    try {
      setSeasonalLoading(true);
      setSeasonalError('');
      const seasonalRes = await getCurrentSeasonalAnime(1, 12);
      setSeasonal(seasonalRes.data || []);
    } catch (err) {
      console.error('Failed to load seasonal anime:', err);
      setSeasonalError(err.message || 'Failed to load seasonal anime.');
    } finally {
      setSeasonalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrending();
    loadSeasonal();
  }, [loadTrending, loadSeasonal]);

  const uniqueTrending = Array.from(new Map(trending.map(a => [a.mal_id, a])).entries()).map(([, v]) => v);
  const uniqueSeasonal = Array.from(new Map(seasonal.map(a => [a.mal_id, a])).entries()).map(([, v]) => v);

  return (
    <div className={`min-h-screen bg-[#09090b] text-white pt-16 sm:pt-20 page-fade ${visible ? 'visible' : ''}`}>
      {/* Hero Showcase Section */}
      {trendingLoading ? (
        <div className="w-full h-[550px] md:h-[680px] bg-[#121216] shimmer border-b border-[#27272a]" />
      ) : uniqueTrending.length > 0 ? (
        <HeroSection items={uniqueTrending.slice(0, 5)} />
      ) : null}

      {/* Main Showcase Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Section 1: Trending Directory */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272a] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ff2e4d] text-black font-jp font-black text-xs flex items-center justify-center">
                人気
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] tracking-widest uppercase">
                  <Flame size={14} className="fill-[#ff2e4d]" />
                  <span>CURATED CATALOGUE</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  TRENDING DIRECTORY
                </h2>
              </div>
            </div>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-xs font-mono font-bold text-[#a1a1aa] hover:text-white transition-all uppercase tracking-wider"
            >
              <span>VIEW FULL ARCHIVE</span>
              <ChevronRight size={14} className="text-[#ff2e4d]" />
            </Link>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          ) : trendingError ? (
            <div className="p-6 bg-[#121216] border border-[#ff2e4d]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-[#ff2e4d] shrink-0" size={24} />
                <div>
                  <h4 className="font-mono font-bold text-sm text-white uppercase">TRENDING FETCH ERROR</h4>
                  <p className="text-xs text-[#a1a1aa]">{trendingError}</p>
                </div>
              </div>
              <button
                onClick={loadTrending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff2e4d] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                <RotateCcw size={14} /> RETRY CONNECTION
              </button>
            </div>
          ) : uniqueTrending.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {uniqueTrending.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} rank={i + 1} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Flame size={32} className="text-[#ff2e4d]" />}
              title="NO TRENDING ENTRIES"
              description="Check your AniList connection or retry shortly."
            />
          )}
        </section>

        {/* Editorial Ticker Banner */}
        <section className="relative overflow-hidden bg-[#121216] border border-[#27272a] p-8 md:p-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff2e4d]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] tracking-widest uppercase">
                <Sparkles size={14} />
                <span>MAGAZINE ANALYTICS</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
                ANIME CATALOGUE METRICS
              </h3>
              <p className="text-xs sm:text-sm text-[#a1a1aa] font-body leading-relaxed">
                Explore aggregated distribution metrics, genre proportions, and historical scoring data powered by AniList's GraphQL endpoint.
              </p>
            </div>

            <Link
              to="/analytics"
              className="px-7 py-3.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#ff2e4d] hover:text-black transition-all duration-300 whitespace-nowrap shadow-lg"
            >
              LAUNCH ANALYTICS DASHBOARD
            </Link>
          </div>
        </section>

        {/* Section 2: Seasonal Broadcasts */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272a] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#191920] border border-[#27272a] text-[#ff2e4d] font-jp font-black text-xs flex items-center justify-center">
                今期
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
                  <Clock size={14} className="text-[#ff2e4d]" />
                  <span>ON AIR BROADCASTS</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  CURRENT SEASON
                </h2>
              </div>
            </div>

            <Link
              to="/seasonal"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-xs font-mono font-bold text-[#a1a1aa] hover:text-white transition-all uppercase tracking-wider"
            >
              <span>SEASONAL INDEX</span>
              <ChevronRight size={14} className="text-[#ff2e4d]" />
            </Link>
          </div>

          {seasonalLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          ) : seasonalError ? (
            <div className="p-6 bg-[#121216] border border-[#ff2e4d]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-[#ff2e4d] shrink-0" size={24} />
                <div>
                  <h4 className="font-mono font-bold text-sm text-white uppercase">SEASONAL FETCH ERROR</h4>
                  <p className="text-xs text-[#a1a1aa]">{seasonalError}</p>
                </div>
              </div>
              <button
                onClick={loadSeasonal}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff2e4d] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                <RotateCcw size={14} /> RETRY BROADCASTS
              </button>
            </div>
          ) : uniqueSeasonal.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {uniqueSeasonal.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock size={32} className="text-[#ff2e4d]" />}
              title="NO BROADCAST ENTRIES"
              description="No seasonal broadcast data found for current quarter."
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;

