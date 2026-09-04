import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MANGA_SOUND_EFFECTS = [
  { text: 'ドドド', label: 'DODODO', color: '#ff2e4d' },
  { text: 'ゴゴゴ', label: 'GOGOGO', color: '#ff7e33' },
  { text: 'バババ', label: 'BABABA', color: '#ffffff' },
  { text: 'シュッ', label: 'SHUTT', color: '#fbbf24' },
  { text: 'ギラッ', label: 'GIRA', color: '#ff2e4d' }
];

export function MangaFXText({ active = false, effectIndex = 0, className = '' }) {
  const fx = MANGA_SOUND_EFFECTS[effectIndex % MANGA_SOUND_EFFECTS.length];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10, rotate: -6 }}
          animate={{ opacity: 0.9, scale: 1.1, y: -20, rotate: 4 }}
          exit={{ opacity: 0, scale: 1.4, y: -35 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute pointer-events-none z-30 font-jp font-black text-2xl tracking-tighter drop-shadow-[0_4px_12px_rgba(255,46,77,0.5)] ${className}`}
          style={{ color: fx.color }}
        >
          <span className="stroke-black stroke-2">{fx.text}</span>
          <span className="block font-mono text-[9px] text-white/80 uppercase tracking-widest text-center -mt-1 font-bold">
            {fx.label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MangaFXText;
