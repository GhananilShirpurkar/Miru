import React from 'react';

export function MiruIcon({ size = 36, className = '' }) {
  return (
    <div 
      className={`relative flex items-center justify-center bg-[#09090b] rounded-md overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="#ff2e4d"
          strokeWidth="6"
        />

        {/* Eye Contour Arc Upper */}
        <path
          d="M 18 50 C 28 28, 72 28, 82 50"
          stroke="#ff2e4d"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eye Contour Arc Lower */}
        <path
          d="M 18 50 C 28 72, 72 72, 82 50"
          stroke="#ff2e4d"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pupil Inner Circles */}
        <circle
          cx="50"
          cy="50"
          r="18"
          stroke="#ffffff"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Negative-Space Play Triangle */}
        <polygon
          points="44,38 64,50 44,62"
          fill="#ff2e4d"
          stroke="#09090b"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default MiruIcon;
