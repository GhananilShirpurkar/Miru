import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Trophy, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
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

const CHART_COLORS = ['#ff6b35', '#00f3ff', '#fbbf24', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'];

export function Analytics() {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'MIRU — Analytics & Charts';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const topRes = await getTopAnime(1, 10);
        setTopAnime(topRes.data);
      } catch (err) {
        console.error('Error loading analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const topByScore = useMemo(() => {
    return [...topAnime]
      .filter(a => a.score)
      .map(a => ({
        name: (a.title_english || a.title).slice(0, 20) + ((a.title_english || a.title).length > 20 ? '...' : ''),
        score: a.score || 0,
        fullTitle: a.title_english || a.title,
      }))
      .slice(0, 10);
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
      .slice(0, 10);
  }, [topAnime]);

  const avgScore = topAnime.length > 0
    ? (topAnime.reduce((sum, a) => sum + (a.score || 0), 0) / topAnime.length).toFixed(2)
    : '0.00';

  const totalEpisodes = topAnime.reduce((sum, a) => sum + (a.episodes || 0), 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#13131a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-[#9090a8] mb-1">{payload[0].payload.fullTitle || label}</p>
          <p className="text-sm font-bold text-[#ff6b35]">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#13131a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-[#9090a8] mb-1">{payload[0].name}</p>
          <p className="text-sm font-bold text-[#ff6b35]">{payload[0].value} anime</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#9090a8] hover:text-[#ff6b35] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20">
              <BarChart3 size={20} className="text-[#ff6b35]" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide uppercase">Analytics</h1>
              <p className="text-xs text-[#5a5a72]">Global anime statistics & insights</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-[#13131a] rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#13131a] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#ff6b35]/10">
                    <Trophy size={16} className="text-[#ff6b35]" />
                  </div>
                  <span className="text-xs text-[#9090a8] uppercase tracking-wider font-medium font-display">Top Rated</span>
                </div>
                <p className="text-3xl font-bold text-white">{topAnime.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#13131a] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#fbbf24]/10">
                    <Star size={16} className="text-[#fbbf24]" />
                  </div>
                  <span className="text-xs text-[#9090a8] uppercase tracking-wider font-medium font-display">Avg Score</span>
                </div>
                <p className="text-3xl font-bold text-white">{avgScore}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#13131a] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#00f3ff]/10">
                    <Users size={16} className="text-[#00f3ff]" />
                  </div>
                  <span className="text-xs text-[#9090a8] uppercase tracking-wider font-medium font-display">Total Episodes</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalEpisodes}</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top by Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#13131a] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-[#fbbf24]" />
                  <h3 className="font-display text-lg text-white tracking-wide uppercase">Top 10 by Score</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topByScore} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" horizontal={false} />
                      <XAxis type="number" domain={[0, 10]} stroke="#5a5a72" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#9090a8" fontSize={10} tickLine={false} axisLine={false} width={100} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="score" fill="#ff6b35" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top by Popularity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#13131a] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-[#00f3ff]" />
                  <h3 className="font-display text-lg text-white tracking-wide uppercase">Top 10 by Popularity</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topByPopularity} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" horizontal={false} />
                      <XAxis type="number" stroke="#5a5a72" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis dataKey="name" type="category" stroke="#9090a8" fontSize={10} tickLine={false} axisLine={false} width={100} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="members" fill="#00f3ff" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Genre Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#13131a] rounded-xl p-5 border border-white/5 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-[#ff6b35]" />
                <h3 className="font-display text-lg text-white tracking-wide uppercase">Genre Distribution</h3>
              </div>
              {genreDistribution.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                          data={genreDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                      >
                        {genreDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs text-[#9090a8]">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-sm text-[#5a5a72]">No genre statistics available</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
