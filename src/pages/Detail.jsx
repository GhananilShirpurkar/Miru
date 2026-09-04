import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Play, Users, Calendar, Clock, Building2, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAnimeById, getTopAnime, getGenreColor } from '../lib/api';
import ScoreDisplay from '../components/ScoreDisplay';
import AnimeCard from '../components/AnimeCard';
import EmptyState from '../components/EmptyState';

export function Detail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setImgLoaded(false);
        const res = await getAnimeById(parseInt(id, 10));
        setAnime(res.data);

        // Load some related anime (top anime as fallback) independently
        try {
          const relatedRes = await getTopAnime(1, 8);
          if (relatedRes?.data) {
            setRelated(relatedRes.data.filter(a => a.mal_id !== res.data.mal_id).slice(0, 6));
          }
        } catch (relatedErr) {
          console.warn('Could not load related anime recommendations:', relatedErr);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load anime details.');
      } finally {
        setLoading(false);
      }
    };
    loadAnime();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-[#1a1a24] rounded mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80 aspect-[3/4] bg-[#1a1a24] rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-3/4 bg-[#1a1a24] rounded" />
              <div className="h-6 w-1/2 bg-[#1a1a24] rounded" />
              <div className="h-4 w-full bg-[#1a1a24] rounded" />
              <div className="h-4 w-5/6 bg-[#1a1a24] rounded" />
              <div className="h-4 w-4/6 bg-[#1a1a24] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="pt-20">
        <EmptyState
          icon={<span className="text-4xl">😢</span>}
          title="Not Found"
          description={error || 'Anime not found.'}
          action={
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-all"
            >
              <ArrowLeft size={18} />
              Go Home
            </Link>
          }
        />
      </div>
    );
  }

  const poster = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const displayTitle = anime.title_english || anime.title;

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]" />
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-80 flex-shrink-0"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                {!imgLoaded && <div className="absolute inset-0 shimmer" />}
                <img
                  src={poster}
                  alt={displayTitle}
                  className={`w-full aspect-[3/4] object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                />
              </div>


            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              {/* Title */}
              <h1 className="font-display text-3xl md:text-5xl text-white leading-tight tracking-wide mb-2 uppercase">
                {displayTitle}
              </h1>
              {anime.title_japanese && (
                <p className="text-sm text-[#9090a8] mb-4 font-medium">
                  {anime.title_japanese}
                </p>
              )}

              {/* Score */}
              <div className="mb-6">
                <ScoreDisplay score={anime.score} size="lg" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-[#13131a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[#5a5a72] text-xs mb-1">
                    <Star size={12} />
                    Rank
                  </div>
                  <span className="text-lg font-bold text-white">#{anime.rank || 'N/A'}</span>
                </div>
                <div className="bg-[#13131a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[#5a5a72] text-xs mb-1">
                    <Users size={12} />
                    Popularity
                  </div>
                  <span className="text-lg font-bold text-white">#{anime.popularity || 'N/A'}</span>
                </div>
                <div className="bg-[#13131a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[#5a5a72] text-xs mb-1">
                    <Play size={12} />
                    Episodes
                  </div>
                  <span className="text-lg font-bold text-white">{anime.episodes || 'TBA'}</span>
                </div>
                <div className="bg-[#13131a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[#5a5a72] text-xs mb-1">
                    <Calendar size={12} />
                    Status
                  </div>
                  <span className="text-sm font-bold text-white">{anime.status}</span>
                </div>
              </div>

              {/* Studio & Source */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                {anime.studios && anime.studios.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[#9090a8]">
                    <Building2 size={14} />
                    <span>{anime.studios.map(s => s.name).join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[#9090a8]">
                  <Clock size={14} />
                  <span>{anime.duration}</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-[#00f3ff]/10 text-[#00f3ff] text-xs font-medium border border-[#00f3ff]/20">
                  {anime.source}
                </div>
                <div className="px-2 py-0.5 rounded-md bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-medium border border-[#ff6b35]/20">
                  {anime.type}
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres && anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getGenreColor(genre.name)}`}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div className="mb-8">
                <h3 className="font-display text-xl text-white mb-3 tracking-wide uppercase font-bold">Synopsis</h3>
                <p className="text-sm text-[#9090a8] leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </div>

              {/* Trailer */}
              {anime.trailer?.embed_url && (
                <div className="mb-8">
                  <h3 className="font-display text-xl text-white mb-3 tracking-wide uppercase font-bold">Trailer</h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#13131a]">
                    <iframe
                      src={anime.trailer.embed_url}
                      title={`${displayTitle} Trailer`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Anime */}
          {related.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-white tracking-wide uppercase font-bold">You Might Also Like</h2>
                <Link
                  to="/search"
                  className="flex items-center gap-1 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors"
                >
                  Explore <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {related.map((a, i) => (
                  <AnimeCard key={a.mal_id} anime={a} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detail;
