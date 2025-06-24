/**
 * Test script to verify Spotify API connection
 * Tests with just a few songs before running the full script
 */

import fs from 'fs';
import path from 'path';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function testSpotifyConnection() {
  console.log('🧪 Testing Spotify API connection...\n');

  // Check credentials
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('❌ Missing Spotify API credentials!');
    console.log('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
    console.log('See SPOTIFY_SETUP.md for instructions.');
    return false;
  }

  console.log('✅ Credentials found');

  // Test authentication
  try {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      console.error('❌ Authentication failed:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('✅ Authentication successful');

    // Test search with a few songs
    const lyricsPath = path.join(process.cwd(), 'public', 'content', 'lyrics.json');
    const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
    
    console.log(`\n📊 Found ${lyricsData.lyrics.length} songs in database`);
    
    // Test with first 3 songs
    const testSongs = lyricsData.lyrics.slice(0, 3);
    console.log('\n🔍 Testing search with first 3 songs:\n');

    for (const song of testSongs) {
      const query = `track:"${song.title}" artist:"${song.artist}"`;
      const encodedQuery = encodeURIComponent(query);

      try {
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
          {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.tracks.items.length > 0) {
            const track = searchData.tracks.items[0];
            console.log(`✅ "${song.title}" by ${song.artist}`);
            console.log(`   Found: ${track.name} by ${track.artists[0].name}`);
            console.log(`   URL: ${track.external_urls.spotify}`);
          } else {
            console.log(`⚠️  "${song.title}" by ${song.artist} - Not found`);
          }
        } else {
          console.log(`❌ "${song.title}" by ${song.artist} - Search failed (${searchResponse.status})`);
        }
      } catch (error) {
        console.log(`❌ "${song.title}" by ${song.artist} - Error: ${error.message}`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ Test completed successfully!');
    console.log('\nYou can now run the full script with:');
    console.log('node scripts/add-spotify-urls.js');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testSpotifyConnection();
