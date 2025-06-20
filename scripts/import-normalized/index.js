#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import db from '../../src/domain/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose');

class ImportPipeline {
  constructor() {
    this.stats = {
      artists: 0,
      labels: 0,
      releases: 0,
      editions: 0,
      songs: 0,
      lyrics: 0,
      tracks: 0,
      chartEntries: 0,
      mediaAssets: 0,
    };
    this.dryRun = isDryRun;
    this.verbose = isVerbose;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = this.dryRun ? '[DRY-RUN] ' : '';
    
    if (level === 'verbose' && !this.verbose) return;
    
    console.log(`${timestamp} ${prefix}${message}`);
  }

  async parseSourceData() {
    this.log('Parsing source data...');
    
    const dataDir = path.join(__dirname, '../../public/content');
    const migrationDir = path.join(__dirname, '../../migration_data/extracted_content');
    
    // Parse albums
    const albums = this.parseAlbums(path.join(dataDir, 'albums.json'));
    
    // Parse lyrics
    const lyrics = this.parseLyrics(path.join(dataDir, 'lyrics.json'));
    const migrationLyrics = this.parseMigrationLyrics(path.join(migrationDir, 'lyrics.json'));
    
    // Parse artists
    const artists = this.parseArtists(path.join(dataDir, 'artists.json'));
    
    return {
      albums,
      lyrics: [...lyrics, ...migrationLyrics],
      artists,
    };
  }

  parseAlbums(filePath) {
    if (!fs.existsSync(filePath)) {
      this.log(`Albums file not found: ${filePath}`, 'verbose');
      return [];
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.log(`Parsed ${data.length} albums from ${filePath}`, 'verbose');
    return data;
  }

  parseLyrics(filePath) {
    if (!fs.existsSync(filePath)) {
      this.log(`Lyrics file not found: ${filePath}`, 'verbose');
      return [];
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.log(`Parsed ${data.length} lyrics from ${filePath}`, 'verbose');
    return data;
  }

  parseMigrationLyrics(filePath) {
    if (!fs.existsSync(filePath)) {
      this.log(`Migration lyrics file not found: ${filePath}`, 'verbose');
      return [];
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const processed = data.map(item => ({
      title: this.extractTitleFromMigration(item.title || ''),
      artist: 'Ilse DeLange', // Default, can be refined
      content: this.cleanMigrationContent(item.content || ''),
      language: 'en',
      source: 'migration',
    })).filter(item => item.title && item.content);
    
    this.log(`Parsed ${processed.length} migration lyrics from ${filePath}`, 'verbose');
    return processed;
  }

  parseArtists(filePath) {
    if (!fs.existsSync(filePath)) {
      this.log(`Artists file not found: ${filePath}`, 'verbose');
      return [];
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    this.log(`Parsed ${data.length} artists from ${filePath}`, 'verbose');
    return data;
  }

  extractTitleFromMigration(title) {
    return title
      .replace(/www\.ilsedelangerecords\.nl\s*-\s*/gi, '')
      .replace(/\s*lyrics?\s*$/gi, '')
      .trim();
  }

  cleanMigrationContent(content) {
    if (!content) return '';
    
    // Remove HTML and extract clean text
    const cleanText = content
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]*>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    const lines = cleanText.split('\n')
      .map(line => line.trim())
      .filter(line => {
        const lower = line.toLowerCase();
        return line.length > 0 && 
               !lower.includes('navigation') &&
               !lower.includes('home') &&
               !lower.includes('album') &&
               !lower.includes('facebook') &&
               !lower.includes('wpscripts') &&
               !lower.startsWith('nav_') &&
               line.length > 3;
      });
    
    return lines.join('\n').trim();
  }

  async importArtists(sourceData) {
    this.log('Importing artists...');
    
    const uniqueArtists = new Set();
    
    // Extract artists from albums
    sourceData.albums.forEach(album => {
      if (album.artist) uniqueArtists.add(album.artist);
    });
    
    // Extract artists from lyrics
    sourceData.lyrics.forEach(lyric => {
      if (lyric.artist) uniqueArtists.add(lyric.artist);
    });
    
    // Add known artists
    uniqueArtists.add('Ilse DeLange');
    uniqueArtists.add('The Common Linnets');
    
    const artistsData = Array.from(uniqueArtists).map(name => ({
      name,
      country: name === 'Ilse DeLange' || name === 'The Common Linnets' ? 'Netherlands' : undefined,
    }));
    
    if (!this.dryRun) {
      for (const artistData of artistsData) {
        await db.getOrCreateArtist(artistData.name, artistData);
        this.stats.artists++;
      }
    } else {
      this.stats.artists = artistsData.length;
    }
    
    this.log(`Imported ${this.stats.artists} artists`);
  }

  async importLabels(sourceData) {
    this.log('Importing labels...');
    
    const uniqueLabels = new Set();
    
    sourceData.albums.forEach(album => {
      if (album.label) uniqueLabels.add(album.label);
    });
    
    // Add known labels
    uniqueLabels.add('Warner Music');
    uniqueLabels.add('Universal Music');
    
    const labelsData = Array.from(uniqueLabels).map(name => ({
      name,
      country: 'Netherlands', // Default
    }));
    
    if (!this.dryRun) {
      for (const labelData of labelsData) {
        await db.getOrCreateLabel(labelData.name, labelData);
        this.stats.labels++;
      }
    } else {
      this.stats.labels = labelsData.length;
    }
    
    this.log(`Imported ${this.stats.labels} labels`);
  }

  async importSongsAndLyrics(sourceData) {
    this.log('Importing songs and lyrics...');
    
    for (const lyricData of sourceData.lyrics) {
      if (!lyricData.title || !lyricData.content) continue;
      
      const songData = {
        title: lyricData.title,
        language: lyricData.language || 'en',
        writers: lyricData.writers || [],
        isCover: lyricData.isCover || false,
        lyrics: {
          text: lyricData.content,
          language: lyricData.language || 'en',
          sourceUrl: lyricData.sourceUrl,
        },
      };
      
      if (!this.dryRun) {
        await db.createSong(songData);
      }
      
      this.stats.songs++;
      this.stats.lyrics++;
    }
    
    this.log(`Imported ${this.stats.songs} songs with ${this.stats.lyrics} lyrics`);
  }

  async importReleases(sourceData) {
    this.log('Importing releases...');
    
    for (const albumData of sourceData.albums) {
      if (!albumData.title || !albumData.artist) continue;
      
      // Get or create artist
      const artist = this.dryRun ? 
        { id: uuidv4() } : 
        await db.getOrCreateArtist(albumData.artist);
      
      // Get or create label
      const label = albumData.label && !this.dryRun ? 
        await db.getOrCreateLabel(albumData.label) : 
        null;
      
      const releaseData = {
        title: albumData.title,
        releaseType: this.mapReleaseType(albumData.type),
        primaryArtistId: artist.id,
        releaseDate: albumData.releaseDate ? new Date(albumData.releaseDate) : undefined,
        labelId: label?.id,
        description: albumData.description,
      };
      
      if (!this.dryRun) {
        const release = await db.createRelease(releaseData);
        
        // Create default edition
        const edition = await db.createEdition({
          releaseId: release.id,
          format: 'CD',
          region: 'Netherlands',
        });
        
        this.stats.editions++;
        
        // Create tracks if available
        if (albumData.tracks && Array.isArray(albumData.tracks)) {
          for (let i = 0; i < albumData.tracks.length; i++) {
            const trackData = albumData.tracks[i];
            
            // Create or find song
            const song = await db.createSong({
              title: trackData.title || `Track ${i + 1}`,
              language: 'en',
            });
            
            await db.createTrack({
              editionId: edition.id,
              position: i + 1,
              songId: song.id,
              duration: trackData.duration,
              isBonus: trackData.isBonus || false,
            });
            
            this.stats.tracks++;
          }
        }
      }
      
      this.stats.releases++;
    }
    
    this.log(`Imported ${this.stats.releases} releases with ${this.stats.editions} editions and ${this.stats.tracks} tracks`);
  }

  mapReleaseType(type) {
    if (!type) return 'ALBUM';
    
    const typeMap = {
      'album': 'ALBUM',
      'single': 'SINGLE',
      'ep': 'EP',
      'compilation': 'COMPILATION',
      'live': 'LIVE',
      'soundtrack': 'SOUNDTRACK',
    };
    
    return typeMap[type.toLowerCase()] || 'ALBUM';
  }

  async run() {
    this.log('Starting import pipeline...');
    
    try {
      if (!this.dryRun) {
        await db.connect();
        this.log('Connected to database');
      }
      
      // Parse source data
      const sourceData = await this.parseSourceData();
      
      // Import in order of dependencies
      await this.importArtists(sourceData);
      await this.importLabels(sourceData);
      await this.importSongsAndLyrics(sourceData);
      await this.importReleases(sourceData);
      
      // Final statistics
      this.log('Import completed successfully!');
      this.log(`Statistics: ${JSON.stringify(this.stats, null, 2)}`);
      
      if (!this.dryRun) {
        const dbStats = await db.getStatistics();
        this.log(`Database statistics: ${JSON.stringify(dbStats, null, 2)}`);
      }
      
    } catch (error) {
      this.log(`Import failed: ${error.message}`, 'error');
      throw error;
    } finally {
      if (!this.dryRun) {
        await db.disconnect();
        this.log('Disconnected from database');
      }
    }
  }
}

// Run the import if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const pipeline = new ImportPipeline();
  pipeline.run().catch(error => {
    console.error('Import pipeline failed:', error);
    process.exit(1);
  });
}

export default ImportPipeline;
