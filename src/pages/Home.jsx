import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Clock, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
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

  const [featured, setFeatured] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'MIRU — Home';
    setVisible(true);
  }, []);

  const loadTrending = useCallback(async () => {
    try {
      setTrendingLoading(true);
      setTrendingError('');
      const trendingRes = await getTopAnime(1, 12);
      const data = trendingRes.data || [];
      setTrending(data);
      if (data.length > 0) {
        setFeatured(data[0]);
      }
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
      const seasonalRes = await getCurrentSeasonalAnime(1, 8);
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
    <div className={`min-h-screen page-fade ${visible ? 'visible' : ''}`}>
      {/* Hero Section */}
      {featured && !trendingLoading && <HeroSection anime={featured} />}
      {trendingLoading && (
        <div className="w-full h-[500px] md:h-[600px] shimmer" />
      )}

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20">
              <Flame size={20} className="text-[#ff6b35]" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide uppercase font-bold">Trending Now</h2>
              <p className="text-xs text-[#5a5a72]">Top rated anime this season</p>
            </div>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-1 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {trendingLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : trendingError ? (
          <div className="p-6 rounded-2xl bg-[#13131a] border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-white">Could not load Trending Anime</h4>
                <p className="text-xs text-[#9090a8]">{trendingError}</p>
              </div>
            </div>
            <button
              onClick={loadTrending}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white text-sm font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-colors whitespace-nowrap"
            >
              <RotateCcw size={16} /> Retry Trending
            </button>
          </div>
        ) : uniqueTrending.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueTrending.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} rank={i + 1} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TrendingUp size={32} className="text-[#5a5a72]" />}
            title="No Trending Anime"
            description="Check back later for trending anime updates."
          />
        )}
      </section>

      {/* Seasonal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00f3ff]/10 border border-[#00f3ff]/20">
              <Clock size={20} className="text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide uppercase font-bold">This Season</h2>
              <p className="text-xs text-[#5a5a72]">Currently airing anime</p>
            </div>
          </div>
          <Link
            to="/seasonal"
            className="hidden sm:flex items-center gap-1 text-sm text-[#9090a8] hover:text-[#00f3ff] transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {seasonalLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : seasonalError ? (
          <div className="p-6 rounded-2xl bg-[#13131a] border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-white">Could not load Seasonal Anime</h4>
                <p className="text-xs text-[#9090a8]">{seasonalError}</p>
              </div>
            </div>
            <button
              onClick={loadSeasonal}
              className="flex items-center gap-2 px-4 py-2 bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 text-sm font-semibold rounded-xl hover:bg-[#00f3ff]/30 transition-colors whitespace-nowrap"
            >
              <RotateCcw size={16} /> Retry Seasonal
            </button>
          </div>
        ) : uniqueSeasonal.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueSeasonal.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock size={32} className="text-[#5a5a72]" />}
            title="No Seasonal Anime"
            description="Check back later for seasonal updates."
          />
        )}
      </section>

      {/* Stats Banner */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up"
        style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#13131a] to-[#1a1a24] border border-white/5 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00f3ff]/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-white mb-2 tracking-wide uppercase font-bold">
                Track Your Anime Journey
              </h3>
              <p className="text-sm text-[#9090a8] max-w-md">
                Discover new anime, build your favorites collection, and explore detailed analytics about your watching habits.
              </p>
            </div>
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-all duration-200 hover:shadow-lg hover:shadow-[#ff6b35]/25 whitespace-nowrap"
            >
              <TrendingUp size={18} />
              View Analytics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
