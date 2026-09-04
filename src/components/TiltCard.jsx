import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function TiltCard({ children, className = '', maxRotate = 12 }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of card (-1 to 1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    setRotateY(mouseX * maxRotate);
    setRotateX(-mouseY * maxRotate);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.03 : 1
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative ${className}`}
      >
        {children}

        {/* Specular Light Sheen Overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none rounded transition-opacity duration-300 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent"
            style={{
              transform: `translate3d(${rotateY * 2}px, ${-rotateX * 2}px, 20px)`
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default TiltCard;
