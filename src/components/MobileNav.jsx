import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Calendar, BarChart2, Swords, Bookmark } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-[#27272a] shadow-2xl px-2 py-1 font-mono text-[10px]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-6 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-sm transition-colors ${
                active
                  ? 'text-[#ff2e4d] font-bold bg-[#121216]'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#ff2e4d]' : 'text-[#71717a]'} />
              <span className="mt-1 truncate max-w-full text-[9px] tracking-tight">{item.label}</span>
              {active && <span className="w-1 h-1 bg-[#ff2e4d] rounded-full mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
