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
 * This transforms any image URL through Vercel's edge network
 * for automatic WebP conversion, resizing, and caching
 */
export function getVercelOptimizedImageUrl(
  src: string,
  width?: number,
  quality: number = 80
): string {
  if (!src) return '';
  
  // If already optimized or relative path, return as-is
  if (src.includes('_vercel') || !src.startsWith('http')) {
    return src;
  }

  // Build Vercel image optimization URL
  const params = new URLSearchParams();
  params.append('url', src);
  params.append('w', (width || 800).toString());
  params.append('q', quality.toString());

  // Use Vercel's image optimization endpoint
  return `/_vercel/image?${params.toString()}`;
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

/**
 * Picture Element for Advanced Responsive Images
 * 
 * Provides srcset for different sizes
 * Supports device pixel ratios
 */
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

  // Generate srcset with multiple sizes
  const widths = [400, 600, 800, 1200];
  const srcSet = widths
    .map((w) => {
      const optimizedUrl = getVercelOptimizedImageUrl(src, w);
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');

  const optimizedSrc = getVercelOptimizedImageUrl(src, width);

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source
        type="image/webp"
        sizes={sizes}
        srcSet={srcSet.replace(/\.jpg|\.png/g, '.webp')}
      />
      
      {/* Fallback JPEG */}
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
    </picture>
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
