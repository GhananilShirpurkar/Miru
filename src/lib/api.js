const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.jikan.moe/v4';

async function fetchWithDelay(url, retries = 1) {
  // Jikan API has rate limiting, add small delay between requests
  await new Promise(resolve => setTimeout(resolve, 350));
  try {
    const response = await fetch(url);
    if (response.status === 429 && retries > 0) {
      console.warn(`Jikan API 429 rate limit hit. Retrying in 1.5s... URL: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return fetchWithDelay(url, retries - 1);
    }
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch error. Retrying in 1.5s... Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return fetchWithDelay(url, retries - 1);
    }
    throw error;
  }
}

export async function getTopAnime(page = 1, limit = 25) {
  return fetchWithDelay(`${BASE_URL}/top/anime?page=${page}&limit=${limit}`);
}

export async function getAnimeById(id) {
  return fetchWithDelay(`${BASE_URL}/anime/${id}/full`);
}

export async function searchAnime(query, page = 1, limit = 25) {
  const encoded = encodeURIComponent(query);
  return fetchWithDelay(`${BASE_URL}/anime?q=${encoded}&page=${page}&limit=${limit}&order_by=popularity&sort=asc`);
}

export async function getAnimeByGenre(genreId, page = 1, limit = 25) {
  return fetchWithDelay(`${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}&order_by=popularity&sort=asc`);
}

export async function getSeasonalAnime(year, season, page = 1, limit = 25) {
  return fetchWithDelay(`${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=${limit}`);
}

export async function getCurrentSeasonalAnime(page = 1, limit = 25) {
  return fetchWithDelay(`${BASE_URL}/seasons/now?page=${page}&limit=${limit}`);
}

// Genre IDs from Jikan API
export const GENRE_MAP = {
  'Action': 1,
  'Adventure': 2,
  'Comedy': 4,
  'Drama': 8,
  'Fantasy': 10,
  'Horror': 14,
  'Mystery': 7,
  'Romance': 22,
  'Sci-Fi': 24,
  'Slice of Life': 36,
  'Sports': 30,
  'Supernatural': 37,
  'Thriller': 41,
};

export const GENRE_COLORS = {
  'Action': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Adventure': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Comedy': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Drama': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Fantasy': 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30',
  'Horror': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Mystery': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Romance': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Sci-Fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Slice of Life': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Sports': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Supernatural': 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30',
  'Thriller': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export function getGenreColor(genreName) {
  return GENRE_COLORS[genreName] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
}
