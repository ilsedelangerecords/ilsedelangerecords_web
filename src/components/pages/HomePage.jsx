import React, { useState, useEffect } from 'react';
import { useContent } from '../../lib/contentLoader';
import { Link } from 'react-router-dom';
import { Music, Users, Calendar, Award, ExternalLink, Globe, Heart, Play } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const HomePage = () => {
  const { data: albums, loading: albumsLoading } = useContent('albums');
  const { data: artists, loading: artistsLoading } = useContent('artists');  // Get featured content
  const featuredAlbums = albums
    ?.sort((a, b) => {
      // Sort by year (newest first), then by title if years are the same
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      if (yearA !== yearB) {
        return yearB - yearA; // Newest first
      }
      return (a.title || '').localeCompare(b.title || '');
    })
    .slice(0, 3) || [];
  const mainArtists = artists || [];
  // Calculate statistics with debugging
  const stats = {
    totalAlbums: Array.isArray(albums) ? albums.length : 0,
    totalArtists: Array.isArray(artists) ? artists.length : 0,
    totalYears: Array.isArray(albums) && albums.length > 0 ? 
      Math.max(1, new Date().getFullYear() - Math.min(...albums.map(a => a.year || new Date().getFullYear())) + 1) : 
      0
  };

  // Debug logging
  console.log('HomePage stats:', stats);
  console.log('Albums data:', albums?.length, albums);
  console.log('Artists data:', artists?.length);

  const loading = albumsLoading || artistsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Ilse DeLange Records
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
              Complete discography and lyrics collection featuring the music of Ilse DeLange and The Common Linnets
            </p>
              {/* GitHub Edit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/albums"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Explore Music
              </Link>
              <a
                href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/pages/HomePage.jsx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Edit on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>      {/* Statistics Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                {loading ? '...' : stats.totalAlbums}
              </div>
              <div className="text-gray-600 font-medium">Albums & Singles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {loading ? '...' : stats.totalArtists}
              </div>
              <div className="text-gray-600 font-medium">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
                {loading ? '...' : stats.totalYears}+
              </div>
              <div className="text-gray-600 font-medium">Years of Music</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Artists Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Artists</h2>
            <p className="text-xl text-gray-600">Discover the artists behind the music</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">                  <div className="md:w-1/3">
                    <OptimizedImage
                      src={artist.profileImage}
                      alt={artist.name}
                      className="w-full h-48 md:h-full object-cover"
                      fallback="/images/placeholder.svg"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {artist.biography || 'Renowned artist with an extensive catalog of music.'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      {artist.origin && (
                        <span className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {artist.origin}
                        </span>
                      )}
                      {artist.formedDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Since {artist.formedDate}
                        </span>
                      )}
                    </div>                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm">
                        <span className="flex items-center text-purple-600">
                          <Music className="w-4 h-4 mr-1" />
                          {artist.stats?.albumsCount || 0} Albums
                        </span>
                        <span className="flex items-center text-pink-600">
                          <Heart className="w-4 h-4 mr-1" />
                          {artist.stats?.lyricsCount || 0} Songs
                        </span>
                      </div>
                      <Link
                        to={`/artist/${artist.name === 'Ilse DeLange' ? 'ilse-delange' : artist.name === 'The Common Linnets' ? 'the-common-linnets' : artist.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>      {/* Latest Music Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest Music</h2>
              <p className="text-xl text-gray-600">Discover the newest albums and singles</p>
            </div>
            <Link
              to="/albums"
              className="hidden sm:block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              View All Albums
            </Link>
          </div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAlbums.map((album) => {
              const albumSlug = album.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              return (
                <div key={album.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    <Link to={`/album/${albumSlug}`} className="block w-full h-full">
                      <OptimizedImage
                        src={album.coverImage || album.coverArt || album.image}
                        alt={`${album.title} cover art`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        fallback="/images/placeholder.svg"
                      />
                    </Link>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{album.title}</h3>
                    <p className="text-gray-600 mb-3">{album.artist}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {album.year}
                      </span>
                      <span className="flex items-center">
                        <Music className="w-4 h-4 mr-1" />
                        {album.trackCount || album.tracks?.length || 0} tracks
                      </span>
                    </div>

                    <Link 
                      to={`/album/${albumSlug}`}
                      className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 font-medium text-center"
                    >
                      View Album
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/albums"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              View All Albums
            </Link>
          </div>
        </div>
      </div>      {/* Call to Action Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Explore the Complete Collection</h2>
          <p className="text-xl mb-8">
            Dive deep into the musical journey with complete albums, verified lyrics, and artist stories
          </p>          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/albums"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Albums
            </Link>
            <Link
              to="/lyrics"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Read Lyrics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

