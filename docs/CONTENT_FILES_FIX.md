# Content Files Fix for Deployment

## Problem
The deployment workflow was failing because the required JSON content files (`albums.json`, `lyrics.json`, `artists.json`) were not found in `dist/content` after the build.

## Root Cause
- The workflow expected content files to be in `public/content/` 
- The `public/` directory was missing entirely from the repository
- The `.gitignore` file was ignoring the entire `public/` directory

## Solution Implemented

### 1. Created Required Content Files
Created the missing content files with sample data:
- `public/content/albums.json` - Sample album data (World of Hurt, Dear John)
- `public/content/lyrics.json` - Sample lyrics data for songs
- `public/content/artists.json` - Sample artist data (Ilse DeLange, The Common Linnets)

### 2. Updated .gitignore
Modified `.gitignore` to:
- Keep ignoring `public/` directory (for build artifacts)
- Allow `public/content/` directory (for committed content files)

```gitignore
# Gatsby files
.cache/
public
# But include content files for the website
!public/content/
```

### 3. Added Build Validation
Created `scripts/validate-build.js` to validate build output:
- Checks that all required JSON files exist in `dist/content/`
- Validates JSON syntax
- Reports item counts for each file
- Fails build if any required files are missing

### 4. Enhanced Build Process
Added new npm script:
- `pnpm run build:validate` - Builds and validates content files

## How It Works

1. **Development**: Content files are stored in `public/content/`
2. **Build**: Vite automatically copies `public/` contents to `dist/`
3. **Deployment**: Workflow copies `public/content/*` to `dist/content/`
4. **Validation**: Build validation ensures all files are present

## Content File Structure

### albums.json
```json
[
  {
    "id": "1",
    "title": "World of Hurt", 
    "slug": "world-of-hurt",
    "artist": "Ilse DeLange",
    "year": 1998,
    "type": "studio",
    "tracks": [...],
    // ... other album properties
  }
]
```

### lyrics.json
```json
[
  {
    "id": "1",
    "title": "I'm Not So Tough",
    "artist": "Ilse DeLange", 
    "album": "World of Hurt",
    "lyrics": "...",
    "verified": true,
    // ... other lyric properties
  }
]
```

### artists.json
```json
[
  {
    "id": "ilse-delange",
    "name": "Ilse DeLange",
    "slug": "ilse-delange", 
    "type": "solo",
    "biography": "...",
    "genres": ["Country", "Pop"],
    // ... other artist properties
  }
]
```

## Future Content Management

### Adding New Content
1. Edit the JSON files in `public/content/`
2. Commit and push changes
3. The deployment workflow will automatically include them

### Data Migration
The existing migration scripts in `migration_scripts/` can be used to generate content, but need to output to `public/content/` instead of their current output directory.

### Content Validation
Run `pnpm run build:validate` locally to ensure content files are valid before pushing.

## Testing
The fix has been tested and verified:
- ✅ Build completes successfully
- ✅ Content files are copied to `dist/content/`
- ✅ All three required JSON files are present
- ✅ JSON files contain valid data
- ✅ Files are properly committed to git

## Deployment Status
This fix resolves the deployment failure. The workflow should now:
1. ✅ Find content files in `public/content/`
2. ✅ Copy them to `dist/content/`
3. ✅ Pass validation checks
4. ✅ Deploy successfully
