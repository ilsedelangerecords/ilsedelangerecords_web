# Spotify URLs Setup Guide

## Step 1: Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - App Name: "Ilse DeLange Records Lyrics"
   - App Description: "Adding Spotify URLs to lyrics database"
   - Website: "https://ilsedelangerecords.nl"
   - Redirect URI: (leave empty for this use case)
   - API/SDKs: Check "Web API"
5. Click "Save"
6. Copy your "Client ID" and "Client Secret"

## Step 2: Set Up Environment

Create a `.env` file in the project root with:
```
SPOTIFY_CLIENT_ID=your_actual_client_id
SPOTIFY_CLIENT_SECRET=your_actual_client_secret
```

## Step 3: Run the Script

```powershell
# Install dependencies if needed
npm install

# Run the script
node scripts/add-spotify-urls.js
```

## What the Script Does

- Searches Spotify for each song in `lyrics.json`
- Adds `spotify_url`, `spotify_id`, and `spotify_preview_url` fields
- Creates a backup file before making changes
- Shows progress and statistics
- Handles rate limiting automatically
- Skips songs that already have Spotify URLs

## Expected Results

- Total songs: 161
- Expected success rate: 70-90% (some songs may not be on Spotify)
- Runtime: ~5-10 minutes (with rate limiting)
