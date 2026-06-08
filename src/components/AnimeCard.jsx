import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

const getGenreColor = (name) => {
  if (!name) return 'border-white/10 text-white/60';
  const n = name.toLowerCase();
  if (n === 'action' || n === 'adventure') return 'border-[#ff6b35]/30 text-[#ff6b35] bg-[#ff6b35]/5';
  if (n === 'comedy' || n === 'slice of life') return 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5';
  if (n === 'drama' || n === 'romance') return 'border-pink-500/30 text-pink-500 bg-pink-500/5';
  if (n === 'fantasy' || n === 'supernatural') return 'border-[#00f3ff]/30 text-[#00f3ff] bg-[#00f3ff]/5';
  return 'border-white/10 text-white/60 bg-white/5';
};

export default function AnimeCard({ anime, rank, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!anime) return null;

  const poster = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const displayTitle = anime.title_english || anime.title;
  const score = anime.score || 0;
  const delay = Math.min(index * 50, 400);

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <Link to={`/anime/${anime.mal_id}`} className="group block">
        <div className="relative bg-[#13131a] rounded-xl overflow-hidden card-glow transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 border border-white/5 hover:border-[#ff6b35]/30">
          {/* Poster Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 shimmer bg-[#1a1a24]" />
            )}
            <img
              src={poster}
              alt={displayTitle}
              className={`w-full h-full object-cover transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

            {/* Rank Badge */}
            {rank !== undefined && (
              <div className="absolute top-3 left-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-[#ff6b35] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff6b35]/30">
                    <span className="font-display text-lg text-white">#{rank}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00f3ff] rounded-full border-2 border-[#0a0a0f]" />
                </div>
              </div>
            )}

            {/* Play Button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-[#ff6b35]/90 flex items-center justify-center shadow-lg shadow-[#ff6b35]/40 backdrop-blur-sm">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Score Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <Star size={14} className="text-[#fbbf24] fill-[#fbbf24]" />
              <span className="text-sm font-bold text-white">{score > 0 ? score.toFixed(2) : 'N/A'}</span>
            </div>

            {/* Episodes Badge */}
            {anime.episodes && (
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs text-white/80 border border-white/10">
                {anime.episodes} EP
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-[#f0f0f5] line-clamp-2 leading-tight mb-2 group-hover:text-[#ff6b35] transition-colors">
              {displayTitle}
            </h3>
            <div className="flex flex-wrap gap-1">
              {anime.genres && anime.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.mal_id}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getGenreColor(genre.name)}`}
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres && anime.genres.length > 2 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-[#5a5a72] border border-white/5">
                  +{anime.genres.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
