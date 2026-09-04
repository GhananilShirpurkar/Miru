import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Flame, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSection({ anime, items = [] }) {
  const animeList = Array.isArray(items) && items.length > 0 ? items : anime ? [anime] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate hero slides every 7 seconds
  useEffect(() => {
    if (animeList.length <= 1 || isPaused || showTrailerModal) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [animeList.length, isPaused, showTrailerModal]);

  // Lock body scroll when modal is active & listen for Escape key
  useEffect(() => {
    if (showTrailerModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowTrailerModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTrailerModal]);

  if (animeList.length === 0) return null;

  const currentAnime = animeList[currentIndex];
  const poster = currentAnime.images?.webp?.large_image_url || currentAnime.images?.jpg?.large_image_url || currentAnime.images?.jpg?.image_url || '';
  const displayTitle = currentAnime.title_english || currentAnime.title;
  const rawTrailerUrl = currentAnime.trailer?.embed_url;
  const trailerUrl = rawTrailerUrl 
    ? (rawTrailerUrl.includes('?') ? `${rawTrailerUrl}&autoplay=1` : `${rawTrailerUrl}?autoplay=1`)
    : null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % animeList.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + animeList.length) % animeList.length);

  const isLongTitle = displayTitle.length > 30;

  return (
    <div 
      className="relative w-full min-h-[580px] md:min-h-[620px] bg-[#09090b] border-b border-[#27272a] overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.mal_id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[580px] md:min-h-[620px] flex items-center"
        >
          {/* Ambient Blurred Backdrop Glow (Removes Pixelation) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover filter blur-2xl md:blur-3xl opacity-35 md:opacity-20 scale-125 brightness-90 contrast-125"
            />
            {/* Ink Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 to-[#09090b]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/80" />
          </div>


          {/* Halftone & Manga Speedline Textures */}
          <div className="absolute inset-0 halftone-red pointer-events-none opacity-15" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 speed-lines pointer-events-none" />

          {/* Large Vertical Japanese Watermark */}
          <div className="absolute right-12 top-16 select-none pointer-events-none opacity-5 hidden lg:block font-jp font-black text-9xl tracking-widest text-white writing-vertical-rl">
            未来・観る
          </div>

          {/* Content & Crisp Poster Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 w-full flex items-center justify-between gap-8">
            {/* Left Content Column */}
            <div className="max-w-2xl space-y-3.5 flex-1 min-w-0">
              
              {/* Mobile-Only Anime Poster Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="md:hidden flex items-center gap-4 mb-2"
              >
                <div className="relative w-24 sm:w-28 aspect-[2/3] bg-[#121216] border-2 border-[#ff2e4d] overflow-hidden shrink-0 shadow-2xl shadow-[#ff2e4d]/30">
                  <img src={poster} alt={displayTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-[#ff2e4d] text-black font-mono font-black text-[10px] uppercase tracking-widest">
                    MUST WATCH #{currentIndex + 1}
                  </span>
                  {currentAnime.score && (
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#fbbf24]">
                      <Star size={12} className="fill-[#fbbf24]" />
                      <span>{currentAnime.score.toFixed(2)} SCORE</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Desktop Editorial Header Badges */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hidden md:flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase"
              >
                <span className="flex items-center gap-2 px-3 py-1 bg-[#ff2e4d] text-black font-black tracking-widest">
                  <Flame size={14} className="fill-black" />
                  MUST WATCH #0{currentIndex + 1}
                </span>

                {currentAnime.score && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-[#121216] border border-[#27272a] text-[#fbbf24] font-bold">
                    <Star size={13} className="fill-[#fbbf24]" />
                    SCORE {currentAnime.score.toFixed(2)}
                  </span>
                )}

                {currentAnime.type && (
                  <span className="px-3 py-1 bg-[#121216] border border-[#27272a] text-[#a1a1aa] font-semibold">
                    {currentAnime.type}
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`font-display font-black text-white leading-tight tracking-tighter uppercase drop-shadow-2xl line-clamp-2 ${
                  isLongTitle ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-5xl md:text-6xl'
                }`}
                title={displayTitle}
              >
                {displayTitle}
              </motion.h1>


              {/* Japanese Title Subhead */}
              {currentAnime.title_japanese && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-jp text-xs sm:text-sm text-[#a1a1aa] font-bold tracking-widest truncate"
                >
                  {currentAnime.title_japanese}
                </motion.p>
              )}

              {/* Genres & Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#a1a1aa]"
              >
                {currentAnime.genres?.slice(0, 4).map((g) => (
                  <span
                    key={g.mal_id || g.name}
                    className="px-2.5 py-0.5 bg-[#121216] border border-[#27272a] text-[#a1a1aa] uppercase tracking-wider"
                  >
                    {g.name}
                  </span>
                ))}
                {currentAnime.episodes && (
                  <span className="px-2.5 py-0.5 bg-[#121216] border border-[#27272a] text-white font-bold">
                    {currentAnime.episodes} EPS
                  </span>
                )}
              </motion.div>

              {/* Synopsis */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed line-clamp-2 max-w-xl font-body"
              >
                {currentAnime.synopsis || 'No description available for this anime entry.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <Link
                  to={`/anime/${currentAnime.mal_id}`}
                  className="px-6 py-3 bg-[#ff2e4d] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#ff2e4d]/20"
                >
                  <Info size={16} />
                  EXPLORE ENTRY
                </Link>

                {trailerUrl && (
                  <button
                    onClick={() => setShowTrailerModal(true)}
                    className="px-6 py-3 bg-[#121216] hover:bg-[#191920] border border-[#27272a] hover:border-[#ff2e4d] text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
                  >
                    <Play size={16} className="text-[#ff2e4d]" />
                    TRAILER
                  </button>
                )}
              </motion.div>
            </div>


            {/* Right Crisp Framed Poster Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:block relative shrink-0"
            >
              <div className="relative w-64 lg:w-72 aspect-[2/3] bg-[#121216] border-2 border-[#ff2e4d] shadow-2xl overflow-hidden group">
                <img
                  src={poster}
                  alt={displayTitle}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-[#a1a1aa] flex justify-between items-center uppercase border-t border-white/20 pt-2">
                  <span>ENTRY #0{currentIndex + 1}</span>
                </div>
              </div>
              {/* Back Accent Offset Frame */}
              <div className="absolute -bottom-3 -right-3 w-64 lg:w-72 aspect-[2/3] border border-[#27272a] bg-[#121216]/50 -z-10 pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Controls */}
      {animeList.length > 1 && (
        <div className="absolute right-4 sm:right-8 bottom-6 z-20 flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3 bg-[#121216]/90 border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#ff2e4d] transition-colors"
            aria-label="Previous Hero Slide"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-1.5 font-mono text-xs text-white">
            {animeList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#ff2e4d]' : 'w-2 bg-[#27272a] hover:bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 bg-[#121216]/90 border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#ff2e4d] transition-colors"
            aria-label="Next Hero Slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Trailer Overlay Modal Portal */}
      {showTrailerModal && trailerUrl && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-lg animate-fade-in"
          onClick={() => setShowTrailerModal(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-[#09090b] border-2 border-[#ff2e4d] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Bar */}
            <div className="flex items-center justify-between p-4 bg-[#121216] border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff2e4d] rounded-full animate-ping" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  TRAILER — {displayTitle}
                </span>
              </div>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#ff2e4d] hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={trailerUrl}
                title={`${displayTitle} Trailer`}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default HeroSection;


