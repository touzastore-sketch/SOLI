import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  Star, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { uploadToCloudinary, isCloudinaryUrl } from '../../lib/cloudinary';

interface CloudinaryGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  language?: 'ar' | 'en';
  maxImages?: number;
}

export const CloudinaryGalleryUploader: React.FC<CloudinaryGalleryUploaderProps> = ({
  images = [],
  onChange,
  language = 'ar',
  maxImages = 6,
}) => {
  const isAr = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlPrompt, setShowUrlPrompt] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      setErrorMessage(isAr ? 'يرجى اختيار ملفات صور صالحة (PNG, JPG, WEBP)' : 'Please select valid image files');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + uploadedUrls.length >= maxImages) break;
      setUploadIndex(i + 1);
      setUploadProgress(15);

      try {
        const res = await uploadToCloudinary(files[i], (percent) => {
          setUploadProgress(percent);
        });
        if (res?.secure_url) {
          uploadedUrls.push(res.secure_url);
        }
      } catch (err: unknown) {
        console.error('[CloudinaryGallery] File upload error:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(isAr ? `فشل رفع إحدى الصور: ${msg}` : `Failed to upload image: ${msg}`);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setIsUploading(false);
    setUploadIndex(null);
    setUploadProgress(0);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  const handleAddRemoteUrl = async () => {
    if (!urlInput.trim()) return;
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(30);

    try {
      const res = await uploadToCloudinary(urlInput.trim(), (percent) => {
        setUploadProgress(percent);
      });
      if (res?.secure_url) {
        onChange([...images, res.secure_url]);
        setUrlInput('');
        setShowUrlPrompt(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(isAr ? `فشل رفع الرابط: ${msg}` : `Failed to upload from URL: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 text-right rtl:text-right ltr:text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-bold text-white/90 text-xs flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{isAr ? 'معرض صور المنتج (Cloudinary CDN)' : 'Product Images Gallery (Cloudinary)'}</span>
          </label>
          <span className="text-[10px] text-white/50 font-mono">({images.length}/{maxImages})</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => setShowUrlPrompt(!showUrlPrompt)}
            className="text-white/60 hover:text-white underline cursor-pointer"
          >
            {isAr ? '+ إضافة عبر رابط' : '+ Add via URL'}
          </button>
        </div>
      </div>

      {/* URL prompt */}
      {showUrlPrompt && (
        <div className="p-3 rounded-2xl bg-black/60 border border-white/15 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-black/50 border border-white/20 rounded-xl py-1.5 px-3 text-xs text-white font-mono focus:border-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddRemoteUrl}
              disabled={isUploading || !urlInput.trim()}
              className="py-1.5 px-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#082F49] text-xs font-black shrink-0 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (isAr ? 'رفع لـ Cloudinary' : 'Upload')}
            </button>
          </div>
        </div>
      )}

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imgUrl, index) => {
          const isPrimary = index === 0;
          const isCloudinary = isCloudinaryUrl(imgUrl);

          return (
            <div
              key={`${imgUrl}-${index}`}
              className={`relative group rounded-2xl overflow-hidden aspect-[3/4] border bg-black/50 transition-all ${
                isPrimary ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/30 shadow-lg' : 'border-white/15 hover:border-white/40'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                {isPrimary && (
                  <span className="px-2 py-0.5 rounded-full bg-[#38BDF8] text-[#082F49] text-[9px] font-black shadow flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{isAr ? 'الرئيسية' : 'Main'}</span>
                  </span>
                )}
                {isCloudinary && (
                  <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#38BDF8] text-[8px] font-mono border border-[#38BDF8]/40">
                    CDN
                  </span>
                )}
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-white/70">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                    title={isAr ? 'حذف الصورة' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {!isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="w-full py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#4C0519] text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'تعيين كرئيسية' : 'Make Primary'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add / Upload Slot */}
        {images.length < maxImages && (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`aspect-[3/4] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer ${
              isUploading 
                ? 'border-[#38BDF8] bg-[#38BDF8]/10' 
                : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-black/60'
            }`}
          >
            {isUploading ? (
              <div className="space-y-2 flex flex-col items-center">
                <Loader2 className="w-6 h-6 text-[#38BDF8] animate-spin" />
                <span className="text-[10px] font-bold text-white">
                  {isAr ? `جاري الرفع ${uploadProgress}%` : `Uploading ${uploadProgress}%`}
                </span>
              </div>
            ) : (
              <div className="space-y-1 flex flex-col items-center pointer-events-none">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#38BDF8]">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white">
                  {isAr ? 'رفع صورة' : 'Add Image'}
                </span>
                <span className="text-[8px] font-mono text-[#38BDF8]">Cloudinary</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={isUploading}
      />

      {/* Error alert */}
      {errorMessage && (
        <div className="p-2 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#FECDD3] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
};
