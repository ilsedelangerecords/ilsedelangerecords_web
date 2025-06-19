import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AlbumsPage from './components/pages/AlbumsPage';
import AlbumDetailPage from './components/pages/AlbumDetailPage';
import LyricsPage from './components/pages/LyricsPage';
import LyricsDetailPage from './components/pages/LyricsDetailPage';
import ArtistPage from './components/pages/ArtistPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:slug" element={<AlbumDetailPage />} />
            <Route path="/lyrics" element={<LyricsPage />} />
            <Route path="/lyrics/:slug" element={<LyricsDetailPage />} />
            <Route path="/artist/:slug" element={<ArtistPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;

