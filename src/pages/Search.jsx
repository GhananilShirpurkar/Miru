import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAnime, getAnimeByGenre, GENRE_MAP } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [hasSearched, setHasSearched] = useState(!!initialQuery || !!initialGenre);

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

      let data = [];

      if (selectedGenre && GENRE_MAP[selectedGenre]) {
        const res = await getAnimeByGenre(GENRE_MAP[selectedGenre], 1, 24);
        data = res.data;
      } else if (query.trim()) {
        const res = await searchAnime(query.trim(), 1, 24);
        data = res.data;
      }

      setResults(data);
    } catch (err) {
      setError('Failed to search anime. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, selectedGenre]);

  useEffect(() => {
    document.title = 'MIRU — Search Anime';
  }, []);

  useEffect(() => {
    if (initialQuery || initialGenre) {
      performSearch();
    }
  }, [initialQuery, initialGenre, performSearch]);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (selectedGenre) params.genre = selectedGenre;
    setSearchParams(params);
  }, [query, selectedGenre, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const toggleGenre = (genre) => {
    setSelectedGenre(prev => prev === genre ? '' : genre);
    // Execute immediately after state update is scheduled
    setTimeout(() => performSearch(), 0);
  };

  const clearAll = () => {
    setQuery('');
    setSelectedGenre('');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

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

        {/* Genre Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-[#9090a8]" />
            <span className="text-xs text-[#9090a8] font-medium uppercase tracking-wider">Filter by Genre</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
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
            {(query || selectedGenre) && (
              <button
                onClick={clearAll}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-[#5a5a72] border border-white/10 hover:text-[#f0f0f5] transition-colors"
              >
                Clear All
              </button>
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
              <EmptyState
                icon={<SearchIcon size={32} className="text-[#5a5a72]" />}
                title="Start Searching"
                description="Enter a search term or select a genre to discover anime."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Search;
