import { useState, useEffect, useCallback, useRef } from 'react';
import { getCached, setCached } from '../utils/cache';

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
          // Keep structure consistent with Jikan structure
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

    const performFetch = async (retryCount = 0) => {
      try {
        const response = await fetch(url, { signal: abortController?.signal });
        
        if (response.status === 429) {
          if (retryCount === 0) {
            // Wait 1000ms and retry once as per the spec
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return await performFetch(1);
          } else {
            // Trigger the rate limit toast
            trigger429Toast();
            throw new Error("Rate limit hit — please wait a moment");
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch anime: ${response.status}`);
        }

        const json = await response.json();
        // Return full JSON structure as Jikan functions expect wrapper
        return json;
      } catch (err) {
        throw err;
      }
    };

    // Construct the promise and store in cache immediately for request deduplication
    const fetchPromise = performFetch();
    setCached(url, fetchPromise);

    try {
      const result = await fetchPromise;
      if (currentFetch === fetchCount.current) {
        setData(result.data || result);
        setError(null);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (currentFetch === fetchCount.current) {
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
