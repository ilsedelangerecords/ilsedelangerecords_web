import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the albums.json file
const albumsPath = path.join(__dirname, '../public/content/albums.json');
const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));

// Fix coverImage paths to start with /
const fixedAlbums = albums.map(album => {
  if (album.coverImage && !album.coverImage.startsWith('/')) {
    album.coverImage = '/' + album.coverImage;
  }
  return album;
});

// Write back to file
fs.writeFileSync(albumsPath, JSON.stringify(fixedAlbums, null, 2));

console.log(`Fixed image paths for ${fixedAlbums.length} albums`);
