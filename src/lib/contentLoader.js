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
      console.log(`Loading content type: ${type}`);
      const response = await fetch(`/content/${type}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${type}: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Loaded ${type}:`, Object.keys(data).length, 'items');
      this.cache.set(type, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      return {};
    }
  }

  // Helper method to format album data
  formatAlbumData(albumData) {
    if (!albumData || typeof albumData !== 'object') {
      console.log('No album data to format');
      return [];
    }
    
    const formatted = Object.entries(albumData).map(([id, album]) => ({
      id,
      title: album.title || 'Untitled Album',
      slug: album.slug || this.createSlug(album.title),
      artist: album.artist || 'Unknown Artist',
      artist_id: album.artist_id,
      album_type: album.album_type || 'studio',
      release_date: album.release_date,
      year: album.release_date ? new Date(album.release_date).getFullYear() : new Date().getFullYear(),
      record_label: album.record_label,
      description: album.description,
      coverArt: this.getImageUrl(album.images?.cover_art),
      images: album.images || {},
      chart_performance: album.chart_performance || [],
      production_credits: album.production_credits || []
    }));
    
    console.log(`Formatted ${formatted.length} albums`);
    return formatted;
  }

  // Helper method to format lyrics data
  formatLyricsData(lyricsData) {
    if (!lyricsData || typeof lyricsData !== 'object') {
      console.log('No lyrics data to format');
      return [];
    }
    
    const formatted = Object.entries(lyricsData).map(([id, lyrics]) => ({
      id,
      title: lyrics.title || 'Untitled Song',
      slug: lyrics.slug || this.createSlug(lyrics.title),
      content: lyrics.content || '',
      language: lyrics.language || 'en',
      structure: lyrics.structure || [],
      verified: lyrics.verified || false,
      artist: lyrics.artist || 'Unknown Artist',
      album: lyrics.album,
      seo: lyrics.seo || {}
    }));
    
    console.log(`Formatted ${formatted.length} lyrics`);
    return formatted;
  }

  // Helper method to format artist data
  formatArtistData(artistData) {
    if (!artistData || typeof artistData !== 'object') {
      console.log('No artist data to format');
      return [];
    }
    
    const formatted = Object.entries(artistData).map(([id, artist]) => ({
      id,
      name: artist.name || 'Unknown Artist',
      slug: artist.slug || this.createSlug(artist.name),
      type: artist.type || 'solo',
      biography: artist.biography || '',
      origin: artist.origin || '',
      genres: artist.genres || [],
      social_media: artist.social_media || {},
      profileImage: this.getImageUrl(artist.images?.profile_image),
      bannerImage: this.getImageUrl(artist.images?.banner_image),
      images: artist.images || {}
    }));
    
    console.log(`Formatted ${formatted.length} artists`);
    return formatted;
  }

  // Helper method to get image URL
  getImageUrl(imagePath) {
    if (!imagePath) return '/images/placeholder.svg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    const filename = imagePath.split('/').pop();
    return `/images/${filename}`;
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
    if (!searchTerm || !Array.isArray(data)) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      fields.some(field => 
        item[field]?.toLowerCase().includes(term)
      )
    );
  }

  // Filter functionality
  filterContent(data, filters) {
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return item[key] === value;
      });
    });
  }

  // Sort functionality
  sortContent(data, sortBy) {
    if (!Array.isArray(data)) return [];
    
    const [field, direction] = sortBy.split('-');
    const multiplier = direction === 'desc' ? -1 : 1;

    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`useContent: Loading ${type}`);
        
        let rawData = await contentLoader.loadContent(type);
        let result = [];
        
        switch (type) {
          case 'albums':
            result = contentLoader.formatAlbumData(rawData);
            break;
          case 'lyrics':
            result = contentLoader.formatLyricsData(rawData);
            break;
          case 'artists':
            result = contentLoader.formatArtistData(rawData);
            break;
          default:
            result = Array.isArray(rawData) ? rawData : Object.values(rawData || {});
        }
        
        console.log(`useContent: Setting ${type} data:`, result.length, 'items');
        setData(result);
      } catch (err) {
        console.error(`useContent: Error loading ${type}:`, err);
        setError(err.message);
        setData([]);
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
    if (!Array.isArray(data)) return [];
    
    let result = data;
    
    if (searchTerm) {
      result = contentLoader.searchContent(result, searchTerm);
    }
    
    if (Object.keys(filters).length > 0) {
      result = contentLoader.filterContent(result, filters);
    }
    
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

export default contentLoader;

