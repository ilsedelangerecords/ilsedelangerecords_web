import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useContent, useContentSearch } from '../../lib/contentLoader';
import { Search, Filter, Music, User, Globe, ExternalLink, Disc, ToggleLeft, ToggleRight } from 'lucide-react';

const LyricsPage = () => {  const { data: lyrics, loading, error } = useContent('lyrics');
  const { data: artists } = useContent('artists');
  const { data: spotifyComparison } = useContent('spotify-lyrics-comparison');
  const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ artist: 'all', language: 'all', album: 'all' });
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'lyrics-only', 'spotify-only'  // Initialize filters from URL parameters
  useEffect(() => {
    const artistParam = searchParams.get('artist');
    const languageParam = searchParams.get('language');
    const albumParam = searchParams.get('album');
    const searchParam = searchParams.get('search');
    const viewParam = searchParams.get('view');

    if (artistParam) {
      setFilters(prev => ({ ...prev, artist: artistParam }));
    }
    if (languageParam) {
      setFilters(prev => ({ ...prev, language: languageParam }));
    }
    if (albumParam) {
      setFilters(prev => ({ ...prev, album: albumParam }));
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (viewParam && ['all', 'lyrics-only', 'spotify-only'].includes(viewParam)) {
      setViewMode(viewParam);
    }
  }, [searchParams]);  // Combine lyrics and Spotify-only tracks
  const allTracks = React.useMemo(() => {
    if (viewMode === 'spotify-only' && spotifyComparison?.tracksMissingLyrics) {
      // Show only Spotify tracks without lyrics
      return spotifyComparison.tracksMissingLyrics.map(track => ({
        title: track.name,
        artist: track.primaryArtist,
        album: track.album?.name || '',
        language: 'Unknown',
        has_lyrics: false,
        spotify_url: track.external_urls?.spotify,
        spotify_id: track.id,
        spotify_album_art: track.album?.images?.[0]?.url,
        year: track.album?.release_date?.substring(0, 4) || '',
        isSpotifyOnly: true
      }));
    } else if (viewMode === 'lyrics-only') {
      // Show only tracks with lyrics
      return lyrics || [];
    } else {
      // Show all tracks (lyrics + Spotify-only)
      const lyricsData = lyrics || [];
      const spotifyOnlyTracks = spotifyComparison?.tracksMissingLyrics?.map(track => ({
        title: track.name,
        artist: track.primaryArtist,
        album: track.album?.name || '',
        language: 'Unknown',
        has_lyrics: false,
        spotify_url: track.external_urls?.spotify,
        spotify_id: track.id,
        spotify_album_art: track.album?.images?.[0]?.url,
        year: track.album?.release_date?.substring(0, 4) || '',
        isSpotifyOnly: true
      })) || [];
      
      return [...lyricsData, ...spotifyOnlyTracks];
    }
  }, [lyrics, spotifyComparison, viewMode]);

  // Get unique values for filters - with safer null checks
  const uniqueArtists = allTracks ? 
    [...new Set(allTracks.filter(track => track?.artist).map(track => track.artist))].sort() : [];
  const uniqueLanguages = allTracks ? 
    [...new Set(allTracks.filter(track => track?.language).map(track => track.language))].sort() : [];
  const uniqueAlbums = allTracks ? 
    [...new Set(allTracks.filter(track => track?.album).map(track => track.album))].sort() : [];  // Apply filtering and searching manually - with safer null checks
  const filteredData = allTracks ? allTracks.filter(track => {
    // Ensure track exists and has basic properties
    if (!track) return false;
    
    const matchesSearch = !searchTerm || 
      (track.title && track.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (track.album && track.album.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArtist = filters.artist === 'all' || (track.artist && track.artist === filters.artist);
    const matchesLanguage = filters.language === 'all' || (track.language && track.language === filters.language);
    const matchesAlbum = filters.album === 'all' || (track.album && track.album === filters.album);
    
    return matchesSearch && matchesArtist && matchesLanguage && matchesAlbum;
  }).sort((a, b) => {
    // Apply sorting
    switch (sortBy) {
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '');
      case 'artist-asc':
        return (a.artist || '').localeCompare(b.artist || '');
      case 'artist-desc':
        return (b.artist || '').localeCompare(a.artist || '');
      case 'album-asc':
        return (a.album || '').localeCompare(b.album || '');
      case 'album-desc':
        return (b.album || '').localeCompare(a.album || '');
      case 'wordCount-desc':
        return (b.wordCount || 0) - (a.wordCount || 0);
      case 'wordCount-asc':
        return (a.wordCount || 0) - (b.wordCount || 0);
      default:
        return (a.title || '').localeCompare(b.title || '');
    }
  }) : [];

  useEffect(() => {
    console.log('Lyrics data:', lyrics);
    console.log('Filtered data:', filteredData);
  }, [lyrics, filteredData]);
  // Helper functions to update filters and URL params
  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };
  const toggleViewMode = () => {
    let newMode;
    if (viewMode === 'all') {
      newMode = 'lyrics-only';
    } else if (viewMode === 'lyrics-only') {
      newMode = 'spotify-only';
    } else {
      newMode = 'all';
    }
    
    setViewMode(newMode);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (newMode !== 'all') {
      newSearchParams.set('view', newMode);
    } else {
      newSearchParams.delete('view');
    }
    setSearchParams(newSearchParams);
  };

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (term) {
      newSearchParams.set('search', term);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">            <div>              <h1 className="text-3xl font-bold text-gray-900">Song Lyrics</h1>
              <p className="mt-2 text-gray-600">
                {viewMode === 'spotify-only' 
                  ? `${spotifyComparison?.statistics?.tracksMissingLyrics || 0} Spotify tracks missing lyrics`
                  : viewMode === 'lyrics-only'
                  ? `Complete lyrics collection with ${lyrics?.length || 0} songs`
                  : `Complete lyrics collection with ${lyrics?.length || 0} songs`
                }
                {spotifyComparison && viewMode === 'all' && (
                  <span className="text-sm text-gray-500 block mt-1">
                    + {spotifyComparison.statistics?.tracksMissingLyrics || 0} Spotify tracks without lyrics
                  </span>
                )}
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

      <div className="max-w-7xl mx-auto px-4 py-8">        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Lyrics
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              placeholder="Search by song title, artist, or album..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Artist Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Artist
              </label>              <select
                value={filters.artist}
                onChange={(e) => updateFilter('artist', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Artists ({uniqueArtists.length})</option>
                {uniqueArtists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
            </div>

            {/* Album Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Music className="w-4 h-4 inline mr-1" />
                Album
              </label>
              <select
                value={filters.album}
                onChange={(e) => updateFilter('album', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Albums ({uniqueAlbums.length})</option>
                {uniqueAlbums.map(album => (
                  <option key={album} value={album}>{album}</option>
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
                onChange={(e) => updateFilter('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Languages</option>
                {uniqueLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'en' ? 'English' : lang === 'nl' ? 'Dutch' : lang}
                  </option>
                ))}
              </select>            </div>

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
                <option value="artist-desc">Artist Z-A</option>
                <option value="album-asc">Album A-Z</option>
                <option value="album-desc">Album Z-A</option>
                <option value="wordCount-desc">Longest First</option>
                <option value="wordCount-asc">Shortest First</option>
              </select>
            </div>          </div>          {/* View Mode Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Disc className="w-4 h-4 inline mr-1" />
                  View Mode
                </label>
                <p className="text-xs text-gray-500">
                  {viewMode === 'all' && 'Showing all tracks (lyrics + Spotify)'}
                  {viewMode === 'lyrics-only' && 'Showing only tracks with lyrics'}
                  {viewMode === 'spotify-only' && 'Showing only Spotify tracks missing lyrics'}
                  {spotifyComparison && ` (${filteredData?.length || 0} tracks)`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    viewMode === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    viewMode === 'lyrics-only' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Lyrics Only
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    viewMode === 'spotify-only' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Spotify Only
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ artist: 'all', language: 'all', album: 'all' });
                setSortBy('title-asc');
                setViewMode('all');
                setSearchParams(new URLSearchParams());
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData?.length || 0} of {allTracks?.length || 0} songs
            {viewMode === 'spotify-only' && ' (Spotify tracks missing lyrics)'}
            {viewMode === 'lyrics-only' && ' (tracks with lyrics)'}
          </p>
        </div>{/* Lyrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData?.map((track, index) => (
            <div key={track.id || track.spotify_id || `${track.artist || 'unknown-artist'}-${track.title || 'unknown-title'}-${index}`} 
                 className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${track.isSpotifyOnly ? 'border-l-4 border-orange-400' : ''}`}>
              <div className="p-6">
                {/* Song Title */}
                <h3 className="font-semibold text-gray-900 mb-2 text-lg flex items-center">
                  {track.title}
                  {track.isSpotifyOnly && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                      No Lyrics
                    </span>
                  )}
                </h3>
                
                {/* Artist and Album */}
                <div className="text-sm text-gray-600 mb-3">
                  <p className="flex items-center mb-1">
                    <User className="w-4 h-4 mr-1" />
                    {track.artist}
                  </p>
                  {track.album && (
                    <p className="flex items-center">
                      <Disc className="w-4 h-4 mr-1" />
                      {track.album} {track.year && `(${track.year})`}
                    </p>
                  )}
                  {track.language && (
                    <p className="flex items-center mt-1">
                      <Globe className="w-4 h-4 mr-1" />
                      {track.language}
                    </p>
                  )}
                </div>

                {/* Spotify Album Art for Spotify-only tracks */}
                {track.isSpotifyOnly && track.spotify_album_art && (
                  <div className="mb-4">
                    <img 
                      src={track.spotify_album_art} 
                      alt={`${track.album} cover`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {track.isSpotifyOnly ? (
                    // Spotify-only track buttons
                    <>
                      {track.spotify_url && (
                        <a
                          href={track.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open in Spotify
                        </a>
                      )}
                      <button
                        className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Add lyrics for this song"
                      >
                        Add Lyrics
                      </button>
                    </>
                  ) : (
                    // Regular lyrics track buttons
                    <Link 
                      to={`/lyrics/${track.id || (track.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium text-center"
                    >
                      View Lyrics
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>{/* No Results */}
        {filteredData?.length === 0 && (
          <div className="text-center py-12">
            <Disc className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lyrics found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsPage;

