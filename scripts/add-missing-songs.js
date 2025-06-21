#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_SOURCE_PATH = path.join(__dirname, '../migration_scripts/migration_data/old_website_clone');
const OUTPUT_LYRICS_PATH = path.join(__dirname, '../public/content/lyrics.json');

// Additional missing songs with their correct filenames
const ADDITIONAL_SONGS = {
  "The Common Linnets": [
    { title: "We dont make the wind blow", filename: "We don't make the wind blow.html" }
  ],
  "Ilse DeLange": [
    { title: "All of the women you'll ever need", filename: "All of the woman you'll ever need.html" },
    { title: "Better then rain", filename: "Better than rain.html" },
    { title: "Blue bitttersweet", filename: "Blue bittersweet.html" },
    { title: "Clean up", filename: "Clean up lyric.html" },
    { title: "Sun &shadow", filename: "Sun & shadow lyricks.html" }
  ]
};

// Filter patterns (same as before)
const FILTER_PATTERNS = [
  /^live$/i,
  /^other artist$/i,
  /^various artist$/i,
  /^items$/i,
  /^tcl other$/i,
  /^tcl various$/i,
  /^world of hurt$/i,
  /^livin['\s]*on love$/i,
  /^clean up$/i,
  /^here i am$/i,
  /^the great escape$/i,
  /^incredible$/i,
  /^next to me$/i,
  /^ilse delange$/i,
  /^eye of the hurricane$/i,
  /^miracle$/i,
  /^afther the hurricane$/i,
  /^ilse delange 2018$/i,
  /^2in1$/i,
  /^i['\s]*m not so though$/i,
  /^i['\s]*d be yours$/i,
  /^when we don['\s]*t talk$/i,
  /^flying blind$/i,
  /^i still cry$/i,
  /^no reason to be shy$/i,
  /^wouldn['\s]*t that be something$/i,
  /^all the answers$/i,
  /^the lonely one$/i,
  /^reach for the light$/i,
  /^i love you$/i,
  /^snow tonight$/i,
  /^so incredible$/i,
  /^puzzle me$/i,
  /^we['\s]*re alright$/i,
  /^beautiful distraction$/i,
  /^carousel$/i,
  /^almost$/i,
  /^doluv2luvu$/i,
  /^hurricane$/i,
  /^winter of love$/i,
  /^we are one$/i,
  /^dance on the heartbreak$/i,
  /^learning to swim$/i,
  /^blue bittersweet$/i,
  /^when it['\s]*s you$/i,
  /^dear john$/i,
  /^live \(in amsterdam\)$/i,
  /^live in ahoy$/i,
  /^live in gelredome$/i,
  /^information$/i,
  /^disclaimer$/i,
  /^help wanted$/i,
  /^wanted$/i
];

/**
 * Extract clean lyrics content from HTML
 */
function extractLyricsFromHTML(htmlContent, title) {
  if (!htmlContent) return '';
  
  // Remove script and style tags
  let content = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<!--.*?-->/gs, '');
  
  // Remove HTML tags but preserve line breaks
  content = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
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
  
  const lyricsLines = [];
  let foundTitle = false;
  let skipNextLines = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    if (skipNextLines > 0) {
      skipNextLines--;
      continue;
    }
    
    // Skip navigation and metadata
    if (lineLower.includes('home') ||
        lineLower.includes('album') ||
        lineLower.includes('singles') ||
        lineLower.includes('facebook') ||
        lineLower.includes('javascript') ||
        lineLower.includes('setmenus') ||
        lineLower.includes('setrollovers') ||
        lineLower.includes('activebutton') ||
        lineLower.includes('nav_') ||
        lineLower.includes('wpscripts') ||
        lineLower.includes('wpimages') ||
        lineLower.includes('www.ilsedelangerecords') ||
        line.length < 3) {
      continue;
    }
    
    // Check against filter patterns
    let shouldFilter = false;
    for (const pattern of FILTER_PATTERNS) {
      if (pattern.test(line)) {
        shouldFilter = true;
        break;
      }
    }
    if (shouldFilter) continue;
    
    // Look for title occurrence
    if (!foundTitle && (lineLower.includes(title.toLowerCase()) || i > 20)) {
      foundTitle = true;
      if (lineLower.includes(title.toLowerCase())) {
        skipNextLines = 2;
        continue;
      }
    }
    
    // Start collecting lyrics after title found
    if (foundTitle) {
      // Skip obvious non-lyrics patterns
      if (line.match(/^[A-Z\s]{3,}$/) || // All caps headers
          lineLower.includes('lyrics') && line.length < 20 ||
          line.match(/^\d+$/) || // Just numbers
          line.match(/^[A-Z]{2,4}$/) // Acronyms like TCL
         ) {
        continue;
      }
      
      lyricsLines.push(line);
    }
  }
  
  // Additional cleanup: remove trailing navigation/metadata
  while (lyricsLines.length > 0) {
    const lastLine = lyricsLines[lyricsLines.length - 1];
    let shouldRemove = false;
    
    for (const pattern of FILTER_PATTERNS) {
      if (pattern.test(lastLine)) {
        shouldRemove = true;
        break;
      }
    }
    
    if (shouldRemove) {
      lyricsLines.pop();
    } else {
      break;
    }
  }
  
  return lyricsLines.join('\n').trim();
}

/**
 * Process additional missing songs
 */
function processAdditionalSongs() {
  console.log('🎵 Processing additional missing songs...\n');
  
  const additionalLyrics = [];
  let foundCount = 0;
  let totalCount = 0;
  
  for (const [artist, songs] of Object.entries(ADDITIONAL_SONGS)) {
    console.log(`\n📀 Processing additional ${artist} songs...`);
    
    for (const { title, filename } of songs) {
      totalCount++;
      const filePath = path.join(MIGRATION_SOURCE_PATH, filename);
      
      if (fs.existsSync(filePath)) {
        console.log(`Found: ${filename} for "${title}"`);
        
        try {
          const htmlContent = fs.readFileSync(filePath, 'utf8');
          const lyrics = extractLyricsFromHTML(htmlContent, title);
          
          if (lyrics && lyrics.length > 50) {
            additionalLyrics.push({
              id: title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-'),
              title: title,
              artist: artist,
              album: "",
              content: lyrics,
              language: /[àáâãäåçèéêëìíîïñòóôõöùúûüý]/i.test(lyrics) || 
                      /\b(de|het|een|en|van|voor|naar|met|op|in|aan|door|over|onder|tussen|bij|na|zonder|tegen)\b/i.test(lyrics) ? "nl" : "en",
              verified: false,
              source: "migration"
            });
            foundCount++;
          }
        } catch (error) {
          console.error(`Error reading ${filePath}:`, error.message);
        }
      } else {
        console.warn(`⚠️  File not found: ${filename}`);
      }
    }
  }
  
  // Read existing lyrics and merge
  const existingLyrics = JSON.parse(fs.readFileSync(OUTPUT_LYRICS_PATH, 'utf8'));
  const allLyrics = [...existingLyrics, ...additionalLyrics];
  
  // Sort by artist and title
  allLyrics.sort((a, b) => {
    if (a.artist !== b.artist) {
      return a.artist.localeCompare(b.artist);
    }
    return a.title.localeCompare(b.title);
  });
  
  // Write the updated file
  try {
    fs.writeFileSync(OUTPUT_LYRICS_PATH, JSON.stringify(allLyrics, null, 2));
    console.log(`\n✅ Successfully added ${foundCount}/${totalCount} additional songs`);
    console.log(`📁 Updated output written to: ${OUTPUT_LYRICS_PATH}`);
    
    console.log('\n📊 Final Summary:');
    console.log(`   Total songs now: ${allLyrics.length}`);
    
    const tcl = allLyrics.filter(l => l.artist === 'The Common Linnets').length;
    const ilse = allLyrics.filter(l => l.artist === 'Ilse DeLange').length;
    console.log(`   The Common Linnets: ${tcl} songs`);
    console.log(`   Ilse DeLange: ${ilse} songs`);
    
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    process.exit(1);
  }
}

// Run the additional migration
processAdditionalSongs();
