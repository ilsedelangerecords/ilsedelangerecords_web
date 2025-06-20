#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_LYRICS_PATH = path.join(__dirname, '../migration_data/extracted_content/lyrics.json');
const CURRENT_LYRICS_PATH = path.join(__dirname, '../public/content/lyrics.json');
const OUTPUT_LYRICS_PATH = path.join(__dirname, '../public/content/lyrics.json');

/**
 * Extract lyrics content from HTML
 */
function extractLyricsContent(htmlContent) {
  if (!htmlContent) return '';
  
  // Remove HTML tags and extract text content
  let content = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<[^>]*>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Split into lines and clean up
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // Find the actual lyrics content by looking for patterns
  let lyricsStart = -1;
  let titleFound = false;
  const lyricsLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Skip obvious navigation and metadata
    if (lineLower.includes('home') || 
        lineLower.includes('album') || 
        lineLower.includes('singles') ||
        lineLower.includes('facebook') ||
        lineLower.includes('disclaimer') ||
        lineLower.includes('help wanted') ||
        lineLower.includes('wanted') ||
        lineLower.includes('information') ||
        lineLower.includes('wpscripts') ||
        lineLower.includes('javascript') ||
        lineLower.includes('nav_') ||
        lineLower.includes('activebutton') ||
        lineLower.includes('setrollovers') ||
        lineLower.includes('setmenus') ||
        lineLower.includes('jquery') ||
        lineLower.includes('wpimages') ||
        lineLower.includes('background-') ||
        lineLower.includes('font-') ||
        lineLower.includes('color:') ||
        lineLower.includes('position:') ||
        lineLower.includes('display:') ||
        lineLower.includes('margin:') ||
        lineLower.includes('padding:') ||
        line.match(/^[A-Z][a-z]+\s[a-z]+$/) || // Skip album names like "World of hurt"
        line.match(/^[A-Z]{2,}/) || // Skip acronyms like "TCL"
        line.length < 3) {
      continue;
    }
    
    // Look for song title (first meaningful content)
    if (!titleFound && line.length > 5 && line.length < 100) {
      titleFound = true;
      continue; // Skip the title line
    }
    
    // Start collecting lyrics after title
    if (titleFound) {
      // Skip common non-lyrics patterns
      if (lineLower.includes('lyrics') && line.length < 20) continue;
      if (line.match(/^[A-Z\s]{3,}$/)) continue; // Skip all caps sections
      
      lyricsLines.push(line);
    }
  }
  
  return lyricsLines.join('\n').trim();
}

/**
 * Parse lyrics structure and extract clean content
 */
function parseLyricsStructure(content) {
  if (!content) return { content: '', album: '' };
  
  const lines = content.split('\n').filter(line => line.trim());
  const cleanLines = [];
  let title = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and potential website artifacts
    if (!line || 
        line.toLowerCase().includes('wpscripts') ||
        line.toLowerCase().includes('javascript') ||
        line.startsWith('nav_') ||
        line.length < 3) {
      continue;
    }
    
    // First meaningful line might be the title
    if (!title && line.length > 5 && line.length < 50) {
      title = line;
      continue;
    }
    
    // Add to clean lyrics content
    cleanLines.push(line);
  }
  
  return {
    content: cleanLines.join('\n').trim(),
    album: ''
  };
}
function extractSongTitle(item) {
  if (item.title) {
    // Remove common suffixes and website name
    let title = item.title
      .replace(/\s*-\s*www\.ilsedelangerecords\.nl/gi, '')
      .replace(/\s*lyrics$/gi, '')
      .replace(/\s*-\s*lyrics$/gi, '')
      .trim();
    
    return title;
  }
  return null;
}

/**
 * Extract artist from title or content analysis
 */
function extractArtist(item, title) {
  // Common patterns: look for "Ilse DeLange", "Common Linnets", "TCL"
  const content = item.content?.toLowerCase() || '';
  const titleLower = title?.toLowerCase() || '';
  
  // Check for Common Linnets indicators
  if (content.includes('tcl') || content.includes('common linnets') || 
      titleLower.includes('tcl') || content.includes('calm after the storm')) {
    return 'The Common Linnets';
  }
  
  // Default to Ilse DeLange for most content
  return 'Ilse DeLange';
}

/**
 * Extract language from content analysis
 */
function extractLanguage(content) {
  if (!content) return 'en';
  
  // Simple heuristic: check for Dutch words
  const dutchWords = ['en', 'het', 'de', 'van', 'een', 'is', 'zijn', 'was', 'waren', 'dat', 'als', 'maar', 'voor', 'niet', 'met', 'op', 'hij', 'zij', 'haar', 'hem'];
  const englishWords = ['the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they', 'have', 'this', 'will', 'can', 'had', 'her', 'what', 'said', 'there', 'each'];
  
  const words = content.toLowerCase().split(/\s+/).slice(0, 50); // Check first 50 words
  
  let dutchCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (dutchWords.includes(word)) dutchCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  return dutchCount > englishCount ? 'nl' : 'en';
}

/**
 * Process migration lyrics and create clean format
 */
function processMigrationLyrics() {
  console.log('Reading migration lyrics data...');
  
  if (!fs.existsSync(MIGRATION_LYRICS_PATH)) {
    console.error('Migration lyrics file not found:', MIGRATION_LYRICS_PATH);
    return [];
  }
  
  const migrationData = JSON.parse(fs.readFileSync(MIGRATION_LYRICS_PATH, 'utf8'));
  const processedLyrics = [];
  
  console.log(`Processing ${migrationData.length} migration entries...`);
  
  migrationData.forEach((item, index) => {
    try {
      const songTitle = extractSongTitle(item);
      
      if (!songTitle || !item.content) {
        console.log(`Skipping item ${index + 1}: No title or content`);
        return;
      }
      
      // Extract lyrics content from HTML
      const cleanedContent = extractLyricsContent(item.content);
      const structuredContent = parseLyricsStructure(cleanedContent);
      
      if (!structuredContent.content || structuredContent.content.length < 50) {
        console.log(`Skipping "${songTitle}": Content too short or empty`);
        return;
      }
      
      const artist = extractArtist(item, songTitle);
      const language = extractLanguage(structuredContent.content);
      
      // Create unique ID
      const id = songTitle.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const lyricEntry = {
        id,
        title: songTitle,
        artist,
        album: structuredContent.album || '',
        content: structuredContent.content,
        language,
        verified: false,
        source: 'migration'
      };
      
      processedLyrics.push(lyricEntry);
      console.log(`✓ Processed: "${songTitle}" by ${artist} (${language})`);
      
    } catch (error) {
      console.error(`Error processing item ${index + 1}:`, error.message);
    }
  });
  
  return processedLyrics;
}

/**
 * Load current lyrics data
 */
function loadCurrentLyrics() {
  console.log('Loading current lyrics data...');
  
  if (!fs.existsSync(CURRENT_LYRICS_PATH)) {
    console.log('No current lyrics file found, starting fresh');
    return [];
  }
  
  try {
    const currentData = JSON.parse(fs.readFileSync(CURRENT_LYRICS_PATH, 'utf8'));
    console.log(`Loaded ${currentData.length} existing lyrics`);
    return currentData;
  } catch (error) {
    console.error('Error loading current lyrics:', error.message);
    return [];
  }
}

/**
 * Merge lyrics collections, avoiding duplicates
 */
function mergeLyrics(currentLyrics, migrationLyrics) {
  console.log('Merging lyrics collections...');
  
  const merged = [...currentLyrics];
  const existingTitles = new Set(
    currentLyrics.map(lyric => 
      `${lyric.title?.toLowerCase()}-${lyric.artist?.toLowerCase()}`
    )
  );
  
  let addedCount = 0;
  
  migrationLyrics.forEach(migrationLyric => {
    const key = `${migrationLyric.title.toLowerCase()}-${migrationLyric.artist.toLowerCase()}`;
    
    if (!existingTitles.has(key)) {
      merged.push(migrationLyric);
      existingTitles.add(key);
      addedCount++;
    } else {
      console.log(`Skipping duplicate: "${migrationLyric.title}" by ${migrationLyric.artist}`);
    }
  });
  
  console.log(`Added ${addedCount} new lyrics entries`);
  return merged;
}

/**
 * Sort lyrics alphabetically by title
 */
function sortLyrics(lyrics) {
  return lyrics.sort((a, b) => {
    const titleA = a.title?.toLowerCase() || '';
    const titleB = b.title?.toLowerCase() || '';
    return titleA.localeCompare(titleB);
  });
}

/**
 * Main execution
 */
function main() {
  console.log('Starting lyrics import process...\n');
  
  try {
    // Process migration data
    const migrationLyrics = processMigrationLyrics();
    console.log(`\nProcessed ${migrationLyrics.length} lyrics from migration data\n`);
    
    // Load current lyrics
    const currentLyrics = loadCurrentLyrics();
    
    // Merge collections
    const mergedLyrics = mergeLyrics(currentLyrics, migrationLyrics);
    
    // Sort the final collection
    const sortedLyrics = sortLyrics(mergedLyrics);
    
    // Write to output file
    console.log(`Writing ${sortedLyrics.length} total lyrics to ${OUTPUT_LYRICS_PATH}...`);
    
    // Ensure directory exists
    const outputDir = path.dirname(OUTPUT_LYRICS_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_LYRICS_PATH, JSON.stringify(sortedLyrics, null, 2), 'utf8');
    
    console.log('\n✅ Lyrics import completed successfully!');
    console.log(`Total lyrics in collection: ${sortedLyrics.length}`);
    
    // Print summary statistics
    const artistCounts = {};
    const languageCounts = {};
    
    sortedLyrics.forEach(lyric => {
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
    
  } catch (error) {
    console.error('\n❌ Error during lyrics import:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
