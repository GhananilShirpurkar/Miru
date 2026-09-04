import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight, Sparkles, Home, Calendar, BarChart2, Flame, Film, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime } from '../lib/api';
import { useSound } from '../hooks/useSound';

const MOOD_PRESETS = [
  { label: 'DARK PSYCHOLOGICAL THRILLER', query: 'Psychological', icon: Flame },
  { label: 'COZY SLICE OF LIFE', query: 'Slice of Life', icon: Sparkles },
  { label: 'EPIC SHONEN BATTLES', query: 'Action', icon: Film },
  { label: 'HIGH-BUDGET SCI-FI', query: 'Sci-Fi', icon: BarChart2 }
];

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { playHover, playClick } = useSound();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debounced search fetching
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchAnime(query, 1, 6);
        setResults(res.data || []);
      } catch (err) {
        console.error('Command search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Global keydown listeners for palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playClick();
        if (isOpen) onClose();
        else onClose(true);
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, playClick]);

  if (!isOpen) return null;

  const handleSelectRoute = (path) => {
    playClick();
    navigate(path);
    onClose();
  };

  const handleSelectAnime = (id) => {
    playClick();
    navigate(`/anime/${id}`);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#09090b] border-2 border-[#ff2e4d] shadow-2xl shadow-[#ff2e4d]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Command Header Input */}
        <div className="relative flex items-center bg-[#121216] border-b border-[#27272a] px-4 py-3.5">
          <Command size={18} className="text-[#ff2e4d] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE ANY TITLE, GENRE, OR MOOD VIBE..."
            className="w-full bg-transparent font-mono text-sm text-white placeholder-[#52525b] uppercase tracking-wider focus:outline-none"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-[#ff2e4d] border-t-transparent rounded-full animate-spin mr-3 shrink-0" />
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#71717a] hover:text-white hover:bg-[#ff2e4d] hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 font-mono text-xs">
          {/* Live Search Results */}
          {query.trim() !== '' ? (
            <div className="space-y-3">
              <div className="text-[10px] text-[#71717a] uppercase font-bold tracking-widest flex items-center justify-between">
                <span>ARCHIVAL QUERY RESULTS ({results.length})</span>
                <span className="text-[#ff2e4d]">INSTANT FETCH</span>
              </div>
              {results.length > 0 ? (
                <div className="space-y-1.5">
                  {results.map((anime) => (
                    <button
                      key={anime.mal_id}
                      onClick={() => handleSelectAnime(anime.mal_id)}
                      onMouseEnter={playHover}
                      className="w-full flex items-center gap-3 p-2.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-left text-white group transition-colors"
                    >
                      <img
                        src={anime.images?.jpg?.small_image_url || anime.images?.webp?.small_image_url}
                        alt=""
                        className="w-8 h-11 object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 truncate">
                        <div className="font-display font-bold uppercase truncate group-hover:text-[#ff2e4d] transition-colors">
                          {anime.title_english || anime.title}
                        </div>
                        <div className="text-[10px] text-[#71717a] uppercase flex items-center gap-2 mt-0.5">
                          <span>{anime.type || 'TV'}</span>
                          <span>•</span>
                          <span className="text-[#fbbf24]">★ {anime.score || 'N/A'}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-[#71717a] group-hover:text-[#ff2e4d] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : !loading ? (
                <div className="py-8 text-center text-[#71717a] uppercase">
                  No anime matched query "{query}"
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {/* Mood Vibe AI Search Presets */}
              <div className="space-y-2.5">
                <div className="text-[10px] text-[#71717a] uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#ff2e4d]" />
                  <span>MOOD & VIBE PRESETS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOOD_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          playClick();
                          navigate(`/search?genre=${encodeURIComponent(preset.query)}`);
                          onClose();
                        }}
                        onMouseEnter={playHover}
                        className="flex items-center gap-2.5 p-3 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-left text-white group transition-all"
                      >
                        <Icon size={14} className="text-[#ff2e4d] shrink-0" />
                        <span className="font-bold text-[11px] uppercase tracking-wider group-hover:text-[#ff2e4d] transition-colors truncate">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation Shortcuts */}
              <div className="space-y-2.5 pt-2 border-t border-[#27272a]">
                <div className="text-[10px] text-[#71717a] uppercase font-bold tracking-widest">
                  QUICK NAVIGATION DIRECTORY
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectRoute('/')}
                    onMouseEnter={playHover}
                    className="flex items-center gap-2 p-2.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-[#a1a1aa] hover:text-white font-bold uppercase transition-colors"
                  >
                    <Home size={14} className="text-[#ff2e4d]" />
                    <span>01. HOME</span>
                  </button>
                  <button
                    onClick={() => handleSelectRoute('/search')}
                    onMouseEnter={playHover}
                    className="flex items-center gap-2 p-2.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-[#a1a1aa] hover:text-white font-bold uppercase transition-colors"
                  >
                    <Search size={14} className="text-[#ff2e4d]" />
                    <span>02. SEARCH</span>
                  </button>
                  <button
                    onClick={() => handleSelectRoute('/seasonal')}
                    onMouseEnter={playHover}
                    className="flex items-center gap-2 p-2.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-[#a1a1aa] hover:text-white font-bold uppercase transition-colors"
                  >
                    <Calendar size={14} className="text-[#ff2e4d]" />
                    <span>03. SEASONAL</span>
                  </button>
                  <button
                    onClick={() => handleSelectRoute('/analytics')}
                    onMouseEnter={playHover}
                    className="flex items-center gap-2 p-2.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-[#a1a1aa] hover:text-white font-bold uppercase transition-colors"
                  >
                    <BarChart2 size={14} className="text-[#ff2e4d]" />
                    <span>04. TELEMETRY</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Hotkey Hints */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#121216] border-t border-[#27272a] font-mono text-[10px] text-[#71717a]">
          <div className="flex items-center gap-3">
            <span>PRESS <kbd className="px-1.5 py-0.5 bg-[#191920] border border-white/10 text-white font-bold">ESC</kbd> TO CLOSE</span>
          </div>
          <span className="text-[#ff2e4d] font-bold">CMD + K MATRIX</span>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default CommandPalette;
