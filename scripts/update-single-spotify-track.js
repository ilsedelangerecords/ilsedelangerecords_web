/**
 * Script to fetch Spotify track details and update a specific song
 * Usage: node scripts/update-single-spotify-track.js "TRACK_ID" "SONG_TITLE"
 */

import fs from 'fs';
import path from 'path';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Get track ID from command line arguments
const trackId = process.argv[2];
const songTitle = process.argv[3];

if (!trackId || !songTitle) {
  console.error('❌ Usage: node scripts/update-single-spotify-track.js "TRACK_ID" "SONG_TITLE"');
  console.error('Example: node scripts/update-single-spotify-track.js "6A5vneoavVypAOtH0VITTc" "Open je ogen"');
  process.exit(1);
}

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Missing Spotify API credentials!');
  process.exit(1);
}

async function getAccessToken() {
  console.log('🔑 Getting Spotify access token...');
  
  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  console.log('✅ Authentication successful');
  return data.access_token;
}

async function getTrackDetails(accessToken, trackId) {
  console.log(`🎵 Fetching track details for ID: ${trackId}`);
  
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }
  const track = await response.json();
  
  console.log(`✅ Found track: "${track.name}" by ${track.artists[0].name}`);
  
  // Log all artists if there are multiple
  if (track.artists.length > 1) {
    console.log(`👥 All artists: ${track.artists.map(a => a.name).join(', ')}`);
  }
  
  console.log(`📀 Album: "${track.album.name}"`);
  console.log(`🔗 URL: ${track.external_urls.spotify}`);
  console.log(`🎧 Preview: ${track.preview_url || 'Not available'}`);
  
  return {
    spotify_url: track.external_urls.spotify,
    spotify_id: track.id,
    spotify_preview_url: track.preview_url,
    spotify_album_art: track.album.images[0]?.url,
    spotify_album_art_medium: track.album.images[1]?.url,
    spotify_album_art_small: track.album.images[2]?.url,
    spotify_album_name: track.album.name,
    spotify_artist_name: track.artists[0].name, // Primary artist
    spotify_all_artists: track.artists.map(artist => ({
      name: artist.name,
      id: artist.id,
      spotify_url: artist.external_urls.spotify
    })),
    spotify_artists_string: track.artists.map(a => a.name).join(', '), // For easy display
    spotify_release_date: track.album.release_date,
    spotify_popularity: track.popularity, // 0-100 popularity score
    spotify_duration_ms: track.duration_ms,
    spotify_explicit: track.explicit,
    spotify_match_confidence: 'manual' // Since this is manually matched
  };
}

async function updateSongInLyrics(songTitle, spotifyData) {
  const lyricsPath = path.join(process.cwd(), 'public', 'content', 'lyrics.json');
  console.log(`📁 Loading lyrics from: ${lyricsPath}`);
  
  const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
  
  // Find the song by title
  const song = lyricsData.lyrics.find(lyric => 
    lyric.title.toLowerCase() === songTitle.toLowerCase()
  );
  
  if (!song) {
    console.error(`❌ Song "${songTitle}" not found in lyrics database`);
    return false;
  }
  
  console.log(`📝 Found song: "${song.title}" by ${song.artist}`);
  
  // Create backup
  const backupPath = lyricsPath.replace('.json', `_backup_${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(lyricsData, null, 2));
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Update song with Spotify data
  Object.assign(song, spotifyData);
  
  // Save updated file
  fs.writeFileSync(lyricsPath, JSON.stringify(lyricsData, null, 2));
  console.log(`✅ Updated "${song.title}" with Spotify data`);
  console.log(`📁 Updated file: ${lyricsPath}`);
  
  return true;
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    const spotifyData = await getTrackDetails(accessToken, trackId);
    const success = await updateSongInLyrics(songTitle, spotifyData);
      if (success) {
      console.log('\n🎉 Successfully updated song with Spotify data!');
      console.log('\n📊 Added fields:');
      Object.entries(spotifyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'spotify_all_artists') {
            console.log(`   - ${key}: ${value.map(a => a.name).join(', ')}`);
          } else if (key === 'spotify_duration_ms') {
            const minutes = Math.floor(value / 60000);
            const seconds = Math.floor((value % 60000) / 1000);
            console.log(`   - ${key}: ${value} (${minutes}:${seconds.toString().padStart(2, '0')})`);
          } else {
            console.log(`   - ${key}: ${value}`);
          }
        }
      });
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
