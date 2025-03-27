import { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mantine/core';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

/**
 * OptimizedImage component with lazy loading, next-gen format support, and proper loading indicators
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio = '16/9',
  priority = false,
  className = '',
  style = {},
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate WebP version of image URL if from unsplash or common formats
  const generateWebPUrl = (url: string) => {
    // If already webp, return as is
    if (url.endsWith('.webp')) return url;
    
    // Handle Unsplash images - they support format conversion
    if (url.includes('unsplash.com')) {
      return url.includes('?') 
        ? `${url}&fm=webp&q=80` 
        : `${url}?fm=webp&q=80`;
    }
    
    // For your own images, you'd need to have a WebP version available
    // This is a simplified approach assuming your backend can serve WebP
    if (url.match(/\.(jpe?g|png)$/i)) {
      return url.replace(/\.(jpe?g|png)$/i, '.webp');
    }
    
    return url;
  };

  // Check if the browser supports WebP
  const supportsWebp = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };
  
  const imageUrl = supportsWebp() ? generateWebPUrl(src) : src;
  
  // Handle load event
  const handleImageLoaded = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle error event
  const handleImageError = () => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Check if image is already loaded (for cached images)
  useEffect(() => {
    if (imgRef.current?.complete) {
      handleImageLoaded();
    }
  }, [src]);

  // Calculate aspect ratio inline style if dimensions not provided
  const containerStyle = {
    ...style,
    ...((!width || !height) && { aspectRatio }),
    position: 'relative' as const,
  };

  return (
    <Box className={`image-container ${className}`} style={containerStyle}>
      {!isLoaded && !isError && (
        <Skeleton
          visible
          height="100%"
          width="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      
      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'} 
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className={`lazy-load ${isLoaded ? 'loaded' : ''}`}
        style={{
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      
      {isError && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mantine-color-gray-1)',
            color: 'var(--mantine-color-gray-7)',
          }}
        >
          Image failed to load
        </Box>
      )}
    </Box>
  );
}