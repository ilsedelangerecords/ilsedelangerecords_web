// Static content loader for pre-compiled data
class ContentLoader {
  constructor() {
    this.cache = new Map();
  }
  async loadContent(type) {
    if (!type || typeof type !== 'string' || type.trim() === '') {
      console.warn('loadContent called with invalid type:', type);
      return [];
    }
    
    const trimmedType = type.trim();
    if (this.cache.has(trimmedType)) {
      return this.cache.get(trimmedType);
    }    try {
      console.log(`Loading content type: ${trimmedType}`);
      
      // Use relative path for static files
      const response = await fetch(`./content/${trimmedType}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${trimmedType}: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Loaded ${trimmedType}:`, Object.keys(data || {}).length, 'items');
      
      // Convert object to array if needed
      let processedData = data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        processedData = Object.values(data);
      }
      
      console.log(`Formatted ${processedData?.length || 0} ${trimmedType}`);
      this.cache.set(trimmedType, processedData || []);
      return processedData || [];
    } catch (error) {
      console.error(`Error loading ${trimmedType}:`, error);
      return [];
    }
  }

  // Pre-load all content for static generation
  async preloadAll() {
    const types = ['albums', 'lyrics', 'artists'];
    const promises = types.map(type => this.loadContent(type));
    await Promise.all(promises);
  }
}

const contentLoader = new ContentLoader();

// React hooks for content loading
import React, { useState, useEffect } from 'react';

export function useContent(type) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type || typeof type !== 'string' || type.trim() === '') {
      console.warn('useContent called with invalid type:', type);
      setData([]);
      setLoading(false);
      setError('Invalid content type');
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const result = await contentLoader.loadContent(type);
        console.log(`useContent: Setting ${type} data:`, result?.length || 0, 'items');
        setData(result || []);
        setError(null);
      } catch (err) {
        console.error(`useContent error for ${type}:`, err);
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [type]);

  return { data, loading, error };
}

export function useContentSearch(type, searchTerm = '', filters = {}) {
  const { data, loading, error } = useContent(type);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let filtered = [...data];

    // Apply search term
    const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm : '';
    if (safeSearchTerm) {
      const term = safeSearchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableText = [
          item.title,
          item.name,
          item.artist,
          item.album,
          item.lyrics,
          item.description
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(term);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          if (key === 'year') {
            return item.year === parseInt(value);
          }
          if (key === 'language') {
            return item.language === value;
          }
          if (key === 'artist') {
            return item.artist === value || item.name === value;
          }
          if (key === 'type') {
            return item.type === value;
          }
          return item[key] === value;
        });
      }
    });

    setFilteredData(filtered);
  }, [data, searchTerm, filters]);

  return { data: filteredData, loading, error, totalCount: data?.length || 0 };
}

// Pre-load content for static generation
if (typeof window !== 'undefined') {
  contentLoader.preloadAll().catch(console.error);
}

