/**
 * Demo script to show filtering functionality with sample data
 * Run: node scripts/demo-filtering.js [filter]
 * Filters: all, with-lyrics, missing-lyrics, local-only
 */

// Get filter from command line arguments
const filter = process.argv[2] || 'all';
const validFilters = ['all', 'with-lyrics', 'missing-lyrics', 'local-only'];

if (!validFilters.includes(filter)) {
  console.error(`❌ Invalid filter: ${filter}`);
  console.error(`Valid filters: ${validFilters.join(', ')}`);
  process.exit(1);
}

// Sample data structure
const sampleResults = {
  statistics: {
    totalSpotifyTracks: 248,
    totalLocalLyrics: 161,
    tracksWithLyrics: 97,
    tracksMissingLyrics: 151,
    localOnlyLyrics: 83,
    matchPercentage: 39,
    exactMatches: 71,
    partialMatches: 26
  },
  withLyrics: [
    { spotify: { name: "Always Overcome", primaryArtist: "Ilse DeLange" }, confidence: "exact" },
    { spotify: { name: "Calm After The Storm", primaryArtist: "The Common Linnets" }, confidence: "exact" },
    { spotify: { name: "Breathe In, Breathe Out", primaryArtist: "Ilse DeLange" }, confidence: "partial", lyrics: { title: "'Cross the Bering strait" } }
  ],
  missingLyrics: [
    { name: "Changes", primaryArtist: "Ilse DeLange", album: { name: "Changes", release_date: "2020" } },
    { name: "Tainted", primaryArtist: "Ilse DeLange", album: { name: "Tainted", release_date: "2024" } },
    { name: "Arms Of Salvation", primaryArtist: "The Common Linnets", album: { name: "The Common Linnets", release_date: "2014" } }
  ],
  localOnlyLyrics: [
    { title: "Als je iets kan doen", artist: "Ilse DeLange" },
    { title: "Open je ogen", artist: "Ilse DeLange" },
    { title: "Jolene", artist: "The Common Linnets" }
  ]
};

function displayResults(filter, results) {
  const stats = results.statistics;
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SPOTIFY-LYRICS COMPARISON DEMO');
  console.log(`🔍 Current filter: ${filter.toUpperCase()}`);
  console.log('='.repeat(80));
  
  console.log('\n📈 STATISTICS:');
  console.log(`📀 Total Spotify tracks: ${stats.totalSpotifyTracks}`);
  console.log(`📝 Total local lyrics: ${stats.totalLocalLyrics}`);
  console.log(`✅ Tracks with lyrics: ${stats.tracksWithLyrics} (${stats.matchPercentage}%)`);
  console.log(`❌ Tracks missing lyrics: ${stats.tracksMissingLyrics}`);
  console.log(`🏠 Local-only lyrics: ${stats.localOnlyLyrics}`);
  console.log(`🎯 Exact matches: ${stats.exactMatches}`);
  console.log(`🎲 Partial matches: ${stats.partialMatches}`);

  // Show filtered results based on selected filter
  if (filter === 'all' || filter === 'with-lyrics') {
    console.log('\n✅ TRACKS WITH LYRICS:');
    console.log('-'.repeat(50));
    results.withLyrics.forEach((item, index) => {
      const confidence = item.confidence === 'exact' ? '🎯' : '🎲';
      console.log(`${index + 1}. ${confidence} "${item.spotify.name}" by ${item.spotify.primaryArtist}`);
      if (item.confidence === 'partial') {
        console.log(`   → Matched with: "${item.lyrics.title}"`);
      }
    });
  }

  if (filter === 'all' || filter === 'missing-lyrics') {
    console.log('\n❌ TRACKS MISSING LYRICS:');
    console.log('-'.repeat(50));
    results.missingLyrics.forEach((track, index) => {
      const year = track.album.release_date ? ` (${track.album.release_date})` : '';
      console.log(`${index + 1}. "${track.name}" by ${track.primaryArtist}${year}`);
      console.log(`   Album: ${track.album.name}`);
    });
  }

  if (filter === 'all' || filter === 'local-only') {
    console.log('\n🏠 LOCAL-ONLY LYRICS (no Spotify match):');
    console.log('-'.repeat(50));
    results.localOnlyLyrics.forEach((lyric, index) => {
      console.log(`${index + 1}. "${lyric.title}" by ${lyric.artist}`);
    });
  }

  console.log('\n💡 Filter options:');
  console.log('   all - Show all tracks (default)');
  console.log('   with-lyrics - Show only tracks with lyrics');
  console.log('   missing-lyrics - Show only tracks missing lyrics');
  console.log('   local-only - Show only local lyrics without Spotify match');
  
  console.log('\n🔄 Try different filters:');
  console.log('   node scripts/demo-filtering.js with-lyrics');
  console.log('   node scripts/demo-filtering.js missing-lyrics');
  console.log('   node scripts/demo-filtering.js local-only');
}

console.log('🚀 Starting Spotify-Lyrics Comparison Demo...');
console.log(`🔍 Filter: ${filter}`);

displayResults(filter, sampleResults);

console.log('\n🎉 Demo completed!');
console.log('💡 This demonstrates the filtering functionality.');
console.log('📝 The actual script will pull real data from Spotify API.');
console.log('🔑 Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to run the full script.');
