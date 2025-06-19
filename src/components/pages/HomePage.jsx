import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Disc3, Heart, Star, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [recentLyrics, setRecentLyrics] = useState([]);
  const [stats, setStats] = useState({ albums: 0, lyrics: 0, images: 0 });

  useEffect(() => {
    // Load featured content (in a real app, this would come from an API)
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    // Simulate loading featured albums and lyrics
    // In production, this would load from the migrated content
    setFeaturedAlbums([
      {
        id: '1',
        title: 'World of Hurt',
        artist: 'Ilse DeLange',
        year: '1998',
        coverArt: '/images/world-of-hurt-cover.jpg',
        description: 'Debut album that launched Ilse DeLange\'s career'
      },
      {
        id: '2',
        title: 'The Common Linnets',
        artist: 'The Common Linnets',
        year: '2014',
        coverArt: '/images/tcl-cover.jpg',
        description: 'Eurovision success and international breakthrough'
      },
      {
        id: '3',
        title: 'The Great Escape',
        artist: 'Ilse DeLange',
        year: '2006',
        coverArt: '/images/great-escape-cover.jpg',
        description: 'Critically acclaimed studio album'
      }
    ]);

    setRecentLyrics([
      { id: '1', title: 'Calm After the Storm', artist: 'The Common Linnets' },
      { id: '2', title: 'I\'m Not So Tough', artist: 'Ilse DeLange' },
      { id: '3', title: 'Miracle', artist: 'Ilse DeLange' },
      { id: '4', title: 'Hearts on Fire', artist: 'The Common Linnets' }
    ]);

    setStats({ albums: 44, lyrics: 41, images: 1010 });
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
            The Complete
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Discography
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore the comprehensive collection of Ilse DeLange and The Common Linnets' 
            musical journey. From debut albums to Eurovision success, discover every song, 
            every lyric, and every moment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Disc3 className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-slate-800">{stats.albums}</span>
            </div>
            <p className="text-slate-600 font-medium">Albums & Singles</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-slate-800">{stats.lyrics}</span>
            </div>
            <p className="text-slate-600 font-medium">Song Lyrics</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-slate-800">{stats.images}</span>
            </div>
            <p className="text-slate-600 font-medium">Images & Artwork</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/albums" 
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Disc3 className="w-5 h-5" />
            <span>Explore Albums</span>
          </Link>
          <Link 
            to="/lyrics" 
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>Browse Lyrics</span>
          </Link>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">Featured Albums</h2>
          <Link 
            to="/albums" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAlbums.map((album) => (
            <div key={album.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span className="font-medium">Listen Now</span>
                  </div>
                </div>
                {/* Placeholder for album cover */}
                <div className="w-full h-full flex items-center justify-center">
                  <Disc3 className="w-16 h-16 text-slate-400" />
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-slate-600 font-medium">{album.artist}</p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{album.year}</span>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {album.description}
                </p>
                
                <Link 
                  to={`/albums/${album.title.toLowerCase().replace(/\\s+/g, '-')}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Lyrics */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">Popular Lyrics</h2>
          <Link 
            to="/lyrics" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentLyrics.map((lyric) => (
            <Link
              key={lyric.id}
              to={`/lyrics/${lyric.title.toLowerCase().replace(/\\s+/g, '-')}`}
              className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {lyric.title}
                  </h3>
                  <p className="text-slate-600">{lyric.artist}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Artists Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Meet the Artists</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the musical journey of Ilse DeLange, from her solo career to 
            her collaboration with Waylon in The Common Linnets.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              to="/artist/ilse-delange"
              className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow group"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Ilse DeLange
                </h3>
                <p className="text-slate-600">
                  Dutch country and pop singer-songwriter with an international career spanning over two decades.
                </p>
              </div>
            </Link>
            
            <Link 
              to="/artist/the-common-linnets"
              className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow group"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  The Common Linnets
                </h3>
                <p className="text-slate-600">
                  Country duo featuring Ilse DeLange and Waylon, known for their Eurovision success and Americana sound.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

