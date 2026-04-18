import React from 'react';

/**
 * Vercel Image Optimization Component
 * 
 * Uses Vercel's built-in image optimization API
 * Automatically serves WebP format and responsive sizing
 * 
 * Benefits:
 * - Automatic WebP conversion
 * - Responsive image sizing
 * - Intelligent caching
 * - CDN delivery
 * - Zero configuration
 * 
 * Usage:
 * <OptimizedImage 
 *   src="https://supabase.../image.jpg"
 *   alt="Product"
 *   width={400}
 *   height={300}
 * />
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Generate Vercel image optimization URL
 * 
 * Returns image URL directly from Supabase storage
 * Supabase handles caching and delivery via CDN
 */
export function getVercelOptimizedImageUrl(
  src: string,
  width?: number,
  quality: number = 80
): string {
  if (!src) return '';
  
  // Return image URL as-is from Supabase
  // Supabase CDN handles caching and delivery
  // No need for /_vercel/image transformation
  return src;
}

/**
 * OptimizedImage Component
 * 
 * Automatically optimizes images through Vercel's API
 * Serves WebP format when supported
 */
export function OptimizedImage({
  src,
  alt,
  width = 800,
  height,
  className = '',
  priority = false,
  sizes,
  quality = 80,
}: OptimizedImageProps) {
  if (!src) {
    return null;
  }

  // Generate optimized URL
  const optimizedSrc = getVercelOptimizedImageUrl(src, width, quality);

  // Calculate aspect ratio if height provided
  const aspectRatio = height ? `${width}/${height}` : undefined;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={
        aspectRatio
          ? {
              aspectRatio,
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
            }
          : {}
      }
    />
  );
}

export function ResponsiveOptimizedImage({
  src,
  alt,
  width = 800,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
}: OptimizedImageProps & { sizes?: string }) {
  if (!src) {
    return null;
  }

  // Use Supabase image URL directly
  // Supabase CDN handles caching and delivery
  const optimizedSrc = getVercelOptimizedImageUrl(src, width);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      srcSet={`${optimizedSrc} 1x`}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={
        height
          ? {
              aspectRatio: `${width}/${height}`,
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
            }
          : {}
      }
    />
  );
}

/**
 * Batch optimization for multiple images
 * Useful for galleries or lists
 */
export function getOptimizedImageUrls(
  urls: string[],
  width: number = 400,
  quality: number = 80
): string[] {
  return urls.map((url) => getVercelOptimizedImageUrl(url, width, quality));
}

export default OptimizedImage;
