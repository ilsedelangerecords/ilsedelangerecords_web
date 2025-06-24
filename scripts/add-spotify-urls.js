/**
 * Script to add Spotify URLs to songs in lyrics.json
 * Requires Spotify Web API credentials
 */

import fs from 'fs';
import path from 'path';

// You'll need to get these from https://developer.spotify.com/dashboard
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

class SpotifyURLAdder {
  constructor() {
    this.accessToken = null;
    this.rateLimitDelay = 100; // ms between requests
  }

  async authenticate() {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      console.log('✅ Spotify authentication successful');
    } catch (error) {
      console.error('❌ Spotify authentication failed:', error);
      throw error;
    }
  }

  async searchTrack(artist, title) {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Spotify');
    }

    // Clean up the search query
    const cleanTitle = title
      .replace(/['"]/g, '') // Remove quotes
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    const query = `track:"${cleanTitle}" artist:"${artist}"`;
    const encodedQuery = encodeURIComponent(query);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait longer
          const retryAfter = response.headers.get('Retry-After') || 1;
          console.log(`⏳ Rate limited, waiting ${retryAfter} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return this.searchTrack(artist, title); // Retry
        }
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
        if (data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        return {
          spotify_url: track.external_urls.spotify,
          spotify_id: track.id,
          spotify_preview_url: track.preview_url,
          spotify_album_art: track.album.images[0]?.url, // High-res album art
          spotify_album_art_medium: track.album.images[1]?.url, // Medium-res
          spotify_album_art_small: track.album.images[2]?.url, // Small-res
          spotify_album_name: track.album.name,
          found: true,
          match_confidence: this.calculateMatchConfidence(artist, title, track)
        };
      }

      return { found: false };
    } catch (error) {
      console.error(`❌ Error searching for "${title}" by ${artist}:`, error.message);
      return { found: false, error: error.message };
    }
  }

  calculateMatchConfidence(originalArtist, originalTitle, spotifyTrack) {
    // Simple confidence calculation based on name similarity
    const artistMatch = spotifyTrack.artists.some(artist => 
      artist.name.toLowerCase().includes(originalArtist.toLowerCase()) ||
      originalArtist.toLowerCase().includes(artist.name.toLowerCase())
    );
    
    const titleSimilarity = this.stringSimilarity(
      originalTitle.toLowerCase(),
      spotifyTrack.name.toLowerCase()
    );

    if (artistMatch && titleSimilarity > 0.8) return 'high';
    if (artistMatch && titleSimilarity > 0.6) return 'medium';
    if (titleSimilarity > 0.9) return 'medium';
    return 'low';
  }

  stringSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - this.levenshteinDistance(longer, shorter)) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async processLyrics() {
    console.log('🎵 Starting to add Spotify URLs to lyrics...');

    // Load the lyrics file
    const lyricsPath = path.join(process.cwd(), 'public', 'content', 'lyrics.json');
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));

    let processed = 0;
    let found = 0;
    let errors = 0;

    for (const song of lyricsData.lyrics) {
      // Skip if already has Spotify URL
      if (song.spotify_url) {
        console.log(`⏭️  Skipping "${song.title}" - already has Spotify URL`);
        continue;
      }

      console.log(`🔍 Searching for "${song.title}" by ${song.artist}...`);

      const result = await this.searchTrack(song.artist, song.title);
        if (result.found) {
        song.spotify_url = result.spotify_url;
        song.spotify_id = result.spotify_id;
        if (result.spotify_preview_url) {
          song.spotify_preview_url = result.spotify_preview_url;
        }
        if (result.spotify_album_art) {
          song.spotify_album_art = result.spotify_album_art;
          song.spotify_album_art_medium = result.spotify_album_art_medium;
          song.spotify_album_art_small = result.spotify_album_art_small;
          song.spotify_album_name = result.spotify_album_name;
        }
        song.spotify_match_confidence = result.match_confidence;
        
        console.log(`✅ Found: ${result.spotify_url} (confidence: ${result.match_confidence})`);
        found++;
      } else {
        console.log(`❌ Not found on Spotify`);
        if (result.error) {
          errors++;
        }
      }

      processed++;
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));

      // Progress update
      if (processed % 10 === 0) {
        console.log(`📊 Progress: ${processed}/${lyricsData.lyrics.length} processed, ${found} found`);
      }
    }

    // Save the updated file
    const backupPath = lyricsPath.replace('.json', '_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(lyricsData, null, 2));
    fs.writeFileSync(lyricsPath, JSON.stringify(lyricsData, null, 2));

    console.log('\n🎉 Spotify URL addition completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total songs: ${lyricsData.lyrics.length}`);
    console.log(`   - Processed: ${processed}`);
    console.log(`   - Found on Spotify: ${found}`);
    console.log(`   - Success rate: ${((found / processed) * 100).toFixed(1)}%`);
    console.log(`   - Errors: ${errors}`);
    console.log(`\n💾 Backup saved to: ${backupPath}`);
    console.log(`📁 Updated file: ${lyricsPath}`);
  }
}

async function main() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('❌ Missing Spotify API credentials!');
    console.log('\n📝 To use this script:');
    console.log('1. Go to https://developer.spotify.com/dashboard');
    console.log('2. Create a new app');
    console.log('3. Get your Client ID and Client Secret');
    console.log('4. Set environment variables:');
    console.log('   - SPOTIFY_CLIENT_ID=your_client_id');
    console.log('   - SPOTIFY_CLIENT_SECRET=your_client_secret');
    console.log('\n🔧 Run with: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/add-spotify-urls.js');
    process.exit(1);
  }

  try {
    const adder = new SpotifyURLAdder();
    await adder.authenticate();
    await adder.processLyrics();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SpotifyURLAdder };
