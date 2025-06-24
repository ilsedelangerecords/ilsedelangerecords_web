/**
 * Simplified script to add Spotify URLs to songs in lyrics.json
 * With better error handling and output
 */

import fs from 'fs';
import path from 'path';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

console.log('🎵 Starting Spotify URL addition script...');
console.log(`📊 Client ID: ${SPOTIFY_CLIENT_ID ? 'Set' : 'Missing'}`);
console.log(`🔐 Client Secret: ${SPOTIFY_CLIENT_SECRET ? 'Set' : 'Missing'}`);

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Missing Spotify credentials!');
  process.exit(1);
}

async function getAccessToken() {
  console.log('🔑 Getting Spotify access token...');
  
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Authentication successful');
    return data.access_token;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    throw error;
  }
}

async function searchSpotifyTrack(accessToken, artist, title) {
  const cleanTitle = title.replace(/['"]/g, '').replace(/\s+/g, ' ').trim();
  const query = `track:"${cleanTitle}" artist:"${artist}"`;
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.log('⏳ Rate limited, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return searchSpotifyTrack(accessToken, artist, title);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.tracks.items.length > 0) {
      const track = data.tracks.items[0];
      return {
        found: true,
        spotify_url: track.external_urls.spotify,
        spotify_id: track.id,
        spotify_preview_url: track.preview_url,
        match_name: track.name,
        match_artist: track.artists[0].name
      };
    }

    return { found: false };
  } catch (error) {
    console.error(`❌ Search error for "${title}":`, error.message);
    return { found: false, error: error.message };
  }
}

async function main() {
  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Load lyrics file
    const lyricsPath = path.join(process.cwd(), 'public', 'content', 'lyrics.json');
    console.log(`📁 Loading lyrics from: ${lyricsPath}`);
    
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
    console.log(`📊 Found ${lyricsData.lyrics.length} songs`);
    
    // Create backup
    const backupPath = lyricsPath.replace('.json', '_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(lyricsData, null, 2));
    console.log(`💾 Backup created: ${backupPath}`);
    
    let processed = 0;
    let found = 0;
    let skipped = 0;
    
    // Process each song
    for (const song of lyricsData.lyrics) {
      // Skip if already has Spotify URL
      if (song.spotify_url) {
        console.log(`⏭️  [${processed + 1}/${lyricsData.lyrics.length}] Skipping "${song.title}" - already has URL`);
        skipped++;
        processed++;
        continue;
      }
      
      console.log(`🔍 [${processed + 1}/${lyricsData.lyrics.length}] Searching: "${song.title}" by ${song.artist}`);
      
      const result = await searchSpotifyTrack(accessToken, song.artist, song.title);
      
      if (result.found) {
        song.spotify_url = result.spotify_url;
        song.spotify_id = result.spotify_id;
        if (result.spotify_preview_url) {
          song.spotify_preview_url = result.spotify_preview_url;
        }
        
        console.log(`✅    Found: "${result.match_name}" by ${result.match_artist}`);
        console.log(`🔗    URL: ${result.spotify_url}`);
        found++;
      } else {
        console.log(`❌    Not found on Spotify`);
      }
      
      processed++;
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Progress update every 10 songs
      if (processed % 10 === 0) {
        console.log(`\n📊 Progress: ${processed}/${lyricsData.lyrics.length} | Found: ${found} | Skipped: ${skipped}\n`);
      }
    }
    
    // Save updated file
    fs.writeFileSync(lyricsPath, JSON.stringify(lyricsData, null, 2));
    
    // Final statistics
    console.log('\n🎉 COMPLETED!');
    console.log('================');
    console.log(`📊 Total songs: ${lyricsData.lyrics.length}`);
    console.log(`✅ Found on Spotify: ${found}`);
    console.log(`⏭️  Already had URLs: ${skipped}`);
    console.log(`❌ Not found: ${processed - found - skipped}`);
    console.log(`📈 Success rate: ${((found / (processed - skipped)) * 100).toFixed(1)}%`);
    console.log(`💾 Updated file: ${lyricsPath}`);
    console.log(`🔒 Backup saved: ${backupPath}`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
