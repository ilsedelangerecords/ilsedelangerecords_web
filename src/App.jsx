import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AlbumsPage from './components/pages/AlbumsPage';
import AlbumDetailPage from './components/pages/AlbumDetailPage';
import LyricsPage from './components/pages/LyricsPage';
import LyricsDetailPage from './components/pages/LyricsDetailPage';
import ArtistsPage from './components/pages/ArtistsPage';
import ArtistPage from './components/pages/ArtistPage';
import DisclaimerPage from './components/pages/DisclaimerPage';
import ContributePage from './components/pages/ContributePage';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ArtistManagement from './components/admin/ArtistManagement';
import ArtistForm from './components/admin/ArtistForm';
import ReleaseManagement from './components/admin/ReleaseManagement';

import './App.css';

// Check if we're in development mode with admin enabled
const isDevelopment = import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true';

// Debug component to log route changes
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Current search:', location.search);
    console.log('Current hash:', location.hash);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <RouteDebugger />
        <Routes>
          {/* Admin Routes - only available in development */}
          {isDevelopment && (
            <Route path="/admin/*" element={
              <AdminLayout>                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="artists" element={<ArtistManagement />} />
                  <Route path="artists/new" element={<ArtistForm />} />
                  <Route path="artists/:id/edit" element={<ArtistForm />} />
                  <Route path="releases" element={<ReleaseManagement />} />
                </Routes>
              </AdminLayout>
            } />
          )}
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/albums" element={<AlbumsPage />} />
                  <Route path="/album/:slug" element={<AlbumDetailPage />} />
                  <Route path="/lyrics" element={<LyricsPage />} />
                  <Route path="/lyrics/:slug" element={<LyricsDetailPage />} />
                  <Route path="/artists" element={<ArtistsPage />} />
                  <Route path="/artist/:slug" element={<ArtistPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/contribute" element={<ContributePage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

