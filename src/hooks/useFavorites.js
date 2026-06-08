import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'miru_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Synchronize state across all component instances dynamically
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {
        setFavorites([]);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('miru-favorites-updated', handleSync);
    
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('miru-favorites-updated', handleSync);
    };
  }, []);

  const addFavorite = useCallback((anime) => {
    if (!anime || !anime.mal_id) return;
    setFavorites((prev) => {
      if (prev.some(item => item.mal_id === anime.mal_id)) return prev;
      const updated = [...prev, anime];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('miru-favorites-updated'));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((malId) => {
    if (!malId) return;
    setFavorites((prev) => {
      const updated = prev.filter(item => item.mal_id !== malId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('miru-favorites-updated'));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((malId) => {
    if (!malId) return false;
    return favorites.some(item => item.mal_id === malId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

export default useFavorites;

