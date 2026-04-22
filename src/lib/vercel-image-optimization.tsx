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
  
  // For Supabase URLs, use them directly - Supabase has its own CDN and optimization
  if (src.includes('supabase')) {
    return src;
  }
  
  // Use Vercel Image Proxy API only for non-Supabase URLs
  const isDev = import.meta.env && import.meta.env.DEV;
  if (!isDev) {
    let url = `/_vercel/image?url=${encodeURIComponent(src)}`;
    if (width) url += `&w=${width}`;
    url += `&q=${quality}`;
    return url;
  }
  
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
        aspectRatio ? { aspectRatio, objectFit: 'cover' } : { objectFit: 'cover' }
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

  const optimizedSrc = getVercelOptimizedImageUrl(src, width);
  
  const srcSet = import.meta.env && import.meta.env.DEV 
    ? undefined 
    : `${getVercelOptimizedImageUrl(src, 400)} 400w, ${getVercelOptimizedImageUrl(src, 800)} 800w, ${getVercelOptimizedImageUrl(src, 1200)} 1200w`;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={
        height ? { aspectRatio: `${width}/${height}`, objectFit: 'cover' } : { objectFit: 'cover' }
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
