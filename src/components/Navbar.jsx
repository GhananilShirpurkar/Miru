import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Calendar, BarChart2, Menu, X, Swords, Bookmark } from 'lucide-react';
import MiruIcon from './MiruIcon';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global '/' keyboard shortcut to jump to search page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const navItems = [
    { path: '/', label: 'HOME', icon: HomeIcon },
    { path: '/search', label: 'SEARCH', icon: SearchIcon },
    { path: '/seasonal', label: 'SEASONAL', icon: Calendar },
    { path: '/compare', label: 'COMPARE', icon: Swords },
    { path: '/vault', label: 'VAULT', icon: Bookmark },
    { path: '/analytics', label: 'ANALYTICS', icon: BarChart2 },
  ];


  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a] shadow-xl shadow-black/40'
          : 'bg-[#09090b]/60 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Custom Miru Icon */}
          <Link to="/" className="flex items-center gap-3 group">
            <MiruIcon size={34} className="transform group-hover:scale-105 transition-transform duration-300" />
            <span className="font-display text-2xl font-black tracking-tighter text-white group-hover:text-[#ff2e4d] transition-colors uppercase leading-none">
              MIRU
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest font-mono transition-all duration-200 ${
                    active
                      ? 'text-[#ff2e4d]'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-[#ff2e4d]' : 'text-[#71717a]'} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff2e4d]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger Shortcut & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/search')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#121216] border border-[#27272a] hover:border-[#ff2e4d]/60 text-xs font-mono text-[#a1a1aa] hover:text-white transition-all group"
              title="Press '/' to search"
            >
              <SearchIcon size={13} className="text-[#71717a] group-hover:text-[#ff2e4d] transition-colors" />
              <span>SEARCH</span>
              <kbd className="px-1.5 py-0.5 bg-[#191920] border border-white/10 text-[10px] text-[#ff2e4d] rounded font-mono font-bold">
                /
              </kbd>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#a1a1aa] hover:text-white hover:bg-white/5 border border-[#27272a] transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >

              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#09090b] border-b border-[#27272a] overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2 font-mono text-xs tracking-wider">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 border transition-all ${
                  active
                    ? 'bg-[#121216] border-[#ff2e4d] text-[#ff2e4d] font-bold'
                    : 'border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {active && <span className="w-1.5 h-1.5 bg-[#ff2e4d]" />}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

