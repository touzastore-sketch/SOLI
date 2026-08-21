import React, { useState, useEffect } from 'react';
import ronyGoldLogo from '../../assets/images/rony_store_gold_logo_1787198757442.jpg';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface LuxuryPreloaderProps {
  onLoaded?: () => void;
  minDuration?: number;
}

export const LuxuryPreloader: React.FC<LuxuryPreloaderProps> = ({ 
  onLoaded, 
  minDuration = 1400 
}) => {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth luxury progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 60 ? 18 : prev < 90 ? 12 : 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsDone(true);
        if (onLoaded) onLoaded();
      }, 500); // 500ms fade transition
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minDuration, onLoaded]);

  if (isDone) return null;

  return (
    <div
      id="luxury-preloader"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-b from-[#180104] via-[#0F0002] to-[#120104] text-white select-none transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Ambient Royal Gold & Velvet Red Radial Glows */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[140px] opacity-35 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, #DC2626 0%, #D4AF37 35%, #4C0519 70%, transparent 90%)',
          animationDuration: '3s'
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Luxury Gold Logo Container with Rotating Halo */}
        <div className="relative mb-6">
          {/* Animated Gold Ring Halo */}
          <div 
            className="absolute -inset-4 rounded-full border border-[#D4AF37]/30 opacity-70 animate-spin"
            style={{ 
              animationDuration: '12s',
              borderTopColor: '#FDE047',
              borderRightColor: 'transparent',
              borderBottomColor: '#CA8A04',
              borderLeftColor: 'transparent'
            }}
          />
          
          <div 
            className="absolute -inset-2 rounded-full border border-[#DC2626]/40 opacity-60 animate-ping"
            style={{ animationDuration: '2.5s' }}
          />

          {/* Gold Logo Image */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-b from-[#D4AF37]/40 via-[#4C0519]/60 to-[#140103] shadow-[0_0_50px_rgba(212,175,55,0.35)] overflow-hidden border border-[#D4AF37]/40 flex items-center justify-center">
            <img
              src={ronyGoldLogo}
              alt="RONY STORE - روني ستور"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-2xl filter drop-shadow-[0_0_12px_rgba(253,224,71,0.6)]"
            />
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        {/* Brand Text Branding */}
        <div className="space-y-1.5 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-[#FDE047]/90 font-serif">
              RONY STORE • LUXURY BOUTIQUE
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-pulse" />
          </div>

          <h1 className="font-serif-luxury text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            روني ستور للملابس الراقية
          </h1>

          <p className="text-xs text-[#FECDD3]/80 font-medium">
            بيبي دول • ألعاب زوجية • باديكير • خصوصية 100%
          </p>
        </div>

        {/* Luxury Gold Progress Bar */}
        <div className="w-48 sm:w-60 h-1.5 bg-black/60 rounded-full overflow-hidden border border-[#D4AF37]/30 p-[1px] mb-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#DC2626] rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(253,224,71,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Discreet Badge & Progress Text */}
        <div className="flex items-center justify-between w-48 sm:w-60 text-[10px] text-white/70 font-mono">
          <div className="flex items-center gap-1 text-[#FDE047]/90">
            <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
            <span className="text-[9px] font-sans">تغليف وشحن سري</span>
          </div>
          <span className="font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
