// Domain types that re-export Prisma types and add utility types
import { Prisma, ReleaseType, Format, MediaAssetType } from '@prisma/client';

// Re-export Prisma generated types
export type {
  Artist,
  Label,
  Release,
  Edition,
  Song,
  Track,
  Lyrics,
  ChartEntry,
  MediaAsset,
  ReleaseType,
  Format,
  MediaAssetType,
} from '@prisma/client';

// Utility types for complex queries
export type ReleaseWithDetails = Prisma.ReleaseGetPayload<{
  include: {
    primaryArtist: true;
    label: true;
    editions: {
      include: {
        tracks: {
          include: {
            song: {
              include: {
                lyrics: true;
              };
            };
          };
        };
      };
    };
    chartEntries: true;
    mediaAssets: true;
  };
}>;

export type SongWithLyrics = Prisma.SongGetPayload<{
  include: {
    lyrics: true;
    tracks: {
      include: {
        edition: {
          include: {
            release: {
              include: {
                primaryArtist: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type ArtistWithReleases = Prisma.ArtistGetPayload<{
  include: {
    releases: {
      include: {
        label: true;
        editions: true;
      };
    };
  };
}>;

// Input types for forms
export interface CreateArtistInput {
  name: string;
  country?: string;
  activeFrom?: number;
  activeTo?: number;
}

export interface CreateReleaseInput {
  title: string;
  releaseType: ReleaseType;
  primaryArtistId: string;
  releaseDate?: Date;
  labelId?: string;
  description?: string;
}

export interface CreateSongInput {
  title: string;
  language: string;
  writers?: string[];
  isCover?: boolean;
  lyrics?: {
    text: string;
    language: string;
    sourceUrl?: string;
  };
}

// Helper types for JSON export
export interface ExportedRelease {
  id: string;
  title: string;
  releaseType: string;
  artist: string;
  releaseDate?: string;
  label?: string;
  description?: string;
  tracks: ExportedTrack[];
  coverUrl?: string;
}

export interface ExportedTrack {
  position: number;
  title: string;
  duration?: number;
  isBonus: boolean;
  guestArtists?: string[];
  lyrics?: string;
}

export interface ExportedSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  language: string;
  content?: string;
  writers?: string[];
  verified: boolean;
}

// Query filters
export interface ReleaseFilters {
  artist?: string;
  releaseType?: ReleaseType;
  year?: number;
  label?: string;
}

export interface SongFilters {
  artist?: string;
  language?: string;
  hasLyrics?: boolean;
  album?: string;
}
