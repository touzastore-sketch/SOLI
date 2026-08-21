import React, { useState } from 'react';
import { 
  MessageCircle, 
  Instagram, 
  Send, 
  Sparkles, 
  Share2,
  X
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const FloatingSocialBar: React.FC = () => {
  const { language, storeSettings } = useShop();
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(true);

  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';

  const socialLinks = [
    {
      id: 'whatsapp',
      name: isAr ? 'واتساب VIP' : 'WhatsApp VIP',
      sub: isAr ? 'استشارات وطلب فوري' : 'Orders & Concierge',
      url: `https://wa.me/${whatsappNumber}`,
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      bgColor: 'bg-[#22C55E]',
      glowColor: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]',
      borderGlow: 'hover:border-[#22C55E]'
    },
    {
      id: 'instagram',
      name: isAr ? 'إنستجرام' : 'Instagram',
      sub: isAr ? 'أحدث الكولكشن والريلز' : 'Exclusive Looks & Reels',
      url: storeSettings.instagramUrl || 'https://instagram.com',
      icon: <Instagram className="w-5 h-5 text-white" />,
      bgColor: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      glowColor: 'hover:shadow-[0_0_25px_rgba(221,42,123,0.6)]',
      borderGlow: 'hover:border-[#DD2A7B]'
    },
    {
      id: 'tiktok',
      name: isAr ? 'تيك توك' : 'TikTok',
      sub: isAr ? 'فيديوهات وتنسيقات حصرية' : 'Styling & Unboxing',
      url: storeSettings.tiktokUrl || 'https://tiktok.com',
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.91 1.62V6.92a4.84 4.84 0 0 1-1-.23z"/>
        </svg>
      ),
      bgColor: 'bg-black',
      glowColor: 'hover:shadow-[0_0_25px_rgba(0,242,234,0.5)]',
      borderGlow: 'hover:border-[#00f2fe]'
    },
    {
      id: 'telegram',
      name: isAr ? 'تليجرام الخاص' : 'Telegram VIP',
      sub: isAr ? 'العروض السرية أولاً' : 'Private Secret Drops',
      url: storeSettings.telegramChannelUrl || 'https://t.me',
      icon: <Send className="w-4 h-4 text-white" />,
      bgColor: 'bg-[#229ED9]',
      glowColor: 'hover:shadow-[0_0_25px_rgba(34,158,217,0.6)]',
      borderGlow: 'hover:border-[#229ED9]'
    },
    {
      id: 'facebook',
      name: isAr ? 'فيسبوك' : 'Facebook',
      sub: isAr ? 'مجتمع روني ستور' : 'Official Page',
      url: storeSettings.facebookUrl || 'https://facebook.com',
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bgColor: 'bg-[#1877F2]',
      glowColor: 'hover:shadow-[0_0_25px_rgba(24,119,242,0.6)]',
      borderGlow: 'hover:border-[#1877F2]'
    }
  ];

  return (
    <div 
      className="fixed bottom-6 ltr:left-5 rtl:right-5 z-40 flex flex-col items-end rtl:items-start gap-3 pointer-events-auto"
      style={{ isolation: 'isolate' }}
    >
      {/* Expanded Animated Social Panel */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 p-2 bg-[#2D040A]/90 backdrop-blur-xl border border-white/25 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 animate-fadeIn max-w-[240px]">
          <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-white/15">
            <div className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#FECDD3] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-white">
                {isAr ? 'قنواتنا الحصرية' : 'Social Channels'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 rounded-full hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isAr ? 'تصغير' : 'Collapse'}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {socialLinks.map((item, idx) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center gap-3 p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 ${item.borderGlow} transition-all duration-300 cursor-pointer ${item.glowColor}`}
                style={{
                  animation: `fadeIn 0.3s ease-out ${idx * 60}ms forwards`
                }}
              >
                <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0 pr-1 rtl:pr-0 rtl:pl-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white group-hover:text-[#FECDD3] transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  </div>
                  <p className="text-[9px] text-white/70 font-medium truncate">
                    {item.sub}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Floating Main Toggle Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#DC2626] to-[#7F1D1D] text-white border-2 border-white/40 shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:shadow-[0_0_40px_rgba(220,38,38,0.9)] hover:scale-105 transition-all duration-300 cursor-pointer animate-bounce-subtle"
        >
          <div className="relative">
            <Share2 className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#7F1D1D]" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase">
            {isAr ? 'تواصل معنا سوشيال' : 'Social Hub'}
          </span>
        </button>
      )}
    </div>
  );
};
