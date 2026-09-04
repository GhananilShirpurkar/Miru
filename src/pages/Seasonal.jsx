import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, ChevronRight, Tv } from 'lucide-react';
import { getCurrentSeasonalAnime } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export function Seasonal() {
  const navigate = useNavigate();
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    document.title = 'MIRU — Seasonal Broadcasts';
    setVisible(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getCurrentSeasonalAnime(1, 24);
        setAnime(res.data);
      } catch (err) {
        setError('Failed to load current seasonal broadcasts.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const currentDate = new Date();
  const month = currentDate.getMonth();
  let season = 'WINTER';
  if (month >= 2 && month <= 4) season = 'SPRING';
  else if (month >= 5 && month <= 7) season = 'SUMMER';
  else if (month >= 8 && month <= 10) season = 'FALL';

  const uniqueAnime = Array.from(new Map(anime.map(a => [a.mal_id, a])).entries()).map(([, v]) => v);

  return (
    <div className={`min-h-screen bg-[#09090b] text-white pt-24 pb-20 page-fade ${visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="border-b border-[#27272a] pb-6 space-y-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-[#ff2e4d]" />
            RETURN TO PREVIOUS
          </button>


          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#121216] border border-[#27272a] text-[#ff2e4d] font-jp font-black text-sm flex items-center justify-center">
                今期
              </div>
              <div>
                <div className="font-mono text-xs text-[#ff2e4d] tracking-widest uppercase font-bold">
                  CURRENT BROADCAST INDEX
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                  {season} {currentDate.getFullYear()} SHOWS
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#121216] border border-[#27272a] font-mono text-xs text-[#a1a1aa]">
              <Tv size={14} className="text-[#ff2e4d]" />
              <span>{anime.length} BROADCASTING SHOWS</span>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<Clock size={36} className="text-[#ff2e4d]" />}
            title="BROADCAST FETCH FAILURE"
            description={error}
          />
        ) : uniqueAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {uniqueAnime.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Calendar size={36} className="text-[#71717a]" />}
            title="NO SEASONAL ENTRIES"
            description="No seasonal broadcast data recorded at this time."
            action={
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff2e4d] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                CATALOGUE SEARCH <ChevronRight size={14} />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}

export default Seasonal;

