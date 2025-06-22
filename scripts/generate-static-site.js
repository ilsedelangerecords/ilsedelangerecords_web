import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the albums and lyrics data
const albumsPath = path.join(__dirname, '../public/content/albums.json');
const lyricsPath = path.join(__dirname, '../public/content/lyrics.json');
const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf8'));
const lyrics = Array.isArray(lyricsData) ? lyricsData : (lyricsData.lyrics || []);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
const albumsDir = path.join(distDir, 'album');
const lyricsDir = path.join(distDir, 'lyrics');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(albumsDir)) {
  fs.mkdirSync(albumsDir, { recursive: true });
}
if (!fs.existsSync(lyricsDir)) {
  fs.mkdirSync(lyricsDir, { recursive: true });
}

// Helper function to create slug
function createSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Base HTML template
function createHtmlTemplate(title, metaDescription, content, additionalHead = '') {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ilsedelangerecords.com' 
    : 'https://staging.ilsedelangerecords.nl';
    
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Ilse DeLange Records</title>
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${escapeHtml(title)} | Ilse DeLange Records">
    <meta property="og:description" content="${escapeHtml(metaDescription)}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="${baseUrl}${title === 'Albums' ? '/albums' : '/album/' + createSlug(title)}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .line-clamp-2 { 
            display: -webkit-box; 
            -webkit-line-clamp: 2; 
            -webkit-box-orient: vertical; 
            overflow: hidden; 
        }
        .line-clamp-3 { 
            display: -webkit-box; 
            -webkit-line-clamp: 3; 
            -webkit-box-orient: vertical; 
            overflow: hidden; 
        }
    </style>
    ${additionalHead}
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        <a href="/">Ilse DeLange Records</a>
                    </h1>
                </div>
                <nav class="space-x-6">
                    <a href="/albums" class="text-gray-600 hover:text-gray-900">Albums</a>
                    <a href="/artists" class="text-gray-600 hover:text-gray-900">Artists</a>
                    <a href="/lyrics" class="text-gray-600 hover:text-gray-900">Lyrics</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        ${content}
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="text-center text-gray-600">
                <p>&copy; 2025 Ilse DeLange Records. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// Generate albums listing page
function generateAlbumsPage() {
  const albumsGrid = albums.map(album => {
    const slug = createSlug(album.title);
    const trackCount = album.tracks ? (Array.isArray(album.tracks) ? album.tracks.length : 0) : 0;
    
    return `        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                <a href="/album/${slug}" class="block w-full h-full">
                    <img 
                        src="${escapeHtml(album.coverImage || '/images/placeholder.svg')}" 
                        alt="${escapeHtml(album.title)} cover art"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onerror="this.src='/images/placeholder.svg'"
                    />
                </a>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">
                    ${escapeHtml(album.title)}
                </h3>
                <p class="text-sm text-gray-600 mb-2">${escapeHtml(album.artist)}</p>
                
                <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>${escapeHtml(album.year)}</span>
                    <span class="capitalize">${escapeHtml(album.type || 'album')}</span>
                </div>

                ${album.description ? `
                <p class="text-sm text-gray-600 line-clamp-3 mb-3">
                    ${escapeHtml(album.description)}
                </p>
                ` : ''}

                <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span class="flex items-center">
                        🎵 ${trackCount} tracks
                    </span>
                    ${album.duration ? `<span>${escapeHtml(album.duration)}</span>` : ''}
                </div>
                
                <a 
                    href="/album/${slug}" 
                    class="w-full block text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                >
                    View Details
                </a>
            </div>
        </div>`;
  }).join('');

  const content = `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Albums & Singles</h1>
                        <p class="mt-2 text-gray-600">
                            Complete discography with ${albums.length} releases
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${albumsGrid}
            </div>
        </div>
    </div>`;

  return createHtmlTemplate(
    'Albums',
    `Complete discography of Ilse DeLange with ${albums.length} albums and singles`,
    content
  );
}

// Generate individual album pages
function generateAlbumPage(album) {
  const slug = createSlug(album.title);
  const trackCount = album.tracks ? (Array.isArray(album.tracks) ? album.tracks.length : 0) : 0;
  
  // Generate tracks listing
  let tracksHtml = '';
  if (album.tracks && Array.isArray(album.tracks) && album.tracks.length > 0) {
    const tracksList = album.tracks.map((track, index) => {
      const trackTitle = typeof track === 'string' ? track : (track.title || track.name || `Track ${index + 1}`);
      return `
        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div class="flex items-center space-x-4">
                <span class="w-8 text-center text-slate-500 font-medium">${index + 1}</span>
                <div class="flex-1">
                    <h3 class="font-medium text-slate-800">${escapeHtml(trackTitle)}</h3>
                </div>
            </div>
            ${track.duration ? `<span class="text-slate-500 text-sm">${escapeHtml(track.duration)}</span>` : ''}
        </div>`;
    }).join('');

    tracksHtml = `
      <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Track Listing</h2>
        <div class="space-y-2">
          ${tracksList}
        </div>
      </div>`;
  }

  const content = `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <!-- Back Navigation -->
        <a href="/albums" class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
            <span>←</span>
            <span>Back to Albums</span>
        </a>

        <!-- Album Header -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">            <!-- Album Cover -->
            <div class="lg:col-span-1">
                <a href="/albums" class="block aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img 
                        src="${escapeHtml(album.coverImage || '/images/placeholder.svg')}" 
                        alt="${escapeHtml(album.title)} cover art"
                        class="w-full h-full object-cover"
                        onerror="this.src='/images/placeholder.svg'"
                    />
                </a>
            </div>

            <!-- Album Info -->
            <div class="lg:col-span-2 space-y-6">
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            ${escapeHtml(album.type ? album.type.charAt(0).toUpperCase() + album.type.slice(1) : 'Album')}
                        </span>
                        <div class="flex items-center space-x-1 text-slate-500">
                            📅 <span>${escapeHtml(album.year)}</span>
                        </div>
                    </div>

                    <h1 class="text-4xl font-bold text-slate-800">${escapeHtml(album.title)}</h1>
                    
                    <div class="text-2xl text-blue-600 font-semibold">
                        ${escapeHtml(album.artist)}
                    </div>

                    ${album.description ? `
                    <p class="text-lg text-slate-600 leading-relaxed">
                        ${escapeHtml(album.description)}
                    </p>
                    ` : ''}
                </div>

                <!-- Album Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg p-4 border border-slate-200">
                        <div class="flex items-center space-x-2 text-slate-600 mb-1">
                            <span>💿</span>
                            <span class="text-sm">Tracks</span>
                        </div>
                        <span class="text-2xl font-bold text-slate-800">${trackCount}</span>
                    </div>

                    ${album.duration ? `
                    <div class="bg-white rounded-lg p-4 border border-slate-200">
                        <div class="flex items-center space-x-2 text-slate-600 mb-1">
                            <span>⏱️</span>
                            <span class="text-sm">Duration</span>
                        </div>
                        <span class="text-2xl font-bold text-slate-800">${escapeHtml(album.duration)}</span>
                    </div>
                    ` : ''}

                    <div class="bg-white rounded-lg p-4 border border-slate-200">
                        <div class="flex items-center space-x-2 text-slate-600 mb-1">
                            <span>📅</span>
                            <span class="text-sm">Released</span>
                        </div>
                        <span class="text-lg font-bold text-slate-800">${escapeHtml(album.year)}</span>
                    </div>

                    ${album.label ? `
                    <div class="bg-white rounded-lg p-4 border border-slate-200">
                        <div class="flex items-center space-x-2 text-slate-600 mb-1">
                            <span>🏷️</span>
                            <span class="text-sm">Label</span>
                        </div>
                        <span class="text-lg font-bold text-slate-800">${escapeHtml(album.label)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        ${tracksHtml}

        <!-- Album Details -->
        ${album.label || album.catalog ? `
        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <h3 class="text-xl font-bold text-slate-800 mb-4">Album Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${album.label ? `
                <div>
                    <span class="font-medium text-slate-600">Record Label:</span>
                    <p class="text-slate-800">${escapeHtml(album.label)}</p>
                </div>
                ` : ''}
                ${album.catalog ? `
                <div>
                    <span class="font-medium text-slate-600">Catalog Number:</span>
                    <p class="text-slate-800">${escapeHtml(album.catalog)}</p>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
    </div>`;

  return createHtmlTemplate(
    album.title,
    `${album.title} by ${album.artist} (${album.year}) - Album details, tracklist and information`,
    content,
    `<meta property="og:image" content="${album.coverImage || '/images/placeholder.svg'}">`
  );
}

// Generate index page
function generateIndexPage() {
  const content = `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div class="max-w-6xl mx-auto px-4 py-16">
            <div class="text-center">
                <h1 class="text-5xl font-bold text-gray-900 mb-6">
                    Ilse DeLange Records
                </h1>
                <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Complete discography and lyrics collection for Ilse DeLange and The Common Linnets
                </p>
                <div class="space-x-4">
                    <a href="/albums" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                        Browse Albums
                    </a>
                    <a href="/artists" class="bg-white text-purple-600 px-6 py-3 rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors font-medium">
                        View Artists
                    </a>
                </div>
            </div>
            
            <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">🎵</div>
                    <h3 class="text-xl font-semibold mb-2">${albums.length} Albums</h3>
                    <p class="text-gray-600">Complete discography with detailed track listings</p>
                </div>
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">🎤</div>
                    <h3 class="text-xl font-semibold mb-2">Multiple Artists</h3>
                    <p class="text-gray-600">Ilse DeLange solo and The Common Linnets</p>
                </div>
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">📝</div>
                    <h3 class="text-xl font-semibold mb-2">Song Lyrics</h3>
                    <p class="text-gray-600">Full lyrics collection and detailed information</p>
                </div>
            </div>
        </div>
    </div>`;

  return createHtmlTemplate(
    'Home',
    'Ilse DeLange Records - Complete discography and lyrics collection for Ilse DeLange and The Common Linnets',
    content
  );
}

// Generate lyrics listing page
function generateLyricsPage() {
  const lyricsItems = lyrics.map(lyric => {
    const languageFlag = lyric.language === 'en' ? '🇺🇸' : lyric.language === 'nl' ? '🇳🇱' : '🌐';
    const languageName = lyric.language === 'en' ? 'English' : lyric.language === 'nl' ? 'Dutch' : lyric.language;
    
    return `
      <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${escapeHtml(lyric.title)}</h3>
        <div class="text-gray-600 mb-3">
          <p class="flex items-center mb-1">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
            ${escapeHtml(lyric.artist)}
          </p>
          ${lyric.album ? `
            <p class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
              ${escapeHtml(lyric.album)}
            </p>
          ` : ''}
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${languageFlag} ${languageName}
          </span>
          ${lyric.verified ? `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          ` : ''}
        </div>
        <a href="/lyrics/${lyric.id}" class="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center font-medium">
          View Lyrics
        </a>
      </div>
    `;
  }).join('');

  return createHtmlTemplate(
    'Song Lyrics - Ilse DeLange Records',
    'Complete lyrics collection for Ilse DeLange and The Common Linnets with detailed song information',
    `
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">Song Lyrics</h1>
          <p class="mt-2 text-gray-600">Complete lyrics collection with ${lyrics.length} songs</p>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${lyricsItems}
        </div>
      </div>
    `
  );
}

// Generate individual lyrics page
function generateLyricsDetailPage(lyric) {
  const languageFlag = lyric.language === 'en' ? '🇺🇸' : lyric.language === 'nl' ? '🇳🇱' : '🌐';
  const languageName = lyric.language === 'en' ? 'English' : lyric.language === 'nl' ? 'Dutch' : lyric.language;
  
  return createHtmlTemplate(
    `${lyric.title} by ${lyric.artist} - Lyrics`,
    `Full lyrics for "${lyric.title}" by ${lyric.artist}${lyric.album ? ` from the album "${lyric.album}"` : ''}`,
    `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <a href="/lyrics" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Lyrics
        </a>

        <div class="bg-white rounded-xl p-8 shadow-lg border border-slate-200 mb-8">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <span class="text-3xl" title="${languageName}">${languageFlag}</span>
              ${lyric.verified ? `
                <div class="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <span class="text-sm font-medium">✓ Verified</span>
                </div>
              ` : ''}
            </div>
            <h1 class="text-4xl font-bold text-slate-800">${escapeHtml(lyric.title)}</h1>
            <div class="space-y-1">
              ${lyric.artistId ? `
                <a href="/artist/${lyric.artistId}" class="text-xl text-blue-600 hover:text-blue-700 font-semibold">
                  ${escapeHtml(lyric.artist)}
                </a>
              ` : `
                <span class="text-xl font-semibold text-gray-900">${escapeHtml(lyric.artist)}</span>
              `}
              ${lyric.album && lyric.albumId ? `
                <p class="text-slate-600">
                  from the album 
                  <a href="/album/${lyric.albumId}" class="text-blue-600 hover:text-blue-700 font-medium">
                    ${escapeHtml(lyric.album)}
                  </a>
                </p>
              ` : lyric.album ? `
                <p class="text-slate-600">
                  from the album <span class="font-medium">${escapeHtml(lyric.album)}</span>
                </p>
              ` : `
                <p class="text-slate-600 italic">Album information not available</p>
              `}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-800 mb-6">Lyrics</h2>
          <div class="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
            ${escapeHtml(lyric.content)}
          </div>        </div>
      </div>
    `
  );
}

function generateArtistsPage() {
  // Extract unique artists from albums
  const artistsMap = new Map();
  
  albums.forEach(album => {
    if (!artistsMap.has(album.artist)) {
      // Create artist slug from name
      const slug = album.artist.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
        
      artistsMap.set(album.artist, {
        name: album.artist,
        slug: slug,
        albumCount: 1,
        albums: [album],
        image: album.coverImage || album.image,
        latestAlbum: album
      });
    } else {
      const existingArtist = artistsMap.get(album.artist);
      existingArtist.albumCount++;
      existingArtist.albums.push(album);
      
      // Update latest album if this one is more recent
      if (!existingArtist.latestAlbum.year || 
          (album.year && album.year > existingArtist.latestAlbum.year)) {
        existingArtist.latestAlbum = album;
        existingArtist.image = album.coverImage || album.image;
      }
    }
  });
  
  // Convert to array and sort by name
  const artistsArray = Array.from(artistsMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));

  const artistsGrid = artistsArray.map(artist => {
    return `        <div class="group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <a href="/artist/${artist.slug}" class="block w-full h-full">
                    ${artist.image ? `
                    <img
                        src="/images/albums/${escapeHtml(artist.image)}"
                        alt="${escapeHtml(artist.name)}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                    />
                    ` : ''}
                    <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600" ${artist.image ? 'style="display: none"' : ''}>
                        <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                        </svg>
                    </div>
                    
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    
                    <!-- Album Count Badge -->
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span class="text-sm font-medium text-gray-700">
                            ${artist.albumCount} album${artist.albumCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </a>
            </div>

            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    <a href="/artist/${artist.slug}">${escapeHtml(artist.name)}</a>
                </h3>
                
                ${artist.latestAlbum ? `
                <div class="flex items-center space-x-2 text-gray-600 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-sm">
                        Latest: ${escapeHtml(artist.latestAlbum.title)}
                        ${artist.latestAlbum.year ? ` (${artist.latestAlbum.year})` : ''}
                    </span>
                </div>
                ` : ''}
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                        </svg>
                        <span>${artist.albumCount} releases</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                        <span>View Profile</span>
                    </div>
                </div>
            </div>
        </div>`;
  }).join('');

  const content = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div class="container mx-auto px-4 py-12">
            <!-- Page Header -->
            <div class="text-center mb-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                </div>
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Artists</h1>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover all the talented artists in our collection, from solo performers to collaborative groups.
                </p>
            </div>

            <!-- Artists Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
${artistsGrid}
            </div>

            ${artistsArray.length === 0 ? `
            <!-- Empty State -->
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">No Artists Found</h3>
                <p class="text-gray-500">
                    No artists are available at the moment. Please check back later.
                </p>
            </div>
            ` : ''}
        </div>
    </div>
  `;

  return createHtmlTemplate(
    'Artists | Ilse DeLange Records',
    'Discover all the talented artists in our collection, from solo performers to collaborative groups.',
    content
  );
}

function generateStaticSite() {
  console.log('Generating static HTML files...');

  // Generate index page
  const indexHtml = generateIndexPage();
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
  console.log('✓ Generated index.html');
  // Generate albums listing page
  const albumsHtml = generateAlbumsPage();
  const albumsPageDir = path.join(distDir, 'albums');
  if (!fs.existsSync(albumsPageDir)) {
    fs.mkdirSync(albumsPageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(albumsPageDir, 'index.html'), albumsHtml);
  console.log('✓ Generated albums/index.html');

  // Generate artists listing page
  const artistsHtml = generateArtistsPage();
  const artistsPageDir = path.join(distDir, 'artists');
  if (!fs.existsSync(artistsPageDir)) {
    fs.mkdirSync(artistsPageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(artistsPageDir, 'index.html'), artistsHtml);
  console.log('✓ Generated artists/index.html');

  // Generate individual album pages
  albums.forEach(album => {
    const slug = createSlug(album.title);
    const albumDir = path.join(albumsDir, slug);
    
    if (!fs.existsSync(albumDir)) {
      fs.mkdirSync(albumDir, { recursive: true });
    }
    
    const albumHtml = generateAlbumPage(album);
    fs.writeFileSync(path.join(albumDir, 'index.html'), albumHtml);
    console.log(`✓ Generated album/${slug}/index.html`);
  });

  // Generate lyrics listing page
  const lyricsHtml = generateLyricsPage();
  fs.writeFileSync(path.join(lyricsDir, 'index.html'), lyricsHtml);
  console.log('✓ Generated lyrics/index.html');

  // Generate individual lyrics pages
  lyrics.forEach(lyric => {
    const lyricId = lyric.id;
    const lyricDir = path.join(lyricsDir, lyricId.toString());
    
    if (!fs.existsSync(lyricDir)) {
      fs.mkdirSync(lyricDir, { recursive: true });
    }
    
    const lyricHtml = generateLyricsDetailPage(lyric);
    fs.writeFileSync(path.join(lyricDir, 'index.html'), lyricHtml);
    console.log(`✓ Generated lyrics/${lyricId}/index.html`);
  });

  // Copy public assets
  const publicDir = path.join(__dirname, '../public');
  const distPublicDir = path.join(distDir);
  
  // Copy images
  const imagesSource = path.join(publicDir, 'images');
  const imagesDestination = path.join(distPublicDir, 'images');
  
  if (fs.existsSync(imagesSource)) {
    fs.cpSync(imagesSource, imagesDestination, { recursive: true });
    console.log('✓ Copied images to dist/images');
  }

  // Copy content files
  const contentSource = path.join(publicDir, 'content');
  const contentDestination = path.join(distPublicDir, 'content');
  
  if (fs.existsSync(contentSource)) {
    fs.cpSync(contentSource, contentDestination, { recursive: true });
    console.log('✓ Copied content to dist/content');
  }
  console.log(`\n🎉 Static site generated successfully!`);
  console.log(`📁 Generated ${albums.length + 2} HTML pages in the dist/ directory`);
  
  // Generate sitemap and robots.txt
  generateSEOFiles();
  
  console.log(`\nPages generated:`);
  console.log(`- / (homepage)`);
  console.log(`- /albums (albums listing)`);
  albums.forEach(album => {
    const slug = createSlug(album.title);
    console.log(`- /album/${slug} (${album.title})`);
  });
}

// Generate SEO files
function generateSEOFiles() {
  // Use staging URL for now, will be changed for production
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ilsedelangerecords.com' 
    : 'https://staging.ilsedelangerecords.nl';
  const today = new Date().toISOString().split('T')[0];
    // Generate sitemap
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
  </url>
  <url>
    <loc>${baseUrl}/lyrics</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

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

  lyrics.forEach(lyric => {
    sitemap += `
  <url>
    <loc>${baseUrl}/lyrics/${lyric.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log(`✓ Generated sitemap.xml with ${albums.length + lyrics.length + 3} URLs`);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  console.log('✓ Generated robots.txt');
}

// Run the generator
generateStaticSite();
