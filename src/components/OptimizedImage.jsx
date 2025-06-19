import React from 'react';

// Image component with fallback and error handling
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/images/placeholder.jpg',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        {...props}
      />
      {hasError && imageSrc === fallback && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center p-4">
            <div className="mb-2">🖼️</div>
            <div>Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Image utility functions
export const imageUtils = {
  // Get optimized image URL
  getImageUrl: (imagePath, size = 'medium') => {
    if (!imagePath) return '/images/placeholder.jpg';
    
    // Handle external URLs
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle absolute paths
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Convert old image paths to new optimized paths
    const filename = imagePath.split('/').pop();
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const ext = filename.split('.').pop();
    
    // Size variants
    const sizeMap = {
      small: '_small',
      medium: '',
      large: '_large',
      thumbnail: '_thumb'
    };
    
    const sizeSuffix = sizeMap[size] || '';
    return `/images/${nameWithoutExt}${sizeSuffix}.${ext}`;
  },

  // Get album cover art URL
  getAlbumCoverUrl: (album, size = 'medium') => {
    if (album?.images?.cover_art) {
      return imageUtils.getImageUrl(album.images.cover_art, size);
    }
    if (album?.coverArt) {
      return imageUtils.getImageUrl(album.coverArt, size);
    }
    return '/images/album-placeholder.jpg';
  },

  // Get artist profile image URL
  getArtistImageUrl: (artist, type = 'profile', size = 'medium') => {
    const imageKey = type === 'banner' ? 'banner_image' : 'profile_image';
    
    if (artist?.images?.[imageKey]) {
      return imageUtils.getImageUrl(artist.images[imageKey], size);
    }
    
    const fallbackKey = type === 'banner' ? 'bannerImage' : 'profileImage';
    if (artist?.[fallbackKey]) {
      return imageUtils.getImageUrl(artist[fallbackKey], size);
    }
    
    return type === 'banner' ? '/images/artist-banner-placeholder.jpg' : '/images/artist-placeholder.jpg';
  },

  // Preload image
  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Generate responsive image srcSet
  generateSrcSet: (basePath) => {
    if (!basePath) return '';
    
    const sizes = [
      { suffix: '_small', width: 400 },
      { suffix: '', width: 800 },
      { suffix: '_large', width: 1200 }
    ];
    
    return sizes
      .map(({ suffix, width }) => {
        const url = imageUtils.getImageUrl(basePath.replace(/\.[^/.]+$/, suffix + basePath.match(/\.[^/.]+$/)?.[0] || ''));
        return `${url} ${width}w`;
      })
      .join(', ');
  }
};

// Album cover component
export const AlbumCover = ({ album, size = 'medium', className = '', ...props }) => {
  const src = imageUtils.getAlbumCoverUrl(album, size);
  const alt = `${album?.title || 'Album'} cover art`;
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      fallback="/images/album-placeholder.jpg"
      {...props}
    />
  );
};

// Artist image component
export const ArtistImage = ({ artist, type = 'profile', size = 'medium', className = '', ...props }) => {
  const src = imageUtils.getArtistImageUrl(artist, type, size);
  const alt = `${artist?.name || 'Artist'} ${type} image`;
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      fallback={type === 'banner' ? '/images/artist-banner-placeholder.jpg' : '/images/artist-placeholder.jpg'}
      {...props}
    />
  );
};

// Lazy loading image component
export const LazyImage = ({ src, alt, className = '', threshold = 0.1, ...props }) => {
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <OptimizedImage src={src} alt={alt} className={className} {...props} />
      ) : (
        <div className={`bg-gray-200 animate-pulse ${className}`}>
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

// Image gallery component
export const ImageGallery = ({ images, className = '' }) => {
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center p-8">
          <div className="text-4xl mb-2">🖼️</div>
          <div>No images available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main image */}
      <div className="mb-4">
        <OptimizedImage
          src={imageUtils.getImageUrl(images[selectedImage])}
          alt={`Gallery image ${selectedImage + 1}`}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <OptimizedImage
                src={imageUtils.getImageUrl(image, 'thumbnail')}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

