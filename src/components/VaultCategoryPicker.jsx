import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, ChevronDown, Check, Trash2, Heart, Eye, Clock, CheckCircle } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { WATCH_STATUSES } from '../lib/watchlist';

export default function VaultCategoryPicker({ anime, fullWidth = false, size = 'normal' }) {
  const { status, updateStatus } = useWatchlist(anime?.mal_id);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!anime) return null;

  const currentStatusObj = WATCH_STATUSES.find((s) => s.id === status);

  const getStatusIcon = (stId) => {
    switch (stId) {
      case 'watching':
        return <Eye size={13} className="text-[#10b981]" />;
      case 'completed':
        return <CheckCircle size={13} className="text-[#8b5cf6]" />;
      case 'favorite':
        return <Heart size={13} className="text-[#ff2e4d] fill-[#ff2e4d]" />;
      case 'plan':
      default:
        return <Clock size={13} className="text-[#3b82f6]" />;
    }
  };

  const handleSelect = (targetStatus) => {
    updateStatus(anime, targetStatus);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''}`} ref={dropdownRef}>
      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full font-mono font-bold uppercase transition-all flex items-center justify-between gap-2 border shadow-sm ${
          size === 'small' ? 'py-2 px-3 text-[11px]' : 'py-3 px-4 text-xs'
        } ${
          status
            ? 'bg-[#ff2e4d] border-[#ff2e4d] text-black font-black'
            : 'bg-[#09090b] border-[#27272a] hover:border-[#ff2e4d] text-white'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Bookmark size={14} className={status ? 'fill-black text-black' : 'text-[#ff2e4d]'} />
          <span>{currentStatusObj ? currentStatusObj.label : 'ADD TO VAULT'}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Category Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 z-50 bg-[#121216] border border-[#27272a] shadow-2xl p-1 font-mono text-xs space-y-0.5">
          <div className="px-3 py-1.5 text-[9px] text-[#71717a] font-bold uppercase border-b border-[#27272a] mb-1">
            SELECT VAULT CATEGORY
          </div>

          {WATCH_STATUSES.map((st) => {
            const isSelected = status === st.id;
            return (
              <button
                key={st.id}
                onClick={() => handleSelect(st.id)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#ff2e4d]/15 text-white font-bold border-l-2 border-[#ff2e4d]'
                    : 'text-[#a1a1aa] hover:bg-[#191920] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(st.id)}
                  <span>{st.label}</span>
                </div>
                {isSelected && <Check size={13} className="text-[#ff2e4d]" />}
              </button>
            );
          })}

          {status && (
            <button
              onClick={() => handleSelect(null)}
              className="w-full px-3 py-2 text-left text-[#ff2e4d] hover:bg-[#ff2e4d]/10 flex items-center gap-2 border-t border-[#27272a] mt-1 pt-2 font-bold"
            >
              <Trash2 size={13} />
              <span>REMOVE FROM VAULT</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
