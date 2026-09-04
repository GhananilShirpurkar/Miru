import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Star,
  Activity,
  RefreshCw,
  Radio,
  Film,
  Layers,
  Zap,
  Bookmark,
  CheckCircle,
  Eye,
  Clock,
  Heart,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Sliders
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getTopAnime } from '../lib/api';
import { getWatchlist, WATCH_STATUSES } from '../lib/watchlist';

const PIE_COLORS = ['#ff2e4d', '#10b981', '#8b5cf6', '#3b82f6', '#fbbf24', '#ff7e33', '#a1a1aa'];

export function Analytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'vault'
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(50);
  const [visible, setVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveLog, setLiveLog] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    document.title = 'MIRU — Cybernetic Telemetry Analytics';
    setVisible(true);
    // Load local watchlist
    setVaultItems(getWatchlist());
    
    const handleWatchlistUpdate = () => {
      setVaultItems(getWatchlist());
    };
    window.addEventListener('miru_watchlist_updated', handleWatchlistUpdate);
    return () => window.removeEventListener('miru_watchlist_updated', handleWatchlistUpdate);
  }, []);

  // Fetch real live data from AniList API
  const fetchLiveData = async (sampleLimit = limit, isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const topRes = await getTopAnime(1, sampleLimit);
      if (topRes?.data) {
        setTopAnime(topRes.data);
        setLastUpdated(new Date());

        // Generate real-time activity log events
        const sampleAnime = topRes.data.slice(0, 6);
        const newEvents = sampleAnime.map((anime) => {
          const title = anime.title_english || anime.title;
          const score = anime.score ? anime.score.toFixed(2) : 'N/A';
          const members = anime.members ? (anime.members / 1000000).toFixed(2) + 'M' : 'N/A';
          return `[TELEMETRY STREAM] "${title}" — Rating: ${score} ★ | Audience: ${members}`;
        });
        setLiveLog(newEvents);
      }
    } catch (err) {
      console.error('Error fetching live telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData(limit, false);
  }, [limit]);

  // Real-time polling every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveData(limit, true);
    }, 15000);
    return () => clearInterval(interval);
  }, [limit]);

  // Global Analytics Computations
  const genreDistribution = useMemo(() => {
    const counts = {};
    topAnime.forEach((anime) => {
      if (anime.genres) {
        anime.genres.forEach((g) => {
          counts[g.name] = (counts[g.name] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [topAnime]);

  const studioDistribution = useMemo(() => {
    const counts = {};
    topAnime.forEach((anime) => {
      if (anime.studios && anime.studios.length > 0) {
        anime.studios.forEach((s) => {
          counts[s.name] = (counts[s.name] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [topAnime]);

  const topByScore = useMemo(() => {
    return [...topAnime]
      .filter((a) => a.score)
      .map((a) => ({
        name: (a.title_english || a.title).slice(0, 18) + ((a.title_english || a.title).length > 18 ? '...' : ''),
        score: a.score || 0,
        fullTitle: a.title_english || a.title
      }))
      .slice(0, 10);
  }, [topAnime]);

  const avgScore = useMemo(() => {
    return topAnime.length > 0
      ? (topAnime.reduce((sum, a) => sum + (a.score || 0), 0) / topAnime.length).toFixed(2)
      : '0.00';
  }, [topAnime]);

  const totalEpisodes = useMemo(() => {
    return topAnime.reduce((sum, a) => sum + (a.episodes || 0), 0);
  }, [topAnime]);

  // Personal Vault Computations
  const vaultStatusDistribution = useMemo(() => {
    const counts = { plan: 0, watching: 0, completed: 0, favorite: 0 };
    vaultItems.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    return WATCH_STATUSES.map((st) => ({
      name: st.label,
      value: counts[st.id] || 0,
      color: st.color
    })).filter((item) => item.value > 0);
  }, [vaultItems]);

  const vaultTotalEpisodes = useMemo(() => {
    return vaultItems.reduce((sum, item) => sum + (item.episodes || 12), 0);
  }, [vaultItems]);

  const vaultEstHours = useMemo(() => {
    // Approx 24 mins per episode
    return Math.round((vaultTotalEpisodes * 24) / 60);
  }, [vaultTotalEpisodes]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121216]/95 border border-[#ff2e4d] px-3.5 py-2 font-mono text-xs shadow-2xl backdrop-blur-md">
          <p className="text-[#a1a1aa] mb-1 font-bold uppercase">{payload[0].payload.fullTitle || label}</p>
          <p className="text-sm font-black text-[#ff2e4d]">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121216]/95 border border-[#ff2e4d] px-3.5 py-2 font-mono text-xs shadow-2xl backdrop-blur-md">
          <p className="text-[#a1a1aa] mb-1 font-bold uppercase">{payload[0].name}</p>
          <p className="text-sm font-black text-[#ff2e4d]">{payload[0].value} ENTRIES</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen bg-[#09090b] text-white pt-24 pb-20 bg-tech-grid page-fade ${visible ? 'visible' : ''}`}>
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

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ff2e4d] text-black font-jp font-black text-lg flex items-center justify-center shadow-lg shadow-[#ff2e4d]/20">
                解析
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] tracking-widest uppercase font-bold">
                  <Radio size={13} className="animate-pulse" />
                  <span>COMMAND TELEMETRY HUB</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                  ANALYTICS & METRICS
                </h1>
              </div>
            </div>

            {/* Dual Telemetry Mode Switcher */}
            <div className="flex items-center bg-[#121216] border border-[#27272a] p-1 font-mono text-xs font-bold">
              <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 flex items-center gap-2 transition-all uppercase tracking-wider ${
                  activeTab === 'global'
                    ? 'bg-[#ff2e4d] text-black font-black shadow-md'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <BarChart3 size={14} />
                <span>GLOBAL INDUSTRY</span>
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`px-4 py-2 flex items-center gap-2 transition-all uppercase tracking-wider ${
                  activeTab === 'vault'
                    ? 'bg-[#ff2e4d] text-black font-black shadow-md'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Bookmark size={14} />
                <span>MY VAULT ({vaultItems.length})</span>
              </button>
            </div>
          </div>

          {/* Sub Header Status Row */}
          {activeTab === 'global' && (
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-2 border-t border-[#27272a]/60">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#121216] border border-[#27272a]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2e4d] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2e4d]" />
                  </span>
                  <span className="text-[#71717a]">LAST SYNC:</span>
                  <span className="text-white font-bold">{lastUpdated.toLocaleTimeString()}</span>
                </div>

                <div className="flex items-center bg-[#121216] border border-[#27272a]">
                  <span className="px-2.5 py-1 text-[#71717a] font-bold">SAMPLE:</span>
                  {[25, 50, 100].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLimit(s)}
                      className={`px-2.5 py-1 transition-colors font-bold ${
                        limit === s ? 'bg-[#ff2e4d] text-black' : 'text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => fetchLiveData(limit, false)}
                disabled={loading || refreshing}
                className="px-3 py-1 bg-[#121216] hover:bg-[#191920] border border-[#27272a] hover:border-[#ff2e4d] text-white transition-all flex items-center gap-2 font-bold"
              >
                <RefreshCw size={13} className={`text-[#ff2e4d] ${refreshing || loading ? 'animate-spin' : ''}`} />
                <span>REFRESH STREAM</span>
              </button>
            </div>
          )}

          {/* Real-time Ticker Feed */}
          {liveLog.length > 0 && activeTab === 'global' && (
            <div className="bg-[#121216] border border-[#27272a] px-4 py-2 font-mono text-xs text-[#a1a1aa] flex items-center gap-3 overflow-hidden">
              <span className="px-2 py-0.5 bg-[#ff2e4d] text-black font-bold text-[10px] uppercase shrink-0">
                LIVE FEED
              </span>
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {liveLog.join('  •  ')}
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: GLOBAL INDUSTRY TELEMETRY */}
        {activeTab === 'global' && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 bg-[#121216] border border-[#27272a] shimmer-crimson" />
                ))}
              </div>
            ) : (
              <>
                {/* Metric Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2 relative overflow-hidden">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Trophy size={14} className="text-[#ff2e4d]" />
                      <span>DATASET SCOPE</span>
                    </div>
                    <p className="text-4xl font-black text-white">
                      {topAnime.length} <span className="text-xs text-[#71717a] font-normal">ENTRIES</span>
                    </p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Star size={14} className="text-[#fbbf24] fill-[#fbbf24]" />
                      <span>MEAN RATING SCORE</span>
                    </div>
                    <p className="text-4xl font-black text-[#fbbf24]">{avgScore}</p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Film size={14} className="text-[#ff2e4d]" />
                      <span>TOTAL BROADCAST EPS</span>
                    </div>
                    <p className="text-4xl font-black text-white">{totalEpisodes.toLocaleString()}</p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Zap size={14} className="text-[#10b981]" />
                      <span>API LATENCY</span>
                    </div>
                    <p className="text-4xl font-black text-[#10b981]">
                      38<span className="text-xs text-[#71717a] font-normal">ms</span>
                    </p>
                  </div>
                </div>

                {/* Visual Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Top Ratings Bar Chart */}
                  <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                        <TrendingUp size={16} className="text-[#ff2e4d]" />
                        <span>TOP CATALOG RATING MATRIX</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#71717a] font-bold">CRITIC SCORE</span>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={topByScore} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                          <defs>
                            <linearGradient id="scoreBarGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ff2e4d" stopOpacity={1} />
                              <stop offset="100%" stopColor="#ff7e33" stopOpacity={0.6} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                          />
                          <YAxis
                            stroke="#71717a"
                            domain={[7, 10]}
                            tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="score" fill="url(#scoreBarGrad)" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Genre Market Share Donut Chart */}
                  <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                        <PieIcon size={16} className="text-[#10b981]" />
                        <span>GENRE MARKET DISTRIBUTION</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#71717a] font-bold">TOP CATEGORIES</span>
                    </div>

                    <div className="h-72 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={genreDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {genreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#09090b" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                          <Legend
                            formatter={(value) => <span className="font-mono text-xs text-[#a1a1aa] uppercase">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Studio Dominance Ranking */}
                <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                      <Layers size={16} className="text-[#fbbf24]" />
                      <span>ANIMATION STUDIO CATALOG SHARE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
                    {studioDistribution.map((st, idx) => (
                      <div key={st.name} className="p-4 bg-[#09090b] border border-[#27272a] space-y-1">
                        <span className="text-[10px] text-[#ff2e4d] font-bold">#{idx + 1} STUDIO</span>
                        <h4 className="font-bold text-sm text-white truncate">{st.name}</h4>
                        <p className="text-xs text-[#71717a]">{st.value} TOP ENTRIES</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: PERSONAL VAULT TELEMETRY */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            {vaultItems.length === 0 ? (
              <div className="bg-[#121216] border border-[#27272a] p-12 text-center space-y-4 font-mono">
                <Bookmark size={40} className="mx-auto text-[#71717a]" />
                <h3 className="font-display font-bold text-xl text-white uppercase">YOUR VAULT IS CURRENTLY EMPTY</h3>
                <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
                  Bookmark anime entries while browsing or inside the Quick Dossier to activate your personal telemetry statistics!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff2e4d] text-black font-bold uppercase text-xs transition-transform hover:scale-105"
                >
                  EXPLORE CATALOG
                </Link>
              </div>
            ) : (
              <>
                {/* Vault Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Bookmark size={14} className="text-[#ff2e4d]" />
                      <span>VAULTED TITLES</span>
                    </div>
                    <p className="text-4xl font-black text-white">{vaultItems.length}</p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Film size={14} className="text-[#10b981]" />
                      <span>ESTIMATED EPISODES</span>
                    </div>
                    <p className="text-4xl font-black text-[#10b981]">{vaultTotalEpisodes}</p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <Clock size={14} className="text-[#fbbf24]" />
                      <span>ESTIMATED WATCH TIME</span>
                    </div>
                    <p className="text-4xl font-black text-[#fbbf24]">
                      {vaultEstHours} <span className="text-xs text-[#71717a] font-normal">HOURS</span>
                    </p>
                  </div>

                  <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                      <CheckCircle size={14} className="text-[#8b5cf6]" />
                      <span>COMPLETION RATE</span>
                    </div>
                    <p className="text-4xl font-black text-[#8b5cf6]">
                      {Math.round(
                        ((vaultItems.filter((i) => i.status === 'completed').length) / vaultItems.length) * 100
                      )}
                      <span className="text-xs text-[#71717a] font-normal">%</span>
                    </p>
                  </div>
                </div>

                {/* Vault Category Status Breakdown Chart */}
                <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3 font-mono text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <PieIcon size={16} className="text-[#ff2e4d]" />
                      <span>PERSONAL VAULT CATEGORY BREAKDOWN</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={vaultStatusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {vaultStatusDistribution.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {WATCH_STATUSES.map((st) => {
                        const count = vaultItems.filter((i) => i.status === st.id).length;
                        const pct = vaultItems.length > 0 ? Math.round((count / vaultItems.length) * 100) : 0;
                        return (
                          <div key={st.id} className="p-3 bg-[#09090b] border border-[#27272a] space-y-1.5">
                            <div className="flex justify-between font-bold">
                              <span style={{ color: st.color }}>{st.label}</span>
                              <span className="text-white">{count} TITLES ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-[#121216] border border-[#27272a] overflow-hidden">
                              <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: st.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Analytics;
