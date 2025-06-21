#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose');

console.log('🚀 Starting import pipeline...');
console.log(`Dry run: ${isDryRun}, Verbose: ${isVerbose}`);

class ImportPipeline {
  constructor() {
    this.stats = {
      artists: 0,
      labels: 0,
      releases: 0,
      songs: 0,
      lyrics: 0,
      tracks: 0,
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

  generateSlug(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\\s-]/g, '') // Remove special characters
      .replace(/\\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  async parseSourceData() {
    this.log('Parsing source data...');
    
    const dataDir = path.join(__dirname, '../../public/content');
    
    // For now, let's create some basic test data
    const testData = {
      albums: [
        {
          title: 'World of Hurt',
          artist: 'Ilse DeLange',
          label: 'Warner Music',
          releaseDate: '1998-08-20',
          type: 'album',
          tracks: [
            { title: 'I\'m Not So Tough', duration: '4:12' },
            { title: 'World of Hurt', duration: '3:45' }
          ]
        }
      ],
      lyrics: [
        {
          title: 'I\'m Not So Tough',
          content: 'Sample lyrics content here...',
          language: 'en'
        }
      ],
      artists: [
        {
          name: 'Ilse DeLange',
          bio: 'Dutch country and pop singer'
        }
      ]
    };
    
    this.log('Using test data for now');
    return testData;
  }

  async getOrCreateArtist(name, data = {}) {
    if (this.dryRun) {
      this.log(`[DRY RUN] Would create/get artist: ${name}`);
      return { id: uuidv4(), name, slug: this.generateSlug(name) };
    }

    const existing = await prisma.artist.findFirst({
      where: { 
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: this.generateSlug(name) }
        ]
      }
    });

    if (existing) {
      this.log(`Found existing artist: ${existing.name}`, 'verbose');
      return existing;
    }

    const artistData = {
      id: uuidv4(),
      name: name.trim(),
      slug: this.generateSlug(name),
      bio: data.bio || null,
      website: data.website || null,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null
    };

    const artist = await prisma.artist.create({ data: artistData });
    this.log(`Created artist: ${artist.name}`, 'verbose');
    return artist;
  }

  async getOrCreateLabel(name) {
    if (this.dryRun) {
      this.log(`[DRY RUN] Would create/get label: ${name}`);
      return { id: uuidv4(), name, slug: this.generateSlug(name) };
    }

    const existing = await prisma.label.findFirst({
      where: { 
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: this.generateSlug(name) }
        ]
      }
    });

    if (existing) {
      this.log(`Found existing label: ${existing.name}`, 'verbose');
      return existing;
    }

    const labelData = {
      id: uuidv4(),
      name: name.trim(),
      slug: this.generateSlug(name)
    };

    const label = await prisma.label.create({ data: labelData });
    this.log(`Created label: ${label.name}`, 'verbose');
    return label;
  }

  async importArtists(sourceData) {
    this.log('Importing artists...');
    
    const uniqueArtists = new Set();
    
    // Extract unique artist names from albums
    sourceData.albums.forEach(album => {
      if (album.artist) uniqueArtists.add(album.artist);
    });
    
    // Add from existing artists data
    sourceData.artists.forEach(artist => {
      uniqueArtists.add(artist.name);
    });
    
    const artistsData = Array.from(uniqueArtists).map(name => ({
      name,
      bio: sourceData.artists.find(a => a.name === name)?.bio
    }));
    
    if (!this.dryRun) {
      for (const artistData of artistsData) {
        await this.getOrCreateArtist(artistData.name, artistData);
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
    
    if (!this.dryRun) {
      for (const labelName of uniqueLabels) {
        await this.getOrCreateLabel(labelName);
        this.stats.labels++;
      }
    } else {
      this.stats.labels = uniqueLabels.size;
    }
    
    this.log(`Imported ${this.stats.labels} labels`);
  }

  async run() {
    try {
      this.log('🚀 Starting import pipeline...');
      
      if (this.dryRun) {
        this.log('🔍 DRY RUN MODE - No changes will be made to the database');
      }
      
      // Connect to database
      if (!this.dryRun) {
        await prisma.$connect();
        this.log('Connected to database');
      }
      
      // Parse source data
      const sourceData = await this.parseSourceData();
      
      // Import in order of dependencies
      await this.importArtists(sourceData);
      await this.importLabels(sourceData);
      
      // Print final statistics
      this.log('\\n📊 Import Statistics:');
      this.log(`Artists: ${this.stats.artists}`);
      this.log(`Labels: ${this.stats.labels}`);
      
      this.log('✅ Import pipeline completed successfully!');
      
    } catch (error) {
      this.log(`❌ Import failed: ${error.message}`);
      console.error(error);
      throw error;
    } finally {
      if (!this.dryRun) {
        await prisma.$disconnect();
      }
    }
  }
}

// Run the pipeline
if (import.meta.url === `file://${process.argv[1]}`) {
  const pipeline = new ImportPipeline();
  pipeline.run().catch(error => {
    console.error('Pipeline failed:', error);
    process.exit(1);
  });
}

export default ImportPipeline;
