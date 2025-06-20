import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent, useContentSearch } from '../../lib/contentLoader';
import { Search, Filter, Music, User, Globe, ExternalLink, Copy, Share2 } from 'lucide-react';

const LyricsPage = () => {
  const { data: lyrics, loading, error } = useContent('lyrics');
  const { data: artists } = useContent('artists');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ artist: 'all', language: 'all', verified: 'all' });
  const [sortBy, setSortBy] = useState('title');

  // Get unique values for filters - with safer null checks
  const uniqueArtists = (lyrics && Array.isArray(lyrics)) ? 
    [...new Set(lyrics.filter(lyric => lyric?.artist).map(lyric => lyric.artist))] : [];
  const uniqueLanguages = (lyrics && Array.isArray(lyrics)) ? 
    [...new Set(lyrics.filter(lyric => lyric?.language).map(lyric => lyric.language))] : [];

  // Apply filtering and searching manually - with safer null checks
  const filteredData = (lyrics && Array.isArray(lyrics)) ? lyrics.filter(lyric => {
    // Ensure lyric exists and has basic properties
    if (!lyric) return false;
    
    const matchesSearch = !searchTerm || 
      (lyric.title && lyric.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lyric.artist && lyric.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lyric.album && lyric.album.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArtist = filters.artist === 'all' || (lyric.artist && lyric.artist === filters.artist);
    const matchesLanguage = filters.language === 'all' || (lyric.language && lyric.language === filters.language);
    const matchesVerified = filters.verified === 'all' || 
      (filters.verified === 'verified' && lyric.verified === true) ||
      (filters.verified === 'unverified' && lyric.verified !== true);
    
    return matchesSearch && matchesArtist && matchesLanguage && matchesVerified;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lyrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading lyrics: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Song Lyrics</h1>
              <p className="mt-2 text-gray-600">
                Complete lyrics collection with {lyrics?.length || 0} songs
              </p>
            </div>
            
            {/* GitHub Edit Button */}
            <a
              href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/pages/LyricsPage.jsx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Edit on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Lyrics
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by song title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Artist Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Artist
              </label>
              <select
                value={filters.artist}
                onChange={(e) => setFilters({...filters, artist: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Artists</option>
                {uniqueArtists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Languages</option>
                {uniqueLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'en' ? 'English' : lang === 'nl' ? 'Dutch' : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="artist-asc">Artist A-Z</option>
                <option value="wordCount-desc">Longest First</option>
                <option value="wordCount-asc">Shortest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData?.length || 0} of {lyrics?.length || 0} songs
          </p>
        </div>

        {/* Lyrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData?.map((lyric) => (
            <div key={lyric.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Song Title */}
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {lyric.title}
                </h3>
                
                {/* Artist and Album */}
                <div className="text-sm text-gray-600 mb-3">
                  <p className="flex items-center mb-1">
                    <User className="w-4 h-4 mr-1" />
                    {lyric.artist}
                  </p>
                  {lyric.album && (
                    <p className="flex items-center">
                      <Music className="w-4 h-4 mr-1" />
                      {lyric.album}
                    </p>
                  )}
                </div>

                {/* Language and Verification */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Globe className="w-3 h-3 mr-1" />
                    {lyric.language === 'en' ? 'English' : lyric.language === 'nl' ? 'Dutch' : lyric.language}
                  </span>
                  
                  {lyric.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>                {/* Full Lyrics Content */}
                {lyric.content && (
                  <div className="bg-gray-50 rounded-md p-4 mb-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {lyric.content}
                    </pre>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  {lyric.wordCount && (
                    <span>{lyric.wordCount} words</span>
                  )}
                  {lyric.writers && lyric.writers.length > 0 && (
                    <span>By: {lyric.writers.join(', ')}</span>
                  )}
                </div>                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    to={`/lyrics/${lyric.id || lyric.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium text-center"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(lyric.content);
                      // Could add a toast notification here
                    }}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    title="Copy lyrics"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData?.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lyrics found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsPage;

