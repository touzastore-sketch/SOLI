import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

let activeCloudName = process.env.CLOUDINARY_CLOUD_NAME || 'edido9ui';
let activeApiKey = process.env.CLOUDINARY_API_KEY || '728215931316187';
let activeApiSecret = process.env.CLOUDINARY_API_SECRET || 'q51lU1SmaS9JrSJrSX9M3QavSJY';
let activeUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'upload_rony';

// Configure Cloudinary with initial environment variables
function applyCloudinaryConfig() {
  cloudinary.config({
    cloud_name: activeCloudName,
    api_key: activeApiKey,
    api_secret: activeApiSecret,
    secure: true,
  });
}
applyCloudinaryConfig();

export function updateCloudinaryRuntimeConfig(config: {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPreset?: string;
}) {
  if (config.cloudName) activeCloudName = config.cloudName.trim();
  if (config.apiKey) activeApiKey = config.apiKey.trim();
  if (config.apiSecret) activeApiSecret = config.apiSecret.trim();
  if (config.uploadPreset) activeUploadPreset = config.uploadPreset.trim();
  applyCloudinaryConfig();
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at: string;
  isLocalFallback?: boolean;
}

/**
 * Uploads media (image or video) directly to Cloudinary using authenticated SDK.
 * All credentials are read safely from environment variables.
 */
export async function uploadMediaToCloudinaryServer(
  fileData: string, // URL or base64 data URI
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  folder?: string
): Promise<CloudinaryUploadResponse> {
  if (!activeCloudName) {
    throw new Error('CLOUDINARY_CLOUD_NAME is missing.');
  }

  applyCloudinaryConfig();

  const uploadOptions: Record<string, any> = {
    resource_type: resourceType,
  };

  if (folder) {
    uploadOptions.folder = folder;
  }

  try {
    const result = await cloudinary.uploader.upload(fileData, uploadOptions);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format || 'unknown',
      resource_type: result.resource_type || 'image',
      bytes: result.bytes || 0,
      width: result.width,
      height: result.height,
      duration: result.duration,
      created_at: result.created_at || new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn('[Cloudinary SDK Upload Notice]:', err?.message || err);
    throw new Error(err?.message || 'Cloudinary upload failed via SDK');
  }
}

/**
 * Tests connection with the configured Cloudinary credentials
 */
export async function testCloudinaryConnection(): Promise<{ success: boolean; message: string }> {
  try {
    applyCloudinaryConfig();
    const pingRes = await cloudinary.api.ping();
    return {
      success: true,
      message: pingRes.status === 'ok' ? 'تم الاتصال بنجاح مع سيرفرات Cloudinary' : 'Cloudinary ping OK',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'تعذر الاتصال بسيرفرات Cloudinary. يرجى التحقق من Cloud Name والمفاتيح.',
    };
  }
}

/**
 * Generates an upload signature for direct authenticated client uploads
 */
export function generateCloudinarySignature(paramsToSign: Record<string, any>) {
  if (!activeApiSecret || !activeApiKey || !activeCloudName) {
    throw new Error('Cloudinary credentials missing for signature generation');
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, activeApiSecret);
  return {
    signature,
    apiKey: activeApiKey,
    cloudName: activeCloudName,
    timestamp: paramsToSign.timestamp,
  };
}

/**
 * Retrieves public Cloudinary client configuration without exposing secrets
 */
export function getCloudinaryClientConfig() {
  return {
    cloudName: activeCloudName,
    uploadPreset: activeUploadPreset,
    apiKey: activeApiKey,
    isConfigured: Boolean(activeCloudName),
  };
}
