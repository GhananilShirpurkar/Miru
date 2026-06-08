import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, SortAsc, SortDesc } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFavorites, removeFavorite } from '../lib/store';
import { getAnimeById } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState('added');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    document.title = 'MIRU — My Favorites';
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedItems = getFavorites();
      if (storedItems.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const animeList = [];
        for (const item of storedItems) {
          if (typeof item === 'object' && item !== null && item.mal_id) {
            // Already cached full object locally
            animeList.push(item);
          } else {
            // ID fallback
            try {
              const res = await getAnimeById(Number(item));
              animeList.push(res.data);
            } catch {
              // Skip failed loads
            }
          }
        }
        setFavorites(animeList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setFavorites(prev => prev.filter(a => a.mal_id !== id));
    window.dispatchEvent(new Event('storage'));
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    let comparison = 0;
    switch (sortMode) {
      case 'score':
        comparison = (b.score || 0) - (a.score || 0);
        break;
      case 'title':
        comparison = (a.title_english || a.title).localeCompare(b.title_english || b.title);
        break;
      case 'added':
      default:
        comparison = 0;
        break;
    }
    return sortAsc ? -comparison : comparison;
  });

  return (
    <div className="min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-2 uppercase font-bold">
                My Favorites
              </h1>
              <p className="text-sm text-[#9090a8]">
                {favorites.length} anime in your collection
              </p>
            </div>

            {favorites.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="px-3 py-2 bg-[#13131a] border border-white/10 rounded-lg text-sm text-[#f0f0f5] focus:outline-none focus:border-[#ff6b35]/50"
                >
                  <option value="added">Recently Added</option>
                  <option value="score">By Score</option>
                  <option value="title">By Title</option>
                </select>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="p-2 bg-[#13131a] border border-white/10 rounded-lg text-[#9090a8] hover:text-white transition-colors"
                >
                  {sortAsc ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Heart size={32} className="text-[#5a5a72]" />}
            title="No Favorites Yet"
            description="Start exploring anime and add your favorites to build your personal collection."
            action={
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-white font-semibold rounded-xl hover:bg-[#ff6b35]/90 transition-all"
              >
                Discover Anime
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedFavorites.map((anime, i) => (
              <div key={anime.mal_id} className="relative group">
                <AnimeCard anime={anime} index={i} />
                <button
                  onClick={() => handleRemove(anime.mal_id)}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500"
                  title="Remove from favorites"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
