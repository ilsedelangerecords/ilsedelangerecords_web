import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.DEV_SERVER_PORT || 3001;
const VITE_PORT = process.env.VITE_PORT || 5173;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma client
const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// API Routes

// Artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        _count: {
          select: { releases: true }
        }
      }
    });
    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

app.get('/api/artists/:id', async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.params.id },
      include: {
        releases: {
          include: {
            editions: {
              include: {
                tracks: {
                  include: {
                    song: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

app.post('/api/artists', async (req, res) => {
  try {
    const { name, bio, website, socialLinks } = req.body;
    const artist = await prisma.artist.create({
      data: {
        id: uuidv4(),
        name,
        slug: generateSlug(name),
        bio: bio || null,
        website: website || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null
      }
    });
    res.status(201).json(artist);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

app.put('/api/artists/:id', async (req, res) => {
  try {
    const { name, bio, website, socialLinks } = req.body;
    const artist = await prisma.artist.update({
      where: { id: req.params.id },
      data: {
        name,
        slug: generateSlug(name),
        bio: bio || null,
        website: website || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null
      }
    });
    res.json(artist);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ error: 'Failed to update artist' });
  }
});

app.delete('/api/artists/:id', async (req, res) => {
  try {
    await prisma.artist.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
});

// Labels
app.get('/api/labels', async (req, res) => {
  try {
    const labels = await prisma.label.findMany({
      include: {
        _count: {
          select: { releases: true }
        }
      }
    });
    res.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

app.post('/api/labels', async (req, res) => {
  try {
    const { name } = req.body;
    const label = await prisma.label.create({
      data: {
        id: uuidv4(),
        name,
        slug: generateSlug(name)
      }
    });
    res.status(201).json(label);
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// Releases
app.get('/api/releases', async (req, res) => {
  try {
    const releases = await prisma.release.findMany({
      include: {
        primaryArtist: true,
        label: true,
        editions: {
          include: {
            tracks: {
              include: { song: true }
            }
          }
        }
      }
    });
    res.json(releases);
  } catch (error) {
    console.error('Error fetching releases:', error);
    res.status(500).json({ error: 'Failed to fetch releases' });
  }
});

app.get('/api/releases/:id', async (req, res) => {
  try {
    const release = await prisma.release.findUnique({
      where: { id: req.params.id },
      include: {
        primaryArtist: true,
        label: true,
        editions: {
          include: {
            tracks: {
              include: { song: true }
            }
          }
        }
      }
    });
    if (!release) {
      return res.status(404).json({ error: 'Release not found' });
    }
    res.json(release);
  } catch (error) {
    console.error('Error fetching release:', error);
    res.status(500).json({ error: 'Failed to fetch release' });
  }
});

app.post('/api/releases', async (req, res) => {
  try {
    const { title, artistId, labelId, releaseDate, releaseType, description } = req.body;
    const release = await prisma.release.create({
      data: {
        id: uuidv4(),
        title,
        slug: generateSlug(title),
        artistId,
        labelId,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        releaseType: releaseType || 'ALBUM',
        description: description || null
      },
      include: {
        artist: true,
        label: true
      }
    });
    res.status(201).json(release);
  } catch (error) {
    console.error('Error creating release:', error);
    res.status(500).json({ error: 'Failed to create release' });
  }
});

// Songs and Lyrics
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      include: {
        lyrics: true,
        tracks: {
          include: {
            edition: {
              include: { release: { include: { primaryArtist: true } } }
            }
          }
        }
      }
    });
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

app.get('/api/songs/:id', async (req, res) => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: req.params.id },
      include: {
        lyrics: true,
        tracks: {
          include: {
            edition: {
              include: { release: { include: { primaryArtist: true } } }
            }
          }
        }
      }
    });
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

app.post('/api/songs', async (req, res) => {
  try {
    const { title, duration, writers, composedDate } = req.body;
    const song = await prisma.song.create({
      data: {
        id: uuidv4(),
        title,
        slug: generateSlug(title),
        duration: duration || null,
        writers: writers ? JSON.stringify(writers) : null,
        composedDate: composedDate ? new Date(composedDate) : null
      }
    });
    res.status(201).json(song);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

app.put('/api/songs/:id/lyrics', async (req, res) => {
  try {
    const { content, language, translation } = req.body;
    const lyrics = await prisma.lyrics.upsert({
      where: { songId: req.params.id },
      update: {
        content,
        language: language || 'en',
        translation: translation || null
      },
      create: {
        id: uuidv4(),
        songId: req.params.id,
        content,
        language: language || 'en',
        translation: translation || null
      }
    });
    res.json(lyrics);
  } catch (error) {
    console.error('Error updating lyrics:', error);
    res.status(500).json({ error: 'Failed to update lyrics' });
  }
});

// Export current data to JSON
app.post('/api/export', async (req, res) => {
  try {
    const { spawn } = await import('child_process');
    const exportProcess = spawn('node', ['scripts/export-to-json.js'], {
      cwd: join(__dirname, '..'),
      stdio: 'pipe'
    });

    let output = '';
    let error = '';

    exportProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    exportProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    exportProcess.on('close', (code) => {
      if (code === 0) {
        res.json({ success: true, output });
      } else {
        res.status(500).json({ error: 'Export failed', details: error });
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
async function startServer() {
  try {
    // Ensure database is connected
    await prisma.$connect();
    console.log('Connected to database');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Dev API server running on port ${PORT}`);
    });

    // Start Vite dev server
    const viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_DEV_MODE: 'true',
        VITE_API_URL: `http://localhost:${PORT}/api`
      }
    });

    viteProcess.on('error', (error) => {
      console.error('Failed to start Vite server:', error);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await prisma.$disconnect();
      viteProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start dev server:', error);
    process.exit(1);
  }
}

startServer();
