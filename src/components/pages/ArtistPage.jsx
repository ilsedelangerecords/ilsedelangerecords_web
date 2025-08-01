import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Music, Calendar, MapPin, Star, Disc3, Heart, ExternalLink } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const ArtistPage = () => {
  const { slug } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [popularLyrics, setPopularLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistDetails();
  }, [slug]);  const loadArtistDetails = async () => {
    setLoading(true);
    
    try {
      console.log('ArtistPage: Starting to load data for slug:', slug);
      
      // Load real data from JSON files
      const [artistsResponse, albumsResponse, lyricsResponse] = await Promise.all([
        fetch('/content/artists.json'),
        fetch('/content/albums.json'),
        fetch('/content/lyrics.json')
      ]);

      console.log('ArtistPage: Fetch responses:', {
        artists: artistsResponse.status,
        albums: albumsResponse.status,
        lyrics: lyricsResponse.status
      });      const allArtists = await artistsResponse.json();
      const allAlbums = await albumsResponse.json();
      const lyricsData = await lyricsResponse.json();
      
      // Extract lyrics array from the nested structure
      const allLyrics = lyricsData.lyrics || [];

      console.log('ArtistPage Debug:', {
        slug,
        allArtists: allArtists.length,
        artistSlugs: allArtists.map(a => a.slug),
        searchingFor: slug,
        lyricsTotal: allLyrics.length
      });

      // Find the artist by slug
      const artistDetails = allArtists.find(artist => {
        console.log('Comparing:', artist.slug, '===', slug, '?', artist.slug === slug);
        return artist.slug === slug;
      });
      
      console.log('Found artist:', artistDetails);
      
      if (!artistDetails) {
        console.error(`Artist not found for slug: ${slug}`);
        console.error('Available artists:', allArtists.map(a => ({ name: a.name, slug: a.slug })));
        setLoading(false);
        return;
      }

      // Filter albums and lyrics for this artist
      const artistAlbums = allAlbums.filter(album => 
        album.artist === artistDetails.name
      ).slice(0, 6); // Show top 6 albums

      const artistLyrics = allLyrics.filter(lyric => 
        lyric.artist === artistDetails.name
      ).slice(0, 8); // Show top 8 popular lyrics

      // Update stats with actual counts
      const updatedArtistDetails = {
        ...artistDetails,
        stats: {
          ...artistDetails.stats,
          albumsCount: allAlbums.filter(album => album.artist === artistDetails.name).length,
          lyricsCount: allLyrics.filter(lyric => lyric.artist === artistDetails.name).length
        }      };

      setArtist(updatedArtistDetails);
      setAlbums(artistAlbums || []);
      setPopularLyrics(artistLyrics || []);
      
    } catch (error) {
      console.error('Error loading artist data:', error);
      setArtist(null);
      setAlbums([]);
      setPopularLyrics([]);
    } finally {
      setLoading(false);
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">          {/* Artist Image */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-white/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
              {artist.images?.profileImage ? (
                <OptimizedImage
                  src={artist.images.profileImage}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  fallback="/images/placeholder.svg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-24 h-24 text-white/80" />
                </div>
              )}
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
            </div>            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/lyrics?artist=${encodeURIComponent(artist.name)}`}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors backdrop-blur-sm font-medium"
              >
                <Music className="w-4 h-4" />
                <span>View All Lyrics</span>
              </Link>
              
              {/* Social Links */}
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
            </div>
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
        </div>        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 relative">
                  {album.coverImage ? (
                    <img 
                      src={album.coverImage} 
                      alt={album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
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
                      {album.label && (
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {album.label}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/albums/${album.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Album
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <Disc3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No albums found for this artist.</p>
          </div>
        )}
      </div>

      {/* Popular Lyrics */}
      <div className="space-y-6">        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Popular Lyrics</h2>
          <Link 
            to={`/lyrics?artist=${encodeURIComponent(artist.name)}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Lyrics →
          </Link>
        </div>{popularLyrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularLyrics.map((lyric) => (
              <Link
                key={lyric.id}
                to={`/lyrics/${lyric.id}`}
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
                    <p className="text-slate-600">{lyric.album || 'Single'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No lyrics found for this artist.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;

