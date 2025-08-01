# 🎵 Ilse DeLange Records - Static Website

A fully static React application showcasing the complete discography and lyrics collection of Ilse DeLange and The Common Linnets.

## 🚀 Features

- **Fully Static**: Pre-compiled content, no server-side processing required
- **Complete Discography**: 44+ albums and singles with detailed metadata
- **Lyrics Collection**: 41+ song lyrics with search and filtering
- **Responsive Design**: Works perfectly on desktop and mobile
- **Fast Loading**: Optimized static assets and content
- **GitHub Integration**: Edit content directly through GitHub

## 📦 Build Output

The build process creates a fully static website with:

```
dist/
├── index.html              # Main HTML file
├── assets/                 # CSS and JS bundles
│   ├── index-[hash].css   # Compiled styles
│   └── index-[hash].js    # Compiled JavaScript
├── content/               # JSON data files
│   ├── albums.json       # Album discography (44 items)
│   ├── lyrics.json       # Song lyrics (41 items)
│   ├── artists.json      # Artist information (2 items)
│   └── *.json           # Additional metadata
├── images/               # Optimized images (1000+ files)
│   ├── album covers
│   ├── artist photos
│   └── promotional images
└── favicon.ico          # Site favicon
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm (specified in package.json)

### Quick Start with GitHub Codespaces

The fastest way to start developing:

1. **Click "Code" → "Create codespace on main"** in GitHub
2. **Wait for automatic setup** (dependencies install automatically)
3. **Run `pnpm run dev`** and start coding!

See [.devcontainer/README.md](.devcontainer/README.md) for full details.

### Local Development Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Build with content validation
pnpm run build:validate

# Preview production build
pnpm run preview
```

### Content Structure

All content is stored as static JSON files in `public/content/`:

- **Albums**: Complete discography with release dates, labels, chart positions
- **Lyrics**: Add entries to `public/content/lyrics.json`  
- **Artists**: Artist profiles with biographies and social media links
- **Images**: Place in `public/images/` directory
- **Favicon**: Place `favicon.ico` in `public/` directory

## 🚀 Deployment

### Static Hosting
The built website can be deployed to any static hosting service:

- **Netlify**: Connect repository for automatic deployment
- **Vercel**: Deploy with build command `pnpm run build`
- **GitHub Pages**: Use the `dist/` folder contents
- **Traditional hosting**: Upload `dist/` folder contents to web server

### GitHub Actions
Automated deployment is configured via GitHub Actions:

```yaml
# Builds and deploys on every push to main
- Build with pnpm
- Copy public assets to dist
- Validate content integrity
- Deploy via rsync to production server
```

### Server Requirements
- **Static file serving** (Apache, Nginx, CDN)
- **No server-side processing** required
- **HTTPS recommended** for modern web standards

## 📊 Content Management

### Adding New Content
1. **Albums**: Add entries to `public/content/albums.json`
2. **Lyrics**: Add entries to `public/content/lyrics.json`  
3. **Images**: Place in `public/images/` directory
4. **Favicon**: Place `favicon.ico` in `public/` directory
5. **Commit changes**: GitHub Actions will rebuild and deploy

### Content Validation
- JSON schema validation in CI/CD
- Image reference checking
- Content integrity verification
- Build-time error detection

## 🔧 Technical Details

### Static Generation
- **Vite build system** for optimal bundling
- **React components** pre-compiled to static HTML/CSS/JS
- **Content pre-loading** for instant navigation
- **Image optimization** with multiple formats

### Performance
- **Minimal JavaScript**: Only essential React code
- **CSS optimization**: Tailwind CSS with purging
- **Asset optimization**: Images compressed and optimized
- **Caching friendly**: Hashed filenames for cache busting

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile optimized**: Responsive design with touch support
- **Progressive enhancement**: Works without JavaScript for basic content

## 🏗️ Static Site Generation

For SEO optimization and faster loading, this project supports generating a completely static HTML version:

### Generate Static Site

```bash
# Generate static HTML files for all pages
npm run build:static

# Serve the static site locally
npm run serve:static
```

This creates:
- **Flat HTML structure**: Each album gets its own `/album/[slug]/index.html`
- **SEO optimized**: Proper meta tags, Open Graph, and structured data
- **No JavaScript required**: Content is server-side rendered in HTML
- **Fast indexing**: Search engines can crawl all content immediately

### Static Site Structure

```
dist/
├── index.html                          # Homepage
├── albums/index.html                   # Albums listing page
├── album/                              # Individual album pages
│   ├── 2-original-albums/index.html    # Album detail pages
│   ├── flying-blind/index.html
│   └── ...32 more albums
├── images/                             # All album cover images
│   └── albums/*.jpg
└── content/                            # JSON data files
    └── albums.json
```

### Benefits of Static Generation

✅ **SEO-friendly**: All content is in HTML, easily crawled by search engines  
✅ **Fast loading**: No client-side JavaScript needed for content  
✅ **Better indexing**: Search engines can index all albums immediately  
✅ **Works without JS**: Accessible even when JavaScript is disabled  
✅ **CDN ready**: Can be deployed to any static hosting (GitHub Pages, Netlify, Vercel)

## 📝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.

## 📄 License

This project contains copyrighted music content. See individual files for licensing information.

---

**🎵 Preserving musical heritage through modern web technology 🎵**


