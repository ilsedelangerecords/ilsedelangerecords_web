#!/usr/bin/env node

/**
 * Fix Lyrics Links Script
 * 
 * This script fixes the linking between lyrics and albums/artists by:
 * 1. Adding proper artistId and albumId fields to lyrics entries
 * 2. Matching song titles to album track listings
 * 3. Creating proper URL-safe slugs for navigation
 * 4. Filling in missing album information where possible
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create URL-safe slugs
function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to normalize text for matching
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Load data files
const contentDir = path.join(__dirname, '..', 'public', 'content');
const lyricsPath = path.join(contentDir, 'lyrics.json');
const albumsPath = path.join(contentDir, 'albums.json');

console.log('🔧 Loading data files...');

let lyrics, albums;

try {
  lyrics = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
  albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
} catch (error) {
  console.error('❌ Error loading data files:', error);
  process.exit(1);
}

console.log(`📝 Loaded ${lyrics.length} lyrics entries`);
console.log(`💿 Loaded ${albums.length} album entries`);

// Create artist mapping
const artistSlugs = {
  'Ilse DeLange': 'ilse-delange',
  'The Common Linnets': 'the-common-linnets'
};

// Create album slug mapping
const albumSlugs = {};
const albumTitleToSlug = {};

albums.forEach(album => {
  const slug = createSlug(album.title);
  albumSlugs[album.id] = slug;
  albumTitleToSlug[normalizeText(album.title)] = {
    id: album.id,
    slug: slug,
    title: album.title,
    artist: album.artist
  };
});

console.log('🔗 Creating album title mappings...');

// Track statistics
let stats = {
  totalLyrics: lyrics.length,
  linkedToAlbum: 0,
  addedArtistId: 0,
  addedAlbumId: 0,
  updatedAlbumTitle: 0,
  errors: []
};

// Process each lyrics entry
console.log('🔧 Processing lyrics entries...');

const updatedLyrics = lyrics.map((lyric, index) => {
  const updated = { ...lyric };
  
  // Add artistId if missing
  if (!updated.artistId && updated.artist) {
    const artistSlug = artistSlugs[updated.artist];
    if (artistSlug) {
      updated.artistId = artistSlug;
      stats.addedArtistId++;
    } else {
      // Create slug from artist name
      updated.artistId = createSlug(updated.artist);
      stats.addedArtistId++;
    }
  }

  // Try to find matching album
  let matchedAlbum = null;

  // First, try exact album title match
  if (updated.album) {
    const normalizedAlbumTitle = normalizeText(updated.album);
    matchedAlbum = albumTitleToSlug[normalizedAlbumTitle];
  }

  // If no album match and we have a song title, search through album tracks
  if (!matchedAlbum && updated.title) {
    const normalizedSongTitle = normalizeText(updated.title);
    
    for (const album of albums) {
      // Only match albums by the same artist
      if (album.artist !== updated.artist) continue;
      
      if (album.tracks && Array.isArray(album.tracks)) {
        const trackFound = album.tracks.some(track => {
          const normalizedTrack = normalizeText(track);
          return normalizedTrack.includes(normalizedSongTitle) || 
                 normalizedSongTitle.includes(normalizedTrack);
        });
        
        if (trackFound) {
          matchedAlbum = {
            id: album.id,
            slug: createSlug(album.title),
            title: album.title,
            artist: album.artist
          };
          break;
        }
      }
      
      // Also check if tracks are in description field (some albums have tracks there)
      if (album.description && typeof album.description === 'string') {
        const normalizedDesc = normalizeText(album.description);
        if (normalizedDesc.includes(normalizedSongTitle)) {
          matchedAlbum = {
            id: album.id,
            slug: createSlug(album.title),
            title: album.title,
            artist: album.artist
          };
          break;
        }
      }
    }
  }

  // Apply matched album information
  if (matchedAlbum) {
    updated.albumId = matchedAlbum.slug;
    
    // Update album title if it was empty or different
    if (!updated.album || updated.album !== matchedAlbum.title) {
      updated.album = matchedAlbum.title;
      stats.updatedAlbumTitle++;
    }
    
    stats.linkedToAlbum++;
    stats.addedAlbumId++;
  } else {
    // If we still don't have an album, at least ensure we have an albumId field
    if (!updated.albumId) {
      updated.albumId = updated.album ? createSlug(updated.album) : '';
    }
  }

  // Clean up any remaining issues
  if (!updated.album) {
    updated.album = '';
  }

  return updated;
});

// Additional pass: try to find albums for unmatched songs using partial matching
console.log('🔧 Second pass: partial matching for unlinked songs...');

const secondPassStats = {
  partialMatches: 0
};

const finalLyrics = updatedLyrics.map(lyric => {
  // Skip if already has a proper album
  if (lyric.album && lyric.albumId && lyric.albumId !== '') {
    return lyric;
  }

  const updated = { ...lyric };
  const normalizedSongTitle = normalizeText(updated.title);

  // More aggressive partial matching
  for (const album of albums) {
    if (album.artist !== updated.artist) continue;

    // Check album title similarity
    const normalizedAlbumTitle = normalizeText(album.title);
    const titleWords = normalizedSongTitle.split(' ');
    
    // If song title contains album title words
    const albumWords = normalizedAlbumTitle.split(' ');
    const commonWords = titleWords.filter(word => 
      word.length > 2 && albumWords.includes(word)
    );

    if (commonWords.length >= 2) {
      updated.album = album.title;
      updated.albumId = createSlug(album.title);
      secondPassStats.partialMatches++;
      stats.linkedToAlbum++;
      break;
    }
  }

  return updated;
});

// Final statistics
console.log('\n📊 Processing complete!');
console.log(`✅ Total lyrics processed: ${stats.totalLyrics}`);
console.log(`🔗 Linked to albums: ${stats.linkedToAlbum}`);
console.log(`👤 Added artist IDs: ${stats.addedArtistId}`);
console.log(`💿 Added album IDs: ${stats.addedAlbumId}`);
console.log(`📝 Updated album titles: ${stats.updatedAlbumTitle}`);
console.log(`🔍 Partial matches (second pass): ${secondPassStats.partialMatches}`);

// Show unlinked songs for review
const unlinkedSongs = finalLyrics.filter(lyric => !lyric.album || lyric.album === '');
if (unlinkedSongs.length > 0) {
  console.log(`\n⚠️  ${unlinkedSongs.length} songs still without album links:`);
  unlinkedSongs.slice(0, 10).forEach(song => {
    console.log(`   - "${song.title}" by ${song.artist}`);
  });
  if (unlinkedSongs.length > 10) {
    console.log(`   ... and ${unlinkedSongs.length - 10} more`);
  }
}

// Backup original file
const backupPath = lyricsPath + '.backup.' + Date.now();
fs.writeFileSync(backupPath, fs.readFileSync(lyricsPath));
console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

// Write updated lyrics
fs.writeFileSync(lyricsPath, JSON.stringify(finalLyrics, null, 2));
console.log(`✅ Updated lyrics saved to ${path.basename(lyricsPath)}`);

// Generate summary report
const reportPath = path.join(__dirname, '..', 'lyrics-links-report.json');
const report = {
  timestamp: new Date().toISOString(),
  stats: {
    ...stats,
    partialMatches: secondPassStats.partialMatches
  },
  unlinkedSongs: unlinkedSongs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist
  })),
  albumMappings: Object.keys(albumTitleToSlug).map(key => ({
    normalized: key,
    ...albumTitleToSlug[key]
  }))
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📋 Report saved to ${path.basename(reportPath)}`);

console.log('\n🎉 Lyrics linking process complete!');
