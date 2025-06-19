import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Disc3, Play, Star } from 'lucide-react';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('year-desc');

  useEffect(() => {
    loadAlbums();
  }, []);

  useEffect(() => {
    filterAndSortAlbums();
  }, [albums, searchTerm, selectedArtist, selectedType, sortBy]);

  const loadAlbums = async () => {
    // In production, this would load from the migrated content
    // For now, we'll use sample data based on the migration results
    const sampleAlbums = [
      {
        id: '1',
        title: 'World of Hurt',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        year: 1998,
        type: 'studio',
        coverArt: '/images/world-of-hurt-cover.jpg',
        description: 'Debut studio album that launched Ilse DeLange\'s international career.',
        trackCount: 12,
        chartPosition: 1
      },
      {
        id: '2',
        title: 'The Common Linnets',
        artist: 'The Common Linnets',
        artistId: 'the-common-linnets',
        year: 2014,
        type: 'studio',
        coverArt: '/images/tcl-cover.jpg',
        description: 'Debut album following Eurovision success with "Calm After the Storm".',
        trackCount: 11,
        chartPosition: 1
      },
      {
        id: '3',
        title: 'The Great Escape',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        year: 2006,
        type: 'studio',
        coverArt: '/images/great-escape-cover.jpg',
        description: 'Critically acclaimed album showcasing artistic growth.',
        trackCount: 13,
        chartPosition: 3
      },
      {
        id: '4',
        title: 'Livin\' on Love',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        year: 2000,
        type: 'studio',
        coverArt: '/images/livin-on-love-cover.jpg',
        description: 'Second studio album building on debut success.',
        trackCount: 11,
        chartPosition: 2
      },
      {
        id: '5',
        title: 'Clean Up',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        year: 2003,
        type: 'studio',
        coverArt: '/images/clean-up-cover.jpg',
        description: 'Third studio album exploring new musical directions.',
        trackCount: 12,
        chartPosition: 4
      },
      {
        id: '6',
        title: 'Miracle',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        year: 2004,
        type: 'single',
        coverArt: '/images/miracle-single-cover.jpg',
        description: 'Hit single from the Clean Up album.',
        trackCount: 3,
        chartPosition: 8
      }
    ];

    setAlbums(sampleAlbums);
  };

  const filterAndSortAlbums = () => {
    let filtered = albums.filter(album => {
      const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArtist = selectedArtist === 'all' || album.artistId === selectedArtist;
      const matchesType = selectedType === 'all' || album.type === selectedType;
      
      return matchesSearch && matchesArtist && matchesType;
    });

    // Sort albums
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredAlbums(filtered);
  };

  const getAlbumTypeColor = (type) => {
    switch (type) {
      case 'studio':
        return 'bg-blue-100 text-blue-800';
      case 'single':
        return 'bg-green-100 text-green-800';
      case 'live':
        return 'bg-purple-100 text-purple-800';
      case 'compilation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">Albums & Singles</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Complete discography featuring studio albums, singles, live recordings, and special releases.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Artist Filter */}
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Artists</option>
            <option value="ilse-delange">Ilse DeLange</option>
            <option value="the-common-linnets">The Common Linnets</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="studio">Studio Albums</option>
            <option value="single">Singles</option>
            <option value="live">Live Albums</option>
            <option value="compilation">Compilations</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="year-desc">Newest First</option>
            <option value="year-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredAlbums.length} of {albums.length} releases
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAlbums.map((album) => (
          <div key={album.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
            {/* Album Cover */}
            <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span className="font-medium">View Details</span>
                  </div>
                  {album.chartPosition && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">#{album.chartPosition}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Placeholder for album cover */}
              <div className="w-full h-full flex items-center justify-center">
                <Disc3 className="w-20 h-20 text-slate-400" />
              </div>
            </div>

            {/* Album Info */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlbumTypeColor(album.type)}`}>
                    {album.type.charAt(0).toUpperCase() + album.type.slice(1)}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{album.year}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {album.title}
                </h3>
                <p className="text-slate-600 font-medium">{album.artist}</p>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                {album.description}
              </p>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{album.trackCount} tracks</span>
                {album.chartPosition && (
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Peak #{album.chartPosition}</span>
                  </span>
                )}
              </div>

              <Link
                to={`/albums/${album.title.toLowerCase().replace(/\\s+/g, '-').replace(/'/g, '')}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Album Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAlbums.length === 0 && (
        <div className="text-center py-12">
          <Disc3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No albums found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;

