// Deprecated: useFavorites hook was removed.
export function useFavorites() {
  return {
    favorites: [],
    addFavorite: () => {},
    removeFavorite: () => {},
    isFavorite: () => false
  };
}
export default useFavorites;
