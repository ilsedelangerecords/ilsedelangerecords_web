/**
 * Script to update the frontend Spotify data
 * Run this after generating new spotify-lyrics-comparison.json data
 */

import fs from 'fs/promises';
import path from 'path';

async function updateFrontendSpotifyData() {
  console.log('📊 Updating frontend Spotify data...');
  
  const sourceFile = 'spotify-lyrics-comparison.json';
  const targetFile = 'public/content/spotify-lyrics-comparison.json';
  
  try {
    // Check if source file exists
    await fs.access(sourceFile);
    
    // Read the source data
    const data = JSON.parse(await fs.readFile(sourceFile, 'utf-8'));
    console.log(`📈 Found data with ${data.statistics.totalSpotifyTracks} total Spotify tracks`);
    console.log(`✅ Tracks with lyrics: ${data.statistics.tracksWithLyrics}`);
    console.log(`❌ Tracks missing lyrics: ${data.statistics.tracksMissingLyrics}`);
    console.log(`📅 Export date: ${data.exportDate}`);
    
    // Copy to public folder for frontend access
    await fs.copyFile(sourceFile, targetFile);
    console.log(`✅ Updated frontend data: ${targetFile}`);
    
    console.log('\n🎉 Frontend data updated successfully!');
    console.log('The lyrics page will now show the updated track counts.');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Source file not found:', sourceFile);
      console.log('\n💡 To get updated data:');
      console.log('1. Set Spotify API credentials:');
      console.log('   $env:SPOTIFY_CLIENT_ID = "your_client_id"');
      console.log('   $env:SPOTIFY_CLIENT_SECRET = "your_client_secret"');
      console.log('2. Run: node scripts/spotify-lyrics-comparison.js');
      console.log('3. Run: node scripts/update-frontend-data.js');
    } else {
      console.error('❌ Error updating frontend data:', error.message);
    }
  }
}

updateFrontendSpotifyData();
