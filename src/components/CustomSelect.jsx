import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomSelect({ label, value, options, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => 
    (typeof opt === 'string' ? opt.toLowerCase() : opt.value) === value
  ) || options[0];

  const getOptionLabel = (opt) => typeof opt === 'string' ? opt : opt.label;
  const getOptionValue = (opt) => typeof opt === 'string' ? opt.toLowerCase() : opt.value;

  return (
    <div className={`relative space-y-1.5 font-mono text-xs ${className}`} ref={containerRef}>
      {label && <label className="block text-[#71717a] uppercase font-bold tracking-wider">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-[#191920] border transition-all duration-200 uppercase font-bold text-white text-left ${
          isOpen ? 'border-[#ff2e4d] bg-[#1c1c24]' : 'border-[#27272a] hover:border-white/30'
        }`}
        aria-expanded={isOpen}
      >
        <span className="truncate">{getOptionLabel(selectedOption)}</span>
        <ChevronDown size={14} className={`text-[#ff2e4d] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-1 bg-[#121216] border border-[#27272a] shadow-2xl shadow-black max-h-56 overflow-y-auto overflow-x-hidden py-1"
          >
            {options.map((opt) => {
              const optVal = getOptionValue(opt);
              const optLbl = getOptionLabel(opt);
              const isSelected = optVal === value;

              return (
                <button
                  key={optVal}
                  type="button"
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left font-mono text-xs font-bold uppercase transition-colors ${
                    isSelected
                      ? 'bg-[#ff2e4d] text-black'
                      : 'text-[#a1a1aa] hover:bg-[#191920] hover:text-white'
                  }`}
                >
                  <span className="truncate">{optLbl}</span>
                  {isSelected && <Check size={13} className="shrink-0 text-black" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomSelect;
