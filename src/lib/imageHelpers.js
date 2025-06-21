// Placeholder images for the website
export const placeholderImages = {
  album: '/images/album-placeholder.jpg',
  artist: '/images/artist-placeholder.jpg',
  artistBanner: '/images/artist-banner-placeholder.jpg',
  default: '/images/placeholder.jpg'
};

// Create placeholder images if they don't exist
export const createPlaceholderImages = () => {
  // This would typically be handled by the build process
  // For now, we'll use data URLs for basic placeholders
  
  const albumPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f3f4f6"/>
      <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">Album</text>
      <text x="200" y="200" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">Artwork</text>
      <text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">Not Available</text>
      <circle cx="200" cy="120" r="30" fill="#d1d5db"/>
      <path d="M185 110 L215 130 L185 150 Z" fill="#9ca3af"/>
    </svg>
  `)}`;

  const artistPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f9fafb"/>
      <circle cx="200" cy="150" r="50" fill="#e5e7eb"/>
      <path d="M200 120 C180 120 165 135 165 155 C165 175 180 190 200 190 C220 190 235 175 235 155 C235 135 220 120 200 120 Z" fill="#d1d5db"/>
      <path d="M150 280 C150 250 170 230 200 230 C230 230 250 250 250 280 L250 320 L150 320 Z" fill="#d1d5db"/>
      <text x="200" y="350" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">Artist Photo</text>
      <text x="200" y="370" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">Not Available</text>
    </svg>
  `)}`;

  const bannerPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="800" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill="url(#grad1)"/>
      <text x="400" y="140" text-anchor="middle" font-family="Arial" font-size="24" fill="white" font-weight="bold">Artist Banner</text>
      <text x="400" y="170" text-anchor="middle" font-family="Arial" font-size="16" fill="white">Image Not Available</text>
    </svg>
  `)}`;

  return {
    album: albumPlaceholder,
    artist: artistPlaceholder,
    banner: bannerPlaceholder
  };
};

// Image mapping for migrated content
export const imageMappings = {
  // Common album covers that might be referenced
  'world_of_hurt': '1998, World of hurt, promo order - info folder, front.jpg',
  'after_the_storm': 'After_The_Storm,_Front-1_e9f97381.jpg',
  'common_linnets': 'Album_Artwork_\'The_Common_Linnets\'_7df6b537.jpg',
  'eurovision_2014': 'Eurovision_Song_Contest_2014,_Front-1_29bb6cb3.jpg',
  '2in1': 'Ilse_DeLange,_2in1,_front-1_b65a13dd.jpg',  
  // Artist photos
  'ilse_delange_profile': 'ilsedelange2018_34e4bd79.jpg',
  'ilse_delange_ok': 'ilse_delange_OK_a29f0a07.jpg'
};

// Function to resolve image paths from the migrated content
export const resolveImagePath = (imagePath) => {
  if (!imagePath) return placeholderImages.default;
  
  // Handle data URLs
  if (imagePath.startsWith('data:')) return imagePath;
  
  // Handle external URLs
  if (imagePath.startsWith('http')) return imagePath;
  
  // Handle absolute paths
  if (imagePath.startsWith('/images/')) return imagePath;
  
  // Handle relative paths from old website
  if (imagePath.includes('/')) {
    const filename = imagePath.split('/').pop();
    return `/images/${filename}`;
  }
  
  // Direct filename
  if (imagePath.includes('.')) {
    return `/images/${imagePath}`;
  }
  
  // Try to map known image keys
  if (imageMappings[imagePath]) {
    return `/images/${imageMappings[imagePath]}`;
  }
  
  // Fallback to placeholder
  return placeholderImages.default;
};

// Function to get the best available image for an item
export const getBestImage = (item, type = 'default') => {
  if (!item) return placeholderImages[type] || placeholderImages.default;
  
  // For albums
  if (type === 'album' || item.type === 'album') {
    const candidates = [
      item.coverArt,
      item.images?.cover_art,
      item.images?.front,
      item.cover_image,
      item.image
    ];
    
    for (const candidate of candidates) {
      if (candidate) return resolveImagePath(candidate);
    }
    
    return placeholderImages.album;
  }
  
  // For artists
  if (type === 'artist' || item.type === 'artist') {
    const candidates = [
      item.profileImage,
      item.images?.profile_image,
      item.images?.photo,
      item.profile_image,
      item.image
    ];
    
    for (const candidate of candidates) {
      if (candidate) return resolveImagePath(candidate);
    }
    
    return placeholderImages.artist;
  }
  
  // For artist banners
  if (type === 'banner') {
    const candidates = [
      item.bannerImage,
      item.images?.banner_image,
      item.images?.banner,
      item.banner_image,
      item.cover_image
    ];
    
    for (const candidate of candidates) {
      if (candidate) return resolveImagePath(candidate);
    }
    
    return placeholderImages.artistBanner;
  }
  
  // Generic image resolution
  const candidates = [
    item.image,
    item.images?.main,
    item.images?.default,
    item.src,
    item.url
  ];
  
  for (const candidate of candidates) {
    if (candidate) return resolveImagePath(candidate);
  }
  
  return placeholderImages.default;
};

export default {
  placeholderImages,
  createPlaceholderImages,
  imageMappings,
  resolveImagePath,
  getBestImage
};

