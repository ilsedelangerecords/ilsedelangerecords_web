// Content Models for Ilse DeLange Records Website
// TypeScript interfaces and schemas for content management

export interface Artist {
  id: string;
  name: string;
  slug: string;
  type: 'solo' | 'band' | 'collaboration';
  biography: string;
  formed_date?: Date;
  disbanded_date?: Date;
  origin: string;
  genres: string[];
  website_url?: string;  social_media: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  images: {
    profile_image?: string;
    banner_image?: string;
    logo_image?: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  artist_id: string;
  album_type: 'studio' | 'live' | 'compilation' | 'soundtrack' | 'ep' | 'single';
  release_date: Date;
  record_label: string;
  catalog_number?: string;
  description: string;
  chart_performance: ChartPerformance[];
  production_credits: ProductionCredit[];
  images: {
    cover_art: string;
    back_cover?: string;
    booklet_images?: string[];
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface AlbumVersion {
  id: string;
  album_id: string;
  version_name: string;
  catalog_number: string;
  release_date: Date;
  format: 'cd' | 'vinyl' | 'cassette' | 'digital' | 'dvd' | 'blu-ray';
  packaging_type: string;
  limited_edition: boolean;
  exclusive_retailers?: string[];
  bonus_content: BonusContent[];
  track_listing: VersionTrack[];
  images: {
    cover_art: string;
    disc_art?: string;
    packaging_images?: string[];
  };
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  duration: string;
  isrc?: string;
  writers: string[];
  composers?: string[];
  publishers?: string[];
  recording_date?: Date;
  recording_location?: string;
  production_notes?: string;
  lyrics_id?: string;
  audio_preview_url?: string;
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface Lyrics {
  id: string;
  track_id: string;
  language: string;
  content: string;
  structure: LyricsStructure[];
  translation_notes?: string;
  copyright_info?: string;
  transcription_notes?: string;
  verified: boolean;
  verified_by?: string;
  verified_date?: Date;
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface LivePerformance {
  id: string;
  title: string;
  slug: string;
  performance_date: Date;
  venue_name: string;
  venue_location: string;
  tour_name?: string;
  setlist: SetlistItem[];
  recording_quality: 'professional' | 'soundboard' | 'audience' | 'broadcast';
  available_formats: string[];
  duration?: string;
  notes?: string;
  images: {
    performance_photos?: string[];
    venue_photos?: string[];
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export interface ImageAsset {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  dimensions: {
    width: number;
    height: number;
  };
  image_type: 'album_cover' | 'artist_photo' | 'concert_photo' | 'promotional' | 'artwork' | 'packaging';
  related_entity_type: 'artist' | 'album' | 'track' | 'performance' | 'collection';
  related_entity_id: string;
  alt_text: string;
  caption?: string;
  photographer?: string;
  copyright_info?: string;
  usage_rights: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

// Supporting interfaces
export interface ChartPerformance {
  country: string;
  chart_name: string;
  peak_position: number;
  weeks_on_chart: number;
  entry_date: Date;
  certification?: string;
}

export interface ProductionCredit {
  role: string;
  person_name: string;
  tracks?: number[];
}

export interface BonusContent {
  type: 'track' | 'video' | 'documentary' | 'interview' | 'photo_gallery';
  title: string;
  description?: string;
  duration?: string;
  file_url?: string;
}

export interface VersionTrack {
  track_number: number;
  track_id: string;
  disc_number?: number;
  bonus_track: boolean;
}

export interface LyricsStructure {
  section_type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'instrumental';
  section_number?: number;
  content: string;
  repeat_count?: number;
}

export interface SetlistItem {
  position: number;
  track_id?: string;
  song_title: string;
  notes?: string;
  guest_performers?: string[];
}

export interface TrackCredit {
  track_id: string;
  person_name: string;
  role: string;
  instrument?: string;
  notes?: string;
}

export interface ContentStatus {
  id: string;
  content_type: 'artist' | 'album' | 'track' | 'lyrics' | 'performance';
  content_id: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  assigned_editor?: string;
  review_notes?: string;
  publication_date?: Date;
  last_modified_by: string;
  created_at: Date;
  updated_at: Date;
}

// Migration-specific interfaces
export interface MigrationPage {
  file_path: string;
  title: string;
  description: string;
  keywords: string[];
  content_type: string;
  main_content: string;
  images: MigrationImage[];
  raw_html: string;
}

export interface MigrationImage {
  src: string;
  alt: string;
  file_path: string;
  exists: boolean;
}

export interface ContentInventory {
  summary: {
    total_pages: number;
    content_types: Record<string, number>;
    total_images: number;
    missing_images: number;
  };
  pages: Record<string, MigrationPage>;
  navigation: {
    ilse_delange: string[];
    common_linnets: string[];
  };
}

