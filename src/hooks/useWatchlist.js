import { useState, useEffect, useCallback } from 'react';
import { getWatchlist, setAnimeWatchStatus, getAnimeWatchStatus } from '../lib/watchlist';

export function useWatchlist(malId = null) {
  const [watchlist, setWatchlist] = useState(() => getWatchlist());
  const [status, setStatus] = useState(() => (malId ? getAnimeWatchStatus(malId) : null));

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getWatchlist();
      setWatchlist(updated);
      if (malId) {
        setStatus(getAnimeWatchStatus(malId));
      }
    };

    window.addEventListener('miru_watchlist_updated', handleUpdate);
    return () => window.removeEventListener('miru_watchlist_updated', handleUpdate);
  }, [malId]);

  const updateStatus = useCallback((anime, newStatus) => {
    setAnimeWatchStatus(anime, newStatus);
  }, []);

  return {
    watchlist,
    status,
    updateStatus
  };
}
