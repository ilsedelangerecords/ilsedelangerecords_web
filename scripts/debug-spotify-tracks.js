import dotenv from 'dotenv';

dotenv.config();

class SpotifyDebugger {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;    // Artist IDs
    this.artists = {
      'Ilse DeLange': '3FTKP1k9VbOng3m1rgnsqx',
      'The Common Linnets': '18h3nc5ixeV80KKGWDAaMG'
    };
  }

  async authenticate() {
    console.log('🔐 Authenticating with Spotify...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    console.log('✅ Successfully authenticated with Spotify');
  }

  async debugArtistAlbums(artistId, artistName) {
    console.log(`\n📊 DEBUGGING: ${artistName} (${artistId})`);
    console.log('=' .repeat(60));
    
    const limit = 50;
    let offset = 0;
    let hasMore = true;
    let totalAlbums = 0;
    let albumsByType = {
      album: 0,
      single: 0,
      compilation: 0
    };

    while (hasMore) {
      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=NL&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!albumsResponse.ok) {
        throw new Error(`Failed to fetch albums for ${artistName}: ${albumsResponse.statusText}`);
      }

      const albumsData = await albumsResponse.json();
      
      console.log(`📀 Batch ${Math.floor(offset/limit) + 1}: Found ${albumsData.items.length} albums (offset: ${offset})`);
      
      // Count albums by type
      for (const album of albumsData.items) {
        totalAlbums++;
        albumsByType[album.album_type] = (albumsByType[album.album_type] || 0) + 1;
        
        console.log(`  ${totalAlbums}. ${album.name} (${album.album_type}) - ${album.release_date} - ${album.total_tracks} tracks`);
      }

      hasMore = albumsData.next !== null;
      offset += limit;
      
      if (hasMore) {
        console.log(`   ⏳ Fetching next batch...`);
      }
    }
    
    console.log(`\n📊 SUMMARY for ${artistName}:`);
    console.log(`   Total albums/releases: ${totalAlbums}`);
    console.log(`   Albums: ${albumsByType.album || 0}`);
    console.log(`   Singles: ${albumsByType.single || 0}`);
    console.log(`   Compilations: ${albumsByType.compilation || 0}`);
    
    // Now let's count actual tracks
    console.log(`\n🎵 Counting tracks for ${artistName}...`);
    let totalTracks = 0;
    let uniqueTracks = new Set();
    
    offset = 0;
    hasMore = true;
    
    while (hasMore) {
      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=NL&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const albumsData = await albumsResponse.json();
      
      for (const album of albumsData.items) {
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks?market=NL`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );

        if (tracksResponse.ok) {
          const tracksData = await tracksResponse.json();
          
          for (const track of tracksData.items) {
            const isMainArtist = track.artists.some(artist => 
              artist.id === artistId || 
              this.normalizeArtist(artist.name) === this.normalizeArtist(artistName)
            );

            if (isMainArtist) {
              totalTracks++;
              uniqueTracks.add(this.normalizeTitle(track.name));
            }
          }
        }
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      hasMore = albumsData.next !== null;
      offset += limit;
    }
    
    console.log(`   Total tracks found: ${totalTracks}`);
    console.log(`   Unique track titles: ${uniqueTracks.size}`);
    
    return {
      totalAlbums,
      albumsByType,
      totalTracks,
      uniqueTracks: uniqueTracks.size
    };
  }

  normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  normalizeArtist(artist) {
    return artist
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

async function main() {
  try {
    const spotify = new SpotifyDebugger();
    await spotify.authenticate();

    let grandTotal = {
      albums: 0,
      tracks: 0,
      uniqueTracks: 0
    };

    for (const [artistName, artistId] of Object.entries(spotify.artists)) {
      const stats = await spotify.debugArtistAlbums(artistId, artistName);
      
      grandTotal.albums += stats.totalAlbums;
      grandTotal.tracks += stats.totalTracks;
      grandTotal.uniqueTracks += stats.uniqueTracks;
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎯 GRAND TOTAL SUMMARY:');
    console.log('='.repeat(80));
    console.log(`Total albums/releases: ${grandTotal.albums}`);
    console.log(`Total tracks (with duplicates): ${grandTotal.tracks}`);
    console.log(`Unique tracks (normalized titles): ${grandTotal.uniqueTracks}`);
    console.log('\nNote: The comparison script removes duplicates, so the final count');
    console.log('should match the unique tracks count.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
