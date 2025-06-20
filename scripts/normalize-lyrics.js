#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LYRICS_PATH = path.join(__dirname, '../public/content/lyrics.json');

function normalizeLyricsData() {
  console.log('Normalizing lyrics data...');
  
  if (!fs.existsSync(LYRICS_PATH)) {
    console.error('Lyrics file not found:', LYRICS_PATH);
    return;
  }
  
  const lyrics = JSON.parse(fs.readFileSync(LYRICS_PATH, 'utf8'));
  
  let changesCount = 0;
  
  lyrics.forEach(lyric => {
    // Normalize language codes
    if (lyric.language === 'English') {
      lyric.language = 'en';
      changesCount++;
    } else if (lyric.language === 'Dutch') {
      lyric.language = 'nl';
      changesCount++;
    }
    
    // Ensure all lyrics have required fields
    if (!lyric.id && lyric.title) {
      lyric.id = lyric.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Set default values for missing fields
    if (!lyric.verified) lyric.verified = false;
    if (!lyric.album) lyric.album = '';
    if (!lyric.artist) lyric.artist = 'Ilse DeLange';
  });
  
  // Sort by title
  lyrics.sort((a, b) => {
    const titleA = a.title?.toLowerCase() || '';
    const titleB = b.title?.toLowerCase() || '';
    return titleA.localeCompare(titleB);
  });
  
  // Write back to file
  fs.writeFileSync(LYRICS_PATH, JSON.stringify(lyrics, null, 2), 'utf8');
  
  console.log(`✅ Normalized ${changesCount} entries`);
  console.log(`Total lyrics: ${lyrics.length}`);
  
  // Print summary
  const artistCounts = {};
  const languageCounts = {};
  
  lyrics.forEach(lyric => {
    artistCounts[lyric.artist] = (artistCounts[lyric.artist] || 0) + 1;
    languageCounts[lyric.language] = (languageCounts[lyric.language] || 0) + 1;
  });
  
  console.log('\nSummary by artist:');
  Object.entries(artistCounts).forEach(([artist, count]) => {
    console.log(`  ${artist}: ${count} songs`);
  });
  
  console.log('\nSummary by language:');
  Object.entries(languageCounts).forEach(([lang, count]) => {
    console.log(`  ${lang}: ${count} songs`);
  });
}

normalizeLyricsData();
