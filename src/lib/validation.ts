// Content validation schemas using Zod
import { z } from 'zod';

// Artist schema
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['solo', 'band', 'collaboration']),
  biography: z.string(),
  formed_date: z.date().optional(),
  disbanded_date: z.date().optional(),
  origin: z.string(),
  genres: z.array(z.string()),
  website_url: z.string().url().optional(),
  social_media: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }),
  images: z.object({
    profile_image: z.string().optional(),
    banner_image: z.string().optional(),
    logo_image: z.string().optional(),
  }),
  seo: z.object({
    meta_title: z.string().min(1).max(60),
    meta_description: z.string().min(1).max(160),
    keywords: z.array(z.string()),
  }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Album schema
export const AlbumSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  artist_id: z.string(),
  album_type: z.enum(['studio', 'live', 'compilation', 'soundtrack', 'ep', 'single']),
  release_date: z.date(),
  record_label: z.string().min(1),
  catalog_number: z.string().optional(),
  description: z.string(),
  chart_performance: z.array(z.object({
    country: z.string(),
    chart_name: z.string(),
    peak_position: z.number().min(1),
    weeks_on_chart: z.number().min(0),
    entry_date: z.date(),
    certification: z.string().optional(),
  })),
  production_credits: z.array(z.object({
    role: z.string(),
    person_name: z.string(),
    tracks: z.array(z.number()).optional(),
  })),
  images: z.object({
    cover_art: z.string(),
    back_cover: z.string().optional(),
    booklet_images: z.array(z.string()).optional(),
  }),
  seo: z.object({
    meta_title: z.string().min(1).max(60),
    meta_description: z.string().min(1).max(160),
    keywords: z.array(z.string()),
  }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Album Version schema
export const AlbumVersionSchema = z.object({
  id: z.string(),
  album_id: z.string(),
  version_name: z.string(),
  catalog_number: z.string(),
  release_date: z.date(),
  format: z.enum(['cd', 'vinyl', 'cassette', 'digital', 'dvd', 'blu-ray']),
  packaging_type: z.string(),
  limited_edition: z.boolean(),
  exclusive_retailers: z.array(z.string()).optional(),
  bonus_content: z.array(z.object({
    type: z.enum(['track', 'video', 'documentary', 'interview', 'photo_gallery']),
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    file_url: z.string().optional(),
  })),
  track_listing: z.array(z.object({
    track_number: z.number().min(1),
    track_id: z.string(),
    disc_number: z.number().optional(),
    bonus_track: z.boolean(),
  })),
  images: z.object({
    cover_art: z.string(),
    disc_art: z.string().optional(),
    packaging_images: z.array(z.string()).optional(),
  }),
  notes: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Track schema
export const TrackSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/), // MM:SS format
  isrc: z.string().optional(),
  writers: z.array(z.string()),
  composers: z.array(z.string()).optional(),
  publishers: z.array(z.string()).optional(),
  recording_date: z.date().optional(),
  recording_location: z.string().optional(),
  production_notes: z.string().optional(),
  lyrics_id: z.string().optional(),
  audio_preview_url: z.string().url().optional(),
  seo: z.object({
    meta_title: z.string().min(1).max(60),
    meta_description: z.string().min(1).max(160),
    keywords: z.array(z.string()),
  }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Lyrics schema
export const LyricsSchema = z.object({
  id: z.string(),
  track_id: z.string(),
  language: z.string().length(2), // ISO 639-1 language code
  content: z.string().min(1),
  structure: z.array(z.object({
    section_type: z.enum(['verse', 'chorus', 'bridge', 'intro', 'outro', 'instrumental']),
    section_number: z.number().optional(),
    content: z.string(),
    repeat_count: z.number().optional(),
  })),
  translation_notes: z.string().optional(),
  copyright_info: z.string().optional(),
  transcription_notes: z.string().optional(),
  verified: z.boolean(),
  verified_by: z.string().optional(),
  verified_date: z.date().optional(),
  seo: z.object({
    meta_title: z.string().min(1).max(60),
    meta_description: z.string().min(1).max(160),
    keywords: z.array(z.string()),
  }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Live Performance schema
export const LivePerformanceSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  performance_date: z.date(),
  venue_name: z.string(),
  venue_location: z.string(),
  tour_name: z.string().optional(),
  setlist: z.array(z.object({
    position: z.number().min(1),
    track_id: z.string().optional(),
    song_title: z.string(),
    notes: z.string().optional(),
    guest_performers: z.array(z.string()).optional(),
  })),
  recording_quality: z.enum(['professional', 'soundboard', 'audience', 'broadcast']),
  available_formats: z.array(z.string()),
  duration: z.string().optional(),
  notes: z.string().optional(),
  images: z.object({
    performance_photos: z.array(z.string()).optional(),
    venue_photos: z.array(z.string()).optional(),
  }),
  seo: z.object({
    meta_title: z.string().min(1).max(60),
    meta_description: z.string().min(1).max(160),
    keywords: z.array(z.string()),
  }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Image Asset schema
export const ImageAssetSchema = z.object({
  id: z.string(),
  filename: z.string(),
  original_filename: z.string(),
  file_path: z.string(),
  file_size: z.number().min(0),
  dimensions: z.object({
    width: z.number().min(1),
    height: z.number().min(1),
  }),
  image_type: z.enum(['album_cover', 'artist_photo', 'concert_photo', 'promotional', 'artwork', 'packaging']),
  related_entity_type: z.enum(['artist', 'album', 'track', 'performance', 'collection']),
  related_entity_id: z.string(),
  alt_text: z.string(),
  caption: z.string().optional(),
  photographer: z.string().optional(),
  copyright_info: z.string().optional(),
  usage_rights: z.string(),
  tags: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});

// Migration-specific schemas
export const MigrationPageSchema = z.object({
  file_path: z.string(),
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  content_type: z.string(),
  main_content: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    file_path: z.string(),
    exists: z.boolean(),
  })),
  raw_html: z.string(),
});

export const ContentInventorySchema = z.object({
  summary: z.object({
    total_pages: z.number(),
    content_types: z.record(z.number()),
    total_images: z.number(),
    missing_images: z.number(),
  }),
  pages: z.record(MigrationPageSchema),
  navigation: z.object({
    ilse_delange: z.array(z.string()),
    common_linnets: z.array(z.string()),
  }),
});

// Validation helper functions
export function validateArtist(data: unknown) {
  return ArtistSchema.parse(data);
}

export function validateAlbum(data: unknown) {
  return AlbumSchema.parse(data);
}

export function validateTrack(data: unknown) {
  return TrackSchema.parse(data);
}

export function validateLyrics(data: unknown) {
  return LyricsSchema.parse(data);
}

export function validateContentInventory(data: unknown) {
  return ContentInventorySchema.parse(data);
}

