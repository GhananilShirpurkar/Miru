import { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../lib/sound';

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const toggleMute = useCallback(() => {
    return soundEngine.toggleMute();
  }, []);

  const playHover = useCallback(() => {
    soundEngine.playHover();
  }, []);

  const playClick = useCallback(() => {
    soundEngine.playClick();
  }, []);

  const playSlide = useCallback(() => {
    soundEngine.playSlide();
  }, []);

  const playToggle = useCallback((isOpen) => {
    soundEngine.playToggle(isOpen);
  }, []);

  return {
    isMuted,
    toggleMute,
    playHover,
    playClick,
    playSlide,
    playToggle
  };
}
