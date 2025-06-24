# Spotify-Lyrics Comparison Tool - Enhanced Edition

## Overview
The enhanced Spotify-lyrics comparison tool fetches **ALL** songs from Spotify for Ilse DeLange and The Common Linnets, stores them for future use, and provides flexible filtering options to view different categories of tracks.

## Features ✨

### 🔍 Filtering Options
- **all** (default): Show all tracks - complete overview
- **with-lyrics**: Show only tracks that have lyrics in the database
- **missing-lyrics**: Show only tracks missing lyrics (prioritization list)
- **local-only**: Show only local lyrics without Spotify matches

### 📊 Complete Data Collection
- Fetches ALL Spotify tracks (248 total as of last run)
- Stores complete catalog for future reference
- Cross-references with local lyrics database (161 songs)
- Smart matching with exact and partial title matching

### 📁 Export Files
1. **spotify-lyrics-comparison.csv** - Filtered results for spreadsheet analysis
2. **spotify-lyrics-comparison.json** - Complete comparison data with filtering info
3. **spotify-catalog.json** - Complete Spotify catalog with lyrics status

## Usage

### Basic Usage
```bash
# Show all tracks (default)
node scripts/spotify-lyrics-comparison.js

# Show only tracks with lyrics
node scripts/spotify-lyrics-comparison.js with-lyrics

# Show only tracks missing lyrics (for prioritization)
node scripts/spotify-lyrics-comparison.js missing-lyrics

# Show only local lyrics without Spotify matches
node scripts/spotify-lyrics-comparison.js local-only
```

### Demo Mode (No API Credentials Required)
```bash
# Test filtering functionality with sample data
node scripts/demo-filtering.js [filter]
```

## Prerequisites
Set Spotify API credentials as environment variables:
```bash
$env:SPOTIFY_CLIENT_ID = "your_client_id"
$env:SPOTIFY_CLIENT_SECRET = "your_client_secret"
```

## Output Examples

### Statistics Summary
```
📊 SPOTIFY-LYRICS COMPARISON RESULTS
🔍 Current filter: MISSING-LYRICS

📈 STATISTICS:
📀 Total Spotify tracks: 248
📝 Total local lyrics: 161
✅ Tracks with lyrics: 97 (39%)
❌ Tracks missing lyrics: 151
🏠 Local-only lyrics: 83
🎯 Exact matches: 71
🎲 Partial matches: 26
```

### Filter Results
- **with-lyrics**: Shows 97 tracks that have lyrics (great for validation)
- **missing-lyrics**: Shows 151 tracks needing lyrics (prioritization list)
- **local-only**: Shows 83 local lyrics that might need Spotify matching

## Data Structure

### Complete Spotify Catalog (spotify-catalog.json)
```json
{
  "exportDate": "2025-06-24T00:29:21.494Z",
  "totalTracks": 248,
  "artists": ["Ilse DeLange", "The Common Linnets"],
  "tracks": [
    {
      "id": "spotify_track_id",
      "name": "Song Title",
      "artists": ["Artist Name"],
      "album": {
        "name": "Album Name",
        "release_date": "2020",
        "images": [...]
      },
      "hasLyrics": true,
      "lyricsMatch": {...},
      "matchConfidence": "exact"
    }
  ]
}
```

## Use Cases

### 🎯 For Content Managers
- **Priority List**: Use `missing-lyrics` filter to see what lyrics to add next
- **Recent Releases**: Focus on 2019-2024 albums that need lyrics
- **Quality Check**: Use `with-lyrics` filter to verify existing matches

### 📊 For Analysis
- **Coverage Report**: See 39% lyrics coverage across full Spotify catalog
- **Gap Analysis**: Identify missing content by album/year
- **Match Quality**: Review exact vs partial matches

### 🔄 For Future Updates
- **Complete Catalog**: All 248 Spotify tracks stored for reference
- **Re-run Capability**: Easy to update as new lyrics are added
- **Bulk Operations**: Use track IDs for batch lyrics addition

## Recommendations

### High Priority (missing-lyrics filter)
1. **Recent Albums**: "Changes" (2020), "Tainted" (2024), "Gravel & Dust" (2019)
2. **Eurovision Content**: Complete The Common Linnets catalog
3. **Popular Singles**: Recent releases with high popularity scores

### Quality Assurance (with-lyrics filter)
1. **Verify Partial Matches**: Review 26 partial matches for accuracy
2. **Check Recent Updates**: Ensure new lyrics are properly matched

### Investigation (local-only filter)
1. **Spotify Matching**: Check if 83 local-only tracks have Spotify equivalents
2. **Title Variations**: Look for title differences causing match failures

## Files Created
- `scripts/spotify-lyrics-comparison.js` - Enhanced main script
- `scripts/demo-filtering.js` - Demo version for testing
- `spotify-catalog.json` - Complete Spotify track database
- `spotify-lyrics-comparison.csv` - Analysis-ready spreadsheet data
- `spotify-lyrics-comparison.json` - Complete technical data

## Next Steps
1. Set up Spotify API credentials to run full script
2. Use `missing-lyrics` filter to prioritize lyrics addition
3. Review `local-only` tracks for potential Spotify matches
4. Set up regular runs to track progress as lyrics are added

The tool now provides a complete foundation for managing the relationship between Spotify catalog and local lyrics database! 🎉
