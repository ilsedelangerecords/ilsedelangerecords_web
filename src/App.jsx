import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AlbumsPage from './components/pages/AlbumsPage';
import AlbumDetailPage from './components/pages/AlbumDetailPage';
import LyricsPage from './components/pages/LyricsPage';
import LyricsDetailPage from './components/pages/LyricsDetailPage';
import ArtistPage from './components/pages/ArtistPage';
import DisclaimerPage from './components/pages/DisclaimerPage';
import ContributePage from './components/pages/ContributePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/album/:slug" element={<AlbumDetailPage />} />
            <Route path="/lyrics" element={<LyricsPage />} />
            <Route path="/lyrics/:slug" element={<LyricsDetailPage />} />
            <Route path="/artist/:slug" element={<ArtistPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/contribute" element={<ContributePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

