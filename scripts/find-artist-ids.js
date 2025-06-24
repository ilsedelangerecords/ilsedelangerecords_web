/**
 * Script to find correct Spotify artist IDs
 */

import fs from 'fs';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function authenticate() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function searchArtist(accessToken, artistName) {
  console.log(`🔍 Searching for: ${artistName}`);
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  console.log(`Found ${data.artists.items.length} results:`);
  data.artists.items.forEach((artist, index) => {
    console.log(`${index + 1}. ${artist.name} (ID: ${artist.id})`);
    console.log(`   Followers: ${artist.followers.total.toLocaleString()}`);
    console.log(`   Popularity: ${artist.popularity}`);
    console.log(`   Genres: ${artist.genres.join(', ') || 'None'}`);
    console.log('');
  });
  
  return data.artists.items;
}

async function main() {
  try {
    console.log('🚀 Finding Spotify Artist IDs...\n');
    
    const accessToken = await authenticate();
    console.log('✅ Authenticated with Spotify\n');
    
    await searchArtist(accessToken, 'Ilse DeLange');
    console.log('-'.repeat(50));
    await searchArtist(accessToken, 'The Common Linnets');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
