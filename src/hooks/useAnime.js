import { useState, useEffect, useCallback, useRef } from 'react';
import { getCached } from '../utils/cache';
import { fetchWithDelay } from '../lib/api';

// Simple global subscriber system to trigger the rate-limit Toast in the layout
let toastListeners = [];
export const subscribeTo429Toast = (listener) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
};

const trigger429Toast = () => {
  toastListeners.forEach(listener => listener());
};

export function useAnime(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track fetch operations to avoid race conditions when URLs change rapidly
  const fetchCount = useRef(0);

  const fetchData = useCallback(async (abortController) => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // 1. Check cache first
    const cachedData = getCached(url);
    if (cachedData) {
      setLoading(true);
      setError(null);
      fetchCount.current += 1;
      const currentFetch = fetchCount.current;
      
      try {
        const resolvedData = await cachedData; // This handles both data or active Promise
        if (currentFetch === fetchCount.current) {
          setData(resolvedData.data || resolvedData);
          setError(null);
        }
      } catch (err) {
        if (currentFetch === fetchCount.current) {
          setError(err.message || 'Something went wrong');
          setData(null);
        }
      } finally {
        if (currentFetch === fetchCount.current) {
          setLoading(false);
        }
      }
      return;
    }
    
    setLoading(true);
    setError(null);
    fetchCount.current += 1;
    const currentFetch = fetchCount.current;

    try {
      const result = await fetchWithDelay(url);
      if (currentFetch === fetchCount.current) {
        setData(result.data || result);
        setError(null);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (currentFetch === fetchCount.current) {
        if (err.message?.includes('429')) {
          trigger429Toast();
        }
        setError(err.message || 'Something went wrong');
        setData(null);
      }
    } finally {
      if (currentFetch === fetchCount.current) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
export default useAnime;
