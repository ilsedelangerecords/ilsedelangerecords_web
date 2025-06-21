import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function exportToJson() {
  try {
    console.log('🔄 Exporting data from database to JSON files...');

    // Fetch all data with relationships
    const [artists, labels, releases, songs] = await Promise.all([
      prisma.artist.findMany({
        include: {
          releases: {
            include: {
              editions: {
                include: {
                  tracks: {
                    include: {
                      song: {
                        include: {
                          lyrics: true
                        }
                      }
                    }
                  }
                }
              },
              label: true
            }
          }
        }
      }),
      prisma.label.findMany({
        include: {
          releases: true
        }
      }),
      prisma.release.findMany({
        include: {
          artist: true,
          label: true,
          editions: {
            include: {
              tracks: {
                include: {
                  song: {
                    include: {
                      lyrics: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.song.findMany({
        include: {
          lyrics: true,
          tracks: {
            include: {
              edition: {
                include: {
                  release: {
                    include: {
                      artist: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    ]);

    // Ensure output directory exists
    const outputDir = join(__dirname, '..', 'public', 'content');
    mkdirSync(outputDir, { recursive: true });

    // Transform and export artists
    const transformedArtists = artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      bio: artist.bio,
      website: artist.website,
      socialLinks: artist.socialLinks ? JSON.parse(artist.socialLinks) : null,
      releases: artist.releases.map(release => ({
        id: release.id,
        title: release.title,
        slug: release.slug,
        releaseDate: release.releaseDate,
        releaseType: release.releaseType,
        description: release.description
      }))
    }));

    writeFileSync(
      join(outputDir, 'artists.json'),
      JSON.stringify(transformedArtists, null, 2)
    );

    // Transform and export releases (albums)
    const transformedReleases = releases.map(release => ({
      id: release.id,
      title: release.title,
      slug: release.slug,
      artist: {
        id: release.artist.id,
        name: release.artist.name,
        slug: release.artist.slug
      },
      label: release.label ? {
        id: release.label.id,
        name: release.label.name,
        slug: release.label.slug
      } : null,
      releaseDate: release.releaseDate,
      releaseType: release.releaseType,
      description: release.description,
      editions: release.editions.map(edition => ({
        id: edition.id,
        type: edition.type,
        format: edition.format,
        catalog: edition.catalog,
        barcode: edition.barcode,
        releaseDate: edition.releaseDate,
        tracks: edition.tracks
          .sort((a, b) => a.trackNumber - b.trackNumber)
          .map(track => ({
            id: track.id,
            trackNumber: track.trackNumber,
            song: {
              id: track.song.id,
              title: track.song.title,
              slug: track.song.slug,
              duration: track.song.duration,
              writers: track.song.writers ? JSON.parse(track.song.writers) : null,
              composedDate: track.song.composedDate,
              hasLyrics: !!track.song.lyrics
            }
          }))
      }))
    }));

    writeFileSync(
      join(outputDir, 'albums.json'),
      JSON.stringify(transformedReleases, null, 2)
    );

    // Transform and export lyrics
    const transformedLyrics = songs
      .filter(song => song.lyrics)
      .map(song => ({
        id: song.lyrics.id,
        songId: song.id,
        songTitle: song.title,
        songSlug: song.slug,
        content: song.lyrics.content,
        language: song.lyrics.language,
        translation: song.lyrics.translation,
        releases: song.tracks.map(track => ({
          releaseId: track.edition.release.id,
          releaseTitle: track.edition.release.title,
          releaseSlug: track.edition.release.slug,
          artistName: track.edition.release.artist.name,
          trackNumber: track.trackNumber
        }))
      }));

    writeFileSync(
      join(outputDir, 'lyrics.json'),
      JSON.stringify(transformedLyrics, null, 2)
    );

    // Export labels
    const transformedLabels = labels.map(label => ({
      id: label.id,
      name: label.name,
      slug: label.slug,
      releaseCount: label.releases.length
    }));

    writeFileSync(
      join(outputDir, 'labels.json'),
      JSON.stringify(transformedLabels, null, 2)
    );

    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      counts: {
        artists: artists.length,
        releases: releases.length,
        songs: songs.length,
        lyrics: transformedLyrics.length,
        labels: labels.length
      },
      files: [
        'artists.json',
        'albums.json',
        'lyrics.json',
        'labels.json'
      ]
    };

    writeFileSync(
      join(outputDir, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('✅ Export completed successfully!');
    console.log(`📊 Exported: ${artists.length} artists, ${releases.length} releases, ${songs.length} songs, ${transformedLyrics.length} lyrics`);
    console.log(`📁 Files saved to: ${outputDir}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exportToJson();
}

export default exportToJson;
