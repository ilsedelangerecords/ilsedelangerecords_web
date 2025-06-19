import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Music, Globe, ArrowRight } from 'lucide-react';

const LyricsPage = () => {
  const [lyrics, setLyrics] = useState([]);
  const [filteredLyrics, setFilteredLyrics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    loadLyrics();
  }, []);

  useEffect(() => {
    filterAndSortLyrics();
  }, [lyrics, searchTerm, selectedArtist, selectedLanguage, sortBy]);

  const loadLyrics = async () => {
    // In production, this would load from the migrated lyrics content
    const sampleLyrics = [
      {
        id: '1',
        title: 'I\'m Not So Tough',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        album: 'World of Hurt',
        language: 'en',
        verified: true,
        preview: 'I can\'t sleep, I can\'t eat, I can\'t do anything right...',
        wordCount: 156
      },
      {
        id: '2',
        title: 'Calm After the Storm',
        artist: 'The Common Linnets',
        artistId: 'the-common-linnets',
        album: 'The Common Linnets',
        language: 'en',
        verified: true,
        preview: 'Driving in the fast lane, counting mile marker signs...',
        wordCount: 142
      },
      {
        id: '3',
        title: 'Miracle',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        album: 'Clean Up',
        language: 'en',
        verified: true,
        preview: 'It\'s a miracle, how you changed my world...',
        wordCount: 128
      },
      {
        id: '4',
        title: 'Kalverliefde',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        album: 'World of Hurt',
        language: 'nl',
        verified: true,
        preview: 'Het was kalverliefde, zo puur en zo echt...',
        wordCount: 134
      },
      {
        id: '5',
        title: 'Hearts on Fire',
        artist: 'The Common Linnets',
        artistId: 'the-common-linnets',
        album: 'The Common Linnets',
        language: 'en',
        verified: true,
        preview: 'We got hearts on fire, burning bright tonight...',
        wordCount: 167
      },
      {
        id: '6',
        title: 'Learning to Swim',
        artist: 'Ilse DeLange',
        artistId: 'ilse-delange',
        album: 'World of Hurt',
        language: 'en',
        verified: true,
        preview: 'I\'m learning to swim in the deep end...',
        wordCount: 145
      }
    ];

    setLyrics(sampleLyrics);
  };

  const filterAndSortLyrics = () => {
    let filtered = lyrics.filter(lyric => {
      const matchesSearch = lyric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lyric.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lyric.album.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArtist = selectedArtist === 'all' || lyric.artistId === selectedArtist;
      const matchesLanguage = selectedLanguage === 'all' || lyric.language === selectedLanguage;
      
      return matchesSearch && matchesArtist && matchesLanguage;
    });

    // Sort lyrics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'artist-asc':
          return a.artist.localeCompare(b.artist);
        case 'artist-desc':
          return b.artist.localeCompare(a.artist);
        default:
          return 0;
      }
    });

    setFilteredLyrics(filtered);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">Song Lyrics</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Complete collection of song lyrics from Ilse DeLange and The Common Linnets, 
          featuring both English and Dutch songs with verified transcriptions.
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
              placeholder="Search lyrics..."
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

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="artist-asc">Artist A-Z</option>
            <option value="artist-desc">Artist Z-A</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredLyrics.length} of {lyrics.length} songs
        </div>
      </div>

      {/* Lyrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLyrics.map((lyric) => (
          <Link
            key={lyric.id}
            to={`/lyrics/${lyric.title.toLowerCase().replace(/\\s+/g, '-').replace(/'/g, '')}`}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {lyric.title}
                  </h3>
                  <p className="text-slate-600 font-medium">{lyric.artist}</p>
                  <p className="text-sm text-slate-500">{lyric.album}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-2xl" title={getLanguageName(lyric.language)}>
                    {getLanguageFlag(lyric.language)}
                  </span>
                  {lyric.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Heart className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic">
                  "{lyric.preview}"
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{lyric.wordCount} words</span>
                  <div className="flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    <span>Read full lyrics</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Song Lyrics</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredLyrics.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No lyrics found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Language Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Language Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🇺🇸</div>
            <div className="text-2xl font-bold text-slate-800">
              {lyrics.filter(l => l.language === 'en').length}
            </div>
            <div className="text-sm text-slate-600">English Songs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🇳🇱</div>
            <div className="text-2xl font-bold text-slate-800">
              {lyrics.filter(l => l.language === 'nl').length}
            </div>
            <div className="text-sm text-slate-600">Dutch Songs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-slate-800">
              {lyrics.filter(l => l.verified).length}
            </div>
            <div className="text-sm text-slate-600">Verified Lyrics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-slate-800">
              {Math.round(lyrics.reduce((sum, l) => sum + l.wordCount, 0) / lyrics.length)}
            </div>
            <div className="text-sm text-slate-600">Avg. Words</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsPage;

