# SPA Deployment Guide

## 📁 Files to Upload

Upload the entire contents of the `dist/` folder to your web hosting root directory:

```
dist/
├── index.html          # Main SPA entry point
├── .htaccess          # Apache rewrite rules for SPA routing
├── _redirects         # Netlify/Vercel redirect rules (backup)
├── assets/
│   ├── index-*.css    # Bundled CSS
│   └── index-*.js     # Bundled JavaScript
└── content/
    ├── albums.json    # Albums data
    ├── artists.json   # Artists data
    └── lyrics.json    # Complete lyrics database (161 songs)
```

## 🚀 Deployment Steps

### Option 1: Manual Upload (FTP/cPanel)
1. Build the project: `npm run build`
2. Upload all files from `dist/` folder to your hosting root directory
3. Make sure `.htaccess` is uploaded (some FTP clients hide dotfiles)
4. Test the website

### Option 2: Hosting-Specific Instructions

#### **Apache Hosting (Most Common)**
- The `.htaccess` file handles SPA routing automatically
- Ensure `mod_rewrite` is enabled on your server
- All routes will be handled by React Router

#### **Nginx Hosting**
- You'll need to add this to your nginx config:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### **Shared Hosting**
- Upload the `dist/` contents to `public_html/` or `www/`
- The `.htaccess` file should work on most shared hosts

## ✅ What This SPA Version Includes

- **Complete lyrics database** (161 songs)
- **Client-side routing** with React Router
- **Responsive design** for all devices
- **Search functionality** for lyrics
- **Artist and album pages**
- **SEO-friendly meta tags**
- **Fast loading** with bundled assets

## 🔧 Testing Your Deployment

1. Visit your domain
2. Test navigation between pages
3. Try direct URL access (e.g., yourdomain.com/lyrics/song-title)
4. Test the search functionality
5. Verify that all lyrics are loading

## 🆚 SPA vs Static Site

**SPA Advantages:**
- ✅ Faster navigation (no page reloads)
- ✅ Better user experience
- ✅ Smaller file size
- ✅ Works on most hosting providers

**SPA Requirements:**
- Apache with mod_rewrite OR proper server configuration
- Modern browser support (which is universal now)

## 🔧 Troubleshooting

**404 Errors on Direct URLs?**
- Check if `.htaccess` is uploaded and working
- Verify mod_rewrite is enabled
- Contact your hosting provider about SPA support

**Content Not Loading?**
- Check browser console for errors
- Verify JSON files are accessible: `yourdomain.com/content/lyrics.json`

## 📊 File Sizes
- Total: ~435KB (gzipped: ~109KB)
- Very fast loading on any connection

Built on: ${new Date().toISOString().split('T')[0]}
