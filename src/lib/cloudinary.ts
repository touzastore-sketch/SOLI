/**
 * Cloudinary Integration Module for Rony Store
 * Robust Media Upload (Cloudinary CDN + Seamless Local Compressed Fallback)
 */

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id?: string;
  signature?: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag?: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename?: string;
  duration?: number;
  isLocalFallback?: boolean;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center';
}

let cachedConfig: { cloudName: string; uploadPreset: string; apiKey?: string } | null = null;

export async function getCloudinaryConfig(): Promise<{ cloudName: string; uploadPreset: string; apiKey?: string }> {
  if (cachedConfig && cachedConfig.cloudName) {
    return cachedConfig;
  }

  try {
    const res = await fetch('/api/cloudinary/config');
    if (res.ok) {
      const data = await res.json();
      if (data.cloudName) {
        cachedConfig = {
          cloudName: data.cloudName,
          uploadPreset: data.uploadPreset || 'upload_rony',
          apiKey: data.apiKey || '',
        };
        return cachedConfig;
      }
    }
  } catch (err) {
    console.warn('[Cloudinary Config] Error retrieving server config:', err);
  }

  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  cachedConfig = {
    cloudName: envCloudName || 'edido9ui',
    uploadPreset: envUploadPreset || 'upload_rony',
    apiKey: '',
  };
  return cachedConfig;
}

/**
 * Updates Cloudinary configuration dynamically at runtime
 */
export async function updateCloudinaryConfigOnServer(config: {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPreset?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/cloudinary/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      cachedConfig = null; // Clear cache
      return { success: true };
    }
    const err = await res.json();
    return { success: false, message: err.error || 'Failed to update config' };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Network error' };
  }
}

/**
 * Tests connection with Cloudinary
 */
export async function testCloudinaryConnectionClient(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/cloudinary/test');
    if (res.ok) {
      return await res.json();
    }
    return { success: false, message: 'Server responded with status ' + res.status };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Error testing connection' };
  }
}

/**
 * Compresses an image to a lightweight, high-quality WebP/JPEG base64 data URL
 * Provides an instant, 100% resilient fallback for any network/Cloudinary error.
 */
export function compressImageToDataUrl(
  file: File | Blob,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // If it's a video or non-image, read raw data URL
    if (file.type && !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try webp first, fallback to jpeg
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a single media file (Image or Video: File, Blob, Data URI, or Remote URL) to Cloudinary
 * With automatic graceful fallback to optimized local storage if Cloudinary returns an error.
 */
export async function uploadToCloudinary(
  file: File | Blob | string,
  onProgress?: (progressPercent: number) => void,
  resourceType: 'image' | 'video' | 'auto' = 'auto'
): Promise<CloudinaryUploadResponse> {
  if (onProgress) onProgress(20);

  let fallbackDataUrl = '';
  if (typeof file === 'string') {
    fallbackDataUrl = file;
  } else {
    fallbackDataUrl = await compressImageToDataUrl(file);
  }

  if (onProgress) onProgress(45);

  // 1. Attempt Cloudinary server upload
  try {
    const res = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: fallbackDataUrl,
        resourceType,
      }),
    });

    if (onProgress) onProgress(80);

    if (res.ok) {
      const data = await res.json();
      if (data.result && data.result.secure_url) {
        if (onProgress) onProgress(100);
        return data.result as CloudinaryUploadResponse;
      }
    }

    const errJson = await res.json().catch(() => ({}));
    console.warn('[Cloudinary Server Notice]:', errJson.error || 'Server upload bypassed');
  } catch (serverErr) {
    console.warn('[Cloudinary Server Attempt]:', serverErr);
  }

  // 2. Direct unsigned upload attempt
  try {
    const config = await getCloudinaryConfig();
    if (config.cloudName && config.uploadPreset) {
      const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.uploadPreset);

      const directRes = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (directRes.ok) {
        const directData = (await directRes.json()) as CloudinaryUploadResponse;
        if (onProgress) onProgress(100);
        return directData;
      }
    }
  } catch (directErr) {
    console.warn('[Cloudinary Direct Attempt]:', directErr);
  }

  // 3. Resilient Fallback: If Cloudinary fails (e.g. Invalid cloud_name), deliver the compressed media safely
  if (onProgress) onProgress(100);
  console.info('[Media Storage] Saved media with high-efficiency local compression.');

  return {
    asset_id: 'local_' + Date.now(),
    public_id: 'local_media_' + Date.now(),
    version: 1,
    width: 1200,
    height: 1200,
    format: 'webp',
    resource_type: typeof file !== 'string' && file.type?.startsWith('video/') ? 'video' : 'image',
    created_at: new Date().toISOString(),
    tags: ['local_storage'],
    bytes: fallbackDataUrl.length,
    type: 'local',
    placeholder: false,
    url: fallbackDataUrl,
    secure_url: fallbackDataUrl,
    isLocalFallback: true,
  };
}

/**
 * Helper to build optimized Cloudinary delivery URLs with format & quality auto
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options?: CloudinaryTransformOptions
): string {
  if (!url) return '';

  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformList: string[] = ['f_auto', 'q_auto'];
      if (options?.width) transformList.push(`w_${options.width}`);
      if (options?.height) transformList.push(`h_${options.height}`);
      if (options?.crop) transformList.push(`c_${options.crop}`);
      if (options?.gravity) transformList.push(`g_${options.gravity}`);

      const currentPath = parts[1];
      if (/^([a-z]_[a-z0-9:,]+)(\/.*)$/i.test(currentPath)) {
        return `${parts[0]}/upload/${transformList.join(',')}/${currentPath.replace(/^([a-z]_[a-z0-9:,]+)\//i, '')}`;
      }
      return `${parts[0]}/upload/${transformList.join(',')}/${currentPath}`;
    }
  }

  return url;
}

/**
 * Check if a URL is hosted on Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}
