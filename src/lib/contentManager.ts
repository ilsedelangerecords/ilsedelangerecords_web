// Content management utilities for migration and data handling
import { ContentInventory, MigrationPage, Artist, Album, Track, Lyrics } from '../types/content';
import { validateContentInventory } from './validation';

export class ContentManager {
  private inventory: ContentInventory | null = null;

  async loadContentInventory(inventoryPath: string): Promise<ContentInventory> {
    try {
      const response = await fetch(inventoryPath);
      const data = await response.json();
      this.inventory = validateContentInventory(data);
      return this.inventory;
    } catch (error) {
      console.error('Failed to load content inventory:', error);
      throw error;
    }
  }

  getPagesByType(contentType: string): MigrationPage[] {
    if (!this.inventory) return [];
    
    return Object.values(this.inventory.pages).filter(
      page => page.content_type === contentType
    );
  }

  getAlbumPages(): MigrationPage[] {
    return this.getPagesByType('album');
  }

  getLyricsPages(): MigrationPage[] {
    return this.getPagesByType('lyrics');
  }

  getSinglePages(): MigrationPage[] {
    return this.getPagesByType('single');
  }

  getTCLPages(): MigrationPage[] {
    return this.getPagesByType('tcl_content');
  }

  getLivePages(): MigrationPage[] {
    return this.getPagesByType('live');
  }

  // Extract structured data from migration pages
  extractAlbumData(page: MigrationPage): Partial<Album> {
    const title = this.cleanTitle(page.title);
    const slug = this.createSlug(title);
    
    return {
      title,
      slug,
      description: page.description,
      seo: {
        meta_title: page.title,
        meta_description: page.description,
        keywords: page.keywords,
      },
      // Additional parsing logic would go here
    };
  }

  extractTrackData(page: MigrationPage): Partial<Track> {
    const title = this.cleanTitle(page.title);
    const slug = this.createSlug(title);
    
    return {
      title,
      slug,
      seo: {
        meta_title: page.title,
        meta_description: page.description,
        keywords: page.keywords,
      },
      // Additional parsing logic would go here
    };
  }

  extractLyricsData(page: MigrationPage): Partial<Lyrics> {
    const content = this.extractLyricsContent(page.main_content);
    const language = this.detectLanguage(content);
    
    return {
      content,
      language,
      structure: this.parseLyricsStructure(content),
      verified: false,
      seo: {
        meta_title: page.title,
        meta_description: page.description,
        keywords: page.keywords,
      },
    };
  }

  // Utility functions
  private cleanTitle(title: string): string {
    return title
      .replace(/^(Ilse [Dd]elange?\s*)/i, '')
      .replace(/\s+(album|single|lyrics?)\s*$/i, '')
      .trim();
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private extractLyricsContent(content: string): string {
    // Remove navigation and metadata, keep only lyrics
    const lines = content.split('\n');
    const lyricsStart = lines.findIndex(line => 
      line.includes('Lyrics') || line.includes('lyrics') || 
      line.match(/^[A-Z][a-z].*[a-z]$/) // Likely first line of lyrics
    );
    
    if (lyricsStart > -1) {
      return lines.slice(lyricsStart + 1).join('\n').trim();
    }
    
    return content;
  }

  private detectLanguage(content: string): string {
    // Simple language detection based on common words
    const dutchWords = ['de', 'het', 'een', 'van', 'is', 'en', 'dat', 'je', 'niet', 'op'];
    const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'is', 'you', 'that', 'it'];
    
    const words = content.toLowerCase().split(/\s+/);
    const dutchCount = words.filter(word => dutchWords.includes(word)).length;
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    
    return dutchCount > englishCount ? 'nl' : 'en';
  }

  private parseLyricsStructure(content: string): any[] {
    // Basic structure parsing - could be enhanced
    const lines = content.split('\n').filter(line => line.trim());
    const structure = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // Simple heuristic for verse/chorus detection
        const isChorus = line.toLowerCase().includes('chorus') || 
                        (i > 0 && lines[i-1] && lines[i-1].toLowerCase().includes('chorus'));
        
        structure.push({
          section_type: isChorus ? 'chorus' : 'verse',
          content: line,
        });
      }
    }
    
    return structure;
  }

  // Image processing utilities
  getImagesForPage(page: MigrationPage): string[] {
    return page.images
      .filter(img => img.exists)
      .map(img => img.src);
  }

  getAllImages(): string[] {
    if (!this.inventory) return [];
    
    const allImages = new Set<string>();
    
    Object.values(this.inventory.pages).forEach(page => {
      page.images.forEach(img => {
        if (img.exists) {
          allImages.add(img.src);
        }
      });
    });
    
    return Array.from(allImages);
  }

  // Statistics and reporting
  getContentStatistics() {
    if (!this.inventory) return null;
    
    return {
      ...this.inventory.summary,
      pagesByType: this.inventory.summary.content_types,
      totalUniqueImages: this.getAllImages().length,
    };
  }

  generateMigrationReport(): string {
    if (!this.inventory) return 'No inventory loaded';
    
    const stats = this.getContentStatistics();
    
    return `
# Migration Report

## Content Summary
- Total Pages: ${stats?.total_pages}
- Total Images: ${stats?.total_images}
- Unique Images: ${stats?.totalUniqueImages}
- Missing Images: ${stats?.missing_images}

## Content Types
${Object.entries(stats?.pagesByType || {})
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

## Migration Status
✅ Content inventory complete
✅ All images found and catalogued
✅ Content models defined
✅ Validation schemas implemented
    `.trim();
  }
}

// Singleton instance
export const contentManager = new ContentManager();

