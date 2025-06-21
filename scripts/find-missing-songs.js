#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_SOURCE_PATH = path.join(__dirname, '../migration_scripts/migration_data/old_website_clone');

// Missing songs from our previous migration
const MISSING_SONGS = [
  "We dont make the wind blow", // The Common Linnets
  "All of the women you'll ever need", // Ilse DeLange  
  "Around again", // Ilse DeLange
  "Better then rain", // Ilse DeLange
  "Blue bitttersweet", // Ilse DeLange
  "Clean up", // Ilse DeLange
  "Engel van m'n hart", // Ilse DeLange
  "Sun &shadow", // Ilse DeLange
  "Tab dancing on the highwire" // Ilse DeLange
];

function findMissingSongs() {
  console.log('🔍 Searching for missing songs with alternative patterns...\n');
  
  // Get all HTML files in the directory
  const allFiles = fs.readdirSync(MIGRATION_SOURCE_PATH)
    .filter(file => file.endsWith('.html'))
    .map(file => file.toLowerCase());
  
  for (const song of MISSING_SONGS) {
    console.log(`\n🎵 Searching for: "${song}"`);
    
    // Generate different search patterns
    const searchPatterns = [
      song.toLowerCase(),
      song.toLowerCase().replace(/[^\w\s]/g, ''),
      song.toLowerCase().replace(/&/g, 'and'),
      song.toLowerCase().replace('dont', "don't"),
      song.toLowerCase().replace('bitttersweet', 'bittersweet'),
      song.toLowerCase().replace('better then', 'better than'),
      song.toLowerCase().replace('women', 'woman'),
      song.toLowerCase().replace('all of the woman', 'all of the women'),
    ];
    
    // Find potential matches
    const matches = [];
    for (const pattern of searchPatterns) {
      const found = allFiles.filter(file => 
        file.includes(pattern) || 
        pattern.split(' ').every(word => file.includes(word))
      );
      matches.push(...found);
    }
    
    // Remove duplicates
    const uniqueMatches = [...new Set(matches)];
    
    if (uniqueMatches.length > 0) {
      console.log(`   Found potential matches:`);
      uniqueMatches.forEach(match => console.log(`     - ${match}`));
    } else {
      console.log(`   ❌ No matches found`);
    }
  }
  
  // Also search for some common alternative patterns
  console.log('\n🔍 Additional searches for common alternatives...');
  
  const alternatives = [
    'we don\'t make the wind blow',
    'we do not make the wind blow', 
    'blue bittersweet',
    'better than rain',
    'all of the woman you\'ll ever need',
    'engel van mijn hart',
    'sun and shadow',
    'tab dancing',
    'clean up lyric'
  ];
  
  for (const alt of alternatives) {
    const matches = allFiles.filter(file => 
      file.includes(alt.toLowerCase()) ||
      alt.toLowerCase().split(' ').every(word => file.includes(word))
    );
    
    if (matches.length > 0) {
      console.log(`\n   "${alt}" → Found:`);
      matches.forEach(match => console.log(`     - ${match}`));
    }
  }
}

findMissingSongs();
