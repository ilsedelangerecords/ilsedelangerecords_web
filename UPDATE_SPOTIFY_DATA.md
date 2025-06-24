# Getting Updated Spotify Data (281 Tracks)

## Current Status
The frontend currently shows data from an earlier run with **248 tracks**, but you mentioned there are actually **281 tracks** available. This means either:

1. New tracks have been released on Spotify
2. The Spotify API is now finding additional tracks (albums, singles, compilations)
3. The search parameters have been expanded

## How to Update to 281 Tracks

### Step 1: Set Spotify Credentials
```powershell
$env:SPOTIFY_CLIENT_ID = "your_client_id"
$env:SPOTIFY_CLIENT_SECRET = "your_client_secret"
```

### Step 2: Run Updated Comparison
```bash
# Generate fresh data with all current Spotify tracks
node scripts/spotify-lyrics-comparison.js

# This will create new files with current track counts:
# - spotify-lyrics-comparison.json
# - spotify-lyrics-comparison.csv  
# - spotify-catalog.json
```

### Step 3: Update Frontend Data
```bash
# Copy the new data to the frontend
node scripts/update-frontend-data.js
```

### Step 4: Verify Results
The lyrics page should now show:
- **281 total Spotify tracks** (or current count)
- Updated "tracks missing lyrics" count
- More recent album/single releases

## What You'll See Updated

### 🎵 Lyrics Page Changes
- **Higher track count**: From 248 to 281+ tracks
- **More missing lyrics**: Likely 30+ additional tracks without lyrics
- **Recent releases**: Newer albums and singles will appear
- **Better coverage stats**: Updated percentage of tracks with lyrics

### 📊 Data Analysis
- **New prioritization**: Fresh list of tracks needing lyrics
- **Recent albums**: Latest releases will be in the "missing lyrics" section
- **Updated statistics**: More accurate representation of catalog coverage

## Expected Impact
If we go from 248 to 281 tracks:
- **+33 new tracks** discovered on Spotify
- **Likely +30 tracks missing lyrics** (most new releases won't have lyrics yet)
- **Lower coverage percentage** initially (more tracks to cover)
- **Better prioritization** for recent content

## Manual Alternative
If Spotify credentials aren't available right now:
1. Check the console output where you saw "281 tracks"
2. Look for a more recent `spotify-lyrics-comparison.json` file
3. Copy that data to `public/content/spotify-lyrics-comparison.json`
4. The frontend will automatically use the updated data

## Benefits of Updated Data
- ✅ Complete current catalog view
- ✅ Accurate missing lyrics count  
- ✅ Recent releases prioritization
- ✅ Better planning for lyrics addition
- ✅ Up-to-date statistics and reporting

Once updated, the lyrics page toggle will show the true scope of content available on Spotify vs. what has lyrics in the database!
