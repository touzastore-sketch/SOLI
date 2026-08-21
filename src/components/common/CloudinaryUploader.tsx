import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ExternalLink,
  Copy,
  Sparkles,
  Video,
  Play
} from 'lucide-react';
import { uploadToCloudinary, isCloudinaryUrl } from '../../lib/cloudinary';

interface CloudinaryUploaderProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (secureUrl: string) => void;
  language?: 'ar' | 'en';
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'video';
  maxFileSizeMB?: number;
  className?: string;
  acceptMedia?: 'image' | 'video' | 'all';
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  label,
  helperText,
  value,
  onChange,
  language = 'ar',
  aspectRatio = 'portrait',
  maxFileSizeMB = 50,
  className = '',
  acceptMedia = 'all',
}) => {
  const isAr = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const isVideoUrl = (url: string) => {
    return Boolean(url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video/upload/')));
  };

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (acceptMedia === 'image' && !isImage) {
      setErrorMessage(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)' : 'Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    if (acceptMedia === 'video' && !isVideo) {
      setErrorMessage(isAr ? 'يرجى اختيار ملف فيديو صالح (MP4, WEBM, MOV)' : 'Please select a valid video file (MP4, WEBM, MOV)');
      return;
    }

    if (!isImage && !isVideo) {
      setErrorMessage(isAr ? 'يرجى اختيار صورة أو فيديو صالح' : 'Please select a valid image or video file');
      return;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setErrorMessage(
        isAr 
          ? `حجم الملف أكبر من ${maxFileSizeMB} ميجابايت. يرجى اختيار ملف بحجم أصغر.`
          : `File size exceeds ${maxFileSizeMB}MB limit. Please choose a smaller file.`
      );
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const resourceType = isVideo ? 'video' : 'image';
      const result = await uploadToCloudinary(file, (percent) => {
        setUploadProgress(percent);
      }, resourceType);

      if (result && result.secure_url) {
        onChange(result.secure_url);
        setUploadProgress(100);
      } else {
        throw new Error('No secure_url returned');
      }
    } catch (err: unknown) {
      console.error('[CloudinaryUploader] Upload error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(
        isAr 
          ? `فشل رفع الملف إلى Cloudinary: ${msg}` 
          : `Failed to upload to Cloudinary: ${msg}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoteUrlUpload = async () => {
    if (!customUrl.trim()) return;
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const isVideo = isVideoUrl(customUrl.trim());
      const result = await uploadToCloudinary(
        customUrl.trim(),
        (percent) => {
          setUploadProgress(percent);
        },
        isVideo ? 'video' : 'auto'
      );
      if (result && result.secure_url) {
        onChange(result.secure_url);
        setCustomUrl('');
        setShowUrlInput(false);
      }
    } catch (err: unknown) {
      console.error('[CloudinaryUploader] Remote upload error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(isAr ? `فشل رفع الرابط: ${msg}` : `Failed to upload from URL: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isHostedOnCloudinary = isCloudinaryUrl(value);
  const isCurrentVideo = isVideoUrl(value);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'landscape': return 'aspect-[16/9]';
      case 'video': return 'aspect-video';
      case 'portrait':
      default: return 'aspect-[3/4]';
    }
  };

  const getAcceptedTypes = () => {
    if (acceptMedia === 'image') return 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
    if (acceptMedia === 'video') return 'video/mp4,video/webm,video/quicktime';
    return 'image/png,image/jpeg,image/jpg,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
  };

  return (
    <div className={`space-y-2 text-right rtl:text-right ltr:text-left ${className}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{label}</span>
          </label>
        )}

        {value && (
          <div className="flex items-center gap-1.5 text-[10px]">
            {isHostedOnCloudinary ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Cloudinary CDN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium">
                {isAr ? 'رابط خارجي' : 'External URL'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Container / Dropzone / Preview */}
      <div className="relative">
        {value ? (
          /* Preview Mode with Actions */
          <div className="relative group rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-lg">
            <div className={`w-full ${getAspectClass()} max-h-56 flex items-center justify-center overflow-hidden bg-black/40`}>
              {isCurrentVideo ? (
                <video
                  src={value}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={value}
                  alt="Uploaded Media"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>

            {/* Overlay Bar on Hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none group-hover:pointer-events-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/80 truncate max-w-[200px] bg-black/60 px-2 py-1 rounded">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                  title={isAr ? 'إزالة الملف' : 'Remove File'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{isCopied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#082F49] text-[11px] font-black flex items-center gap-1 shadow transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استبدال بالرفع' : 'Replace Media'}</span>
                </button>
              </div>
            </div>

            {/* Cloudinary CDN tag */}
            <div className="absolute bottom-2 left-2 pointer-events-none bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 text-[9px] font-mono text-[#38BDF8] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Cloudinary CDN</span>
            </div>
          </div>
        ) : (
          /* Empty Dropzone Mode */
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`w-full ${getAspectClass()} max-h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
              isDragging 
                ? 'border-[#38BDF8] bg-[#38BDF8]/10' 
                : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-black/60'
            }`}
          >
            {isUploading ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    {isAr ? 'جاري الرفع السحابي إلى Cloudinary...' : 'Uploading to Cloudinary...'}
                  </p>
                  <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <div 
                      className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0284C7] transition-all duration-200" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/70">{uploadProgress}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center pointer-events-none">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#38BDF8] shadow-md">
                  {acceptMedia === 'video' ? <Video className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isAr 
                      ? (acceptMedia === 'video' ? 'اضغط لرفع فيديو أو اسحبه هنا' : 'اضغط لاختيار صورة/فيديو أو اسحب هنا')
                      : 'Click to select media or drag & drop'}
                  </p>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    {isAr ? 'رفع وتخزين سحابي فوري عبر Cloudinary' : 'Direct upload to Cloudinary Storage'}
                  </p>
                </div>
                <span className="inline-block text-[9px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
                  Cloudinary Upload Preset
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Toggle Link/URL Input for existing remote media */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-white/60 hover:text-white underline cursor-pointer text-[10px] flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          <span>
            {showUrlInput 
              ? (isAr ? 'إخفاء إدخال الرابط المباشر' : 'Hide URL input') 
              : (isAr ? 'أو أدخل رابط وسائط خارجي لرفعه' : 'Or upload from remote URL')}
          </span>
        </button>

        {helperText && <span className="text-[10px] text-white/50">{helperText}</span>}
      </div>

      {/* Remote URL Form */}
      {showUrlInput && (
        <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-black/50 border border-white/20 rounded-xl py-1.5 px-2.5 text-xs text-white font-mono focus:border-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleRemoteUrlUpload}
              disabled={isUploading || !customUrl.trim()}
              className="py-1.5 px-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#082F49] text-xs font-black shrink-0 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (isAr ? 'رفع لـ Cloudinary' : 'Upload')}
            </button>
          </div>
          <p className="text-[9px] text-white/50">
            {isAr ? 'سيتم جلب الوسائط وتخزينها على Cloudinary مباشرة.' : 'Fetches the remote media and saves to Cloudinary.'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#FECDD3] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
