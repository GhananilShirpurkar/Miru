import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Bookmark, Swords, ArrowRight, Film, Layers, Flame, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuickDrawer } from '../hooks/useQuickDrawer';
import VaultCategoryPicker from './VaultCategoryPicker';

export default function QuickDossierDrawer() {
  const { isOpen, selectedAnime, closeDrawer } = useQuickDrawer();

  // Keyboard shortcut listener to close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  if (!selectedAnime) return null;

  const poster = selectedAnime.images?.webp?.large_image_url || selectedAnime.images?.jpg?.large_image_url || selectedAnime.images?.jpg?.image_url || selectedAnime.image || '';
  const displayTitle = selectedAnime.title_english || selectedAnime.title;
  const studioName = selectedAnime.studios?.[0]?.name || selectedAnime.studio || 'N/A';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-body">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-out Panel Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full sm:w-screen sm:max-w-md bg-[#09090b] border-l border-[#27272a] shadow-2xl flex flex-col justify-between"
            >

              {/* Drawer Top Navigation Header */}
              <div className="p-4 sm:p-6 border-b border-[#27272a] bg-[#121216] flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] font-bold uppercase tracking-widest">
                  <Flame size={14} />
                  <span>QUICK TELEMETRY DOSSIER</span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#27272a] transition-colors rounded-sm"
                  aria-label="Close Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Poster & Quick Header Info */}
                <div className="flex gap-4 items-start">
                  <div className="relative w-28 aspect-[2/3] bg-[#121216] border border-[#ff2e4d] overflow-hidden shrink-0 shadow-lg">
                    <img src={poster} alt={displayTitle} className="w-full h-full object-cover" />
                    {selectedAnime.score && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-[#fbbf24] font-mono text-[9px] font-bold flex items-center gap-1 border border-white/10">
                        <Star size={9} className="fill-[#fbbf24]" />
                        <span>{selectedAnime.score.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 min-w-0 flex-1">
                    <h2 className="font-display font-black text-lg text-white uppercase tracking-tight leading-snug line-clamp-2">
                      {displayTitle}
                    </h2>
                    {selectedAnime.title_japanese && (
                      <p className="font-jp text-xs text-[#a1a1aa] font-bold truncate">
                        {selectedAnime.title_japanese}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                      {selectedAnime.type && (
                        <span className="px-2 py-0.5 bg-[#121216] border border-[#27272a] text-[#ff2e4d] font-bold">
                          {selectedAnime.type}
                        </span>
                      )}
                      {selectedAnime.episodes && (
                        <span className="px-2 py-0.5 bg-[#121216] border border-[#27272a] text-white">
                          {selectedAnime.episodes} EPS
                        </span>
                      )}
                      {selectedAnime.rank && (
                        <span className="px-2 py-0.5 bg-[#121216] border border-[#27272a] text-[#fbbf24] font-bold">
                          RANK #{selectedAnime.rank}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="bg-[#121216] border border-[#27272a] p-4 font-mono text-xs space-y-2.5">
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">STUDIO</span>
                    <span className="font-bold text-white truncate max-w-[200px] text-right">{studioName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">STATUS</span>
                    <span className="font-bold text-white">{selectedAnime.status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">SOURCE</span>
                    <span className="font-bold text-white">{selectedAnime.source || 'N/A'}</span>
                  </div>
                  {selectedAnime.duration && (
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">DURATION</span>
                      <span className="font-bold text-white">{selectedAnime.duration}</span>
                    </div>
                  )}
                </div>

                {/* Genre Tags */}
                {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] text-[#71717a] font-bold uppercase tracking-wider">GENRES</div>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {selectedAnime.genres.map((g) => (
                        <span
                          key={g.mal_id || g.name || g}
                          className="px-2.5 py-1 bg-[#121216] border border-[#27272a] text-white uppercase"
                        >
                          {g.name || g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synopsis */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-[#71717a] font-bold uppercase tracking-wider">ARCHIVAL SYNOPSIS</div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed font-body bg-[#121216] border border-[#27272a] p-3.5 line-clamp-6">
                    {selectedAnime.synopsis || selectedAnime.description || 'No synopsis available for this entry.'}
                  </p>
                </div>

              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 sm:p-6 border-t border-[#27272a] bg-[#121216] space-y-2.5 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <VaultCategoryPicker anime={selectedAnime} fullWidth size="small" />

                  <Link
                    to={`/compare?anime1=${selectedAnime.mal_id}`}
                    onClick={closeDrawer}
                    className="py-2 px-3 bg-[#09090b] border border-[#27272a] hover:border-white text-white flex items-center justify-center gap-1.5 font-bold uppercase transition-all"
                  >
                    <Swords size={14} className="text-[#ff2e4d]" />
                    <span>COMPARE</span>
                  </Link>
                </div>

                <Link
                  to={`/anime/${selectedAnime.mal_id}`}
                  onClick={closeDrawer}
                  className="w-full py-3 bg-[#ff2e4d] hover:bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#ff2e4d]/20"
                >
                  <span>FULL DOSSIER</span>
                  <ArrowRight size={14} />
                </Link>
              </div>


            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
