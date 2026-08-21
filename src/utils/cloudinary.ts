/**
 * Cloudinary Media & CDN Utility for RONY STORE
 * Provides automatic URL optimization, responsive transformations,
 * and direct upload capabilities to Cloudinary.
 */

export interface CloudinaryOptions {
  cloudName?: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center';
  folder?: string;
}

export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'ronystore';
export const DEFAULT_CLOUDINARY_FOLDER = 'ronystore';

/**
 * Checks if a given URL is already a Cloudinary asset
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

/**
 * Builds an optimized Cloudinary delivery URL with f_auto, q_auto and dimensions
 */
export function buildCloudinaryUrl(
  publicIdOrUrl: string,
  options: CloudinaryOptions = {}
): string {
  if (!publicIdOrUrl) return '';

  const cloudName = options.cloudName || DEFAULT_CLOUDINARY_CLOUD_NAME;
  const format = options.format || 'auto';
  const quality = options.quality || 'auto';
  const crop = options.crop || (options.width && options.height ? 'fill' : 'limit');
  
  const transformations: string[] = [
    `f_${format}`,
    `q_${quality}`
  ];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);

  const transformStr = transformations.join(',');

  // Case 1: Already a Cloudinary URL -> insert/update transformations
  if (isCloudinaryUrl(publicIdOrUrl)) {
    if (publicIdOrUrl.includes('/image/upload/')) {
      // Check if transformations already exist
      const parts = publicIdOrUrl.split('/image/upload/');
      if (parts.length === 2) {
        const afterUpload = parts[1];
        // If there's an existing transform block like f_auto,q_auto/...
        if (afterUpload.match(/^[a-z]_[a-z0-9:,_]+\//i)) {
          const rest = afterUpload.substring(afterUpload.indexOf('/') + 1);
          return `${parts[0]}/image/upload/${transformStr}/${rest}`;
        } else {
          return `${parts[0]}/image/upload/${transformStr}/${afterUpload}`;
        }
      }
    }
    return publicIdOrUrl;
  }

  // Case 2: Clean Public ID (e.g. 'ronystore/products/rony-1-front')
  if (!publicIdOrUrl.startsWith('http://') && !publicIdOrUrl.startsWith('https://') && !publicIdOrUrl.startsWith('data:')) {
    const cleanId = publicIdOrUrl.startsWith('/') ? publicIdOrUrl.substring(1) : publicIdOrUrl;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${cleanId}`;
  }

  // Case 3: External URL (Unsplash or direct CDN) -> Cloudinary Fetch proxy
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformStr}/${encodeURIComponent(publicIdOrUrl)}`;
}

/**
 * General helper to optimize any product/banner/category image URL via Cloudinary
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 1200,
  cloudName: string = DEFAULT_CLOUDINARY_CLOUD_NAME
): string {
  if (!url) return '';
  // If it's a data URL, return as is
  if (url.startsWith('data:image')) return url;
  
  return buildCloudinaryUrl(url, {
    cloudName,
    width,
    quality: 'auto',
    format: 'auto'
  });
}

/**
 * Direct unsigned upload to Cloudinary from browser
 */
export async function uploadToCloudinary(
  file: File | Blob | string,
  cloudName: string = DEFAULT_CLOUDINARY_CLOUD_NAME,
  uploadPreset: string = 'ronystore_unsigned',
  folder: string = 'ronystore/products'
): Promise<{ success: boolean; secureUrl?: string; publicId?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `Upload failed with HTTP ${response.status}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      secureUrl: data.secure_url,
      publicId: data.public_id
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during Cloudinary upload'
    };
  }
}
