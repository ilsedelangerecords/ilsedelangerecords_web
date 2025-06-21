import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Disc3, Play, Clock, Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { useContent } from '../../lib/contentLoader';
import OptimizedImage from '../OptimizedImage';

const AlbumDetailPage = () => {
  const { slug } = useParams();
  const { data: albums, loading: albumsLoading } = useContent('albums');
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!albumsLoading && albums) {
      loadAlbumDetails();
    }
  }, [slug, albums, albumsLoading]);  const loadAlbumDetails = async () => {
    setLoading(true);
    
    // Find the album by slug
    const foundAlbum = albums.find(a => 
      a.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
    );
    
    if (foundAlbum) {
      setAlbum(foundAlbum);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Album Not Found</h1>
        <Link to="/albums" className="text-blue-600 hover:text-blue-700">
          ← Back to Albums
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link 
        to="/albums" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Albums</span>
      </Link>

      {/* Album Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">        {/* Album Cover */}
        <div className="lg:col-span-1">
          <Link to="/albums" className="block aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <OptimizedImage
              src={album.coverImage}
              alt={`${album.title} cover art`}
              className="w-full h-full object-cover"
              fallback="/images/placeholder.svg"
            />
          </Link>
        </div>{/* Album Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {album.type ? album.type.charAt(0).toUpperCase() + album.type.slice(1) : 'Album'}
              </span>
              <div className="flex items-center space-x-1 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{album.year}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-800">{album.title}</h1>
            
            <div className="text-2xl text-blue-600 font-semibold">
              {album.artist}
            </div>

            {album.description && (
              <p className="text-lg text-slate-600 leading-relaxed">
                {album.description}
              </p>
            )}
          </div>

          {/* Album Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Disc3 className="w-4 h-4" />
                <span className="text-sm">Tracks</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {album.trackCount || (album.tracks && Array.isArray(album.tracks) ? album.tracks.length : 0)}
              </span>
            </div>

            {album.duration && (
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="text-2xl font-bold text-slate-800">{album.duration}</span>
              </div>
            )}

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Released</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{album.year}</span>
            </div>

            {album.label && (
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Label</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{album.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>      {/* Track Listing */}
      {album.tracks && Array.isArray(album.tracks) && album.tracks.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Track Listing</h2>
          
          <div className="space-y-2">
            {album.tracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <span className="w-8 text-center text-slate-500 font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                      {typeof track === 'string' ? track : (track.title || track.name || `Track ${index + 1}`)}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {track.duration && (
                    <span className="text-slate-500 text-sm">{track.duration}</span>
                  )}
                  <button className="text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Album Details */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Album Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {album.label && (
              <div>
                <span className="font-medium text-slate-600">Record Label:</span>
                <p className="text-slate-800">{album.label}</p>
              </div>
            )}
            {album.catalog && (
              <div>
                <span className="font-medium text-slate-600">Catalog Number:</span>
                <p className="text-slate-800">{album.catalog}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-600">Release Date:</span>
              <p className="text-slate-800">{album.year}</p>
            </div>
            <div>
              <span className="font-medium text-slate-600">Artist:</span>
              <p className="text-slate-800">{album.artist}</p>
            </div>
          </div>
        </div>
        
        {album.description && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="font-medium text-slate-600">Description:</span>
            <p className="text-slate-800 mt-2 leading-relaxed">{album.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetailPage;

