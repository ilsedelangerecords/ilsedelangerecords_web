import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Disc3, Play, Clock, Star, ArrowLeft, ExternalLink } from 'lucide-react';

const AlbumDetailPage = () => {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbumDetails();
  }, [slug]);

  const loadAlbumDetails = async () => {
    setLoading(true);
    
    // In production, this would load from the migrated content based on slug
    // For now, we'll simulate loading album details
    const albumDetails = {
      id: '1',
      title: 'World of Hurt',
      artist: 'Ilse DeLange',
      artistId: 'ilse-delange',
      year: 1998,
      type: 'studio',
      releaseDate: '1998-05-15',
      recordLabel: 'Warner Music',
      catalogNumber: 'WM001',
      description: 'Ilse DeLange\'s debut studio album "World of Hurt" marked the beginning of her international career. The album showcases her powerful vocals and country-influenced sound that would become her signature style.',
      coverArt: '/images/world-of-hurt-cover.jpg',
      trackCount: 12,
      duration: '45:32',
      chartPerformance: [
        { country: 'Netherlands', chart: 'Album Top 100', peakPosition: 1, weeksOnChart: 24 },
        { country: 'Belgium', chart: 'Ultratop 200', peakPosition: 3, weeksOnChart: 18 }
      ],
      productionCredits: [
        { role: 'Producer', person: 'John Doe' },
        { role: 'Executive Producer', person: 'Jane Smith' },
        { role: 'Mixing', person: 'Bob Johnson' }
      ],
      tracks: [
        { number: 1, title: 'I\'m Not So Tough', duration: '3:45', hasLyrics: true },
        { number: 2, title: 'World of Hurt', duration: '4:12', hasLyrics: true },
        { number: 3, title: 'When It\'s You', duration: '3:28', hasLyrics: true },
        { number: 4, title: 'Miracle', duration: '4:01', hasLyrics: true },
        { number: 5, title: 'Learning to Swim', duration: '3:55', hasLyrics: true },
        { number: 6, title: 'Reach for the Light', duration: '4:18', hasLyrics: true },
        { number: 7, title: 'All Alone', duration: '3:33', hasLyrics: true },
        { number: 8, title: 'Time Will Have to Wait', duration: '3:47', hasLyrics: true },
        { number: 9, title: 'Kalverliefde', duration: '3:22', hasLyrics: true },
        { number: 10, title: 'So Incredible', duration: '4:05', hasLyrics: true },
        { number: 11, title: 'Winter of Love', duration: '3:58', hasLyrics: true },
        { number: 12, title: 'Wouldn\'t That Be Something', duration: '4:08', hasLyrics: true }
      ],
      versions: [
        {
          name: 'Standard Edition',
          format: 'CD',
          catalogNumber: 'WM001',
          releaseDate: '1998-05-15',
          notes: 'Original release'
        },
        {
          name: 'Limited Edition',
          format: 'CD',
          catalogNumber: 'WM001L',
          releaseDate: '1998-05-15',
          notes: 'Includes bonus tracks and enhanced CD content'
        }
      ]
    };

    setAlbum(albumDetails);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Album Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-24 h-24 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Album Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {album.type.charAt(0).toUpperCase() + album.type.slice(1)} Album
              </span>
              <div className="flex items-center space-x-1 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{album.year}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-800">{album.title}</h1>
            
            <Link 
              to={`/artist/${album.artistId}`}
              className="text-2xl text-blue-600 hover:text-blue-700 font-semibold"
            >
              {album.artist}
            </Link>

            <p className="text-lg text-slate-600 leading-relaxed">
              {album.description}
            </p>
          </div>

          {/* Album Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Disc3 className="w-4 h-4" />
                <span className="text-sm">Tracks</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">{album.trackCount}</span>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">{album.duration}</span>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">Peak Chart</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">#{album.chartPerformance[0]?.peakPosition}</span>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Released</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{album.year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Track Listing */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Track Listing</h2>
        
        <div className="space-y-2">
          {album.tracks.map((track) => (
            <div key={track.number} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="flex items-center space-x-4">
                <span className="w-8 text-center text-slate-500 font-medium">
                  {track.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                    {track.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-slate-500 text-sm">{track.duration}</span>
                {track.hasLyrics && (
                  <Link
                    to={`/lyrics/${track.title.toLowerCase().replace(/\\s+/g, '-').replace(/'/g, '')}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View Lyrics
                  </Link>
                )}
                <button className="text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Album Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Performance */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Chart Performance</h3>
          <div className="space-y-3">
            {album.chartPerformance.map((chart, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{chart.country}</p>
                  <p className="text-sm text-slate-600">{chart.chart}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">#{chart.peakPosition}</p>
                  <p className="text-sm text-slate-600">{chart.weeksOnChart} weeks</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Credits */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Production Credits</h3>
          <div className="space-y-3">
            {album.productionCredits.map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-800">{credit.role}</span>
                <span className="text-slate-600">{credit.person}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Album Versions */}
      {album.versions && album.versions.length > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Album Versions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {album.versions.map((version, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">{version.name}</h4>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><span className="font-medium">Format:</span> {version.format}</p>
                  <p><span className="font-medium">Catalog:</span> {version.catalogNumber}</p>
                  <p><span className="font-medium">Released:</span> {version.releaseDate}</p>
                  {version.notes && <p><span className="font-medium">Notes:</span> {version.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Album Details */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Album Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-600">Record Label:</span>
              <p className="text-slate-800">{album.recordLabel}</p>
            </div>
            <div>
              <span className="font-medium text-slate-600">Catalog Number:</span>
              <p className="text-slate-800">{album.catalogNumber}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-600">Release Date:</span>
              <p className="text-slate-800">{album.releaseDate}</p>
            </div>
            <div>
              <span className="font-medium text-slate-600">Genre:</span>
              <p className="text-slate-800">Country, Pop</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;

