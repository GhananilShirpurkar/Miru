import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="bg-[#13131a] rounded-xl overflow-hidden border border-white/5">
        <div className="aspect-[3/4] shimmer" />
        <div className="p-3 space-y-2">
          <div className="h-4 shimmer rounded bg-[#20202a]" />
          <div className="h-3 shimmer rounded w-2/3 bg-[#20202a]" />
          <div className="flex gap-1">
            <div className="h-5 w-14 shimmer rounded-full bg-[#20202a]" />
            <div className="h-5 w-12 shimmer rounded-full bg-[#20202a]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SkeletonCard;
