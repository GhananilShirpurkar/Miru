import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Swords, Trophy, Star, Film, Flame, Award, ArrowRight, CheckCircle2, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAnimeById, searchAnime } from '../lib/api';
import CustomSelect from '../components/CustomSelect';

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const anime1Id = searchParams.get('anime1') || '5114'; // Default FMA Brotherhood
  const anime2Id = searchParams.get('anime2') || '9253'; // Default Steins;Gate

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };


  const [anime1, setAnime1] = useState(null);
  const [anime2, setAnime2] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search states for picking anime
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [searching1, setSearching1] = useState(false);
  const [searching2, setSearching2] = useState(false);

  // Fetch details for selected combatants
  useEffect(() => {
    async function fetchCombatants() {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          getAnimeById(anime1Id).catch(() => null),
          getAnimeById(anime2Id).catch(() => null)
        ]);
        setAnime1(res1?.data || null);
        setAnime2(res2?.data || null);
      } catch (err) {
        console.error('Failed to load comparison data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCombatants();
  }, [anime1Id, anime2Id]);


  // Debounced search for Combatant 1
  useEffect(() => {
    if (!search1.trim()) { setResults1([]); return; }
    const timer = setTimeout(async () => {
      setSearching1(true);
      try {
        const res = await searchAnime(search1, 1, 5);
        setResults1(res.data || []);
      } catch (e) {} finally { setSearching1(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [search1]);

  // Debounced search for Combatant 2
  useEffect(() => {
    if (!search2.trim()) { setResults2([]); return; }
    const timer = setTimeout(async () => {
      setSearching2(true);
      try {
        const res = await searchAnime(search2, 1, 5);
        setResults2(res.data || []);
      } catch (e) {} finally { setSearching2(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [search2]);

  const setCombatant1 = (id) => {
    setSearchParams({ anime1: id, anime2: anime2Id });
    setSearch1('');
    setResults1([]);
  };

  const setCombatant2 = (id) => {
    setSearchParams({ anime1: anime1Id, anime2: id });
    setSearch2('');
    setResults2([]);
  };

  // Determine metric winners
  const scoreWinner = anime1?.score && anime2?.score 
    ? (anime1.score > anime2.score ? 1 : anime1.score < anime2.score ? 2 : 0) 
    : 0;

  const popWinner = anime1?.members && anime2?.members
    ? (anime1.members > anime2.members ? 1 : anime1.members < anime2.members ? 2 : 0)
    : 0;

  const rankWinner = anime1?.rank && anime2?.rank
    ? (anime1.rank < anime2.rank ? 1 : anime1.rank > anime2.rank ? 2 : 0)
    : 0;

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

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">

          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] font-bold uppercase tracking-widest">
              <Swords size={16} />
              <span>HEAD-TO-HEAD BATTLE ARENA</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mt-1">
              ANIME COMPARISON MATRIX
            </h1>
          </div>

          <div className="font-mono text-xs text-[#52525b]">
            SIDE-BY-SIDE ANALYTICAL TELEMETRY
          </div>
        </div>

        {/* Combatant Pickers Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121216] border border-[#27272a] p-4 sm:p-6">
          {/* Picker 1 */}
          <div className="relative space-y-2">
            <label className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>SELECT COMBATANT ALPHA</span>
              <span className="text-[#ff2e4d]">#01</span>
            </label>
            <input
              type="text"
              value={search1}
              onChange={(e) => setSearch1(e.target.value)}
              placeholder="SEARCH ANIME TITLE..."
              className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#ff2e4d] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#52525b] uppercase tracking-wider focus:outline-none"
            />
            {results1.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-40 bg-[#121216] border border-[#ff2e4d] mt-1 divide-y divide-[#27272a] max-h-60 overflow-y-auto shadow-2xl">
                {results1.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => setCombatant1(item.mal_id)}
                    className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-[#ff2e4d]/10 text-white font-mono text-xs transition-colors"
                  >
                    <img src={item.images?.jpg?.small_image_url} alt="" className="w-7 h-10 object-cover" />
                    <div className="truncate">
                      <div className="font-bold truncate">{item.title_english || item.title}</div>
                      <div className="text-[10px] text-[#71717a]">SCORE: {item.score || 'N/A'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Picker 2 */}
          <div className="relative space-y-2">
            <label className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>SELECT COMBATANT BETA</span>
              <span className="text-[#10b981]">#02</span>
            </label>
            <input
              type="text"
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
              placeholder="SEARCH ANIME TITLE..."
              className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#10b981] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#52525b] uppercase tracking-wider focus:outline-none"
            />
            {results2.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-40 bg-[#121216] border border-[#10b981] mt-1 divide-y divide-[#27272a] max-h-60 overflow-y-auto shadow-2xl">
                {results2.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => setCombatant2(item.mal_id)}
                    className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-[#10b981]/10 text-white font-mono text-xs transition-colors"
                  >
                    <img src={item.images?.jpg?.small_image_url} alt="" className="w-7 h-10 object-cover" />
                    <div className="truncate">
                      <div className="font-bold truncate">{item.title_english || item.title}</div>
                      <div className="text-[10px] text-[#71717a]">SCORE: {item.score || 'N/A'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#ff2e4d] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs text-[#71717a] uppercase tracking-widest">
              CALIBRATING COMPARISON MATRICES...
            </p>
          </div>
        ) : anime1 && anime2 ? (
          <div className="space-y-12">
            
            {/* Versus Cards Showcase Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* VS Central Emblem Badge */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-[#09090b] border-2 border-[#ff2e4d] items-center justify-center font-display font-black text-xl text-white shadow-2xl shadow-[#ff2e4d]/40">
                VS
              </div>

              {/* Combatant 1 Showcase */}
              <div className={`relative bg-[#121216] border-2 p-6 space-y-4 ${
                scoreWinner === 1 ? 'border-[#ff2e4d] shadow-xl shadow-[#ff2e4d]/10' : 'border-[#27272a]'
              }`}>
                {scoreWinner === 1 && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#ff2e4d] text-black font-mono font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <Trophy size={12} />
                    <span>HIGHER RATED</span>
                  </div>
                )}
                <div className="flex gap-4">
                  <img
                    src={anime1.images?.webp?.large_image_url || anime1.images?.jpg?.large_image_url}
                    alt=""
                    className="w-28 sm:w-36 aspect-[2/3] object-cover border border-[#27272a] shrink-0"
                  />
                  <div className="space-y-2 truncate">
                    <h2 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate">
                      {anime1.title_english || anime1.title}
                    </h2>
                    <p className="font-jp text-xs text-[#a1a1aa] truncate">{anime1.title_japanese}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[10px]">
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-[#ff2e4d] font-bold">
                        ★ {anime1.score ? anime1.score.toFixed(2) : 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-white">
                        RANK #{anime1.rank || 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-[#a1a1aa]">
                        {anime1.episodes || 'TBA'} EPS
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/anime/${anime1.mal_id}`}
                  className="w-full py-2.5 bg-[#09090b] hover:bg-[#ff2e4d] border border-[#27272a] hover:border-[#ff2e4d] text-white hover:text-black font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <span>VIEW DOSSIER</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Combatant 2 Showcase */}
              <div className={`relative bg-[#121216] border-2 p-6 space-y-4 ${
                scoreWinner === 2 ? 'border-[#10b981] shadow-xl shadow-[#10b981]/10' : 'border-[#27272a]'
              }`}>
                {scoreWinner === 2 && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#10b981] text-black font-mono font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <Trophy size={12} />
                    <span>HIGHER RATED</span>
                  </div>
                )}
                <div className="flex gap-4">
                  <img
                    src={anime2.images?.webp?.large_image_url || anime2.images?.jpg?.large_image_url}
                    alt=""
                    className="w-28 sm:w-36 aspect-[2/3] object-cover border border-[#27272a] shrink-0"
                  />
                  <div className="space-y-2 truncate">
                    <h2 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate">
                      {anime2.title_english || anime2.title}
                    </h2>
                    <p className="font-jp text-xs text-[#a1a1aa] truncate">{anime2.title_japanese}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[10px]">
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-[#10b981] font-bold">
                        ★ {anime2.score ? anime2.score.toFixed(2) : 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-white">
                        RANK #{anime2.rank || 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] text-[#a1a1aa]">
                        {anime2.episodes || 'TBA'} EPS
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/anime/${anime2.mal_id}`}
                  className="w-full py-2.5 bg-[#09090b] hover:bg-[#10b981] border border-[#27272a] hover:border-[#10b981] text-white hover:text-black font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <span>VIEW DOSSIER</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual Metric Bar Comparison breakdown */}
            <div className="bg-[#121216] border border-[#27272a] p-6 space-y-6">
              <div className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-[#27272a] pb-3 flex items-center gap-2">
                <BarChartIcon size={16} className="text-[#ff2e4d]" />
                <span>ANALYTICAL METRIC DISTRIBUTION</span>
              </div>

              {/* Score Bar */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-white font-bold">
                  <span className="text-[#ff2e4d]">ALPHA: {anime1.score || 'N/A'}</span>
                  <span className="text-[#a1a1aa]">CRITIC OVERALL RATING</span>
                  <span className="text-[#10b981]">BETA: {anime2.score || 'N/A'}</span>
                </div>
                <div className="h-3 bg-[#09090b] border border-[#27272a] flex overflow-hidden">
                  <div
                    className="bg-[#ff2e4d] h-full transition-all duration-500"
                    style={{
                      width: `${(anime1.score / ((anime1.score || 0) + (anime2.score || 0))) * 100}%`
                    }}
                  />
                  <div
                    className="bg-[#10b981] h-full transition-all duration-500"
                    style={{
                      width: `${(anime2.score / ((anime1.score || 0) + (anime2.score || 0))) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Members Popularity Bar */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-white font-bold">
                  <span className="text-[#ff2e4d]">ALPHA: {(anime1.members || 0).toLocaleString()}</span>
                  <span className="text-[#a1a1aa]">COMMUNITY MEMBERS</span>
                  <span className="text-[#10b981]">BETA: {(anime2.members || 0).toLocaleString()}</span>
                </div>
                <div className="h-3 bg-[#09090b] border border-[#27272a] flex overflow-hidden">
                  <div
                    className="bg-[#ff2e4d] h-full transition-all duration-500"
                    style={{
                      width: `${(anime1.members / ((anime1.members || 1) + (anime2.members || 1))) * 100}%`
                    }}
                  />
                  <div
                    className="bg-[#10b981] h-full transition-all duration-500"
                    style={{
                      width: `${(anime2.members / ((anime1.members || 1) + (anime2.members || 1))) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Side-By-Side Technical Specifications Table */}
            <div className="bg-[#121216] border border-[#27272a] overflow-hidden font-mono text-xs">
              <div className="p-4 bg-[#191920] border-b border-[#27272a] font-bold text-white uppercase tracking-widest">
                FULL SPECIFICATION COMPARISON MATRIX
              </div>

              <div className="divide-y divide-[#27272a]">
                <SpecRow label="PRODUCTION STUDIO" val1={anime1.studios?.[0]?.name} val2={anime2.studios?.[0]?.name} />
                <SpecRow label="TYPE / FORMAT" val1={anime1.type} val2={anime2.type} />
                <SpecRow label="EPISODE COUNT" val1={anime1.episodes} val2={anime2.episodes} />
                <SpecRow label="AIRING STATUS" val1={anime1.status} val2={anime2.status} />
                <SpecRow label="SOURCE MATERIAL" val1={anime1.source} val2={anime2.source} />
                <SpecRow label="CONTENT RATING" val1={anime1.rating} val2={anime2.rating} />
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}

function SpecRow({ label, val1, val2 }) {
  return (
    <div className="grid grid-cols-3 p-3.5 hover:bg-white/5 transition-colors">
      <div className="text-white font-bold truncate pr-2">{val1 || 'N/A'}</div>
      <div className="text-center text-[#71717a] font-bold uppercase">{label}</div>
      <div className="text-right text-white font-bold truncate pl-2">{val2 || 'N/A'}</div>
    </div>
  );
}

function BarChartIcon(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
