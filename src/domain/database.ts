// Database service for interacting with Prisma
import { PrismaClient } from '@prisma/client';
import { 
  CreateArtistInput, 
  CreateReleaseInput, 
  CreateSongInput,
  ReleaseWithDetails,
  SongWithLyrics,
  ArtistWithReleases,
  ReleaseFilters,
  SongFilters
} from './types.js';

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  // Artist operations
  async createArtist(data: CreateArtistInput) {
    return this.prisma.artist.create({
      data,
    });
  }

  async getArtistByName(name: string) {
    return this.prisma.artist.findUnique({
      where: { name },
    });
  }

  async getOrCreateArtist(name: string, data?: Partial<CreateArtistInput>) {
    const existing = await this.getArtistByName(name);
    if (existing) return existing;
    
    return this.createArtist({
      name,
      ...data,
    });
  }

  async getArtistWithReleases(id: string): Promise<ArtistWithReleases | null> {
    return this.prisma.artist.findUnique({
      where: { id },
      include: {
        releases: {
          include: {
            label: true,
            editions: true,
          },
        },
      },
    });
  }

  // Label operations
  async createLabel(data: { name: string; country?: string; foundedYear?: number }) {
    return this.prisma.label.create({
      data,
    });
  }

  async getOrCreateLabel(name: string, data?: { country?: string; foundedYear?: number }) {
    const existing = await this.prisma.label.findUnique({
      where: { name },
    });
    if (existing) return existing;
    
    return this.createLabel({
      name,
      ...data,
    });
  }

  // Release operations
  async createRelease(data: CreateReleaseInput) {
    return this.prisma.release.create({
      data,
    });
  }

  async getReleaseWithDetails(id: string): Promise<ReleaseWithDetails | null> {
    return this.prisma.release.findUnique({
      where: { id },
      include: {
        primaryArtist: true,
        label: true,
        editions: {
          include: {
            tracks: {
              include: {
                song: {
                  include: {
                    lyrics: true,
                  },
                },
              },
            },
          },
        },
        chartEntries: true,
        mediaAssets: true,
      },
    });
  }

  async getReleases(filters?: ReleaseFilters) {
    const where: any = {};
    
    if (filters?.artist) {
      where.primaryArtist = {
        name: { contains: filters.artist, mode: 'insensitive' },
      };
    }
    
    if (filters?.releaseType) {
      where.releaseType = filters.releaseType;
    }
    
    if (filters?.year) {
      where.releaseDate = {
        gte: new Date(`${filters.year}-01-01`),
        lt: new Date(`${filters.year + 1}-01-01`),
      };
    }
    
    if (filters?.label) {
      where.label = {
        name: { contains: filters.label, mode: 'insensitive' },
      };
    }

    return this.prisma.release.findMany({
      where,
      include: {
        primaryArtist: true,
        label: true,
        editions: {
          select: {
            format: true,
            region: true,
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });
  }

  // Song operations
  async createSong(data: CreateSongInput) {
    const { lyrics, writers, ...songData } = data;
    
    // Handle writers array as JSON string
    const writersJson = writers ? JSON.stringify(writers) : null;
    
    return this.prisma.song.create({
      data: {
        ...songData,
        writers: writersJson,
        lyrics: lyrics ? {
          create: lyrics,
        } : undefined,
      },
      include: {
        lyrics: true,
      },
    });
  }

  async getSongWithLyrics(id: string): Promise<SongWithLyrics | null> {
    return this.prisma.song.findUnique({
      where: { id },
      include: {
        lyrics: true,
        tracks: {
          include: {
            edition: {
              include: {
                release: {
                  include: {
                    primaryArtist: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getSongs(filters?: SongFilters) {
    const where: any = {};
    
    if (filters?.language) {
      where.language = filters.language;
    }
    
    if (filters?.hasLyrics !== undefined) {
      where.lyrics = filters.hasLyrics ? { isNot: null } : { is: null };
    }

    return this.prisma.song.findMany({
      where,
      include: {
        lyrics: true,
        tracks: {
          include: {
            edition: {
              include: {
                release: {
                  include: {
                    primaryArtist: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  // Edition and Track operations
  async createEdition(data: {
    releaseId: string;
    catalogNumber?: string;
    format: string;
    region?: string;
    extraNotes?: string;
  }) {
    return this.prisma.edition.create({
      data: {
        ...data,
        format: data.format as any, // Type assertion for enum
      },
    });
  }

  async createTrack(data: {
    editionId: string;
    position: number;
    songId: string;
    duration?: number;
    isBonus?: boolean;
    guestArtists?: string[];
  }) {
    const { guestArtists, ...trackData } = data;
    const guestArtistsJson = guestArtists ? JSON.stringify(guestArtists) : null;
    
    return this.prisma.track.create({
      data: {
        ...trackData,
        guestArtists: guestArtistsJson,
      },
    });
  }

  // Statistics and counts
  async getStatistics() {
    const [artistCount, releaseCount, songCount, lyricsCount] = await Promise.all([
      this.prisma.artist.count(),
      this.prisma.release.count(),
      this.prisma.song.count(),
      this.prisma.lyrics.count(),
    ]);

    return {
      artists: artistCount,
      releases: releaseCount,
      songs: songCount,
      lyrics: lyricsCount,
    };
  }

  // Cleanup and reset
  async resetDatabase() {
    // Delete in reverse order of dependencies
    await this.prisma.chartEntry.deleteMany();
    await this.prisma.mediaAsset.deleteMany();
    await this.prisma.track.deleteMany();
    await this.prisma.lyrics.deleteMany();
    await this.prisma.song.deleteMany();
    await this.prisma.edition.deleteMany();
    await this.prisma.release.deleteMany();
    await this.prisma.label.deleteMany();
    await this.prisma.artist.deleteMany();
  }

  // Raw access to Prisma client for complex operations
  get client() {
    return this.prisma;
  }
}

// Singleton instance
const db = new DatabaseService();

export { db, DatabaseService };
export default db;
