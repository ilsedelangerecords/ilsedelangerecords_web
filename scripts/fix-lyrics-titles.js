import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual mapping of lyrics to correct Spotify songs
const titleMappings = [
  {
    currentTitle: "'Cross the Bering strait",
    correctTitle: "Flying Solo",
    spotifyName: "Flying Solo"
  },
  {
    currentTitle: "As I sit here below the light",
    correctTitle: "Man In The Moon", 
    spotifyName: "Man In The Moon"
  },
  {
    currentTitle: "An empty floor, a record on",
    correctTitle: "Dance On The Heartbreak",
    spotifyName: "Dance On The Heartbreak"
  },
  {
    currentTitle: "Blue bittersweet, blue bittersweet, like crowds that turned you,",
    correctTitle: "Blue Bittersweet",
    spotifyName: "Blue Bittersweet"
  },
  {
    currentTitle: "Build walls in secret corners",
    correctTitle: "Sun & Shadow",
    spotifyName: "Sun & Shadow"
  },
  {
    currentTitle: "Carry me down to the river and heal me tonight",
    correctTitle: "As If Only",
    spotifyName: "As If Only"
  }
];

async function updateLyricsTitles() {
  console.log('🔄 Updating lyrics titles to match Spotify songs...');
  
  try {
    // Load lyrics.json
    const lyricsPath = path.join(__dirname, '..', 'public', 'content', 'lyrics.json');
    const lyricsData = JSON.parse(await fs.readFile(lyricsPath, 'utf-8'));
    
    // Load Spotify comparison data to get metadata
    const spotifyPath = path.join(__dirname, '..', 'public', 'content', 'spotify-lyrics-comparison.json');
    const spotifyData = JSON.parse(await fs.readFile(spotifyPath, 'utf-8'));
    
    let updatedCount = 0;
    
    // Update each mapping
    for (const mapping of titleMappings) {
      console.log(`\n🔍 Looking for: "${mapping.currentTitle}"`);
      
      // Find the lyrics entry
      const lyricsIndex = lyricsData.lyrics.findIndex(song => 
        song.title === mapping.currentTitle
      );
      
      if (lyricsIndex === -1) {
        console.log(`❌ Lyrics not found for: "${mapping.currentTitle}"`);
        continue;
      }
      
      // Find the Spotify track
      const spotifyTrack = spotifyData.allSpotifyTracks?.find(track => 
        track.name === mapping.spotifyName ||
        track.name.toLowerCase().includes(mapping.spotifyName.toLowerCase())
      );
      
      if (!spotifyTrack) {
        console.log(`❌ Spotify track not found for: "${mapping.spotifyName}"`);
        continue;
      }
      
      // Update the lyrics entry
      const originalTitle = lyricsData.lyrics[lyricsIndex].title;
      lyricsData.lyrics[lyricsIndex].title = mapping.correctTitle;
      
      // Add Spotify metadata
      lyricsData.lyrics[lyricsIndex].spotify_url = spotifyTrack.external_urls?.spotify;
      lyricsData.lyrics[lyricsIndex].spotify_id = spotifyTrack.id;
      lyricsData.lyrics[lyricsIndex].spotify_album_art = spotifyTrack.album?.images?.[0]?.url;
      lyricsData.lyrics[lyricsIndex].spotify_preview_url = spotifyTrack.preview_url;
      
      // Update album info if available
      if (spotifyTrack.album) {
        lyricsData.lyrics[lyricsIndex].album = spotifyTrack.album.name;
        lyricsData.lyrics[lyricsIndex].year = spotifyTrack.album.release_date?.substring(0, 4);
      }
      
      console.log(`✅ Updated: "${originalTitle}" → "${mapping.correctTitle}"`);
      console.log(`   Spotify URL: ${spotifyTrack.external_urls?.spotify}`);
      console.log(`   Album: ${spotifyTrack.album?.name} (${spotifyTrack.album?.release_date?.substring(0, 4)})`);
      
      updatedCount++;
    }
    
    // Save updated lyrics.json
    await fs.writeFile(lyricsPath, JSON.stringify(lyricsData, null, 2));
    
    console.log(`\n🎉 Successfully updated ${updatedCount} lyrics titles!`);
    console.log(`📝 Updated lyrics.json with correct titles and Spotify metadata`);
    
    // Now we should regenerate the Spotify comparison to reflect these matches
    console.log('\n💡 Next step: Run the Spotify comparison script to update the frontend data');
    console.log('   → node scripts/spotify-lyrics-comparison.js');
    console.log('   → node scripts/update-frontend-data.js');
    
  } catch (error) {
    console.error('❌ Error updating lyrics titles:', error.message);
    process.exit(1);
  }
}

updateLyricsTitles();
