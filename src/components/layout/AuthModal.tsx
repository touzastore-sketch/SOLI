import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AuthModal: React.FC = () => {
  const {
    language,
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    signInWithGoogle,
    showToast
  } = useShop();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isAr = language === 'ar';

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email', 'warning');
      return;
    }
    login(email, fullName || 'سارة عبد الرحمن');
  };

  const handleQuickGuestLogin = () => {
    login('vip.client@ronystore.eg', isAr ? 'سارة عبد الرحمن' : 'Sarah Abdelrahman');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-[#121110] border border-[#2B2724] rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 text-[#ECE7DF]">
          {/* Left / Editorial Image Side */}
          <div className="relative hidden md:block bg-[#0A0A09] overflow-hidden min-h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Boutique"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-black/40 to-transparent" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div>
                <span className="font-serif-luxury text-xl tracking-[0.2em] font-light text-white block">
                  RONY STORE
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-sans">
                  LE LUXE INTIME • CAIRO
                </span>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-[#1F1C1A]/80 border border-[#3A3530] px-3 py-1 rounded-full text-xs text-[#E6C594]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAr ? 'عضوية التميز الخاصة' : 'Private VIP Membership'}</span>
                </div>
                <h3 className="font-serif-luxury text-xl text-white font-medium leading-relaxed">
                  {isAr
                    ? 'عالم من الخصوصية والأناقة الحريرية يبدأ هنا.'
                    : 'A sanctuary of privacy and refined silk begins here.'}
                </h3>
                <p className="text-xs text-[#A8A29E] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>{isAr ? 'بياناتك الشخصية مشفرة وسرية تماماً' : '100% Confidential & Secure'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right / Form Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#141211]">
            <div>
              {/* Close button */}
              <div className="flex justify-between items-center mb-6">
                {/* Tabs */}
                <div className="flex bg-[#1E1C1A] p-1 rounded-lg border border-[#2B2724]">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      mode === 'login'
                        ? 'bg-[#9B2226] text-white shadow-sm'
                        : 'text-[#8E877E] hover:text-white'
                    }`}
                  >
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-[#9B2226] text-white shadow-sm'
                        : 'text-[#8E877E] hover:text-white'
                    }`}
                  >
                    {isAr ? 'حساب جديد' : 'Register'}
                  </button>
                </div>

                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#201D1A] text-[#8E877E] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h2 className="font-serif-luxury text-2xl font-bold text-[#FDFBF7]">
                  {mode === 'login'
                    ? isAr ? 'مرحباً بك مجدداً' : 'Welcome Back'
                    : isAr ? 'إنشاء حساب فاخر' : 'Create Exclusive Account'}
                </h2>
                <p className="text-xs text-[#8E877E] mt-1">
                  {mode === 'login'
                    ? isAr ? 'سجلي دخولك لتتبع طلباتك والوصول للمفضلة' : 'Sign in to access your orders and saved wishlist'
                    : isAr ? 'انضمي لعالم روني للاستمتاع بخصومات حصرية وتغليف سري' : 'Join Rony Privé for exclusive perks and discreet shipping'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#C7C2BA] mb-1">
                      {isAr ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#7A746B] absolute top-3 ltr:left-3 rtl:right-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isAr ? 'سارة عبد الرحمن' : 'Sarah Miller'}
                        className="w-full bg-[#1A1817] border border-[#2B2724] rounded-lg py-2.5 px-9 text-xs text-[#ECE7DF] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#C7C2BA] mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A746B] absolute top-3 ltr:left-3 rtl:right-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-[#1A1817] border border-[#2B2724] rounded-lg py-2.5 px-9 text-xs text-[#ECE7DF] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-[#C7C2BA] mb-1">
                      {isAr ? 'رقم الهاتف (للتوصيل في مصر)' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#7A746B] absolute top-3 ltr:left-3 rtl:right-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+20 10X XXX XXXX"
                        className="w-full bg-[#1A1817] border border-[#2B2724] rounded-lg py-2.5 px-9 text-xs text-[#ECE7DF] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-[#C7C2BA]">
                      {isAr ? 'كلمة المرور' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => showToast(isAr ? 'تم إرسال رابط استعادة كلمة المرور لبريدك' : 'Password reset link sent to your email', 'info')}
                        className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                      >
                        {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7A746B] absolute top-3 ltr:left-3 rtl:right-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1A1817] border border-[#2B2724] rounded-lg py-2.5 px-9 text-xs text-[#ECE7DF] placeholder-[#666] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-2.5 ltr:right-3 rtl:left-3 text-[#7A746B] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#9B2226] hover:bg-[#801B1E] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg cursor-pointer mt-2"
                >
                  {mode === 'login'
                    ? isAr ? 'تسجيل الدخول' : 'Sign In'
                    : isAr ? 'إنشاء حساب جديد' : 'Create Account'}
                </button>
              </form>

              {/* Google Sign In with Firebase */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full bg-[#1F1C1A] hover:bg-[#2A2623] border border-[#3D3732] text-[#F3EFEA] py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                    />
                  </svg>
                  <span>
                    {isGoogleLoading
                      ? isAr ? 'جاري الاتصال بـ Google...' : 'Connecting to Google...'
                      : isAr ? 'المتابعة باستخدام حساب Google' : 'Continue with Google'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Demo Login Option */}
            <div className="pt-6 border-t border-[#221F1C] mt-6">
              <button
                onClick={handleQuickGuestLogin}
                className="w-full bg-[#1B1918] hover:bg-[#252220] border border-[#332E2A] text-[#D4AF37] py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'دخول تجريبي سريع بحساب VIP (نقرة واحدة)' : 'Instant VIP Demo Sign-In (1-Click)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
