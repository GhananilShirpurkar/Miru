const cache = new Map();

const TTL_CONFIG = {
  topAnime: 10 * 60 * 1000,     // 10 minutes
  seasonal: 10 * 60 * 1000,     // 10 minutes
  detail: 30 * 60 * 1000,       // 30 minutes
  search: 2 * 60 * 1000,        // 2 minutes
  default: 2 * 60 * 1000        // 2 minutes
};

function getTTL(key) {
  // AniList cache keys are prefixed strings (e.g. "top:", "detail:", "seasonal:", "search:", "genre:")
  if (key.startsWith('top:')) {
    return TTL_CONFIG.topAnime;
  }
  if (key.startsWith('seasonal:')) {
    return TTL_CONFIG.seasonal;
  }
  if (key.startsWith('detail:')) {
    return TTL_CONFIG.detail;
  }
  if (key.startsWith('search:') || key.startsWith('genre:')) {
    return TTL_CONFIG.search;
  }
  return TTL_CONFIG.default;
}

export function getCached(url) {
  const cached = cache.get(url);
  if (!cached) return null;

  // If it's a promise, we are in-flight, return the promise itself
  if (cached.promise) {
    return cached.promise;
  }

  const { data, timestamp, ttl } = cached;
  if (Date.now() - timestamp > ttl) {
    cache.delete(url); // Expired
    return null;
  }

  return data;
}

export function setCached(url, dataOrPromise) {
  const ttl = getTTL(url);
  
  if (dataOrPromise instanceof Promise) {
    cache.set(url, {
      promise: dataOrPromise,
      timestamp: Date.now(),
      ttl
    });
    
    // Update cache with resolved value once ready
    dataOrPromise.then(
      (resolvedData) => {
        cache.set(url, {
          data: resolvedData,
          timestamp: Date.now(),
          ttl
        });
      },
      () => {
        // If the fetch fails, clean up the cache entry so subsequent requests can try again
        cache.delete(url);
      }
    );
  } else {
    cache.set(url, {
      data: dataOrPromise,
      timestamp: Date.now(),
      ttl
    });
  }
}
