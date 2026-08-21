import React from 'react';
import { X, Ruler, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { language } = useShop();
  if (!isOpen) return null;

  const isAr = language === 'ar';

  const sizeTable = [
    { size: 'S', bust: '82 - 88 سم', waist: '62 - 68 سم', hips: '86 - 92 سم', weight: '45 - 55 كجم', bra: '70B / 75A' },
    { size: 'M', bust: '88 - 94 سم', waist: '68 - 74 سم', hips: '92 - 98 سم', weight: '55 - 65 كجم', bra: '75B / 75C / 80B' },
    { size: 'L', bust: '94 - 100 سم', waist: '74 - 80 سم', hips: '98 - 104 سم', weight: '65 - 75 كجم', bra: '80C / 85B / 85C' },
    { size: 'XL', bust: '100 - 108 سم', waist: '80 - 88 سم', hips: '104 - 112 سم', weight: '75 - 85 كجم', bra: '85D / 90B / 90C' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#141211] border border-[#2B2724] rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-[#ECE7DF]">
          <div className="flex items-center justify-between pb-4 border-b border-[#24211E]">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Ruler className="w-5 h-5" />
              <h3 className="font-serif-luxury text-lg font-bold text-[#FDFBF7]">
                {isAr ? 'دليل المقاسات الدقيق' : 'Precise Size Guide'}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-[#8E877E] hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <p className="text-[#A09A92] leading-relaxed">
              {isAr
                ? 'جميع تشكيلات روني ستور مصممة بخامات مرنة فائقة النعومة وتدعم الضبط بأربطة مخصصة لضمان المقاس المثالي.'
                : 'All Rony pieces feature gentle stretch fabrics and adjustable sliders for an effortlessly customized fit.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left border-collapse border border-[#2B2724]">
                <thead>
                  <tr className="bg-[#1E1C1A] text-[#D4AF37] text-xs">
                    <th className="p-2.5 border border-[#2B2724]">{isAr ? 'المقاس' : 'Size'}</th>
                    <th className="p-2.5 border border-[#2B2724]">{isAr ? 'محيط الصدر' : 'Bust'}</th>
                    <th className="p-2.5 border border-[#2B2724]">{isAr ? 'محيط الخصر' : 'Waist'}</th>
                    <th className="p-2.5 border border-[#2B2724]">{isAr ? 'محيط الأرداف' : 'Hips'}</th>
                    <th className="p-2.5 border border-[#2B2724]">{isAr ? 'الوزن التقريبي' : 'Est. Weight'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24211E] text-xs text-[#C7C2BA]">
                  {sizeTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#1C1A18]">
                      <td className="p-2.5 font-bold text-white border border-[#24211E]">{row.size}</td>
                      <td className="p-2.5 border border-[#24211E]">{row.bust}</td>
                      <td className="p-2.5 border border-[#24211E]">{row.waist}</td>
                      <td className="p-2.5 border border-[#24211E]">{row.hips}</td>
                      <td className="p-2.5 text-[#D4AF37] font-mono border border-[#24211E]">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#1A1817] border border-[#2D2825] rounded-lg flex items-center gap-3 text-[#A8A29E]">
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
              <span>
                {isAr
                  ? 'إذا كنتِ بين مقاسين، نوصي باختيار المقاس الأكبر لراحة أكبر، أو استشيري مستشارنا الذكي.'
                  : 'If you fall between two sizes, we suggest choosing the larger size for relaxed luxury.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
