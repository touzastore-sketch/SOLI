import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  textAr: string;
  textEn: string;
  recommendedProductIds?: string[];
}

export const AiStylistModal: React.FC = () => {
  const {
    language,
    products,
    isStylistOpen,
    setIsStylistOpen,
    navigateToProduct,
    addToCart
  } = useShop();

  const isAr = language === 'ar';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      textAr: 'أهلاً بكِ في الجناح الاستشاري الخاص لبوتيك روني. أنا مستشاركِ الذكي السري، أستطيع مساعدتكِ في اختيار المقاس المثالي، تنسيق هدايا ذكرى الزواج، أو اختيار الأطقم والألعاب الحميمية الأنسب لأمسيتكِ الخاصة. كيف يمكنني مساعدتكِ اليوم؟ ✨',
      textEn: 'Welcome to the Private Concierge of Rony Store. I am your confidential styling advisor. I can assist you in finding your tailored fit, coordinating anniversary gift sets, or curating romantic evening pairings. How may I indulge you today? ✨',
      recommendedProductIds: ['rony-1', 'rony-2']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isStylistOpen) return null;

  const quickPrompts = [
    {
      labelAr: '💍 أريد هدية مميزة لذكرى زواجنا',
      labelEn: '💍 Curate a luxury anniversary gift set',
      text: isAr ? 'أبحث عن هدية استثنائية لذكرى زواجنا تجمع بين الرقي والرومانسية' : 'Looking for an unforgettable romantic anniversary gift'
    },
    {
      labelAr: '📏 كيف أختار المقاس المناسب بدون خطأ؟',
      labelEn: '📏 How do I choose the exact right size?',
      text: isAr ? 'كيف أختار مقاس اللانجري المناسب لي بشكل دقيق؟' : 'How do I choose my precise intimate lingerie size?'
    },
    {
      labelAr: '🎲 أفضل ألعاب زوجية لكسر الروتين',
      labelEn: '🎲 Best couple games to break routine',
      text: isAr ? 'ما هي أفضل لعبة زوجية لتقوية التقارب وإشعال الرومانسية؟' : 'What is the most recommended couple card game?'
    },
    {
      labelAr: '🕯️ شموع وزيوت المساج الطبيعية',
      labelEn: '🕯️ Botanical massage candles guide',
      text: isAr ? 'أخبرني عن فوائد شموع وزيوت التدليك العضوية' : 'Tell me about the organic massage candle benefits'
    }
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      textAr: userText,
      textEn: userText
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const lower = userText.toLowerCase();
          let recs: string[] = [];
          if (lower.includes('مقاس') || lower.includes('size')) recs = ['rony-1', 'rony-3'];
          else if (lower.includes('هدية') || lower.includes('gift') || lower.includes('زواج')) recs = ['rony-1', 'rony-2', 'rony-8'];
          else if (lower.includes('لعب') || lower.includes('game')) recs = ['rony-2', 'rony-7'];
          else if (lower.includes('باديكير') || lower.includes('مساج') || lower.includes('spa')) recs = ['rony-5', 'rony-8'];
          else recs = ['rony-1', 'rony-4'];

          const aiResponse: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            textAr: data.reply,
            textEn: data.reply,
            recommendedProductIds: recs
          };

          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to local AI concierge:', e);
    }

    // Fallback response
    setTimeout(() => {
      let replyAr = '';
      let replyEn = '';
      let recs: string[] = [];

      const lower = userText.toLowerCase();

      if (lower.includes('مقاس') || lower.includes('size') || lower.includes('قياس')) {
        replyAr = 'يسعدني مساعدتك في المقاس! أطقمنا الحريرية مصممة بأربطة مطاطية ناعمة وأشرطة كتف قابلة للتعديل. للمقاس المصري المعتاد: (S يناسب وزن 45-55 كجم)، (M يناسب 55-65 كجم)، (L يناسب 65-75 كجم)، و(XL يناسب 75-85 كجم). كما نوفر جدول مقاسات تفصيلي في صفحة كل منتج.';
        replyEn = 'I would be delighted to guide your sizing! Our silk and lace creations feature adaptable soft bands. Standard fit: S (45-55kg), M (55-65kg), L (65-75kg), XL (75-85kg).';
        recs = ['rony-1', 'rony-3', 'rony-10'];
      } else if (lower.includes('هدية') || lower.includes('زواج') || lower.includes('anniversary') || lower.includes('gift')) {
        replyAr = 'ذكرى زواج سعيدة مقدماً! أنصحكِ بتنسيق يجمع بين "طقم حرير إمبريال عنابي" مع "صندوق الألعاب الزوجية الملكي" وشمعة المساج الدافئة. سيتم تغليفها جميعاً في بوكس روني المخملي الفاخر مع كارت إهداء سري مجاني.';
        replyEn = 'Happy Anniversary! I highly recommend pairing the "Imperial Burgundy Silk Set" with "The Royal Intimate Box" and our warm botanical massage candle. Sealed in our signature velvet gift packaging with total discretion.';
        recs = ['rony-1', 'rony-2', 'rony-8'];
      } else if (lower.includes('لعب') || lower.includes('game') || lower.includes('روتين') || lower.includes('صندوق')) {
        replyAr = 'لتجديد الشغف وكسر الروتين، خيارنا الأبرز هو "صندوق الألعاب الزوجية الملكي" الذي يحتوي على 120 بطاقة أسئلة عميقة وتحديات رومانسية، أو "مجموعة ألعاب الحب الليلية" للأمسيات الهادئة.';
        replyEn = 'To spark playful intimacy, "The Royal Intimate Box" is our flagship experience containing 120 graded intimacy prompts and silk accessories.';
        recs = ['rony-2', 'rony-7'];
      } else if (lower.includes('باديكير') || lower.includes('مساج') || lower.includes('عناية') || lower.includes('spa')) {
        replyAr = 'لجلسة استرخاء متكاملة، أنصحكِ بـ "مجموعة العناية والباديكير الماسية" ومبرد النانو الزجاجي، مع "شمعة المساج الشرقية" بزبدة الشيا والزيوت النقية.';
        replyEn = 'For a sublime private spa night, our "Diamond Spa Pedicure Kit" alongside the "Warm Sensual Botanical Massage Candle" provides pure rejuvenation.';
        recs = ['rony-5', 'rony-8', 'rony-9'];
      } else {
        replyAr = 'اختيار رائع! في روني ستور نحرص على تقديم تصاميم مختارة بعناية فائقة تمنحك الراحة والأنوثة المطلقة مع تغليف معتم وسري يضمن خصوصيتك بنسبة 100%. تفضلي بالاطلاع على هذه الترشيحات الملكية:';
        replyEn = 'A splendid inquiry! At Rony Store, every piece is curated to blend tactile silk comfort with timeless romance, sealed with guaranteed discreet delivery. Here are my tailored suggestions:';
        recs = ['rony-1', 'rony-4', 'rony-6'];
      }

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        textAr: replyAr,
        textEn: replyEn,
        recommendedProductIds: recs
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsStylistOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-[#121110] border border-[#2B2724] rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col h-[85vh] text-[#ECE7DF]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#171514] border-b border-[#24211E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9B2226] to-[#D4AF37] p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#171514] rounded-full flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#FDFBF7] flex items-center gap-2">
                  <span>{isAr ? 'مستشار روني الخاص (AI Concierge)' : 'Rony Private AI Concierge'}</span>
                </h3>
                <span className="text-[11px] text-[#10B981] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAr ? 'محادثة مشفرة وسرية 100%' : '100% Confidential Consultation'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsStylistOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#201D1A] text-[#8E877E] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0F0E0D]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[#1C1A18] border border-[#332E2A] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#9B2226] text-white rounded-br-none'
                      : 'bg-[#181615] border border-[#2B2724] text-[#ECE7DF] rounded-tl-none shadow-md'
                  }`}
                >
                  <p>{isAr ? msg.textAr : msg.textEn}</p>

                  {/* Render Recommended Products If Any */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#2A2724] space-y-2">
                      <span className="text-[11px] font-semibold text-[#D4AF37] block">
                        {isAr ? 'الترشيحات الحصرية المقترحة لكِ:' : 'Tailored Suggestions for You:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProductIds.map(id => {
                          const prod = products.find(p => p.id === id);
                          if (!prod) return null;
                          return (
                            <div
                              key={prod.id}
                              className="flex items-center gap-2 p-2 bg-[#121110] border border-[#2B2724] rounded-lg hover:border-[#D4AF37] transition-all group"
                            >
                              <img
                                src={prod.images[0]}
                                alt={isAr ? prod.nameAr : prod.nameEn}
                                referrerPolicy="no-referrer"
                                className="w-12 h-14 object-cover rounded bg-black shrink-0 cursor-pointer"
                                onClick={() => {
                                  setIsStylistOpen(false);
                                  navigateToProduct(prod);
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-[11px] font-medium text-[#ECE7DF] truncate cursor-pointer group-hover:text-[#D4AF37]"
                                  onClick={() => {
                                    setIsStylistOpen(false);
                                    navigateToProduct(prod);
                                  }}
                                >
                                  {isAr ? prod.nameAr : prod.nameEn}
                                </h5>
                                <span className="text-[11px] font-mono text-[#D4AF37] block">
                                  {prod.price} {isAr ? 'ج.م' : 'EGP'}
                                </span>
                                <button
                                  onClick={() => addToCart(prod)}
                                  className="text-[10px] text-[#C7C2BA] hover:text-white flex items-center gap-1 mt-1 cursor-pointer"
                                >
                                  <ShoppingBag className="w-2.5 h-2.5" />
                                  <span>{isAr ? 'إضافة سريعة' : 'Quick Add'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#9B2226]/20 border border-[#9B2226] flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-[#1C1A18] border border-[#332E2A] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#181615] border border-[#2B2724] px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="p-2.5 bg-[#141211] border-t border-[#24211E] flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.text)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1E1C1A] hover:bg-[#2C2724] border border-[#2E2925] text-[#C7C2BA] hover:text-[#D4AF37] transition-colors cursor-pointer text-[11px] shrink-0"
              >
                {isAr ? qp.labelAr : qp.labelEn}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#171514] border-t border-[#24211E]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتبي استفسارك السري (مثل: أفضل مقاس لوزن 60، أو طقم رومانسي)...'
                    : 'Ask your confidential styling question...'
                }
                className="flex-1 bg-[#1A1817] border border-[#2B2724] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#ECE7DF] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="bg-[#9B2226] hover:bg-[#801B1E] text-white p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                aria-label="Send"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
