import React from 'react';
import SkeletonCard from './SkeletonCard';

export function LoadingGrid({ count = 10 }) {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="anime-grid" aria-label="Loading anime content">
      {skeletons.map((id, index) => (
        <SkeletonCard key={id} index={index} />
      ))}
    </div>
  );
}

export default LoadingGrid;
