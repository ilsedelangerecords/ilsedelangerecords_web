/**
 * Spotify-Lyrics Comparison Script
 * 
 * This script fetches all songs from Spotify for Ilse DeLange and The Common Linnets,
 * then compares them with our local lyrics database to show:
 * - Which Spotify songs have lyrics in our database
 * - Which Spotify songs are missing lyrics
 * - Which local lyrics don't have a Spotify match
 * - Summary statistics and export to CSV
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Artist Spotify IDs
const ARTISTS = {
  'Ilse DeLange': '3FTKP1k9VbOng3m1rgnsqx',
  'The Common Linnets': '18h3nc5ixeV80KKGWDAaMG'
};

class SpotifyLyricsComparison {
  constructor() {
    this.accessToken = null;
    this.localLyrics = [];
    this.spotifyTracks = [];
    this.comparisonResults = {
      withLyrics: [],
      missingLyrics: [],
      localOnlyLyrics: [],
      statistics: {}
    };
  }
  async authenticate() {
    console.log('🔐 Authenticating with Spotify...');
    
    // Check credentials
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify API credentials! Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
    }
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.statusText}. Response: ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    console.log('✅ Successfully authenticated with Spotify');
  }

  async loadLocalLyrics() {
    console.log('📚 Loading local lyrics database...');
    
    const lyricsPath = path.join(__dirname, '..', 'public', 'content', 'lyrics.json');
    const lyricsData = JSON.parse(await fs.readFile(lyricsPath, 'utf-8'));
    
    this.localLyrics = lyricsData.lyrics.map(song => ({
      ...song,
      normalizedTitle: this.normalizeTitle(song.title),
      normalizedArtist: this.normalizeArtist(song.artist)
    }));

    console.log(`✅ Loaded ${this.localLyrics.length} songs from local database`);
  }

  normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  normalizeArtist(artist) {
    return artist
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async fetchAllArtistTracks(artistId, artistName) {
    console.log(`🎵 Fetching all tracks for ${artistName}...`);
    
    const allTracks = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    // Fetch albums first
    while (hasMore) {
      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=NL&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!albumsResponse.ok) {
        throw new Error(`Failed to fetch albums for ${artistName}: ${albumsResponse.statusText}`);
      }

      const albumsData = await albumsResponse.json();
      
      // For each album, fetch its tracks
      for (const album of albumsData.items) {
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks?market=NL`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );

        if (tracksResponse.ok) {
          const tracksData = await tracksResponse.json();
          
          for (const track of tracksData.items) {
            // Check if this artist is the primary artist or featured
            const isMainArtist = track.artists.some(artist => 
              artist.id === artistId || 
              this.normalizeArtist(artist.name) === this.normalizeArtist(artistName)
            );

            if (isMainArtist) {
              allTracks.push({
                id: track.id,
                name: track.name,
                normalizedTitle: this.normalizeTitle(track.name),
                artists: track.artists.map(a => a.name),
                normalizedArtists: track.artists.map(a => this.normalizeArtist(a.name)),
                album: {
                  id: album.id,
                  name: album.name,
                  release_date: album.release_date,
                  images: album.images
                },
                duration_ms: track.duration_ms,
                explicit: track.explicit,
                preview_url: track.preview_url,
                external_urls: track.external_urls,
                popularity: 0, // We'll get this from the full track data if needed
                primaryArtist: artistName
              });
            }
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      hasMore = albumsData.next !== null;
      offset += limit;

      // Small delay between album fetches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Remove duplicates (same track on different albums)
    const uniqueTracks = allTracks.filter((track, index, self) => 
      index === self.findIndex(t => 
        this.normalizeTitle(t.name) === this.normalizeTitle(track.name) &&
        t.primaryArtist === track.primaryArtist
      )
    );

    console.log(`✅ Found ${uniqueTracks.length} unique tracks for ${artistName} (${allTracks.length} total including duplicates)`);
    return uniqueTracks;
  }

  async fetchAllSpotifyTracks() {
    console.log('🎼 Fetching all Spotify tracks for both artists...');
    
    for (const [artistName, artistId] of Object.entries(ARTISTS)) {
      const tracks = await this.fetchAllArtistTracks(artistId, artistName);
      this.spotifyTracks.push(...tracks);
    }

    console.log(`✅ Total Spotify tracks collected: ${this.spotifyTracks.length}`);
  }

  findLyricsMatch(spotifyTrack) {
    // Try exact title match first
    let match = this.localLyrics.find(lyric => {
      const titleMatch = lyric.normalizedTitle === spotifyTrack.normalizedTitle;
      const artistMatch = lyric.normalizedArtist === this.normalizeArtist(spotifyTrack.primaryArtist) ||
                         spotifyTrack.normalizedArtists.includes(lyric.normalizedArtist);
      return titleMatch && artistMatch;
    });

    if (match) {
      return { match, confidence: 'exact' };
    }

    // Try partial title match
    match = this.localLyrics.find(lyric => {
      const spotifyWords = spotifyTrack.normalizedTitle.split(' ');
      const lyricWords = lyric.normalizedTitle.split(' ');
      
      // Check if at least 70% of words match
      const matchingWords = spotifyWords.filter(word => 
        lyricWords.some(lyricWord => 
          lyricWord.includes(word) || word.includes(lyricWord)
        )
      );

      const matchPercentage = matchingWords.length / Math.max(spotifyWords.length, lyricWords.length);
      
      if (matchPercentage >= 0.7) {
        const artistMatch = lyric.normalizedArtist === this.normalizeArtist(spotifyTrack.primaryArtist) ||
                           spotifyTrack.normalizedArtists.includes(lyric.normalizedArtist);
        return artistMatch;
      }
      
      return false;
    });

    if (match) {
      return { match, confidence: 'partial' };
    }

    return null;
  }

  async compareData() {
    console.log('🔍 Comparing Spotify tracks with local lyrics...');
    
    // Find Spotify tracks with lyrics
    for (const spotifyTrack of this.spotifyTracks) {
      const lyricsMatch = this.findLyricsMatch(spotifyTrack);
      
      if (lyricsMatch) {
        this.comparisonResults.withLyrics.push({
          spotify: spotifyTrack,
          lyrics: lyricsMatch.match,
          confidence: lyricsMatch.confidence
        });
      } else {
        this.comparisonResults.missingLyrics.push(spotifyTrack);
      }
    }

    // Find local lyrics without Spotify match
    const matchedLyricTitles = new Set(
      this.comparisonResults.withLyrics.map(item => item.lyrics.normalizedTitle)
    );

    this.comparisonResults.localOnlyLyrics = this.localLyrics.filter(lyric => 
      !matchedLyricTitles.has(lyric.normalizedTitle)
    );

    // Calculate statistics
    this.comparisonResults.statistics = {
      totalSpotifyTracks: this.spotifyTracks.length,
      totalLocalLyrics: this.localLyrics.length,
      tracksWithLyrics: this.comparisonResults.withLyrics.length,
      tracksMissingLyrics: this.comparisonResults.missingLyrics.length,
      localOnlyLyrics: this.comparisonResults.localOnlyLyrics.length,
      matchPercentage: Math.round((this.comparisonResults.withLyrics.length / this.spotifyTracks.length) * 100),
      exactMatches: this.comparisonResults.withLyrics.filter(item => item.confidence === 'exact').length,
      partialMatches: this.comparisonResults.withLyrics.filter(item => item.confidence === 'partial').length
    };

    console.log('✅ Comparison completed');
  }

  displayResults() {
    const stats = this.comparisonResults.statistics;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SPOTIFY-LYRICS COMPARISON RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n📈 STATISTICS:');
    console.log(`📀 Total Spotify tracks: ${stats.totalSpotifyTracks}`);
    console.log(`📝 Total local lyrics: ${stats.totalLocalLyrics}`);
    console.log(`✅ Tracks with lyrics: ${stats.tracksWithLyrics} (${stats.matchPercentage}%)`);
    console.log(`❌ Tracks missing lyrics: ${stats.tracksMissingLyrics}`);
    console.log(`🏠 Local-only lyrics: ${stats.localOnlyLyrics}`);
    console.log(`🎯 Exact matches: ${stats.exactMatches}`);
    console.log(`🎲 Partial matches: ${stats.partialMatches}`);

    console.log('\n✅ TRACKS WITH LYRICS:');
    console.log('-'.repeat(50));
    this.comparisonResults.withLyrics
      .sort((a, b) => a.spotify.name.localeCompare(b.spotify.name))
      .forEach((item, index) => {
        const confidence = item.confidence === 'exact' ? '🎯' : '🎲';
        console.log(`${index + 1}. ${confidence} "${item.spotify.name}" by ${item.spotify.primaryArtist}`);
        if (item.confidence === 'partial') {
          console.log(`   → Matched with: "${item.lyrics.title}"`);
        }
      });

    console.log('\n❌ TRACKS MISSING LYRICS:');
    console.log('-'.repeat(50));
    this.comparisonResults.missingLyrics
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((track, index) => {
        const year = track.album.release_date ? ` (${track.album.release_date.substring(0, 4)})` : '';
        console.log(`${index + 1}. "${track.name}" by ${track.primaryArtist}${year}`);
        console.log(`   Album: ${track.album.name}`);
      });

    console.log('\n🏠 LOCAL-ONLY LYRICS (no Spotify match):');
    console.log('-'.repeat(50));
    this.comparisonResults.localOnlyLyrics
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((lyric, index) => {
        console.log(`${index + 1}. "${lyric.title}" by ${lyric.artist}`);
      });
  }

  async exportToCSV() {
    console.log('\n💾 Exporting results to CSV...');
    
    const csvPath = path.join(__dirname, '..', 'spotify-lyrics-comparison.csv');
    
    let csvContent = 'Type,Track Title,Artist,Album,Release Year,Spotify URL,Has Lyrics,Match Confidence,Local Title,Notes\n';
    
    // Tracks with lyrics
    for (const item of this.comparisonResults.withLyrics) {
      const track = item.spotify;
      const year = track.album.release_date ? track.album.release_date.substring(0, 4) : '';
      const spotifyUrl = track.external_urls.spotify || '';
      const localTitle = item.lyrics.title !== track.name ? item.lyrics.title : '';
      
      csvContent += `"With Lyrics","${track.name}","${track.primaryArtist}","${track.album.name}","${year}","${spotifyUrl}","Yes","${item.confidence}","${localTitle}",""\n`;
    }
    
    // Tracks missing lyrics
    for (const track of this.comparisonResults.missingLyrics) {
      const year = track.album.release_date ? track.album.release_date.substring(0, 4) : '';
      const spotifyUrl = track.external_urls.spotify || '';
      
      csvContent += `"Missing Lyrics","${track.name}","${track.primaryArtist}","${track.album.name}","${year}","${spotifyUrl}","No","","",""\n`;
    }
    
    // Local-only lyrics
    for (const lyric of this.comparisonResults.localOnlyLyrics) {
      csvContent += `"Local Only","${lyric.title}","${lyric.artist}","","","","Yes","","","No Spotify match found"\n`;
    }
    
    await fs.writeFile(csvPath, csvContent, 'utf-8');
    console.log(`✅ CSV exported to: ${csvPath}`);
  }

  async exportToJSON() {
    console.log('💾 Exporting detailed results to JSON...');
    
    const jsonPath = path.join(__dirname, '..', 'spotify-lyrics-comparison.json');
    
    const exportData = {
      exportDate: new Date().toISOString(),
      statistics: this.comparisonResults.statistics,
      tracksWithLyrics: this.comparisonResults.withLyrics,
      tracksMissingLyrics: this.comparisonResults.missingLyrics,
      localOnlyLyrics: this.comparisonResults.localOnlyLyrics
    };
    
    await fs.writeFile(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');
    console.log(`✅ JSON exported to: ${jsonPath}`);
  }

  async run() {
    try {
      console.log('🚀 Starting Spotify-Lyrics Comparison...\n');
      
      await this.authenticate();
      await this.loadLocalLyrics();
      await this.fetchAllSpotifyTracks();
      await this.compareData();
      
      this.displayResults();
      
      await this.exportToCSV();
      await this.exportToJSON();
      
      console.log('\n🎉 Comparison completed successfully!');
      console.log('\nNext steps:');
      console.log('- Review the missing lyrics list to prioritize which songs to add');
      console.log('- Check local-only lyrics for potential Spotify matches');
      console.log('- Use the CSV file for detailed analysis in Excel or Google Sheets');
      
    } catch (error) {
      console.error('❌ Error during comparison:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run the comparison
const comparison = new SpotifyLyricsComparison();
comparison.run();
