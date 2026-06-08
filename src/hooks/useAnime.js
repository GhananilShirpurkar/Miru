import { useState, useEffect, useCallback, useRef } from 'react';

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
            throw new Error("Slow down — too many requests");
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch anime: ${response.status}`);
        }

        const json = await response.json();
        
        if (currentFetch === fetchCount.current) {
          setData(json.data || null);
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
    };

    await performFetch();
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
