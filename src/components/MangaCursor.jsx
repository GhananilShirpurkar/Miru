import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function MangaCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on fine pointer devices (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if target is interactive (link, button, input)
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, [role="button"], .interactive');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#ff2e4d] rounded-full pointer-events-none z-[999999] mix-blend-difference"
        animate={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
          scale: isHovered ? 2.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 1200, damping: 50, mass: 0.1 }}
      />

      {/* Lagging Target Ring */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 border border-[#ff2e4d] rounded-full pointer-events-none z-[999998] transition-colors duration-200 ${
          isHovered ? 'bg-[#ff2e4d]/15 border-[#ff2e4d]' : 'opacity-60'
        }`}
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: isHovered ? 1.6 : 1,
          rotate: isHovered ? 45 : 0
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.2 }}
      >
        {/* Crosshair accents on hover */}
        {isHovered && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-[#ff2e4d] font-black">
            +
          </span>
        )}
      </motion.div>
    </>
  );
}

export default MangaCursor;
