import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Search from './pages/Search';
import Analytics from './pages/Analytics';
import Seasonal from './pages/Seasonal';
import Compare from './pages/Compare';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/seasonal" element={<Seasonal />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/vault" element={<Watchlist />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;





