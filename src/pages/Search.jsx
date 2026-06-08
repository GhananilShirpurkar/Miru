import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime, GENRE_MAP } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

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
      setError(err.message || 'Failed to search anime. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, selectedGenre, type, status, score, orderBy]);

  useEffect(() => {
    document.title = 'MIRU — Search Anime';
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

  // Trigger search on filter changes if query is not empty or genre is selected
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

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-2 uppercase font-bold">
            Discover Anime
          </h1>
          <p className="text-sm text-[#9090a8]">Search through thousands of anime titles</p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="relative mb-6"
        >
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5a72]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime by title..."
              className="w-full pl-12 pr-12 py-4 bg-[#13131a] border border-white/10 rounded-xl text-white placeholder-[#5a5a72] focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20 transition-all text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a5a72] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.form>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-[#13131a]/40 border border-white/5 rounded-2xl p-5 md:p-6"
        >
          <div className="flex flex-col gap-5">
            {/* Genre Filter Pills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter size={14} className="text-[#9090a8]" />
                <span className="text-xs text-[#9090a8] font-medium uppercase tracking-wider">Filter by Genre</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                      selectedGenre === genre
                        ? 'bg-[#ff6b35]/20 text-[#ff6b35] border-[#ff6b35]/40'
                        : 'bg-[#13131a] text-[#9090a8] border-white/10 hover:border-white/20 hover:text-[#f0f0f5]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Selector Dropdowns */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/15 scrollbar-track-transparent">
              {/* Type Filter */}
              <div className="flex-shrink-0 flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-[10px] text-[#5a5a72] uppercase tracking-wider font-semibold">Format</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none transition-all cursor-pointer border ${
                    type !== 'all'
                      ? 'border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]'
                      : 'bg-[#13131a] border-white/10 hover:border-white/20 focus:border-[#ff6b35]/50'
                  }`}
                >
                  {TYPES.map(t => (
                    <option key={t} value={t.toLowerCase()} className="bg-[#13131a] text-white">{t}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-shrink-0 flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-[10px] text-[#5a5a72] uppercase tracking-wider font-semibold">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none transition-all cursor-pointer border ${
                    status !== 'all'
                      ? 'border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]'
                      : 'bg-[#13131a] border-white/10 hover:border-white/20 focus:border-[#ff6b35]/50'
                  }`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s.toLowerCase()} className="bg-[#13131a] text-white">{s}</option>
                  ))}
                </select>
              </div>

              {/* Score Filter */}
              <div className="flex-shrink-0 flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-[10px] text-[#5a5a72] uppercase tracking-wider font-semibold">Min Score</span>
                <select
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className={`w-full rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none transition-all cursor-pointer border ${
                    score !== 'any'
                      ? 'border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]'
                      : 'bg-[#13131a] border-white/10 hover:border-white/20 focus:border-[#ff6b35]/50'
                  }`}
                >
                  {SCORES.map(s => (
                    <option key={s} value={s.toLowerCase()} className="bg-[#13131a] text-white">{s}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex-shrink-0 flex flex-col gap-1.5 min-w-[130px]">
                <span className="text-[10px] text-[#5a5a72] uppercase tracking-wider font-semibold">Sort By</span>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className={`w-full rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none transition-all cursor-pointer border ${
                    orderBy !== 'relevance'
                      ? 'border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]'
                      : 'bg-[#13131a] border-white/10 hover:border-white/20 focus:border-[#ff6b35]/50'
                  }`}
                >
                  {ORDER_BY_OPTIONS.map(o => (
                    <option key={o} value={o.toLowerCase()} className="bg-[#13131a] text-white">{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear All Button */}
            {showClearButton && (
              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-[#9090a8] border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-1.5"
                >
                  <X size={14} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={<span className="text-4xl">😢</span>}
                title="Search Error"
                description={error}
              />
            </motion.div>
          ) : hasSearched && results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={<SearchIcon size={32} className="text-[#5a5a72]" />}
                title="No Results Found"
                description={`We couldn't find any anime matching "${query}". Try a different search term or genre.`}
              />
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#9090a8]">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.map((anime, i) => (
                  <AnimeCard key={anime.mal_id} anime={anime} index={i} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center justify-center py-20 px-4 max-w-xl mx-auto text-center">
                <SearchIcon size={48} className="text-[#5a5a72] mb-6 opacity-60" />
                <h3 className="font-display text-lg font-bold text-white mb-2 uppercase tracking-wider">
                  Discover Anime
                </h3>
                <p className="text-sm text-[#9090a8] mb-8">
                  Enter a search query or select a genre above to get started, or try one of these trending searches:
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {TRENDING_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#13131a] hover:bg-[#ff6b35]/10 text-white hover:text-[#ff6b35] border border-white/5 hover:border-[#ff6b35]/30 transition-all duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Search;
