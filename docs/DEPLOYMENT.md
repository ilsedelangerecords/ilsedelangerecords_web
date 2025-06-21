# Deployment Configuration

This document outlines the deployment setup for the Ilse DeLange Records website.

## Overview

The website is deployed as a **static HTML site** for maximum performance and speed. This approach provides:

- ⚡ **Fastest possible loading times** - No server-side processing
- 🔒 **Enhanced security** - No database or server vulnerabilities
- 💰 **Cost-effective hosting** - Can be hosted on any static hosting service
- 🌍 **Global CDN compatibility** - Works with any CDN for worldwide distribution
- 📱 **Perfect mobile performance** - Optimized static assets

## Deployment Targets

### Staging: staging.ilsedelangerecords.nl
- **Purpose**: Testing and preview environment
- **Deployment**: Automatic on push to `main` or `develop` branches
- **Technology**: Static HTML files with aggressive caching
- **Workflow**: `.github/workflows/deploy-staging.yml`

### Production: ilsedelangerecords.com (when ready)
- **Purpose**: Live website
- **Deployment**: Manual or on release tags
- **Technology**: Static HTML files with production optimizations
- **Workflow**: `.github/workflows/deploy.yml`

## Static Site Generation

The website uses a custom static site generator (`scripts/generate-static-site.js`) that:

1. **Generates HTML pages** for all albums and content
2. **Optimizes assets** and applies compression
3. **Creates SEO files** (sitemap.xml, robots.txt)
4. **Applies caching headers** via .htaccess
5. **Ensures fast loading** with minimal JavaScript

### Generated Pages

- `/` - Homepage
- `/albums/` - Albums listing
- `/album/{slug}/` - Individual album pages (one per album)
- `/content/` - JSON API endpoints for dynamic content

## Required GitHub Secrets

### Staging Deployment
Configure these secrets in your GitHub repository settings:

```
STAGING_SSH_KEY        # Private SSH key for staging server access
STAGING_SSH_HOST       # staging.ilsedelangerecords.nl
STAGING_SSH_USER       # SSH username for staging server
STAGING_SSH_PATH       # Target directory path on staging server (e.g., /var/www/html)
STAGING_SSH_PORT       # SSH port (optional, defaults to 22)
```

### Production Deployment (for future use)
```
PRODUCTION_SSH_KEY     # Private SSH key for production server
PRODUCTION_SSH_HOST    # Production server hostname
PRODUCTION_SSH_USER    # SSH username for production server  
PRODUCTION_SSH_PATH    # Target directory path on production server
PRODUCTION_SSH_PORT    # SSH port (optional, defaults to 22)
```

## Server Requirements

### Minimum Requirements
- **Web server**: Apache, Nginx, or any static file server
- **Storage**: ~50MB for full site
- **SSL certificate**: For HTTPS (recommended)

### Recommended Setup
- **Web server**: Apache with mod_rewrite enabled
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Browser caching with appropriate headers
- **CDN**: CloudFlare or similar for global distribution

### Apache Configuration
The deployment includes an optimized `.htaccess` file with:
- Gzip compression for all text files
- Long-term caching for static assets
- Security headers
- Pretty URLs (removes .html extensions)

## Deployment Process

### Staging Deployment
1. Push code to `main` or `develop` branch
2. GitHub Actions builds static site
3. Optimizes files and adds caching headers
4. Deploys via rsync to staging server
5. Verifies deployment success

### Manual Deployment
```bash
# Build static site locally
npm run build:staging

# The dist/ folder contains the complete website
# Upload contents to web server
```

## Performance Optimizations

### Build Optimizations
- **Static HTML generation** - No client-side routing overhead
- **Optimized images** - Proper compression and formats
- **Minimal JavaScript** - Only essential functionality
- **CSS optimization** - Tailwind CSS with purging

### Server Optimizations
- **Gzip compression** - Reduces transfer sizes by ~70%
- **Browser caching** - Images cached for 1 year, HTML for 1 day
- **Content Security Policy** - Security headers included
- **HTTP/2 support** - For multiplexed connections

## Monitoring & Verification

Each deployment includes automatic verification:
- Homepage accessibility test
- Content API availability check
- SSL certificate validation
- Performance benchmarking

## File Structure

```
dist/                          # Generated static site
├── index.html                 # Homepage
├── albums/
│   └── index.html             # Albums listing
├── album/
│   ├── {album-slug}/
│   │   └── index.html         # Individual album pages
├── content/
│   ├── albums.json            # Albums data
│   ├── lyrics.json            # Lyrics data
│   └── artists.json           # Artists data
├── images/                    # Optimized images
├── .htaccess                  # Apache optimization rules
├── sitemap.xml                # SEO sitemap
└── robots.txt                 # Search engine directives
```

## Troubleshooting

### Common Issues
1. **404 errors**: Check .htaccess rules and mod_rewrite
2. **Slow loading**: Verify compression and caching headers
3. **SSH deployment fails**: Check SSH key permissions and server access

### Debug Commands
```bash
# Test local build
npm run build:staging
npm run serve:static

# Check deployment status
curl -I https://staging.ilsedelangerecords.nl/

# Verify content API
curl https://staging.ilsedelangerecords.nl/content/albums.json
```

## Security Considerations

- **No database exposure** - Static files only
- **Security headers** - CSP, HSTS, X-Frame-Options included
- **SSH key management** - Secure deployment access
- **HTTPS enforcement** - SSL required for all content

## Future Enhancements

- **CDN integration** - Global content distribution
- **Automated performance monitoring** - Lighthouse CI
- **Cache invalidation** - Smart cache busting strategies
- **Progressive Web App** - Offline functionality
