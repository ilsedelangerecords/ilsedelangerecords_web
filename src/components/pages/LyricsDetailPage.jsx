import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Music, Globe, Copy, Share, Check } from 'lucide-react';

const LyricsDetailPage = () => {
  const { slug } = useParams();
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLyricsDetails();
  }, [slug]);

  const loadLyricsDetails = async () => {
    setLoading(true);
    
    // In production, this would load from the migrated lyrics content based on slug
    const lyricsDetails = {
      id: '1',
      title: 'I\'m Not So Tough',
      artist: 'Ilse DeLange',
      artistId: 'ilse-delange',
      album: 'World of Hurt',
      albumId: 'world-of-hurt',
      language: 'en',
      verified: true,
      verifiedBy: 'Fan Community',
      verifiedDate: '2024-01-15',
      content: `I can't sleep, I can't eat
I can't do anything right
Since you left me here alone
I just cry throughout the night

I'm not so tough
I'm not so tough
Without your love
I'm not so tough

I used to be so strong
I used to stand so tall
But now I'm just a shadow
Of who I used to be at all

I'm not so tough
I'm not so tough
Without your love
I'm not so tough

Every morning when I wake
I reach out for your hand
But all I find is empty space
Where you used to stand

I'm not so tough
I'm not so tough
Without your love
I'm not so tough

No, I'm not so tough
I'm not so tough
Without your love
I'm not so tough`,
      structure: [
        { section_type: 'verse', section_number: 1, content: 'I can\'t sleep, I can\'t eat\nI can\'t do anything right\nSince you left me here alone\nI just cry throughout the night' },
        { section_type: 'chorus', content: 'I\'m not so tough\nI\'m not so tough\nWithout your love\nI\'m not so tough' },
        { section_type: 'verse', section_number: 2, content: 'I used to be so strong\nI used to stand so tall\nBut now I\'m just a shadow\nOf who I used to be at all' },
        { section_type: 'chorus', content: 'I\'m not so tough\nI\'m not so tough\nWithout your love\nI\'m not so tough' },
        { section_type: 'verse', section_number: 3, content: 'Every morning when I wake\nI reach out for your hand\nBut all I find is empty space\nWhere you used to stand' },
        { section_type: 'chorus', content: 'I\'m not so tough\nI\'m not so tough\nWithout your love\nI\'m not so tough' },
        { section_type: 'outro', content: 'No, I\'m not so tough\nI\'m not so tough\nWithout your love\nI\'m not so tough' }
      ],
      writers: ['Ilse DeLange', 'John Doe'],
      wordCount: 156,
      translationNotes: null,
      copyrightInfo: '© 1998 Warner Music',
      transcriptionNotes: 'Transcribed from official album release'
    };

    setLyrics(lyricsDetails);
    setLoading(false);
  };

  const copyLyrics = async () => {
    if (lyrics) {
      try {
        await navigator.clipboard.writeText(lyrics.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy lyrics:', err);
      }
    }
  };

  const shareLyrics = async () => {
    if (navigator.share && lyrics) {
      try {
        await navigator.share({
          title: `${lyrics.title} - ${lyrics.artist}`,
          text: `Check out the lyrics for "${lyrics.title}" by ${lyrics.artist}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
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
        <Link to="/lyrics" className="text-blue-600 hover:text-blue-700">
          ← Back to Lyrics
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link 
        to="/lyrics" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
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
            
            <div className="space-y-1">
              <Link 
                to={`/artist/${lyrics.artistId}`}
                className="text-xl text-blue-600 hover:text-blue-700 font-semibold"
              >
                {lyrics.artist}
              </Link>
              <p className="text-slate-600">
                from the album{' '}
                <Link 
                  to={`/albums/${lyrics.albumId}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {lyrics.album}
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
            
            {navigator.share && (
              <button
                onClick={shareLyrics}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
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
              </div>
            ) : (
              /* Fallback to plain content */
              <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
                {lyrics.content}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Song Information */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Song Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-600">Language:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl">{getLanguageFlag(lyrics.language)}</span>
                  <span className="text-slate-800">{getLanguageName(lyrics.language)}</span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-slate-600">Word Count:</span>
                <p className="text-slate-800">{lyrics.wordCount} words</p>
              </div>
              
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
          )}

          {/* Translation Notes */}
          {lyrics.translationNotes && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Translation Notes</h3>
              <p className="text-sm text-purple-700">{lyrics.translationNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Links */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Related</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={`/albums/${lyrics.albumId}`}
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
          >
            <Music className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-slate-800">View Album</p>
              <p className="text-sm text-slate-600">{lyrics.album}</p>
            </div>
          </Link>
          
          <Link
            to={`/artist/${lyrics.artistId}`}
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
          >
            <Heart className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium text-slate-800">Artist Profile</p>
              <p className="text-sm text-slate-600">{lyrics.artist}</p>
            </div>
          </Link>
          
          <Link
            to="/lyrics"
            className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow"
          >
            <Globe className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-slate-800">More Lyrics</p>
              <p className="text-sm text-slate-600">Browse all songs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LyricsDetailPage;

