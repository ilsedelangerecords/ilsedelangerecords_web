import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Music, Globe, Copy, Check, Play, Pause, ExternalLink } from 'lucide-react';
import { useContent } from '../../lib/contentLoader';

const LyricsDetailPage = () => {
  const { slug } = useParams();
  const { data: allLyrics, loading: lyricsLoading, error } = useContent('lyrics');  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    if (!lyricsLoading && allLyrics && slug) {
      loadLyricsDetails();
    }
  }, [slug, allLyrics, lyricsLoading]);  const loadLyricsDetails = async () => {
    setLoading(true);
    
    try {
      // Find the lyrics item that matches the slug
      // First try by ID (if it exists), then by title-based slug
      let foundLyrics = allLyrics.find(lyric => lyric.id === slug);
      
      if (!foundLyrics) {
        // Try to match by title-based slug
        foundLyrics = allLyrics.find(lyric => {
          const titleSlug = (lyric.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          return titleSlug === slug;
        });
      }
      
      if (foundLyrics) {
        // Add the content field if it doesn't exist (map from lyrics field)
        if (!foundLyrics.content && foundLyrics.lyrics) {
          foundLyrics.content = foundLyrics.lyrics;
        }
        setLyrics(foundLyrics);
      } else {
        console.warn('LyricsDetailPage: No lyrics found for slug:', slug);
        setLyrics(null);
      }
    } catch (error) {
      console.error('LyricsDetailPage: Error loading lyrics details:', error);
      setLyrics(null);
    } finally {
      setLoading(false);
    }
  };
  const getAlbumSlug = (albumTitle) => {
    if (!albumTitle) return 'unknown';
    
    // Generate slug from album title (same format as used in AlbumsPage)
    return albumTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const getArtistSlug = (artistName) => {
    if (!artistName) return 'unknown';
    
    // Handle known artists with specific slugs
    if (artistName === 'Ilse DeLange') return 'ilse-delange';
    if (artistName === 'The Common Linnets') return 'the-common-linnets';
    
    // Generate slug from artist name
    return artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const copyLyrics = () => {
    const lyricsText = lyrics.content || lyrics.lyrics || '';
    navigator.clipboard.writeText(lyricsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const togglePreview = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const getLanguageFlag = (language) => {
    switch (language) {
      case 'en':
        return '🇺🇸';
      case 'nl':
        return '🇳🇱';
      default:
        return '🌐';
    }
  };

  const getLanguageName = (language) => {
    switch (language) {
      case 'en':
        return 'English';
      case 'nl':
        return 'Dutch';
      default:
        return 'Unknown';
    }
  };

  const getSectionLabel = (section) => {
    switch (section.section_type) {
      case 'verse':
        return `Verse ${section.section_number || ''}`;
      case 'chorus':
        return 'Chorus';
      case 'bridge':
        return 'Bridge';
      case 'intro':
        return 'Intro';
      case 'outro':
        return 'Outro';
      default:
        return section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!lyrics) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Lyrics Not Found</h1>
        <Link 
          to="/lyrics" 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lyrics</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">      {/* Back Navigation */}
      <Link 
        to="/lyrics" 
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lyrics</span>
      </Link>

      {/* Song Header */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl" title={getLanguageName(lyrics.language)}>
                {getLanguageFlag(lyrics.language)}
              </span>
              {lyrics.verified && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Verified Lyrics</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-slate-800">{lyrics.title}</h1>
              <div className="space-y-1">              <Link 
                to={`/artist/${getArtistSlug(lyrics.artist)}`}
                className="text-xl text-blue-600 hover:text-blue-700 font-semibold"
              >
                {lyrics.artist}
              </Link>              {lyrics.album ? (
                <p className="text-slate-600">
                  from the album{' '}
                  <Link 
                    to={`/album/${getAlbumSlug(lyrics.album)}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {lyrics.album}
                  </Link>
                </p>
              ) : (
                <p className="text-slate-600 italic">Album information not available</p>              )}
            </div>
          </div>          <div className="flex items-center space-x-3">
            {/* Spotify Button */}
            {lyrics.spotify_url && (
              <a
                href={lyrics.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Listen on Spotify</span>
              </a>
            )}
            
            <button
              onClick={copyLyrics}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            
            {/* Hidden Audio Element - only if preview exists */}
            {lyrics.spotify_preview_url && (
              <audio
                ref={audioRef}
                src={lyrics.spotify_preview_url}
                onEnded={handleAudioEnded}
                preload="none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Lyrics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lyrics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Lyrics</h2>
            
            {/* Structured Lyrics */}
            {lyrics.structure && lyrics.structure.length > 0 ? (
              <div className="space-y-6">
                {lyrics.structure.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {getSectionLabel(section)}
                    </h3>
                    <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>            ) : (
              /* Fallback to plain content */
              <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
                {lyrics.content || lyrics.lyrics}
              </div>
            )}
          </div>
        </div>        {/* Sidebar */}
        <div className="space-y-6">
          {/* Spotify Integration */}
          {lyrics.spotify_url && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center space-x-2">
                <Music className="w-5 h-5" />
                <span>Listen on Spotify</span>
              </h3>
              
              {/* Album Art */}
              {lyrics.spotify_album_art && (
                <div className="mb-4">
                  <img
                    src={lyrics.spotify_album_art_medium || lyrics.spotify_album_art}
                    alt={`${lyrics.spotify_album_name || lyrics.album} album art`}
                    className="w-full rounded-lg shadow-md"
                  />
                  {lyrics.spotify_album_name && (
                    <p className="text-sm text-green-700 mt-2 text-center font-medium">
                      {lyrics.spotify_album_name}
                    </p>
                  )}
                </div>
              )}
                <div className="space-y-3">
                {/* Preview Button - only show if preview is available */}
                {lyrics.spotify_preview_url && (
                  <button
                    onClick={togglePreview}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    <span>{isPlaying ? 'Pause Preview' : 'Play 30s Preview'}</span>
                  </button>
                )}
                
                {/* No preview available message */}
                {!lyrics.spotify_preview_url && (
                  <div className="w-full bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-center text-sm">
                    🎵 Preview not available for this track
                  </div>
                )}
                
                {/* Spotify Link */}
                <a
                  href={lyrics.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Listen Full Song on Spotify</span>
                </a>
                
                {lyrics.spotify_match_confidence && (
                  <p className="text-xs text-green-600 text-center">
                    Match confidence: {lyrics.spotify_match_confidence}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Song Information */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Song Information</h3>
            <div className="space-y-3">
              {lyrics.writers && lyrics.writers.length > 0 && (
                <div>
                  <span className="font-medium text-slate-600">Writers:</span>
                  <p className="text-slate-800">{lyrics.writers.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Info */}
          {lyrics.verified && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 fill-current" />
                <span>Verified Lyrics</span>
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                {lyrics.verifiedBy && (
                  <p><span className="font-medium">Verified by:</span> {lyrics.verifiedBy}</p>
                )}
                {lyrics.verifiedDate && (
                  <p><span className="font-medium">Date:</span> {lyrics.verifiedDate}</p>
                )}
                <p className="text-green-600">
                  These lyrics have been verified for accuracy by our community.
                </p>
              </div>
            </div>
          )}

          {/* Copyright Info */}
          {lyrics.copyrightInfo && (
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Copyright</h3>
              <p className="text-sm text-slate-600">{lyrics.copyrightInfo}</p>
            </div>
          )}

          {/* Transcription Notes */}
          {lyrics.transcriptionNotes && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Transcription Notes</h3>
              <p className="text-sm text-blue-700">{lyrics.transcriptionNotes}</p>
            </div>
          )}          {/* Translation Notes */}
          {lyrics.translationNotes && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Translation Notes</h3>
              <p className="text-sm text-purple-700">{lyrics.translationNotes}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">          {lyrics.album ? (
            <Link
              to={`/album/${getAlbumSlug(lyrics.album)}`}
              className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
            >
              <Music className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-slate-800">View Album</p>
                <p className="text-sm text-slate-600">{lyrics.album}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <Music className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-600">Album Not Available</p>
                <p className="text-sm text-gray-500">No album information</p>
              </div>
            </div>
          )}
            {lyrics.artist ? (
            <Link
              to={`/artist/${getArtistSlug(lyrics.artist)}`}
              className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
            >
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-medium text-slate-800">Artist Profile</p>
                <p className="text-sm text-slate-600">{lyrics.artist}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <Heart className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-600">Artist Profile</p>
                <p className="text-sm text-gray-500">{lyrics.artist}</p>
              </div>
            </div>
          )}
            <Link
            to="/lyrics"
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
          >
            <Globe className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-slate-800">More Lyrics</p>
              <p className="text-sm text-slate-600">Browse all songs</p>            </div>          </Link>
        </div>        </div>
      </div>
    </div>
  );
};

export default LyricsDetailPage;

