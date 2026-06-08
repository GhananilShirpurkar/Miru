import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/search', label: 'Search', icon: SearchIcon },
    { path: '/seasonal', label: 'Seasonal', icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl tracking-wider text-[#ff6b35] group-hover:scale-105 transition-transform uppercase italic">
              ANITRACK
            </span>
            <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-[#ff6b35]'
                      : 'text-[#9090a8] hover:text-[#f0f0f5] hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ff6b35] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Avatar & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/analytics"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 text-[#ff6b35] text-xs font-semibold hover:bg-[#ff6b35]/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
              Analytics
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#00f3ff] flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#9090a8] hover:text-white transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                        : 'text-[#9090a8] hover:text-[#f0f0f5] hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/analytics"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive('/analytics')
                    ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                    : 'text-[#9090a8] hover:text-[#f0f0f5] hover:bg-white/5'
                }`}
              >
                <span className="w-[18px] h-[18px] flex items-center justify-center text-xs">&#128202;</span>
                <span>Analytics</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
