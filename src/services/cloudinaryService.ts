/**
 * Cloudinary Media Upload Service (Images & Videos)
 * Connects securely to Cloudinary using Environment Variables
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at: string;
}

export interface UploadOptions {
  resourceType?: 'image' | 'video' | 'auto';
  folder?: string;
  onProgress?: (progressPercent: number) => void;
}

// Read from client environment variables
const ENV_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const ENV_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Gets the active Cloudinary credentials from environment variables or backend
 */
export async function getCloudinaryConfig(): Promise<{ cloudName: string; uploadPreset: string }> {
  if (ENV_CLOUD_NAME && ENV_UPLOAD_PRESET) {
    return {
      cloudName: ENV_CLOUD_NAME,
      uploadPreset: ENV_UPLOAD_PRESET,
    };
  }

  try {
    const res = await fetch('/api/cloudinary/config');
    if (res.ok) {
      const data = await res.json();
      if (data.cloudName && data.uploadPreset) {
        return {
          cloudName: data.cloudName,
          uploadPreset: data.uploadPreset,
        };
      }
    }
  } catch (e) {
    console.warn('[Cloudinary Service] Could not fetch server config:', e);
  }

  return {
    cloudName: ENV_CLOUD_NAME || '',
    uploadPreset: ENV_UPLOAD_PRESET || '',
  };
}

/**
 * Uploads a local image or video file to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(
  file: File | Blob,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { resourceType = 'auto', folder, onProgress } = options;
  const config = await getCloudinaryConfig();

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('بيانات Cloudinary غير متوفرة في متغيرات البيئة (Environment Variables).');
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    if (folder) {
      formData.append('folder', folder);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: CloudinaryUploadResult = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (err) {
            reject(new Error('فشل معالجة استجابة Cloudinary'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData?.error?.message || `فشل الرفع إلى Cloudinary (رمز الخطأ: ${xhr.status})`));
          } catch {
            reject(new Error(`فشل الرفع إلى Cloudinary (رمز الخطأ: ${xhr.status})`));
          }
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('خطأ في الاتصال بخدمة Cloudinary. يرجى التحقق من اتصال الإنترنت.'));
    };

    xhr.open('POST', endpoint, true);
    xhr.send(formData);
  });
}

/**
 * Generates an auto-optimized, auto-format URL from a Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  transformations: string = 'f_auto,q_auto'
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  // Inserts transformations right after /upload/
  return url.replace('/upload/', `/upload/${transformations}/`);
}
