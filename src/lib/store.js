const FAVORITES_KEY = 'miru_favorites';

export function getFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(anime) {
  if (!anime) return;
  const animeObj = typeof anime === 'object' ? anime : { mal_id: Number(anime) };
  const favorites = getFavorites();
  if (!favorites.some(item => item.mal_id === animeObj.mal_id)) {
    favorites.push(animeObj);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('miru-favorites-updated'));
  }
}

export function removeFavorite(animeId) {
  const favorites = getFavorites();
  const updated = favorites.filter(item => item.mal_id !== Number(animeId));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('miru-favorites-updated'));
}

export function isFavorite(animeId) {
  return getFavorites().some(item => item.mal_id === Number(animeId));
}

export function toggleFavorite(anime) {
  if (!anime) return false;
  const id = typeof anime === 'object' ? anime.mal_id : Number(anime);
  if (isFavorite(id)) {
    removeFavorite(id);
    return false;
  }
  addFavorite(anime);
  return true;
}

export function getFavoritesCount() {
  return getFavorites().length;
}
