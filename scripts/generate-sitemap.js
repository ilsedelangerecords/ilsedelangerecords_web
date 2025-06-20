import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the albums data
const albumsPath = path.join(__dirname, '../public/content/albums.json');
const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));

// Helper function to create slug
function createSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Generate sitemap
function generateSitemap() {
  const baseUrl = 'https://ilsedelangerecords.com';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/albums</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Add album pages
  albums.forEach(album => {
    const slug = createSlug(album.title);
    sitemap += `
  <url>
    <loc>${baseUrl}/album/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Save sitemap to dist directory
const distDir = path.join(__dirname, '../dist');
const sitemapContent = generateSitemap();

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
console.log(`✓ Generated sitemap.xml with ${albums.length + 2} URLs`);

// Also generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://ilsedelangerecords.com/sitemap.xml`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
console.log('✓ Generated robots.txt');

export { generateSitemap };
