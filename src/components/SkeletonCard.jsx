import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <div className="bg-[#121216] border border-[#27272a] overflow-hidden">
        <div className="aspect-[3/4] shimmer-crimson" />
        <div className="p-3 space-y-2 bg-[#121216]">
          <div className="h-4 shimmer-crimson" />
          <div className="h-3 shimmer-crimson w-2/3" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-14 shimmer-crimson" />
            <div className="h-5 w-12 shimmer-crimson" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default SkeletonCard;
