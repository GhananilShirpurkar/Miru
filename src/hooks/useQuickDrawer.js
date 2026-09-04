import { useState, useEffect } from 'react';

// Custom event to trigger quick drawer globally from any component
const OPEN_DRAWER_EVENT = 'miru_open_quick_drawer';

export function openQuickDrawer(anime) {
  window.dispatchEvent(new CustomEvent(OPEN_DRAWER_EVENT, { detail: anime }));
}

export function useQuickDrawer() {
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail) {
        setSelectedAnime(e.detail);
        setIsOpen(true);
      }
    };
    window.addEventListener(OPEN_DRAWER_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_DRAWER_EVENT, handleOpen);
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedAnime,
    openDrawer: openQuickDrawer,
    closeDrawer,
  };
}
