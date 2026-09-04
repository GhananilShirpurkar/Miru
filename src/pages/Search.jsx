import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Filter, Sparkles, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import CustomSelect from '../components/CustomSelect';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];
const TYPES = ['All', 'TV', 'Movie', 'OVA', 'ONA', 'Special'];
const STATUSES = ['All', 'Airing', 'Complete', 'Upcoming'];
const SCORES = ['Any', '7+', '8+', '9+'];
const ORDER_BY_OPTIONS = ['Relevance', 'Score', 'Popularity', 'Newest'];
const TRENDING_SUGGESTIONS = ['Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'Fullmetal Alchemist', 'Death Note', 'Bleach'];

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialStatus = searchParams.get('status') || 'all';
  const initialScore = searchParams.get('score') || 'any';
  const initialOrderBy = searchParams.get('orderBy') || 'relevance';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [score, setScore] = useState(initialScore);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [hasSearched, setHasSearched] = useState(
    !!initialQuery || 
    !!initialGenre || 
    initialType !== 'all' || 
    initialStatus !== 'all' || 
    initialScore !== 'any' || 
    initialOrderBy !== 'relevance'
  );

  const performSearch = useCallback(async () => {
    if (!query.trim() && !selectedGenre) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setHasSearched(true);

      const res = await searchAnime(query.trim(), 1, 24, {
        genre: selectedGenre,
        type,
        status,
        min_score: score,
        order_by: orderBy
      });

      setResults(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to search anime catalogue. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, selectedGenre, type, status, score, orderBy]);

  useEffect(() => {
    document.title = 'MIRU — Catalogue Search';
  }, []);

  useEffect(() => {
    if (initialQuery || initialGenre || initialType !== 'all' || initialStatus !== 'all' || initialScore !== 'any' || initialOrderBy !== 'relevance') {
      performSearch();
    }
  }, [initialQuery, initialGenre, initialType, initialStatus, initialScore, initialOrderBy, performSearch]);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (selectedGenre) params.genre = selectedGenre;
    if (type !== 'all') params.type = type;
    if (status !== 'all') params.status = status;
    if (score !== 'any') params.score = score;
    if (orderBy !== 'relevance') params.orderBy = orderBy;
    setSearchParams(params);
  }, [query, selectedGenre, type, status, score, orderBy, setSearchParams]);

  useEffect(() => {
    if (query.trim() || selectedGenre) {
      performSearch();
    }
  }, [selectedGenre, type, status, score, orderBy, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const toggleGenre = (genre) => {
    setSelectedGenre(prev => prev === genre ? '' : genre);
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
    setTimeout(() => {
      performSearch();
    }, 0);
  };

  const clearAll = () => {
    setQuery('');
    setSelectedGenre('');
    setType('all');
    setStatus('all');
    setScore('any');
    setOrderBy('relevance');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const showClearButton = query || selectedGenre || type !== 'all' || status !== 'all' || score !== 'any' || orderBy !== 'relevance';
  const uniqueResults = Array.from(new Map(results.map(a => [a.mal_id, a])).entries()).map(([, v]) => v);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ff2e4d] text-black font-jp font-black text-sm flex items-center justify-center">
              検索
            </div>
            <div>
              <div className="font-mono text-xs text-[#ff2e4d] tracking-widest uppercase font-bold">
                GLOBAL ARCHIVE SEARCH
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                DISCOVER CATALOGUE
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#71717a]">
            <span>QUICK SHORTCUT: PRESS</span>
            <kbd className="px-2 py-1 bg-[#121216] border border-[#27272a] text-[#ff2e4d] font-bold">
              /
            </kbd>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center bg-[#121216] border-2 border-[#27272a] focus-within:border-[#ff2e4d] transition-colors shadow-lg">
            <SearchIcon size={20} className="ml-5 text-[#71717a] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TYPE TITLE, CHARACTER, OR STUDIO NAME..."
              className="w-full px-4 py-4 bg-transparent text-white font-mono text-sm placeholder-[#52525b] border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none uppercase tracking-wider"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
                className="mr-5 text-[#71717a] hover:text-white p-1 shrink-0 focus:outline-none focus-visible:outline-none"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Filter Controls Panel */}
        <div className="bg-[#121216] border border-[#27272a] p-6 space-y-6">
          {/* Genre Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#71717a] uppercase font-bold tracking-wider">
              <Filter size={14} className="text-[#ff2e4d]" />
              <span>GENRE TAXONOMY</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                    selectedGenre === genre
                      ? 'bg-[#ff2e4d] text-black border-[#ff2e4d]'
                      : 'bg-[#191920] text-[#a1a1aa] border-[#27272a] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dropdown Selectors Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-4 border-t border-[#27272a]">
            <CustomSelect
              label="FORMAT"
              value={type}
              options={TYPES}
              onChange={setType}
            />

            <CustomSelect
              label="STATUS"
              value={status}
              options={STATUSES}
              onChange={setStatus}
            />

            <CustomSelect
              label="MIN SCORE"
              value={score}
              options={SCORES}
              onChange={setScore}
            />

            <CustomSelect
              label="SORT BY"
              value={orderBy}
              options={ORDER_BY_OPTIONS}
              onChange={setOrderBy}
            />
          </div>

          {showClearButton && (
            <div className="flex justify-end pt-3 border-t border-[#27272a]">
              <button
                type="button"
                onClick={clearAll}
                className="px-4 py-2 bg-[#ff2e4d]/10 border border-[#ff2e4d]/40 text-[#ff2e4d] font-mono font-bold text-xs uppercase hover:bg-[#ff2e4d] hover:text-black transition-colors flex items-center gap-1.5"
              >
                <X size={14} />
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>

        {/* Results Container */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={<X size={36} className="text-[#ff2e4d]" />}
              title="SEARCH QUERY FAILURE"
              description={error}
            />
          ) : hasSearched && results.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={36} className="text-[#71717a]" />}
              title="ZERO MATCHES FOUND"
              description={`No anime entries found matching "${query}". Try adjusting your genre or status filters.`}
            />
          ) : uniqueResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-[#a1a1aa] uppercase tracking-wider">
                <span>FOUND {uniqueResults.length} MATCHING ARCHIVE ENTRIES</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {uniqueResults.map((anime, i) => (
                  <AnimeCard key={anime.mal_id} anime={anime} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-6 bg-[#121216] border border-[#27272a] p-8">
              <Sparkles size={40} className="mx-auto text-[#ff2e4d]" />
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                  POPULAR CATALOGUE SEARCHES
                </h3>
                <p className="text-xs text-[#a1a1aa] font-mono">
                  Select a trending keyword below to query the database immediately:
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {TRENDING_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    className="px-4 py-2 bg-[#191920] border border-[#27272a] hover:border-[#ff2e4d] text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Search;
