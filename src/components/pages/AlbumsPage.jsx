import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent, useContentSearch } from '../../lib/contentLoader';
import { Search, Filter, Calendar, User, Music, ExternalLink } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { getBestImage } from '../../lib/imageHelpers';

const AlbumsPage = () => {
  const { data: albums, loading, error } = useContent('albums');
  const { data: artists } = useContent('artists');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ artist: 'all', year: 'all', type: 'all' });
  const [sortBy, setSortBy] = useState('title');
    // Get unique values for filters - with safer null checks
  const uniqueArtists = (albums && Array.isArray(albums)) ? 
    [...new Set(albums.filter(album => album?.artist).map(album => album.artist))] : [];
  const uniqueYears = (albums && Array.isArray(albums)) ? 
    [...new Set(albums.filter(album => album?.year).map(album => album.year))].sort((a, b) => b - a) : [];
  const uniqueTypes = (albums && Array.isArray(albums)) ? 
    [...new Set(albums.filter(album => album?.type).map(album => album.type))] : [];
    // Apply filtering and searching manually - with safer null checks
  const filteredData = (albums && Array.isArray(albums)) ? albums.filter(album => {
    // Ensure album exists and has basic properties
    if (!album) return false;
    
    const matchesSearch = !searchTerm || 
      (album.title && album.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (album.artist && album.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArtist = filters.artist === 'all' || (album.artist && album.artist === filters.artist);
    const matchesYear = filters.year === 'all' || (album.year && album.year === parseInt(filters.year));
    const matchesType = filters.type === 'all' || (album.type && album.type === filters.type);
    
    return matchesSearch && matchesArtist && matchesYear && matchesType;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading albums...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading albums: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Albums & Singles</h1>
              <p className="mt-2 text-gray-600">
                Complete discography with {albums?.length || 0} releases
              </p>
            </div>
            
            {/* GitHub Edit Button */}
            <a
              href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/pages/AlbumsPage.jsx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                Search Albums
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Artists</option>
                {uniqueArtists.map(artist => (
                  <option key={artist} value={artist}>{artist}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="artist-asc">Artist A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData?.length || 0} of {albums?.length || 0} albums
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData?.map((album) => (
            <div key={album.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">              {/* Album Cover */}
              <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                <Link 
                  to={`/album/${album.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="w-full h-full block"
                >                  <OptimizedImage
                    src={getBestImage(album, 'album')}
                    alt={`${album.title} cover art`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    fallback="/images/placeholder.svg"
                  />
                </Link>
              </div>

              {/* Album Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {album.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{album.artist}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{album.year}</span>
                  <span className="capitalize">{album.type}</span>
                </div>

                {album.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {album.description}
                  </p>
                )}

                {/* Album Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Music className="w-3 h-3 mr-1" />
                    {album.trackCount || album.tracks?.length || 0} tracks
                  </span>
                  {album.duration && (
                    <span>{album.duration}</span>
                  )}
                </div>                {/* View Details Button */}
                <Link 
                  to={`/album/${album.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData?.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumsPage;

