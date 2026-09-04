import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ChevronRight, Play, Film, Calendar, Tv, Flame, Tag, Layers, Bookmark, Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAnimeById, getTopAnime } from '../lib/api';
import { useWatchlist } from '../hooks/useWatchlist';
import AnimeCard from '../components/AnimeCard';
import EmptyState from '../components/EmptyState';
import VaultCategoryPicker from '../components/VaultCategoryPicker';


export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const { status, updateStatus } = useWatchlist(id);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };



  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setImgLoaded(false);
        const res = await getAnimeById(parseInt(id, 10));
        setAnime(res.data);

        try {
          const relatedRes = await getTopAnime(1, 8);
          if (relatedRes?.data) {
            setRelated(relatedRes.data.filter(a => a.mal_id !== res.data.mal_id).slice(0, 6));
          }
        } catch (relatedErr) {
          console.warn('Could not load recommendations:', relatedErr);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load anime entry details.');
      } finally {
        setLoading(false);
      }
    };
    loadAnime();
    if (window.location.hash === '#trailer') {
      setTimeout(() => {
        const el = document.getElementById('trailer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-[#09090b]">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-[#121216] rounded" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80 aspect-[3/4] bg-[#121216] border border-[#27272a]" />
            <div className="flex-1 space-y-4">
              <div className="h-12 w-3/4 bg-[#121216]" />
              <div className="h-6 w-1/2 bg-[#121216]" />
              <div className="grid grid-cols-4 gap-4 pt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#121216] border border-[#27272a]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="pt-24 min-h-screen bg-[#09090b] flex items-center justify-center">
        <EmptyState
          icon={<Flame className="text-[#ff2e4d]" size={40} />}
          title="ENTRY NOT FOUND"
          description={error || 'The requested anime entry could not be located.'}
          action={
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff2e4d] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              RETURN TO PREVIOUS
            </button>
          }
        />
      </div>
    );
  }

  const poster = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const displayTitle = anime.title_english || anime.title;
  const uniqueRelated = Array.from(new Map(related.map(a => [a.mal_id, a])).entries()).map(([, v]) => v);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-16 sm:pt-20">
      {/* Background Ink Banner Overlay */}
      <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden border-b border-[#27272a]">
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover object-center filter blur-xl scale-110 opacity-20 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
        <div className="absolute inset-0 halftone-red opacity-15 pointer-events-none" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#09090b]/80 backdrop-blur-md border border-[#27272a] hover:border-[#ff2e4d] font-mono text-xs text-[#a1a1aa] hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft size={14} className="text-[#ff2e4d]" />
            RETURN TO PREVIOUS
          </button>
        </div>

      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Magazine Cover Poster Frame */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-80 flex-shrink-0"
          >
            <div className="relative bg-[#121216] border-2 border-[#ff2e4d] shadow-2xl shadow-black/80 overflow-hidden group">
              {!imgLoaded && <div className="absolute inset-0 shimmer" />}
              <img
                src={poster}
                alt={displayTitle}
                className={`w-full aspect-[3/4] object-cover transition-opacity duration-300 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent font-mono text-[10px] text-[#a1a1aa] flex justify-between uppercase">
                <span>ENTRY #{anime.mal_id}</span>
                <span className="text-[#ff2e4d] font-bold">{anime.status || 'ARCHIVE'}</span>
              </div>
            </div>
          </motion.div>

          {/* Details Overview */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 space-y-8"
          >
            {/* Header Titles */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-xs">
                <span className="px-3 py-1 bg-[#ff2e4d] text-black font-black uppercase tracking-widest">
                  {anime.type || 'ANIME ENTRY'}
                </span>
                {anime.rank && (
                  <span className="px-3 py-1 bg-[#121216] border border-[#27272a] text-[#fbbf24] font-bold">
                    RANK #{anime.rank}
                  </span>
                )}
                {anime.rating && (
                  <span className="px-3 py-1 bg-[#191920] border border-white/10 text-[#a1a1aa]">
                    {anime.rating}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                {displayTitle}
              </h1>

              {anime.title_japanese && (
                <p className="font-jp text-sm sm:text-base text-[#a1a1aa] font-bold tracking-widest mb-4">
                  {anime.title_japanese}
                </p>
              )}

              {/* Action Buttons: Watchlist & Compare */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs font-bold">
                <VaultCategoryPicker anime={anime} />


                <Link
                  to={`/compare?anime1=${anime.mal_id}`}
                  className="px-4 py-3 bg-[#121216] border border-[#27272a] hover:border-white text-white flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Swords size={15} className="text-[#ff2e4d]" />
                  <span>COMPARE IN ARENA</span>
                </Link>
              </div>

            </div>


            {/* Metric Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-4 bg-[#121216] border border-[#27272a] flex flex-col">
                <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">SCORE</span>
                <div className="flex items-center gap-2 mt-1">
                  <Star
                    size={18}
                    className={
                      (anime.score || 0) >= 8.5
                        ? 'text-[#fbbf24] fill-[#fbbf24]'
                        : (anime.score || 0) >= 7.5
                        ? 'text-[#ff2e4d] fill-[#ff2e4d]'
                        : 'text-[#3b82f6] fill-[#3b82f6]'
                    }
                  />
                  <span
                    className={`text-2xl font-bold ${
                      (anime.score || 0) >= 8.5
                        ? 'text-[#fbbf24]'
                        : (anime.score || 0) >= 7.5
                        ? 'text-[#ff2e4d]'
                        : 'text-[#3b82f6]'
                    }`}
                  >
                    {anime.score ? anime.score.toFixed(2) : 'N/A'}
                  </span>
                </div>
                {anime.scored_by && (
                  <span className="text-[10px] text-[#52525b] mt-1">{anime.scored_by.toLocaleString()} REVIEWS</span>
                )}
              </div>


              <div className="p-4 bg-[#121216] border border-[#27272a] flex flex-col">
                <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">POPULARITY</span>
                <span className="text-2xl font-bold text-white mt-1">
                  {anime.popularity ? `#${anime.popularity}` : 'N/A'}
                </span>
                <span className="text-[10px] text-[#52525b] mt-1">GLOBAL RANK</span>
              </div>

              <div className="p-4 bg-[#121216] border border-[#27272a] flex flex-col">
                <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">EPISODES</span>
                <span className="text-2xl font-bold text-white mt-1">
                  {anime.episodes || 'TBA'}
                </span>
                <span className="text-[10px] text-[#52525b] mt-1">{anime.duration || 'DURATION N/A'}</span>
              </div>

              <div className="p-4 bg-[#121216] border border-[#27272a] flex flex-col">
                <span className="text-[10px] text-[#71717a] uppercase tracking-widest font-bold">SOURCE</span>
                <span className="text-lg font-bold text-white mt-1 truncate">
                  {anime.source || 'ORIGINAL'}
                </span>
                <span className="text-[10px] text-[#52525b] mt-1">ADAPTATION</span>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#ff2e4d] font-bold uppercase tracking-wider border-b border-[#27272a] pb-3">
                <Layers size={14} />
                <span>ARCHIVAL SPECIFICATIONS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                <div className="flex justify-between border-b border-[#27272a]/60 pb-2">
                  <span className="text-[#71717a]">FORMAT</span>
                  <span className="font-bold text-white">{anime.type || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-[#27272a]/60 pb-2">
                  <span className="text-[#71717a]">STATUS</span>
                  <span className="font-bold text-white">{anime.status || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-[#27272a]/60 pb-2">
                  <span className="text-[#71717a]">AIRING DATES</span>
                  <span className="font-bold text-white">{anime.aired?.string || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-[#27272a]/60 pb-2">
                  <span className="text-[#71717a]">STUDIO</span>
                  <span className="font-bold text-[#ff2e4d]">
                    {anime.studios?.map((s) => s.name).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                SYNOPSIS
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed font-body">
                {anime.synopsis || 'No official synopsis recorded for this catalogue entry.'}
              </p>
            </div>

            {/* Trailer Showcase Player */}
            {anime.trailer?.embed_url && (
              <div id="trailer" className="space-y-3 pt-4 border-t border-[#27272a]">
                <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] font-bold uppercase tracking-wider">
                  <Film size={14} />
                  <span>OFFICIAL TRAILER FOOTAGE</span>
                </div>
                <div className="relative aspect-video bg-[#121216] border border-[#27272a]">
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

        {/* Related Recommendations Rail */}
        {uniqueRelated.length > 0 && (
          <section className="mt-20 space-y-6">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff2e4d] text-black font-jp font-black text-xs flex items-center justify-center">
                  関連
                </div>
                <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-white">
                  CURATED RECOMMENDATIONS
                </h2>
              </div>

              <Link
                to="/search"
                className="hidden sm:flex items-center gap-1 font-mono text-xs text-[#a1a1aa] hover:text-white uppercase tracking-wider"
              >
                <span>EXPLORE ALL</span>
                <ChevronRight size={14} className="text-[#ff2e4d]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {uniqueRelated.map((a, i) => (
                <AnimeCard key={a.mal_id} anime={a} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

