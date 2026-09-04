import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimeCard({ anime, rank, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!anime) return null;

  const poster = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  const displayTitle = anime.title_english || anime.title;
  const score = anime.score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to={`/anime/${anime.mal_id}`} className="block">
        <div className="relative bg-[#121216] border border-[#27272a] group-hover:border-[#ff2e4d] transition-all duration-300 overflow-hidden shadow-md group-hover:shadow-xl group-hover:shadow-[#ff2e4d]/15">
          {/* Poster Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#191920]">
            {!imgLoaded && <div className="absolute inset-0 shimmer" />}
            <img
              src={poster}
              alt={displayTitle}
              className={`w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 filter group-hover:contrast-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />

            {/* Ink Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

            {/* Rank Badge */}
            {rank !== undefined && (
              <div className="absolute top-0 left-0 bg-[#ff2e4d] text-black font-mono font-black text-xs px-2.5 py-1 tracking-wider">
                #{rank < 10 ? `0${rank}` : rank}
              </div>
            )}

            {/* Score Pill */}
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#09090b]/85 border border-[#27272a] backdrop-blur-sm flex items-center gap-1">
              <Star size={11} className="text-[#fbbf24] fill-[#fbbf24]" />
              <span className="font-mono text-[11px] font-bold text-white">
                {score > 0 ? score.toFixed(2) : 'N/A'}
              </span>
            </div>

            {/* Hover Action Badge */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
              <div className="w-12 h-12 bg-[#ff2e4d] text-black flex items-center justify-center font-mono font-bold shadow-lg shadow-[#ff2e4d]/40 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={22} className="stroke-[3]" />
              </div>
            </div>

            {/* Lift-up Synopsis Preview Drawer */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-[#09090b]/95 border-t border-[#27272a] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <p className="text-[11px] text-[#a1a1aa] line-clamp-2 leading-relaxed font-body">
                {anime.synopsis || 'Click to view full anime specs.'}
              </p>
            </div>
          </div>

          {/* Card Info Footer */}
          <div className="p-3 bg-[#121216] border-t border-[#27272a]/60">
            <h3 className="font-display font-bold text-sm text-white line-clamp-1 leading-snug tracking-tight group-hover:text-[#ff2e4d] transition-colors">
              {displayTitle}
            </h3>
            
            <div className="flex items-center justify-between mt-2 font-mono text-[10px] text-[#a1a1aa]">
              <span className="truncate max-w-[120px]">
                {anime.genres?.[0]?.name || anime.type || 'Anime'}
              </span>
              <span className="text-[#52525b] uppercase">
                {anime.episodes ? `${anime.episodes} EPS` : anime.status || 'TBA'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}



