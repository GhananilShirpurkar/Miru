import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, TrendingUp, Calendar } from 'lucide-react';

const getGenreColor = (name) => {
  if (!name) return 'border-white/10 text-white/60';
  const n = name.toLowerCase();
  if (n === 'action' || n === 'adventure') return 'border-[#ff6b35]/30 text-[#ff6b35] bg-[#ff6b35]/5';
  if (n === 'comedy' || n === 'slice of life') return 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5';
  if (n === 'drama' || n === 'romance') return 'border-pink-500/30 text-pink-500 bg-pink-500/5';
  if (n === 'fantasy' || n === 'supernatural') return 'border-[#00f3ff]/30 text-[#00f3ff] bg-[#00f3ff]/5';
  return 'border-white/10 text-white/60 bg-white/5';
};

export function HeroSection({ anime }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!anime) return null;

  const poster = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const displayTitle = anime.title_english || anime.title;

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden rounded-2xl mb-8 border border-white/5">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 shimmer bg-[#1a1a24]" />}
        <img
          src={poster}
          alt={displayTitle}
          className={`w-full h-full object-cover object-top transition-opacity duration-700 ${
            imgLoaded ? 'opacity-100 animate-ken-burns' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/30" />
      </div>

      {/* Halftone pattern overlay */}
      <div className="absolute inset-0 halftone opacity-[0.03] pointer-events-none" />

      {/* Speed lines */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 speed-lines pointer-events-none" />

      {/* Angular accent shape */}
      <div className="absolute -right-20 top-1/4 w-64 h-64 bg-[#ff6b35]/5 rotate-45 pointer-events-none" />
      <div className="absolute -right-10 top-1/3 w-48 h-48 border-2 border-[#00f3ff]/10 rotate-45 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-12 flex items-end min-h-[500px] md:min-h-[600px]">
        <div className="max-w-2xl">
          {/* Rank Badge */}
          <div
            className="flex items-center gap-3 mb-4 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff6b35]/15 border border-[#ff6b35]/30">
              <TrendingUp size={14} className="text-[#ff6b35]" />
              <span className="text-xs font-bold text-[#ff6b35]">TRENDING NOW</span>
            </div>
            {anime.rank && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f3ff]/15 border border-[#00f3ff]/30">
                <Star size={14} className="text-[#fbbf24] fill-[#fbbf24]" />
                <span className="text-xs font-bold text-[#fbbf24]">Rank #{anime.rank}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-none tracking-wide mb-3 uppercase animate-fade-up"
            style={{
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
              animationDelay: '200ms',
              animationFillMode: 'forwards',
            }}
          >
            {displayTitle}
          </h1>

          {/* Japanese Title */}
          {anime.title_japanese && (
            <p
              className="text-sm text-[#9090a8] mb-4 font-medium animate-fade-up"
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              {anime.title_japanese}
            </p>
          )}

          {/* Meta Info */}
          <div
            className="flex flex-wrap items-center gap-4 mb-5 animate-fade-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-[#fbbf24] fill-[#fbbf24]" />
              <span className="font-bold text-white">{anime.score ? anime.score.toFixed(2) : 'N/A'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#5a5a72]" />
            <div className="flex items-center gap-1.5 text-sm text-[#9090a8]">
              <Calendar size={14} />
              <span>{anime.status}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#5a5a72]" />
            <span className="text-sm text-[#9090a8]">{anime.episodes ? `${anime.episodes} Episodes` : 'TBA'}</span>
          </div>

          {/* Genres */}
          <div
            className="flex flex-wrap gap-2 mb-6 animate-fade-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            {anime.genres && anime.genres.slice(0, 4).map((genre) => (
              <span
                key={genre.mal_id}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getGenreColor(genre.name)}`}
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p
            className="text-sm text-[#9090a8] leading-relaxed mb-6 line-clamp-3 max-w-xl animate-fade-up"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            {anime.synopsis || 'No synopsis available.'}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <Link
              to={`/anime/${anime.mal_id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-all duration-200 hover:shadow-lg hover:shadow-[#ff6b35]/25"
            >
              <Play size={18} fill="white" />
              Watch Trailer
            </Link>
            <Link
              to={`/anime/${anime.mal_id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <Info size={18} />
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </div>
  );
}

export default HeroSection;
