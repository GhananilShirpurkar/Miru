import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTopAnime, getCurrentSeasonalAnime } from '../lib/api';
import HeroSection from '../components/HeroSection';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export function Home() {
  const [trending, setTrending] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'MIRU — Home';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const trendingRes = await getTopAnime(1, 12);
        const seasonalRes = await getCurrentSeasonalAnime(1, 8);
        
        setTrending(trendingRes.data || []);
        setSeasonal(seasonalRes.data || []);
        if (trendingRes.data && trendingRes.data.length > 0) {
          setFeatured(trendingRes.data[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load anime data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="pt-20">
        <EmptyState
          icon={<span className="text-4xl">😢</span>}
          title="Oops!"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featured && !loading && <HeroSection anime={featured} />}
      {loading && (
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.map((anime, i) => (
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : seasonal.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seasonal.map((anime, i) => (
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
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
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
      </motion.section>
    </div>
  );
}

export default Home;
