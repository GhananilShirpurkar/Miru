// LocalStorage Watchlist Manager for MIRU Vault

const WATCHLIST_KEY = 'miru_watchlist_vault';

export const WATCH_STATUSES = [
  { id: 'plan', label: 'PLAN TO WATCH', color: '#3b82f6' },
  { id: 'watching', label: 'WATCHING', color: '#10b981' },
  { id: 'completed', label: 'COMPLETED', color: '#8b5cf6' },
  { id: 'favorite', label: 'FAVORITE', color: '#ff2e4d' }
];

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse watchlist:', e);
    return [];
  }
}

export function saveWatchlist(items) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('miru_watchlist_updated'));
  } catch (e) {
    console.error('Failed to save watchlist:', e);
  }
}

export function getAnimeWatchStatus(malId) {
  const list = getWatchlist();
  const found = list.find((item) => String(item.mal_id) === String(malId));
  return found ? found.status : null;
}

export function setAnimeWatchStatus(anime, status) {
  const list = getWatchlist();
  const index = list.findIndex((item) => String(item.mal_id) === String(anime.mal_id));

  if (!status) {
    // Remove if status is null
    if (index !== -1) list.splice(index, 1);
  } else {
    const entry = {
      mal_id: anime.mal_id,
      title: anime.title_english || anime.title,
      image: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '',
      score: anime.score,
      type: anime.type,
      episodes: anime.episodes,
      status: status,
      addedAt: new Date().toISOString()
    };
    if (index !== -1) {
      list[index] = entry;
    } else {
      list.unshift(entry);
    }
  }

  saveWatchlist(list);
}
