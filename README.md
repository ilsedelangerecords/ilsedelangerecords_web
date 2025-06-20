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

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Content Structure

All content is stored as static JSON files in `public/content/`:

- **Albums**: Complete discography with release dates, labels, chart positions
- **Lyrics**: Song lyrics with language detection and structure preservation  
- **Artists**: Artist profiles with biographies and social media links
- **Images**: Optimized album artwork and promotional photos

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
4. **Commit changes**: GitHub Actions will rebuild and deploy

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

## 📝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.

## 📄 License

This project contains copyrighted music content. See individual files for licensing information.

---

**🎵 Preserving musical heritage through modern web technology 🎵**

