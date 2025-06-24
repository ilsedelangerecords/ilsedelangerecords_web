/**
 * Script to update existing Spotify URLs with album art and enhanced data
 * Run this to add album art to songs that already have Spotify URLs
 */

import fs from 'fs';
import path from 'path';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

console.log('🎨 Updating existing Spotify entries with album art...');

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Missing Spotify credentials!');
  process.exit(1);
}

async function getAccessToken() {
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
  return data.access_token;
}

async function getTrackDetails(accessToken, spotifyId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const track = await response.json();
    
    return {
      spotify_album_art: track.album.images[0]?.url,
      spotify_album_art_medium: track.album.images[1]?.url,
      spotify_album_art_small: track.album.images[2]?.url,
      spotify_album_name: track.album.name,
    };
  } catch (error) {
    console.error(`❌ Error fetching track ${spotifyId}:`, error.message);
    return null;
  }
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    console.log('✅ Authenticated with Spotify');
    
    const lyricsPath = path.join(process.cwd(), 'public', 'content', 'lyrics.json');
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
    
    // Find songs that have Spotify IDs but no album art
    const songsToUpdate = lyricsData.lyrics.filter(song => 
      song.spotify_id && !song.spotify_album_art
    );
    
    console.log(`📊 Found ${songsToUpdate.length} songs to update with album art`);
    
    if (songsToUpdate.length === 0) {
      console.log('✅ All songs already have album art!');
      return;
    }
    
    // Create backup
    const backupPath = lyricsPath.replace('.json', '_backup_album_art.json');
    fs.writeFileSync(backupPath, JSON.stringify(lyricsData, null, 2));
    console.log(`💾 Backup created: ${backupPath}`);
    
    let updated = 0;
    
    for (const song of songsToUpdate) {
      console.log(`🎨 [${updated + 1}/${songsToUpdate.length}] Getting album art for "${song.title}"`);
      
      const details = await getTrackDetails(accessToken, song.spotify_id);
      
      if (details) {
        Object.assign(song, details);
        console.log(`✅    Added album art for "${details.spotify_album_name}"`);
        updated++;
      } else {
        console.log(`❌    Failed to get album art`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save updated file
    fs.writeFileSync(lyricsPath, JSON.stringify(lyricsData, null, 2));
    
    console.log('\n🎉 Album art update completed!');
    console.log(`✅ Updated ${updated}/${songsToUpdate.length} songs`);
    console.log(`💾 Updated file: ${lyricsPath}`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
