import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Star, Trash2, Download, Upload, CheckCircle, Flame, Eye, Film, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../hooks/useWatchlist';
import { WATCH_STATUSES, saveWatchlist } from '../lib/watchlist';

export default function Watchlist() {
  const navigate = useNavigate();
  const { watchlist, updateStatus } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const filteredList = activeFilter === 'ALL'
    ? watchlist
    : watchlist.filter((item) => item.status === activeFilter);


  // Stats
  const totalCount = watchlist.length;
  const watchingCount = watchlist.filter((i) => i.status === 'watching').length;
  const planCount = watchlist.filter((i) => i.status === 'plan').length;
  const completedCount = watchlist.filter((i) => i.status === 'completed').length;
  const favoriteCount = watchlist.filter((i) => i.status === 'favorite').length;

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `miru_vault_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            saveWatchlist(parsed);
          }
        } catch (err) {
          alert("Invalid Watchlist JSON file format.");
        }
      };
    }
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-[#09090b] text-[#a1a1aa] pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="text-[#ff2e4d]" />
          RETURN TO PREVIOUS
        </button>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">

          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] font-bold uppercase tracking-widest">
              <Bookmark size={16} />
              <span>PERSISTENT LOCAL VAULT</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mt-1">
              PERSONAL WATCHLIST
            </h1>
          </div>

          {/* Backup / Restore Controls */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-white hover:text-[#ff2e4d] transition-all flex items-center gap-2 font-bold uppercase"
              title="Export Watchlist Backup JSON"
            >
              <Download size={14} />
              <span>EXPORT JSON</span>
            </button>

            <label className="px-4 py-2 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] text-white hover:text-[#ff2e4d] transition-all flex items-center gap-2 font-bold uppercase cursor-pointer">
              <Upload size={14} />
              <span>IMPORT JSON</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Vault Stats Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="bg-[#121216] border border-[#27272a] p-3.5 space-y-1">
            <div className="text-[10px] text-[#71717a] font-bold uppercase">TOTAL ARCHIVED</div>
            <div className="text-xl font-black text-white">{totalCount}</div>
          </div>
          <div className="bg-[#121216] border border-[#27272a] p-3.5 space-y-1">
            <div className="text-[10px] text-[#10b981] font-bold uppercase">WATCHING</div>
            <div className="text-xl font-black text-[#10b981]">{watchingCount}</div>
          </div>
          <div className="bg-[#121216] border border-[#27272a] p-3.5 space-y-1">
            <div className="text-[10px] text-[#3b82f6] font-bold uppercase">PLAN TO WATCH</div>
            <div className="text-xl font-black text-[#3b82f6]">{planCount}</div>
          </div>
          <div className="bg-[#121216] border border-[#27272a] p-3.5 space-y-1">
            <div className="text-[10px] text-[#8b5cf6] font-bold uppercase">COMPLETED</div>
            <div className="text-xl font-black text-[#8b5cf6]">{completedCount}</div>
          </div>
          <div className="bg-[#121216] border border-[#27272a] p-3.5 space-y-1">
            <div className="text-[10px] text-[#ff2e4d] font-bold uppercase">FAVORITES</div>
            <div className="text-xl font-black text-[#ff2e4d]">{favoriteCount}</div>
          </div>
        </div>

        {/* Status Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 font-mono text-xs border-b border-[#27272a] pb-4">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 border font-bold uppercase tracking-wider transition-all ${
              activeFilter === 'ALL'
                ? 'bg-[#ff2e4d] border-[#ff2e4d] text-black'
                : 'bg-[#121216] border-[#27272a] text-[#a1a1aa] hover:text-white'
            }`}
          >
            ALL ENTRIES ({totalCount})
          </button>
          {WATCH_STATUSES.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveFilter(st.id)}
              className={`px-4 py-2 border font-bold uppercase tracking-wider transition-all ${
                activeFilter === st.id
                  ? 'bg-white border-white text-black'
                  : 'bg-[#121216] border-[#27272a] text-[#a1a1aa] hover:text-white'
              }`}
            >
              {st.label} ({watchlist.filter((i) => i.status === st.id).length})
            </button>
          ))}
        </div>

        {/* Watchlist Grid Showcase */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredList.map((item) => {
                const currentStatusObj = WATCH_STATUSES.find((s) => s.id === item.status);
                return (
                  <motion.div
                    key={item.mal_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-[#191920] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-[#fbbf24] font-mono text-[10px] font-bold flex items-center gap-1 border border-white/10">
                        <Star size={10} className="fill-[#fbbf24]" />
                        <span>{item.score || 'N/A'}</span>
                      </div>
                      
                      {/* Status Tag Overlay */}
                      <div 
                        className="absolute bottom-0 inset-x-0 p-1.5 font-mono text-[9px] font-black uppercase text-center text-black"
                        style={{ backgroundColor: currentStatusObj?.color || '#ff2e4d' }}
                      >
                        {currentStatusObj?.label || 'BOOKMARKED'}
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between font-mono text-xs">
                      <Link
                        to={`/anime/${item.mal_id}`}
                        className="font-display font-bold text-xs text-white line-clamp-1 hover:text-[#ff2e4d] transition-colors"
                      >
                        {item.title}
                      </Link>

                      <div className="flex items-center justify-between pt-2 border-t border-[#27272a]">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item, e.target.value)}
                          className="bg-[#09090b] border border-[#27272a] text-[10px] text-white p-1 font-mono uppercase focus:outline-none focus:border-[#ff2e4d]"
                        >
                          {WATCH_STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => updateStatus(item, null)}
                          className="p-1 text-[#71717a] hover:text-[#ff2e4d] transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-[#121216] border border-[#27272a] p-8">
            <Bookmark size={40} className="text-[#52525b] mx-auto" />
            <div className="font-display text-xl font-bold text-white uppercase">
              NO ANIME FOUND IN VAULT
            </div>
            <p className="text-xs text-[#71717a] font-mono max-w-md mx-auto">
              You haven't bookmarked any anime under "{activeFilter}". Browse entries and click the bookmark button to save them to your offline vault.
            </p>
            <Link
              to="/search"
              className="inline-block px-6 py-3 bg-[#ff2e4d] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
            >
              BROWSE CATALOG
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
