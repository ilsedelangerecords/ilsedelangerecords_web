import React, { useState, useEffect } from 'react';

// Content loader utility to load actual migrated data
class ContentLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadContent(type) {
    if (this.cache.has(type)) {
      return this.cache.get(type);
    }

    try {
      // In development, load from public directory
      // In production, this would be from an API or static files
      const response = await fetch(`/content/${type}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${type}: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(type, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      // Return fallback data structure
      return this.getFallbackData(type);
    }
  }

  getFallbackData(type) {
    const fallbacks = {
      albums: {},
      lyrics: {},
      artists: {},
      image_assets: {},
      url_mapping: {},
      image_mapping: {}
    };
    return fallbacks[type] || {};
  }

  async loadAlbums() {
    return await this.loadContent('albums');
  }

  async loadLyrics() {
    return await this.loadContent('lyrics');
  }

  async loadArtists() {
    return await this.loadContent('artists');
  }

  async loadImageAssets() {
    return await this.loadContent('image_assets');
  }

  async loadUrlMapping() {
    return await this.loadContent('url_mapping');
  }

  async loadImageMapping() {
    return await this.loadContent('image_mapping');
  }

  // Helper method to get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return '/images/placeholder.jpg';
    
    // Handle different image path formats
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Convert old image paths to new optimized paths
    const filename = imagePath.split('/').pop();
    return `/images/${filename}`;
  }

  // Helper method to format album data
  formatAlbumData(albumData) {
    return Object.entries(albumData).map(([id, album]) => ({
      id,
      ...album,
      slug: this.createSlug(album.title),
      coverArt: this.getImageUrl(album.images?.cover_art),
      artistSlug: this.createSlug(album.artist)
    }));
  }

  // Helper method to format lyrics data
  formatLyricsData(lyricsData) {
    return Object.entries(lyricsData).map(([id, lyrics]) => ({
      id,
      ...lyrics,
      slug: this.createSlug(lyrics.title),
      artistSlug: this.createSlug(lyrics.artist)
    }));
  }

  // Helper method to format artist data
  formatArtistData(artistData) {
    return Object.entries(artistData).map(([id, artist]) => ({
      id,
      ...artist,
      slug: this.createSlug(artist.name),
      profileImage: this.getImageUrl(artist.images?.profile_image),
      bannerImage: this.getImageUrl(artist.images?.banner_image)
    }));
  }

  // Create URL-friendly slugs
  createSlug(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Search functionality
  searchContent(data, searchTerm, fields = ['title', 'name']) {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      fields.some(field => 
        item[field]?.toLowerCase().includes(term)
      )
    );
  }

  // Filter functionality
  filterContent(data, filters) {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return item[key] === value;
      });
    });
  }

  // Sort functionality
  sortContent(data, sortBy) {
    const [field, direction] = sortBy.split('-');
    const multiplier = direction === 'desc' ? -1 : 1;

    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      // Handle different data types
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }
      
      if (typeof aVal === 'number') {
        return (aVal - bVal) * multiplier;
      }

      return 0;
    });
  }
}

// Create singleton instance
const contentLoader = new ContentLoader();

// Custom hook for loading content
export const useContent = (type) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        switch (type) {
          case 'albums':
            result = await contentLoader.loadAlbums();
            result = contentLoader.formatAlbumData(result);
            break;
          case 'lyrics':
            result = await contentLoader.loadLyrics();
            result = contentLoader.formatLyricsData(result);
            break;
          case 'artists':
            result = await contentLoader.loadArtists();
            result = contentLoader.formatArtistData(result);
            break;
          default:
            result = await contentLoader.loadContent(type);
        }
        
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error(`Error loading ${type}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type]);

  return { data, loading, error };
};

// Custom hook for searching and filtering content
export const useContentSearch = (data, initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('title-asc');

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    let result = data;
    
    // Apply search
    if (searchTerm) {
      result = contentLoader.searchContent(result, searchTerm);
    }
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = contentLoader.filterContent(result, filters);
    }
    
    // Apply sorting
    if (sortBy) {
      result = contentLoader.sortContent(result, sortBy);
    }
    
    return result;
  }, [data, searchTerm, filters, sortBy]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy
  };
};

// Export the content loader instance for direct use
export default contentLoader;

