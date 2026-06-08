import React from 'react';
import { Star } from 'lucide-react';

export function ScoreDisplay({ score, size = 'md', showBar = true }) {
  const normalizedScore = score ? (score / 10) * 100 : 0;
  const fullStars = score ? Math.floor(score / 2) : 0;
  const hasHalf = score ? (score / 2) % 1 >= 0.5 : false;

  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5',
  };

  const starSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center ${sizeClasses[size]}`}>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={starSizes[size]}
              className={
                i < fullStars
                  ? 'text-[#fbbf24] fill-[#fbbf24]'
                  : i === fullStars && hasHalf
                  ? 'text-[#fbbf24]'
                  : 'text-[#3a3a4a]'
              }
              fill={i < fullStars ? '#fbbf24' : 'none'}
            />
          ))}
        </div>
        <span className="font-bold text-[#f0f0f5] ml-2">
          {score ? score.toFixed(2) : 'N/A'}
        </span>
        <span className="text-[#5a5a72]">/10</span>
      </div>
      {showBar && (
        <div className="w-full h-2 bg-[#1a1a24] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff6b35] to-[#fbbf24] transition-all duration-1000"
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default ScoreDisplay;
