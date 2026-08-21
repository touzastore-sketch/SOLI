import React from 'react';
import transparentBabydollModel from '../../assets/images/transparent_babydoll_model_1787196676829.jpg';
import redBabydollModel from '../../assets/images/red_babydoll_model_1787126559624.jpg';

interface AmbientHomeBackgroundProps {
  isAr?: boolean;
}

export const AmbientHomeBackground: React.FC<AmbientHomeBackgroundProps> = React.memo(() => {
  return (
    <div 
      id="ambient-home-background" 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* 1. Base Rich Dark Maroon-Black Velvet Canvas */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          background: 'radial-gradient(ellipse 120% 90% at 50% 15%, #2D0308 0%, #170104 50%, #0D0002 100%)'
        }}
      />

      {/* 2. Soft Ambient Silk Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FFFFFF_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none"
      />

      {/* 3. Primary Transparent Model (Black Lace Babydoll) - Blended Seamlessly into the Ambient Background */}
      <div 
        className="absolute top-[2%] ltr:right-[-4%] rtl:left-[-4%] sm:ltr:right-[2%] sm:rtl:left-[2%] lg:ltr:right-[5%] lg:rtl:left-[5%] w-[85vw] sm:w-[50vw] lg:w-[38vw] max-w-[580px] h-[90vh] max-h-[820px] opacity-30 sm:opacity-40 pointer-events-none"
      >
        <img
          src={transparentBabydollModel}
          alt="Transparent Model Background Atmosphere"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain object-top filter brightness-105 contrast-110 saturate-105"
          style={{
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 80%, transparent 98%), linear-gradient(to bottom, black 65%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 80%, transparent 98%), linear-gradient(to bottom, black 65%, transparent 100%)'
          }}
        />
      </div>

      {/* 4. Secondary Soft Atmospheric Accent (Red Silk Babydoll) in Opposite Corner */}
      <div 
        className="absolute top-[38%] ltr:left-[-6%] rtl:right-[-6%] sm:ltr:left-[1%] sm:rtl:right-[1%] lg:ltr:left-[3%] lg:rtl:right-[3%] w-[78vw] sm:w-[44vw] lg:w-[32vw] max-w-[500px] h-[85vh] max-h-[780px] opacity-20 sm:opacity-25 pointer-events-none"
      >
        <img
          src={redBabydollModel}
          alt="Babydoll Background Atmosphere"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain object-top filter brightness-100 contrast-110"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.1) 78%, transparent 95%), linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.1) 78%, transparent 95%), linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
        />
      </div>

      {/* 5. Radiant Soft Ambient Atmospheric Light Blooms */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Upper Glow */}
        <div 
          className="absolute top-[4%] left-[50%] -translate-x-1/2 w-[800px] sm:w-[1000px] h-[500px] rounded-full blur-[140px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(254, 205, 211, 0.3) 0%, rgba(220, 38, 38, 0.2) 40%, transparent 75%)'
          }}
        />

        {/* Lower Glow around content */}
        <div 
          className="absolute top-[45%] left-[20%] w-[700px] h-[550px] rounded-full blur-[130px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* 6. Seamless Bottom Fade into Dark Maroon Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#170104]/30 to-[#0D0002] pointer-events-none" />
    </div>
  );
});
