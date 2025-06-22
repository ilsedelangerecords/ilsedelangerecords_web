import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Star, Calendar } from 'lucide-react';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);
  const loadArtists = async () => {
    setLoading(true);
    
    try {
      // Load artists data from JSON file
      const response = await fetch('/content/artists.json');
      const allArtists = await response.json();
      
      console.log('ArtistsPage loaded:', allArtists.length, 'artists');
        setArtists(allArtists);
    } catch (error) {
      console.error('Error loading artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Artists</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover all the talented artists in our collection, from solo performers to collaborative groups.
        </p>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artists.map((artist) => (
          <Link
            key={artist.slug}
            to={`/artist/${artist.slug}`}
            className="group bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >            {/* Artist Image */}
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              {artist.images?.profileImage ? (
                <img
                  src={artist.images.profileImage}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600"
                style={{ display: artist.images?.profileImage ? 'none' : 'flex' }}
              >
                <Music className="w-16 h-16 text-white opacity-50" />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Album Count Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-medium text-slate-700">
                  {artist.albumCount} album{artist.albumCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>            {/* Artist Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {artist.name}
              </h3>
              
              {/* Artist Details */}
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {artist.biography || 'Talented artist with a passion for music.'}
              </p>
              
              {/* Artist Stats */}
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Music className="w-4 h-4" />
                  <span>{artist.stats?.albumsCount || 0} albums</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>View Profile</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {artists.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No Artists Found</h3>
          <p className="text-slate-500">
            No artists are available at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;
