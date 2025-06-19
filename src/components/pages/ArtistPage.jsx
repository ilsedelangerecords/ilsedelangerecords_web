import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Music, Calendar, MapPin, Star, Disc3, Heart, ExternalLink } from 'lucide-react';

const ArtistPage = () => {
  const { slug } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [popularLyrics, setPopularLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistDetails();
  }, [slug]);

  const loadArtistDetails = async () => {
    setLoading(true);
    
    // In production, this would load from the migrated artist content based on slug
    let artistDetails, artistAlbums, artistLyrics;
    
    if (slug === 'ilse-delange') {
      artistDetails = {
        id: 'ilse-delange',
        name: 'Ilse DeLange',
        slug: 'ilse-delange',
        type: 'solo',
        biography: 'Ilse Annoeska de Lange, known professionally as Ilse DeLange, is a Dutch country and pop singer-songwriter. Born on May 13, 1977, in Almelo, Netherlands, she has become one of the most successful Dutch artists internationally. Her career spans over two decades, with multiple platinum albums and international recognition.',
        formedDate: '1996',
        origin: 'Almelo, Netherlands',
        genres: ['Country', 'Pop', 'Folk', 'Americana'],
        websiteUrl: 'https://www.ilsedelange.com',
        socialMedia: {
          facebook: 'http://www.facebook.com/ilsedelangerecords'
        },
        images: {
          profileImage: '/images/ilse-delange-profile.jpg',
          bannerImage: '/images/ilse-delange-banner.jpg'
        },
        achievements: [
          'Multiple platinum albums in the Netherlands',
          'International chart success',
          'Eurovision Song Contest 2014 (2nd place with The Common Linnets)',
          'Multiple Dutch Music Awards'
        ],
        stats: {
          albumsCount: 8,
          singlesCount: 25,
          lyricsCount: 35
        }
      };

      artistAlbums = [
        { id: '1', title: 'World of Hurt', year: 1998, type: 'studio', chartPosition: 1 },
        { id: '2', title: 'Livin\' on Love', year: 2000, type: 'studio', chartPosition: 2 },
        { id: '3', title: 'Clean Up', year: 2003, type: 'studio', chartPosition: 4 },
        { id: '4', title: 'The Great Escape', year: 2006, type: 'studio', chartPosition: 3 },
        { id: '5', title: 'Next to Me', year: 2008, type: 'studio', chartPosition: 5 }
      ];

      artistLyrics = [
        { id: '1', title: 'I\'m Not So Tough', album: 'World of Hurt' },
        { id: '2', title: 'Miracle', album: 'Clean Up' },
        { id: '3', title: 'Learning to Swim', album: 'World of Hurt' },
        { id: '4', title: 'Kalverliefde', album: 'World of Hurt' }
      ];
    } else if (slug === 'the-common-linnets') {
      artistDetails = {
        id: 'the-common-linnets',
        name: 'The Common Linnets',
        slug: 'the-common-linnets',
        type: 'band',
        biography: 'The Common Linnets is a Dutch country duo consisting of Ilse DeLange and Waylon. Formed in 2013, they gained international recognition by representing the Netherlands in the Eurovision Song Contest 2014 with "Calm After the Storm," finishing in second place. Their Americana and country sound brought a fresh perspective to the Dutch music scene.',
        formedDate: '2013',
        origin: 'Netherlands',
        genres: ['Country', 'Americana', 'Folk'],
        websiteUrl: null,
        socialMedia: {},
        images: {
          profileImage: '/images/tcl-profile.jpg',
          bannerImage: '/images/tcl-banner.jpg'
        },
        achievements: [
          'Eurovision Song Contest 2014 - 2nd place',
          'Platinum album "The Common Linnets"',
          'International chart success',
          'Brought country music to mainstream Dutch audience'
        ],
        stats: {
          albumsCount: 2,
          singlesCount: 8,
          lyricsCount: 12
        }
      };

      artistAlbums = [
        { id: '1', title: 'The Common Linnets', year: 2014, type: 'studio', chartPosition: 1 },
        { id: '2', title: 'II', year: 2015, type: 'studio', chartPosition: 2 }
      ];

      artistLyrics = [
        { id: '1', title: 'Calm After the Storm', album: 'The Common Linnets' },
        { id: '2', title: 'Hearts on Fire', album: 'The Common Linnets' },
        { id: '3', title: 'We Don\'t Make the Wind Blow', album: 'II' }
      ];
    }

    setArtist(artistDetails);
    setAlbums(artistAlbums);
    setPopularLyrics(artistLyrics);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Artist Not Found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Artist Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Artist Image */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-white/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-24 h-24 text-white/80" />
              </div>
            </div>
          </div>

          {/* Artist Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {artist.type === 'solo' ? 'Solo Artist' : 'Band'}
                </span>
                <div className="flex items-center space-x-1 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>Since {artist.formedDate}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold">{artist.name}</h1>
              
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{artist.origin}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <span key={genre} className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{artist.stats.albumsCount}</div>
                <div className="text-white/80">Albums</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{artist.stats.singlesCount}</div>
                <div className="text-white/80">Singles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{artist.stats.lyricsCount}</div>
                <div className="text-white/80">Lyrics</div>
              </div>
            </div>

            {/* Social Links */}
            {(artist.websiteUrl || artist.socialMedia.facebook) && (
              <div className="flex items-center space-x-4">
                {artist.websiteUrl && (
                  <a
                    href={artist.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Official Website</span>
                  </a>
                )}
                {artist.socialMedia.facebook && (
                  <a
                    href={artist.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <span>Facebook</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Biography</h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          {artist.biography}
        </p>
      </div>

      {/* Achievements */}
      {artist.achievements && artist.achievements.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artist.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="text-slate-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Albums */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Albums</h2>
          <Link 
            to="/albums" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Albums →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <Disc3 className="w-16 h-16 text-slate-400" />
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{album.year}</span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>#{album.chartPosition}</span>
                    </span>
                  </div>
                </div>
                
                <Link 
                  to={`/albums/${album.title.toLowerCase().replace(/\\s+/g, '-')}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Album
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Lyrics */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Popular Lyrics</h2>
          <Link 
            to="/lyrics" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Lyrics →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularLyrics.map((lyric) => (
            <Link
              key={lyric.id}
              to={`/lyrics/${lyric.title.toLowerCase().replace(/\\s+/g, '-').replace(/'/g, '')}`}
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
                  <p className="text-slate-600">{lyric.album}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;

