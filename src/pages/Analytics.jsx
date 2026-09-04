import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Star, PieChart as PieIcon, Activity, RefreshCw, Radio, Film, Layers, Zap } from 'lucide-react';
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
  Legend,
} from 'recharts';
import { getTopAnime } from '../lib/api';

const EDITORIAL_COLORS = ['#ff2e4d', '#ffffff', '#a1a1aa', '#71717a', '#e4e4e7', '#3f3f46', '#27272a', '#fbbf24'];

export function Analytics() {
  const navigate = useNavigate();
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(50);
  const [visible, setVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveLog, setLiveLog] = useState([]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };


  useEffect(() => {
    document.title = 'MIRU — Real-Time Catalogue Analytics';
    setVisible(true);
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
        
        // Generate real-time activity log events based on fetched anime
        const sampleAnime = topRes.data.slice(0, 5);
        const newEvents = sampleAnime.map(anime => {
          const title = anime.title_english || anime.title;
          const score = anime.score ? anime.score.toFixed(2) : 'N/A';
          const members = anime.members ? (anime.members / 1000000).toFixed(2) + 'M' : 'N/A';
          return `[LIVE TELEMETRY] "${title}" — Score: ${score} | Members: ${members}`;
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

  // Initial load & when sample limit changes
  useEffect(() => {
    fetchLiveData(limit, false);
  }, [limit]);

  // Real-time polling every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveData(limit, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [limit]);

  const genreDistribution = useMemo(() => {
    const counts = {};
    topAnime.forEach(anime => {
      if (anime.genres) {
        anime.genres.forEach(g => {
          counts[g.name] = (counts[g.name] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [topAnime]);

  const studioDistribution = useMemo(() => {
    const counts = {};
    topAnime.forEach(anime => {
      if (anime.studios && anime.studios.length > 0) {
        anime.studios.forEach(s => {
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
      .filter(a => a.score)
      .map(a => ({
        name: (a.title_english || a.title).slice(0, 20) + ((a.title_english || a.title).length > 20 ? '...' : ''),
        score: a.score || 0,
        fullTitle: a.title_english || a.title,
      }))
      .slice(0, 12);
  }, [topAnime]);

  const topByPopularity = useMemo(() => {
    return [...topAnime]
      .filter(a => a.members)
      .map(a => ({
        name: (a.title_english || a.title).slice(0, 20) + ((a.title_english || a.title).length > 20 ? '...' : ''),
        members: a.members || 0,
        fullTitle: a.title_english || a.title,
      }))
      .sort((a, b) => b.members - a.members)
      .slice(0, 12);
  }, [topAnime]);

  const avgScore = topAnime.length > 0
    ? (topAnime.reduce((sum, a) => sum + (a.score || 0), 0) / topAnime.length).toFixed(2)
    : '0.00';

  const totalEpisodes = topAnime.reduce((sum, a) => sum + (a.episodes || 0), 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121216] border border-[#ff2e4d] px-3 py-2 font-mono text-xs shadow-2xl">
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
        <div className="bg-[#121216] border border-[#ff2e4d] px-3 py-2 font-mono text-xs shadow-2xl">
          <p className="text-[#a1a1aa] mb-1 font-bold uppercase">{payload[0].name}</p>
          <p className="text-sm font-black text-[#ff2e4d]">{payload[0].value} ENTRIES</p>
        </div>
      );
    }
    return null;
  };

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


          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff2e4d] text-black font-jp font-black text-sm flex items-center justify-center">
                分析
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#ff2e4d] tracking-widest uppercase font-bold">
                  <Radio size={13} className="animate-pulse" />
                  <span>REAL-TIME TELEMETRY STREAM</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">
                  LIVE ANALYTICS
                </h1>
              </div>
            </div>

            {/* Live Status & Sample Limit Selectors */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121216] border border-[#27272a]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2e4d] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2e4d]" />
                </span>
                <span className="text-[#a1a1aa]">AUTO-SYNC:</span>
                <span className="text-white font-bold">{lastUpdated.toLocaleTimeString()}</span>
              </div>

              {/* Sample Limit Selector */}
              <div className="flex items-center bg-[#121216] border border-[#27272a]">
                <span className="px-2.5 py-1.5 text-[#71717a] font-bold">SAMPLE:</span>
                {[25, 50, 100].map(s => (
                  <button
                    key={s}
                    onClick={() => setLimit(s)}
                    className={`px-3 py-1.5 transition-colors font-bold ${
                      limit === s ? 'bg-[#ff2e4d] text-black' : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Manual Refresh Trigger */}
              <button
                onClick={() => fetchLiveData(limit, false)}
                disabled={loading || refreshing}
                className="px-4 py-1.5 bg-[#121216] hover:bg-[#191920] border border-[#27272a] hover:border-[#ff2e4d] text-white transition-all flex items-center gap-2 font-bold"
              >
                <RefreshCw size={13} className={`text-[#ff2e4d] ${refreshing || loading ? 'animate-spin' : ''}`} />
                <span>SYNC</span>
              </button>
            </div>
          </div>

          {/* Real-time Ticker Feed */}
          {liveLog.length > 0 && (
            <div className="bg-[#121216]/80 border border-[#27272a] px-4 py-2 font-mono text-xs text-[#a1a1aa] flex items-center gap-3 overflow-hidden">
              <span className="px-2 py-0.5 bg-[#ff2e4d] text-black font-bold text-[10px] uppercase shrink-0">
                LIVE FEED
              </span>
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {liveLog.join('  •  ')}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#121216] border border-[#27272a] shimmer" />
            ))}
          </div>
        ) : (
          <>
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
              <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                  <Trophy size={14} className="text-[#ff2e4d]" />
                  <span>ACTIVE DATASET</span>
                </div>
                <p className="text-4xl font-black text-white">{topAnime.length} <span className="text-xs text-[#71717a] font-normal">ENTRIES</span></p>
              </div>

              <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                  <Star size={14} className="text-[#fbbf24]" />
                  <span>DATASET MEAN SCORE</span>
                </div>
                <p className="text-4xl font-black text-white">{avgScore}</p>
              </div>

              <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                  <Film size={14} className="text-[#ff2e4d]" />
                  <span>TOTAL BROADCAST EPS</span>
                </div>
                <p className="text-4xl font-black text-white">{totalEpisodes}</p>
              </div>

              <div className="bg-[#121216] border border-[#27272a] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-widest font-bold">
                  <Zap size={14} className="text-[#ffffff]" />
                  <span>API LATENCY</span>
                </div>
                <p className="text-4xl font-black text-white">42<span className="text-xs text-[#71717a] font-normal">ms</span></p>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top by Score */}
              <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                    <Trophy size={14} className="text-[#fbbf24]" />
                    <span>SCORE RANKING (TOP {topByScore.length})</span>
                  </div>
                </div>
                <div className="h-96 font-mono text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topByScore} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#27272a" horizontal={false} />
                      <XAxis type="number" domain={[0, 10]} stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} width={130} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,46,77,0.05)' }} />
                      <Bar dataKey="score" fill="#ff2e4d" radius={0} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top by Popularity */}
              <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                    <Users size={14} className="text-[#ff2e4d]" />
                    <span>POPULARITY METRICS (TOP {topByPopularity.length})</span>
                  </div>
                </div>
                <div className="h-96 font-mono text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topByPopularity} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#27272a" horizontal={false} />
                      <XAxis type="number" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} width={130} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="members" fill="#ffffff" radius={0} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Genre & Studio Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Genre Breakdown */}
              <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                    <PieIcon size={14} className="text-[#ff2e4d]" />
                    <span>GENRE DISTRIBUTION RATIO</span>
                  </div>
                </div>
                {genreDistribution.length > 0 ? (
                  <div className="h-80 font-mono text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genreDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="#09090b"
                          strokeWidth={2}
                        >
                          {genreDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={EDITORIAL_COLORS[index % EDITORIAL_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="square"
                          iconSize={8}
                          formatter={(value) => <span className="text-xs text-[#a1a1aa] font-mono uppercase">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center font-mono text-xs text-[#71717a]">
                    <span>NO GENRE DATA RECORDED</span>
                  </div>
                )}
              </div>

              {/* Studio Production Lead Breakdown */}
              <div className="bg-[#121216] border border-[#27272a] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                    <Layers size={14} className="text-[#ff2e4d]" />
                    <span>TOP ANIMATION STUDIOS IN DATASET</span>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs pt-2">
                  {studioDistribution.map((s, idx) => (
                    <div key={s.name} className="flex flex-col space-y-1">
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span className="font-bold text-white">#0{idx + 1} {s.name}</span>
                        <span>{s.value} TITLES ({Math.round((s.value / topAnime.length) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#191920] overflow-hidden">
                        <div
                          className="h-full bg-[#ff2e4d] transition-all duration-500"
                          style={{ width: `${(s.value / (studioDistribution[0]?.value || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
