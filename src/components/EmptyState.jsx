import React from 'react';
import { motion } from 'framer-motion';

export function EmptyState({ icon, title, description, action, ctaText, onCtaClick }) {
  const renderIcon = () => {
    if (!icon) return null;
    // Check if icon is a React component (like Lucide Icons)
    if (typeof icon === 'function' || (typeof icon === 'object' && icon.render)) {
      const IconComponent = icon;
      return <IconComponent size={32} className="text-[#ff6b35]" />;
    }
    return icon;
  };

  const renderAction = () => {
    if (action) return action;
    if (ctaText && onCtaClick) {
      return (
        <button 
          className="px-6 py-2.5 bg-[#ff6b35] text-white font-display text-base tracking-wider rounded-lg hover:bg-[#ff8554] transition-colors uppercase"
          onClick={onCtaClick}
          type="button"
        >
          {ctaText}
        </button>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Manga speech bubble */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-[#13131a] border-2 border-[#ff6b35]/20 flex items-center justify-center">
          {renderIcon()}
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#13131a] border-r-2 border-b-2 border-[#ff6b35]/20 rotate-45" />
      </div>

      <h3 className="font-display text-2xl text-white mb-2 tracking-wide uppercase">{title}</h3>
      <p className="text-[#9090a8] text-sm text-center max-w-md mb-6">{description}</p>
      {renderAction() && <div>{renderAction()}</div>}
    </motion.div>
  );
}

export default EmptyState;
