/**
 * Script to add missing preview URLs to existing Spotify entries
 */

import fs from 'fs';
import path from 'path';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

console.log('🎵 Adding preview URLs to existing Spotify entries...');

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

async function getTrackPreview(accessToken, spotifyId) {
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
    return track.preview_url; // Can be null if no preview available
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
    
    // Find songs that have Spotify IDs but no preview URLs
    const songsToUpdate = lyricsData.lyrics.filter(song => 
      song.spotify_id && !song.spotify_preview_url
    );
    
    console.log(`📊 Found ${songsToUpdate.length} songs to check for preview URLs`);
    
    if (songsToUpdate.length === 0) {
      console.log('✅ All songs already have preview URLs checked!');
      return;
    }
    
    // Create backup
    const backupPath = lyricsPath.replace('.json', '_backup_preview_urls.json');
    fs.writeFileSync(backupPath, JSON.stringify(lyricsData, null, 2));
    console.log(`💾 Backup created: ${backupPath}`);
    
    let updated = 0;
    let foundPreviews = 0;
    
    for (const song of songsToUpdate) {
      console.log(`🎵 [${updated + 1}/${songsToUpdate.length}] Checking "${song.title}"`);
      
      const previewUrl = await getTrackPreview(accessToken, song.spotify_id);
      
      if (previewUrl) {
        song.spotify_preview_url = previewUrl;
        console.log(`✅    Added preview URL`);
        foundPreviews++;
      } else {
        console.log(`❌    No preview available`);
      }
      
      updated++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save updated file
    fs.writeFileSync(lyricsPath, JSON.stringify(lyricsData, null, 2));
    
    console.log('\n🎉 Preview URL update completed!');
    console.log(`✅ Checked: ${updated} songs`);
    console.log(`🎵 Found previews: ${foundPreviews} songs`);
    console.log(`📊 Preview rate: ${((foundPreviews / updated) * 100).toFixed(1)}%`);
    console.log(`💾 Updated file: ${lyricsPath}`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
