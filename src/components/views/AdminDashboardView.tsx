import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  KeyRound, 
  LogOut, 
  Store, 
  Package, 
  Layers, 
  MapPin, 
  Share2, 
  Settings, 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  Eye, 
  Save, 
  X, 
  MessageCircle, 
  Sparkles, 
  Tag, 
  DollarSign, 
  Phone, 
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock,
  FileText,
  Type,
  Gift,
  Truck,
  UploadCloud,
  Globe
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductCategory, StoreBranch, StoreCategoryItem, StoreSettings, OrderStatus, ProductColor } from '../../types';
import { DEFAULT_STORE_SETTINGS } from '../../data/storeDefaults';
import { CloudinaryUploader } from '../common/CloudinaryUploader';
import { CloudinaryGalleryUploader } from '../common/CloudinaryGalleryUploader';
import { getCloudinaryConfig, updateCloudinaryConfigOnServer, testCloudinaryConnectionClient } from '../../lib/cloudinary';
import ronyGoldLogo from '../../assets/images/rony_store_gold_logo_1787127712907.jpg';

export const AdminDashboardView: React.FC = () => {
  const { 
    language,
    currentView,
    setCurrentView,
    products,
    branches,
    categories,
    storeSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    loadDemoProducts,
    resetProductsToDefault,
    clearAllOrders,
    addBranch,
    updateBranch,
    deleteBranch,
    addCategory,
    updateCategory,
    deleteCategory,
    updateStoreSettings,
    resetStoreSettings,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    exportStoreDataJSON,
    importStoreDataJSON,
    orders,
    updateOrderStatus,
    deleteOrder,
    isCloudConnected,
    isCloudSyncing,
    lastSyncedAt,
    syncAllToCloud,
    showToast
  } = useShop();

  const isAr = language === 'ar';

  // Admin Login PIN State
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'branches' | 'texts' | 'social' | 'settings' | 'orders'>('products');

  // Product Filter & Search
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState<string>('all');
  const [prodStockFilter, setProdStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  // Product Edit/Add Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);

  // Branch Edit/Add Modal State
  const [editingBranch, setEditingBranch] = useState<StoreBranch | null>(null);
  const [isAddingNewBranch, setIsAddingNewBranch] = useState(false);

  // Category Edit/Add Modal State
  const [editingCategory, setEditingCategory] = useState<StoreCategoryItem | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);

  // Cloudinary Settings State
  const [cloudinaryForm, setCloudinaryForm] = useState({
    cloudName: 'edido9ui',
    uploadPreset: 'upload_rony',
    apiKey: '728215931316187',
    apiSecret: 'q51lU1SmaS9JrSJrSX9M3QavSJY',
  });
  const [isTestingCloudinary, setIsTestingCloudinary] = useState(false);
  const [cloudinaryTestResult, setCloudinaryTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSavingCloudinary, setIsSavingCloudinary] = useState(false);

  // Load Cloudinary Config
  React.useEffect(() => {
    getCloudinaryConfig().then((cfg) => {
      if (cfg && cfg.cloudName) {
        setCloudinaryForm((prev) => ({
          ...prev,
          cloudName: cfg.cloudName,
          uploadPreset: cfg.uploadPreset || 'upload_rony',
          apiKey: cfg.apiKey || prev.apiKey,
        }));
      }
    });
  }, []);

  const handleTestCloudinary = async () => {
    setIsTestingCloudinary(true);
    setCloudinaryTestResult(null);
    try {
      const res = await testCloudinaryConnectionClient();
      setCloudinaryTestResult(res);
    } catch (e: any) {
      setCloudinaryTestResult({ success: false, message: e?.message || 'Error testing' });
    } finally {
      setIsTestingCloudinary(false);
    }
  };

  const handleSaveCloudinary = async () => {
    setIsSavingCloudinary(true);
    try {
      const res = await updateCloudinaryConfigOnServer(cloudinaryForm);
      if (res.success) {
        showToast(isAr ? 'تم تحديث إعدادات Cloudinary بنجاح' : 'Cloudinary settings updated', 'success');
        handleTestCloudinary();
      } else {
        showToast(res.message || 'Error updating settings', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Failed', 'error');
    } finally {
      setIsSavingCloudinary(false);
    }
  };

  // Sync settingsForm whenever storeSettings change in context
  React.useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // In-App Confirmation Modal State (replaces native window.confirm which is blocked in iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmButtonText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmButtonText: '',
    isDestructive: true,
    onConfirm: () => {},
  });

  const requestConfirmation = (config: {
    title: string;
    message: string;
    confirmButtonText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmButtonText: config.confirmButtonText,
      isDestructive: config.isDestructive ?? true,
      onConfirm: config.onConfirm,
    });
  };

  // JSON Import Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle PIN Login Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(enteredPin);
    if (!success) {
      setPinError(true);
      setEnteredPin('');
    } else {
      setPinError(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchQuery = 
        p.nameAr.toLowerCase().includes(prodSearch.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(prodSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(prodSearch.toLowerCase());
      
      const matchCat = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
      const matchStock = 
        prodStockFilter === 'all' || 
        (prodStockFilter === 'inStock' && p.inStock) ||
        (prodStockFilter === 'outOfStock' && !p.inStock);

      return matchQuery && matchCat && matchStock;
    });
  }, [products, prodSearch, prodCategoryFilter, prodStockFilter]);

  // Handle Export Backup
  const handleExport = () => {
    const jsonStr = exportStoreDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rony_store_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(isAr ? 'تم تنزيل نسخة احتياطية من بيانات المتجر' : 'Store backup downloaded', 'success');
  };

  // Handle Import Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importStoreDataJSON(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calculate Overall Store Metrics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const inStockCount = products.filter(p => p.inStock).length;
    return {
      totalProducts: products.length,
      inStockCount,
      outOfStockCount: products.length - inStockCount,
      totalOrders: orders.length,
      totalRevenue,
      branchesCount: branches.length,
      categoriesCount: categories.length
    };
  }, [products, orders, branches, categories]);

  // =========================================================================
  // VIEW 1: ADMIN AUTH GATE SCREEN (شاشة الدخول السرية برمز الأمان)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#140103] via-[#0D0002] to-[#160104] text-white flex flex-col justify-center items-center px-4 py-12 select-none relative overflow-hidden">
        {/* Glow Effects */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #DC2626 0%, #D4AF37 40%, transparent 80%)' }}
        />

        <div className="relative z-10 w-full max-w-md bg-[#240307]/90 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center">
          {/* Lock & Brand Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#DC2626] p-0.5 shadow-2xl mb-6 flex items-center justify-center">
            <div className="w-full h-full bg-[#180104] rounded-2xl flex items-center justify-center">
              <Lock className="w-9 h-9 text-[#FDE047] animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FECDD3] text-[10px] font-black uppercase tracking-widest mb-3">
            <Shield className="w-3 h-3 text-[#22C55E]" />
            <span>RONY STORE • ADMIN PANEL</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-black text-white mb-2">
            {isAr ? 'لوحة تحكم روني ستور' : 'Rony Store Control Panel'}
          </h2>

          <p className="text-xs text-white/70 font-medium mb-6">
            {isAr 
              ? 'الوصول محمي ومخصص فقط لإدارة المتجر والمنتجات والطلبات.' 
              : 'Authorized personnel only. Please enter your secret admin PIN.'}
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-black text-white/80 flex items-center justify-between">
                <span>{isAr ? 'رمز الدخول السري (PIN)' : 'Admin Security PIN'}</span>
                <span className="text-[10px] text-[#FDE047]/90 font-mono">الافتراضي: 8899</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="••••"
                  maxLength={10}
                  autoFocus
                  className="w-full bg-black/50 border border-white/25 rounded-2xl py-3.5 pr-10 pl-4 text-center text-xl font-mono tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-[#FDE047] focus:ring-2 focus:ring-[#FDE047]/40 transition-all"
                />
              </div>
            </div>

            {pinError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#FECDD3] text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span>{isAr ? 'رمز المرور غير صحيح، يرجى المحاولة مجدداً.' : 'Invalid PIN entered. Please try again.'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#DC2626] text-[#4C0519] font-black text-sm tracking-wider uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isAr ? 'دخول لوحة التحكم ←' : 'Unlock Dashboard →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                if (typeof window !== 'undefined') window.location.hash = '';
              }}
              className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرجوع إلى واجهة المتجر الرئيسية' : 'Return to Public Storefront'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED FULL ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#100103] text-white select-none pb-24">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#1C0206]/95 backdrop-blur-xl border-b border-white/15 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#DC2626] p-0.5 flex items-center justify-center shadow">
                <div className="w-full h-full bg-[#180104] rounded-[10px] flex items-center justify-center font-serif-luxury text-sm font-black text-[#FDE047]">
                  R
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-luxury text-base font-black text-white">
                    {isAr ? 'لوحة تحكم روني ستور' : 'Rony Store Admin'}
                  </h1>
                  <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#22C55E] ${isCloudSyncing ? 'animate-ping' : ''}`} />
                    {isCloudSyncing ? (isAr ? 'جاري المزامنة...' : 'Syncing...') : (isAr ? 'مزامنة سحابية حية 🟢' : 'Live Cloud Sync')}
                  </span>
                </div>
                <p className="text-[10px] text-white/60">
                  {isAr 
                    ? `أي تعديل يتم حفظه ومزامنته فورياً على جميع الأجهزة (موبايل ولابتوب) • آخر تحديث: ${lastSyncedAt ? lastSyncedAt.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'الآن'}` 
                    : `Instant multi-device cloud sync active • Last updated: ${lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Now'}`}
                </p>
              </div>
            </div>

            {/* Mobile View Store Button */}
            <button
              onClick={() => {
                setCurrentView('home');
                if (typeof window !== 'undefined') window.location.hash = '';
              }}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white text-xs flex items-center gap-1 border border-white/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'المتجر' : 'Shop'}</span>
            </button>
          </div>

          {/* Action Tools (Cloud Sync, Backup, Restore, Preview, Logout) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => syncAllToCloud()}
              disabled={isCloudSyncing}
              title={isAr ? 'مزامنة قسرية لجميع البيانات مع السحابة' : 'Force sync all data to cloud'}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#22C55E]/20 hover:from-[#D4AF37]/40 hover:to-[#22C55E]/40 text-[#FDE047] border border-[#FDE047]/30 text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin text-[#22C55E]' : 'text-[#FDE047]'}`} />
              <span>{isCloudSyncing ? (isAr ? 'جاري المزامنة...' : 'Syncing...') : (isAr ? 'مزامنة السحابة الآن' : 'Sync Cloud')}</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              title={isAr ? 'تصدير نسخة احتياطية JSON' : 'Export Backup JSON'}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#FDE047]" />
              <span>{isAr ? 'تصدير' : 'Export'}</span>
            </button>

            <label
              title={isAr ? 'استيراد نسخة احتياطية JSON' : 'Import Backup JSON'}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{isAr ? 'استيراد' : 'Import'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                if (typeof window !== 'undefined') window.location.hash = '';
              }}
              className="py-1.5 px-3.5 rounded-xl bg-white text-[#4C0519] hover:bg-[#FFF5F5] text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0 shadow transition-transform hover:scale-105"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'معاينة المتجر' : 'View Store'}</span>
            </button>

            <button
              type="button"
              onClick={adminLogout}
              className="py-1.5 px-3 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#FECDD3] hover:text-white border border-[#DC2626]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'إجمالي المنتجات' : 'Products'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-white font-mono">{stats.totalProducts}</span>
              <Package className="w-4 h-4 text-[#FDE047]" />
            </div>
          </div>

          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'متوفر بالمخزون' : 'In Stock'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#22C55E] font-mono">{stats.inStockCount}</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
          </div>

          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'نفذ المخزون' : 'Out of Stock'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#DC2626] font-mono">{stats.outOfStockCount}</span>
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
            </div>
          </div>

          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'الأقسام النشطة' : 'Categories'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#38BDF8] font-mono">{stats.categoriesCount}</span>
              <Layers className="w-4 h-4 text-[#38BDF8]" />
            </div>
          </div>

          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'فروع المتجر' : 'Branches'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#FB7185] font-mono">{stats.branchesCount}</span>
              <MapPin className="w-4 h-4 text-[#FB7185]" />
            </div>
          </div>

          <div className="bg-[#200206] border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg">
            <span className="text-[10px] text-white/60 font-bold uppercase">{isAr ? 'الطلبات المسجلة' : 'Orders'}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-[#FBBF24] font-mono">{stats.totalOrders}</span>
              <ShoppingBag className="w-4 h-4 text-[#FBBF24]" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/15 pb-4 mb-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isAr ? '📦 المنتجات والأسعار' : 'Products & Pricing'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'products' ? 'bg-[#4C0519] text-white' : 'bg-black/50 text-white/70'}`}>
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'categories'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? '🏷️ الأقسام والتصنيفات' : 'Categories'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-[#4C0519] text-white' : 'bg-black/50 text-white/70'}`}>
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'branches'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isAr ? '📍 الفروع والعناوين' : 'Store Branches'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'branches' ? 'bg-[#4C0519] text-white' : 'bg-black/50 text-white/70'}`}>
              {branches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'texts'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <Type className="w-4 h-4 text-[#FDE047]" />
            <span>{isAr ? '📝 تعديل نصوص وبنرات الموقع' : 'Website Texts & Banners'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'social'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{isAr ? '📱 السوشيال والواتساب' : 'Social & WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isAr ? '⚙️ إعدادات المتجر والشحن' : 'Store Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-white text-[#4C0519] shadow-lg scale-102'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? '📋 سجل الطلبات' : 'Orders Log'}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-[#4C0519] text-white' : 'bg-black/50 text-white/70'}`}>
              {orders.length}
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT (إدارة المنتجات بالكامل) */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Action Bar (Search, Category Filter, Stock Filter, Add Product Button) */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
                {/* Search Field */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder={isAr ? 'بحث بالاسم أو الكود...' : 'Search products...'}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-all"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white transition-all"
                >
                  <option value="all">{isAr ? 'جميع الأقسام' : 'All Categories'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {isAr ? cat.nameAr : cat.nameEn}
                    </option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={prodStockFilter}
                  onChange={(e) => setProdStockFilter(e.target.value as any)}
                  className="w-full sm:w-auto bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white transition-all"
                >
                  <option value="all">{isAr ? 'حالة المخزون: الكل' : 'All Stock'}</option>
                  <option value="inStock">{isAr ? 'متوفر فقط' : 'In Stock only'}</option>
                  <option value="outOfStock">{isAr ? 'نفذ المخزون فقط' : 'Out of Stock'}</option>
                </select>
              </div>

              {/* Action Buttons: Add Product, Clear All (Start from 0), & Reset/Demo Catalog */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                {products.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      requestConfirmation({
                        title: isAr ? 'تصفير وحذف جميع المنتجات للبدء من الصفر' : 'Delete All Products (Start from Scratch)',
                        message: isAr
                          ? 'هل أنت متأكد من حذف وتصفير جميع المنتجات الموجودة في المتجر والبدء من الصفر؟ ستتمكن بعدها من إضافة منتجاتك وصورك الخاصة بكل حرية.'
                          : 'Are you sure you want to delete all products and start completely from scratch?',
                        confirmButtonText: isAr ? 'نعم، حذف وتصفير الكل' : 'Yes, Delete All',
                        isDestructive: true,
                        onConfirm: () => clearAllProducts(),
                      });
                    }}
                    className="py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={isAr ? 'تصفير وحذف جميع المنتجات' : 'Clear all products'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تصفير المنتجات (بدء من الصفر)' : 'Clear All'}</span>
                  </button>
                )}

                {products.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      requestConfirmation({
                        title: isAr ? 'استيراد الكتالوج التجريبي' : 'Load Demo Catalog',
                        message: isAr
                          ? 'هل ترغب في استيراد كتالوج المنتجات التجريبي (18 منتجاً فاخراً) كأمثلة؟'
                          : 'Do you want to load the 18 demo luxury products catalog?',
                        confirmButtonText: isAr ? 'استيراد الكتالوج' : 'Load Demo',
                        isDestructive: false,
                        onConfirm: () => loadDemoProducts(),
                      });
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={isAr ? 'استيراد الكتالوج التجريبي' : 'Load demo catalog'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استيراد كتالوج تجريبي (18)' : 'Load Demo (18)'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const newProdTemplate: Product = {
                      id: `rony-${Date.now().toString().slice(-4)}`,
                      nameAr: 'منتج جديد روني ستور',
                      nameEn: 'New Rony Product',
                      subtitleAr: 'تشكيلة فاخرة حصرية',
                      subtitleEn: 'Exclusive Luxury Collection',
                      category: 'lingerie',
                      price: 750,
                      originalPrice: 950,
                      rating: 5.0,
                      reviewsCount: 1,
                      isNew: true,
                      isBestSeller: false,
                      isSale: true,
                      inStock: true,
                      tagAr: 'وصل حديثاً',
                      tagEn: 'New Arrival',
                      fabricAr: 'حرير ساتان طبيعي فاخر مع دانتيل فرنسي ناعم',
                      fabricEn: 'Luxury Satin Silk with French delicate lace',
                      images: [
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
                      ],
                      colors: [
                        { nameAr: 'عنابي داكن', nameEn: 'Burgundy', hex: '#631523', value: 'burgundy' },
                        { nameAr: 'أسود ملكي', nameEn: 'Black', hex: '#161616', value: 'black' }
                      ],
                      sizes: ['S', 'M', 'L', 'XL'],
                      descriptionAr: 'منتج مميز بجودة تصنيع فائقة وملمس حريري ناعم يوفر الراحة والأناقة.',
                      descriptionEn: 'High quality luxury product tailored for comfort and elegance.',
                      specsAr: [
                        'خامات عالية الجودة وملمس ناعم مضاد للحساسية',
                        'تغليف سري معتم 100% للشحن والتوصيل'
                      ],
                      specsEn: [
                        'Premium hypoallergenic materials',
                        '100% confidential neutral shipping container'
                      ],
                      careGuideAr: [
                        'يُغسل يدوياً بالماء البارد وشامبو خاص للأقمشة الحريرية'
                      ],
                      careGuideEn: [
                        'Hand wash in cold water'
                      ]
                    };
                    setEditingProduct(newProdTemplate);
                    setIsAddingNewProduct(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white hover:from-[#EF4444] hover:to-[#B91C1C] text-xs font-black flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة منتج جديد +' : 'Add Product +'}</span>
                </button>
              </div>
            </div>

            {/* Products Table Grid */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-white">
                  <thead className="bg-[#2B0409] text-white/70 uppercase text-[10px] font-black border-b border-white/15">
                    <tr>
                      <th className="py-3.5 px-4">{isAr ? 'المنتج' : 'Product'}</th>
                      <th className="py-3.5 px-3">{isAr ? 'القسم' : 'Category'}</th>
                      <th className="py-3.5 px-3">{isAr ? 'السعر الحالي' : 'Price'}</th>
                      <th className="py-3.5 px-3">{isAr ? 'السعر الأصلي' : 'Original Price'}</th>
                      <th className="py-3.5 px-3 text-center">{isAr ? 'حالة المخزون' : 'Stock'}</th>
                      <th className="py-3.5 px-3">{isAr ? 'التقييم' : 'Rating'}</th>
                      <th className="py-3.5 px-4 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-xs">
                          {products.length === 0 ? (
                            <div className="max-w-md mx-auto space-y-4 px-4">
                              <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-white border border-white/20">
                                <Sparkles className="w-7 h-7 text-[#FECDD3]" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-serif-luxury text-base font-bold text-white">
                                  {isAr ? 'تم تصفير المنتجات بنجاح - المتجر جاهز للبدء من الصفر' : 'Store is empty and ready to start from scratch'}
                                </h4>
                                <p className="text-white/60 text-xs">
                                  {isAr 
                                    ? 'يمكنك الآن إضافة منتجاتك الخاصة وصورك وأسعارك بسهولة تامة، أو استيراد الكتالوج التجريبي في أي وقت.' 
                                    : 'You can now add your custom products, images and prices, or load the demo catalog at any time.'}
                                </p>
                              </div>
                              <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newProdTemplate: Product = {
                                      id: `rony-${Date.now().toString().slice(-4)}`,
                                      nameAr: 'منتج جديد روني ستور',
                                      nameEn: 'New Rony Product',
                                      subtitleAr: 'تشكيلة فاخرة حصرية',
                                      subtitleEn: 'Exclusive Luxury Collection',
                                      category: 'lingerie',
                                      price: 750,
                                      originalPrice: 950,
                                      rating: 5.0,
                                      reviewsCount: 1,
                                      isNew: true,
                                      isBestSeller: false,
                                      isSale: true,
                                      inStock: true,
                                      tagAr: 'وصل حديثاً',
                                      tagEn: 'New Arrival',
                                      fabricAr: 'حرير ساتان طبيعي فاخر مع دانتيل فرنسي ناعم',
                                      fabricEn: 'Luxury Satin Silk with French delicate lace',
                                      images: [
                                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
                                        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop'
                                      ],
                                      colors: [
                                        { nameAr: 'عنابي داكن', nameEn: 'Burgundy', hex: '#631523', value: 'burgundy' },
                                        { nameAr: 'أسود ملكي', nameEn: 'Black', hex: '#161616', value: 'black' }
                                      ],
                                      sizes: ['S', 'M', 'L', 'XL'],
                                      descriptionAr: 'منتج مميز بجودة تصنيع فائقة وملمس حريري ناعم يوفر الراحة والأناقة.',
                                      descriptionEn: 'High quality luxury product tailored for comfort and elegance.',
                                      specsAr: [
                                        'خامات عالية الجودة وملمس ناعم مضاد للحساسية',
                                        'تغليف سري معتم 100% للشحن والتوصيل'
                                      ],
                                      specsEn: [
                                        'Premium hypoallergenic materials',
                                        '100% confidential neutral shipping container'
                                      ],
                                      careGuideAr: [
                                        'يُغسل يدوياً بالماء البارد وشامبو خاص للأقمشة الحريرية'
                                      ],
                                      careGuideEn: [
                                        'Hand wash in cold water'
                                      ]
                                    };
                                    setEditingProduct(newProdTemplate);
                                    setIsAddingNewProduct(true);
                                  }}
                                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>{isAr ? 'إضافة منتجك الأول +' : 'Add Your First Product'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => loadDemoProducts()}
                                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'استيراد كتالوج تجريبي' : 'Load Demo'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-white/50">{isAr ? 'لا توجد منتجات مطابقة لخيارات البحث.' : 'No products found matching filters.'}</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        return (
                          <tr key={product.id} className="hover:bg-white/5 transition-colors">
                            {/* Image and Titles */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-xl overflow-hidden bg-black/50 border border-white/20 shrink-0">
                                  <img
                                    src={product.images[0]}
                                    alt={product.nameAr}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-serif-luxury font-black text-sm text-white line-clamp-1">
                                      {isAr ? product.nameAr : product.nameEn}
                                    </span>
                                    {product.tagAr && (
                                      <span className="bg-white/10 text-[#FECDD3] text-[9px] font-black px-1.5 py-0.2 rounded border border-white/20">
                                        {isAr ? product.tagAr : product.tagEn}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-white/60 font-mono block">
                                    ID: {product.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-3">
                              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-[#FECDD3]">
                                {product.category === 'lingerie' ? (isAr ? 'بيبي دول' : 'Babydoll')
                                  : product.category === 'couple_games' ? (isAr ? 'ألعاب زوجية' : 'Games')
                                  : product.category === 'care_pedicure' ? (isAr ? 'باديكير' : 'Pedicure')
                                  : product.category === 'men_enhancers' ? (isAr ? 'محفزات رجالي' : 'Men')
                                  : (isAr ? 'محفزات حريمي' : 'Women')}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-3 font-mono font-black text-sm text-white">
                              {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                            </td>

                            {/* Original Price */}
                            <td className="py-3.5 px-3 font-mono text-xs text-white/50 line-through">
                              {product.originalPrice ? `${product.originalPrice.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}` : '—'}
                            </td>

                            {/* Stock Toggle Switch */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  updateProduct({ ...product, inStock: !product.inStock });
                                }}
                                className={`py-1 px-3 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                                  product.inStock
                                    ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40 hover:bg-[#22C55E]/30'
                                    : 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40 hover:bg-[#DC2626]/30'
                                }`}
                              >
                                {product.inStock ? (isAr ? '✓ متوفر' : '✓ In Stock') : (isAr ? '✕ نفذ' : '✕ Out of Stock')}
                              </button>
                            </td>

                            {/* Rating */}
                            <td className="py-3.5 px-3 font-mono text-xs text-[#FDE047]">
                              ★ {product.rating} <span className="text-[10px] text-white/50">({product.reviewsCount})</span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsAddingNewProduct(false);
                                  }}
                                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#4C0519] flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                                  title={isAr ? 'تعديل المنتج' : 'Edit Product'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Duplicate Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const duplicated: Product = {
                                      ...product,
                                      id: `rony-${Date.now().toString().slice(-4)}`,
                                      nameAr: `${product.nameAr} (نسخة)`,
                                      nameEn: `${product.nameEn} (Copy)`
                                    };
                                    addProduct(duplicated);
                                  }}
                                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                                  title={isAr ? 'تكرار المنتج' : 'Duplicate'}
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    requestConfirmation({
                                      title: isAr ? 'تأكيد حذف المنتج' : 'Delete Product',
                                      message: isAr
                                        ? `هل أنت متأكد من رغبتك في حذف المنتج "${product.nameAr}"؟ سيتم حذفه من قائمة المنتجات فوراً.`
                                        : `Are you sure you want to permanently delete "${product.nameEn}"? This action cannot be undone.`,
                                      confirmButtonText: isAr ? 'نعم، احذف المنتج' : 'Delete Product',
                                      isDestructive: true,
                                      onConfirm: () => deleteProduct(product.id),
                                    });
                                  }}
                                  className="w-8 h-8 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#FECDD3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#DC2626]/30"
                                  title={isAr ? 'حذف المنتج' : 'Delete Product'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: CATEGORIES MANAGEMENT (إدارة الأقسام) */}
        {/* ================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-black text-white">
                  {isAr ? 'أقسام وتصنيفات المتجر' : 'Store Categories'}
                </h3>
                <p className="text-xs text-white/70">
                  {isAr ? 'تعديل أسماء وصور ووصف الأقسام المعروضة بالصفحة الرئيسية والمتجر' : 'Manage categories, descriptions & banner images'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newCatTemplate: StoreCategoryItem = {
                    id: `cat_${Date.now().toString().slice(-4)}`,
                    nameAr: 'قسم جديد',
                    nameEn: 'New Category',
                    subtitleAr: 'وصف فرعي فاخر',
                    subtitleEn: 'Luxury Subtitle',
                    descAr: 'وصف القسم الكامل هنا',
                    descEn: 'Full category description',
                    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
                    badgeAr: 'تشكيلة جديدة',
                    badgeEn: 'New'
                  };
                  setEditingCategory(newCatTemplate);
                  setIsAddingNewCategory(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة قسم +' : 'Add Category +'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const prodCount = products.filter(p => p.category === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="bg-[#1C0206] border border-white/15 hover:border-white/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/20 bg-black/40">
                        <img
                          src={cat.image}
                          alt={cat.nameAr}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140103] via-transparent to-transparent" />
                        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-black text-[#FECDD3]">
                          {prodCount} {isAr ? 'منتج مرتبط' : 'products'}
                        </div>
                        {cat.badgeAr && (
                          <div className="absolute bottom-2.5 left-2.5 bg-[#DC2626] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                            {isAr ? cat.badgeAr : cat.badgeEn}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 mb-3">
                        <h4 className="font-serif-luxury text-base font-black text-white">
                          {isAr ? cat.nameAr : cat.nameEn}
                        </h4>
                        <p className="text-xs text-[#FECDD3] font-medium">
                          {isAr ? cat.subtitleAr : cat.subtitleEn}
                        </p>
                        <p className="text-xs text-white/70 line-clamp-2 mt-2">
                          {isAr ? cat.descAr : cat.descEn}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/50">ID: {cat.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsAddingNewCategory(false);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#4C0519] text-xs font-bold flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            requestConfirmation({
                              title: isAr ? 'تأكيد حذف القسم' : 'Delete Category',
                              message: isAr
                                ? `هل أنت متأكد من رغبتك في حذف قسم "${cat.nameAr}"؟`
                                : `Are you sure you want to delete category "${cat.nameEn}"?`,
                              confirmButtonText: isAr ? 'نعم، احذف القسم' : 'Delete Category',
                              isDestructive: true,
                              onConfirm: () => deleteCategory(cat.id),
                            });
                          }}
                          className="w-8 h-8 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#FECDD3] hover:text-white flex items-center justify-center border border-[#DC2626]/30 transition-colors cursor-pointer"
                          title={isAr ? 'حذف القسم' : 'Delete Category'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: STORE BRANCHES (إدارة الفروع والعناوين) */}
        {/* ================================================================= */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-black text-white">
                  {isAr ? 'عناوين وفروع روني ستور الرسمية' : 'Official Boutique Branches'}
                </h3>
                <p className="text-xs text-white/70">
                  {isAr ? 'تعديل فروع بورسعيد، القاهرة، الإسكندرية وإضافة أي فروع جديدة تظهر بالفوتر' : 'Manage showroom addresses, phone numbers & direct WhatsApp links'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newBranchTemplate: StoreBranch = {
                    id: `branch-${Date.now().toString().slice(-4)}`,
                    nameAr: 'فرع جديد',
                    nameEn: 'New Branch',
                    cityAr: 'المدينة',
                    cityEn: 'City',
                    addressAr: 'العنوان بالتفصيل والمعالم المميزة',
                    addressEn: 'Full address and landmarks',
                    phone: storeSettings.primaryPhone || '+20 109 546 1883',
                    whatsapp: storeSettings.whatsappOrder1 || '201095461883',
                    isActive: true
                  };
                  setEditingBranch(newBranchTemplate);
                  setIsAddingNewBranch(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة فرع +' : 'Add Branch +'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branches.map((branch) => {
                return (
                  <div
                    key={branch.id}
                    className="bg-[#1C0206] border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white">
                          {isAr ? branch.cityAr : branch.cityEn}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${branch.isActive ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-gray-700 text-gray-400'}`}>
                          {branch.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow">
                          <MapPin className="w-4 h-4 text-[#FECDD3]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif-luxury text-base font-black text-white">
                            {isAr ? branch.nameAr : branch.nameEn}
                          </h4>
                          <p className="text-xs text-white/80 leading-relaxed font-medium">
                            {isAr ? branch.addressAr : branch.addressEn}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-white/70">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#FDE047]" />
                          <span className="font-mono">{branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span className="font-mono">واتساب: {branch.whatsapp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          updateBranch({ ...branch, isActive: !branch.isActive });
                        }}
                        className="text-[10px] text-white/60 hover:text-white underline cursor-pointer"
                      >
                        {branch.isActive ? (isAr ? 'تعطيل الفرع' : 'Deactivate') : (isAr ? 'تفعيل الفرع' : 'Activate')}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBranch(branch);
                            setIsAddingNewBranch(false);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#4C0519] text-xs font-bold flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            requestConfirmation({
                              title: isAr ? 'تأكيد حذف الفرع' : 'Delete Branch',
                              message: isAr
                                ? `هل أنت متأكد من رغبتك في حذف فرع "${branch.nameAr}"؟`
                                : `Are you sure you want to delete branch "${branch.nameEn}"?`,
                              confirmButtonText: isAr ? 'نعم، احذف الفرع' : 'Delete Branch',
                              isDestructive: true,
                              onConfirm: () => deleteBranch(branch.id),
                            });
                          }}
                          className="w-8 h-8 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#FECDD3] hover:text-white flex items-center justify-center border border-[#DC2626]/30 transition-colors cursor-pointer"
                          title={isAr ? 'حذف الفرع' : 'Delete Branch'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SOCIAL MEDIA & WHATSAPP (إدارة التواصل والسوشيال ميديا) */}
        {/* ================================================================= */}
        {activeTab === 'social' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-lg font-black text-white">
                    {isAr ? 'أرقام الواتساب وقنوات التواصل' : 'WhatsApp & Social Channels'}
                  </h3>
                  <p className="text-xs text-white/70">
                    {isAr ? 'الأرقام المسؤولة عن استقبال رسائل الطلبات وزر التواصل العائم' : 'Order reception numbers & social media links'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E]">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{isAr ? 'رقم واتساب الأساسي لاستقبال الطلبات (مع كود الدولة 20)' : 'Primary WhatsApp (e.g. 201095461883)'}</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappOrder1}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappOrder1: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs font-mono text-white focus:border-[#22C55E] focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{isAr ? 'رقم واتساب الثاني الاحتياطي' : 'Secondary WhatsApp Backup'}</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappOrder2}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappOrder2: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs font-mono text-white focus:border-[#22C55E] focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FDE047]" />
                    <span>{isAr ? 'رقم الهاتف / الخط الساخن' : 'Hotline Phone'}</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.primaryPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, primaryPhone: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs font-mono text-white focus:border-[#FDE047] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">{isAr ? 'رابط إنستجرام' : 'Instagram URL'}</label>
                    <input
                      type="text"
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">{isAr ? 'رابط تيك توك' : 'TikTok URL'}</label>
                    <input
                      type="text"
                      value={settingsForm.tiktokUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">{isAr ? 'رابط فيسبوك' : 'Facebook URL'}</label>
                    <input
                      type="text"
                      value={settingsForm.facebookUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">{isAr ? 'رابط تيليجرام' : 'Telegram URL'}</label>
                    <input
                      type="text"
                      value={settingsForm.telegramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegramUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    updateStoreSettings(settingsForm);
                  }}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ أرقام وروابط التواصل' : 'Save Contact Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: WEBSITE TEXTS & BANNERS (تعديل نصوص وبنرات وواجهة المتجر) */}
        {/* ================================================================= */}
        {activeTab === 'texts' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card with Quick Save and Preview Actions */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FDE047] text-xs font-black">
                  <Type className="w-4 h-4" />
                  <span>{isAr ? 'لوحة تحكم نصوص وبنرات الموقع' : 'Website Copy & Promotional Banners'}</span>
                </div>
                <h3 className="font-serif-luxury text-xl font-black text-white">
                  {isAr ? 'تعديل نصوص وعبارات المتجر بالكامل' : 'Edit All Store Texts & Copy'}
                </h3>
                <p className="text-xs text-white/70 max-w-xl">
                  {isAr
                    ? 'يمكنك تعديل أي نص في الموقع بسهولة (شريط الإعلانات، عبارات الهيدر والترحيب، مميزات البراند، بنر الهدايا، وبطاقات الضمانات الأربعة) وحفظها فوراً لتظهر في واجهة المتجر.'
                    : 'Easily customize announcement texts, hero headers, brand card highlights, flash promo banners, and trust cards.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isAr ? 'معاينة المتجر' : 'Live Store Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateStoreSettings(settingsForm);
                    showToast(
                      isAr ? 'تم حفظ جميع نصوص المتجر وبنراته بنجاح ✨' : 'All store texts saved successfully ✨',
                      'success'
                    );
                  }}
                  className="py-2.5 px-6 rounded-xl bg-white text-[#4C0519] font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#DC2626]" />
                  <span>{isAr ? 'حفظ النصوص الآن' : 'Save Texts'}</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: TOP ANNOUNCEMENT TICKER */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FDE047]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isAr ? '1. الشريط الإعلاني العلوي (Marquee Ticker)' : '1. Top Announcement Bar'}
                    </h4>
                    <p className="text-[11px] text-white/60">
                      {isAr ? 'يظهر في أعلى كل صفحات الموقع فوق النافبار' : 'Appears at the very top of all pages above navbar'}
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcementActive}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                    className="rounded accent-[#DC2626] w-4 h-4 cursor-pointer"
                  />
                  <span>{isAr ? 'تفعيل الشريط' : 'Active'}</span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'النص الإعلاني باللغة العربية' : 'Arabic Announcement Text'}
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.announcementTextAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementTextAr: e.target.value })}
                    placeholder="مثال: ✨ بيبي دول ولانجري سيلك • ألعاب زوجية • باديكير • محفزات رجالي وحريمي • تغليف سري 100%"
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'النص باللغة الإنجليزية (English)' : 'English Announcement Text'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementTextEn || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementTextEn: e.target.value })}
                    placeholder="e.g. ✨ Couture Babydolls & Silk • Couple Games • Pedicure • Men & Women Stimulants • 100% Discreet"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: HERO SECTION & CTA BUTTONS */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FECDD3]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? '2. واجهة الهيدر الرئيسية (Hero Section & CTAs)' : '2. Hero Section & Call-to-Actions'}
                  </h4>
                  <p className="text-[11px] text-white/60">
                    {isAr ? 'العنوان الكبير والوصف الترويجي وأزرار الطلب في الصفحة الرئيسية' : 'Main headline, promotional description and action buttons on home page'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Hero Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'الشارة العلوية الصغيرة (عربي)' : 'Hero Badge (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBadgeAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBadgeAr: e.target.value })}
                      placeholder="مثال: كولكشن روني ستور للملابس الراقية الحصري"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'الشارة العلوية (English)' : 'Hero Badge (English)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBadgeEn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBadgeEn: e.target.value })}
                      placeholder="e.g. RONY STORE EXCLUSIVE COLLECTION"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Hero Main Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#FDE047]">
                      {isAr ? 'العنوان الرئيسي الكبير (عربي)' : 'Hero Main Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroTitleAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleAr: e.target.value })}
                      placeholder="مثال: الأناقة الحميمية والبيبي دول الملكي"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#FDE047]">
                      {isAr ? 'العنوان الرئيسي الكبير (English)' : 'Hero Main Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroTitleEn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleEn: e.target.value })}
                      placeholder="e.g. Couture Babydolls & Intimate Allure"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Hero Subtitle / Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الوصف والفقرة الترويجية تحت العنوان (عربي)' : 'Hero Subtitle / Description (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitleAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitleAr: e.target.value })}
                    placeholder="اكتشفي أرقى تشكيلة بيبي دول دانتيل، قمصان نوم سيلك، وألعاب رومانسية حصرية مع ضمان التغليف السري المعتم والدفع عند الاستلام."
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الوصف والفقرة الترويجية (English)' : 'Hero Subtitle / Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitleEn || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitleEn: e.target.value })}
                    placeholder="Explore romantic sheer lace babydolls, pure silk robes, and private couple romance games with guaranteed discreet packaging and COD across Egypt."
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                {/* Hero CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'نص زر التسوق الرئيسي (عربي)' : 'Primary CTA Button (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBtn1TextAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBtn1TextAr: e.target.value })}
                      placeholder="تسوقي كولكشن البيبي دول"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'نص زر طلب الواتساب (عربي)' : 'WhatsApp CTA Button (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBtn2TextAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBtn2TextAr: e.target.value })}
                      placeholder="طلب واستفسار واتساب"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: BRAND MONOGRAM CARD */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#38BDF8]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? '3. بطاقة تعريف البراند (Brand Monogram Capsule)' : '3. Brand Monogram Capsule Card'}
                  </h4>
                  <p className="text-[11px] text-white/60">
                    {isAr ? 'البطاقة الجانبية الفاخرة بجوار الهيدر في الصفحة الرئيسية' : 'The luxury badge capsule shown next to hero on home page'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'شارة سنة التأسيس والموقع' : 'Established Badge'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandCardBadgeAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandCardBadgeAr: e.target.value })}
                    placeholder="EST. CAIRO"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الوصف الفرعي للبوتيك' : 'Brand Subtitle'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandCardSubAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandCardSubAr: e.target.value })}
                    placeholder="بوتيك الفخامة والخصوصية"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الميزة 1 (تغليف سري)' : 'Feature 1'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandFeat1Ar || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandFeat1Ar: e.target.value })}
                    placeholder="تغليف سري معتم 100% لباب المنزل"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الميزة 2 (الخامات)' : 'Feature 2'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandFeat2Ar || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandFeat2Ar: e.target.value })}
                    placeholder="خامات دانتيل وسيلك ناعم وفاخر"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'الميزة 3 (الشحن)' : 'Feature 3'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandFeat3Ar || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandFeat3Ar: e.target.value })}
                    placeholder="شحن لجميع المحافظات ودفع عند الاستلام"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'نص زر استشارة المقاسات الفورية' : 'Concierge Sizing Button'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandConciergeBtnAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandConciergeBtnAr: e.target.value })}
                    placeholder="استشارة المقاسات الفورية"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: FLASH SPECIAL OFFER & GIFT BANNER */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#DC2626]">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? '4. بنر العرض الترويجي والهدية (Special Offer & Gift Banner)' : '4. Flash Promo & Gift Banner'}
                  </h4>
                  <p className="text-[11px] text-white/60">
                    {isAr ? 'البنر الأفقي للعرض الحصري والهدية المجانية في الصفحة الرئيسية' : 'The prominent horizontal gift offer banner on home page'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'شارة العرض (مثل: عرض حصري لفترة محدودة)' : 'Offer Badge'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.offerBadgeAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, offerBadgeAr: e.target.value })}
                      placeholder="عرض حصري لفترة محدودة"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/90">
                      {isAr ? 'شارة التميز (مثل: هدية مميزة)' : 'Offer Tag'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.offerTagAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, offerTagAr: e.target.value })}
                      placeholder="هدية مميزة"
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#FDE047]">
                    {isAr ? 'عنوان العرض الرئيسي (عربي)' : 'Offer Main Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.offerTitleAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, offerTitleAr: e.target.value })}
                    placeholder="اطلبي أي قطعتين بيبي دول واحصلي على لعبة زوجية هدية مجانية!"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'تفاصيل وشروط العرض (عربي)' : 'Offer Subtitle (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.offerSubtitleAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, offerSubtitleAr: e.target.value })}
                    placeholder="يسري العرض على جميع المحافظات مع شحن سري معتم ودفع عند الاستلام."
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/90">
                    {isAr ? 'نص زر واتساب لتفعيل العرض' : 'Offer CTA Button Text'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.offerBtnTextAr || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, offerBtnTextAr: e.target.value })}
                    placeholder="تفعيل العرض عبر واتساب"
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: 4 TRUST GUARANTEE CARDS */}
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isAr ? '5. بطاقات المميزات والضمانات الأربعة (4 Trust Guarantees)' : '5. Four Trust Guarantee Cards'}
                  </h4>
                  <p className="text-[11px] text-white/60">
                    {isAr ? 'البطاقات الأربعة المعروضة في شريط الفوتر وأسفل الصفحة الرئيسية' : 'The 4 cards displayed across footer and home guarantees strip'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Discreet Packaging */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FECDD3] font-black text-xs">
                    <Lock className="w-4 h-4 text-[#DC2626]" />
                    <span>{isAr ? 'البطاقة 1: التغليف السري' : 'Card 1: Packaging'}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'العنوان' : 'Title'}</label>
                    <input
                      type="text"
                      value={settingsForm.guarantee1TitleAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee1TitleAr: e.target.value })}
                      placeholder="تغليف سري ومحكم 100%"
                      className="w-full bg-black/50 border border-white/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'الشرح والتفاصيل' : 'Description'}</label>
                    <textarea
                      rows={2}
                      value={settingsForm.guarantee1DescAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee1DescAr: e.target.value })}
                      placeholder="يتم شحن جميع الطلبات في صناديق كرتونية معتمة بدون أي إشارة للمحتوى أو اسم المتجر."
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Card 2: Express Shipping */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FECDD3] font-black text-xs">
                    <Truck className="w-4 h-4 text-[#38BDF8]" />
                    <span>{isAr ? 'البطاقة 2: الشحن السريع' : 'Card 2: Shipping'}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'العنوان' : 'Title'}</label>
                    <input
                      type="text"
                      value={settingsForm.guarantee2TitleAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee2TitleAr: e.target.value })}
                      placeholder="شحن سريع لجميع محافظات مصر"
                      className="w-full bg-black/50 border border-white/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'الشرح والتفاصيل' : 'Description'}</label>
                    <textarea
                      rows={2}
                      value={settingsForm.guarantee2DescAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee2DescAr: e.target.value })}
                      placeholder="توصيل سريع خلال 24-48 ساعة للقاهرة والجيزة و2-3 أيام لباقي المحافظات."
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Card 3: Payment & COD */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FECDD3] font-black text-xs">
                    <DollarSign className="w-4 h-4 text-[#FDE047]" />
                    <span>{isAr ? 'البطاقة 3: الدفع والمحافظ' : 'Card 3: Payment'}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'العنوان' : 'Title'}</label>
                    <input
                      type="text"
                      value={settingsForm.guarantee3TitleAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee3TitleAr: e.target.value })}
                      placeholder="دفع عند الاستلام وفودافون كاش"
                      className="w-full bg-black/50 border border-white/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'الشرح والتفاصيل' : 'Description'}</label>
                    <textarea
                      rows={2}
                      value={settingsForm.guarantee3DescAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee3DescAr: e.target.value })}
                      placeholder="الدفع عند الاستلام (COD)، والمحافظ الإلكترونية، والبطاقات البنكية."
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Card 4: Quality & Silk Fabrics */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FECDD3] font-black text-xs">
                    <Shield className="w-4 h-4 text-[#22C55E]" />
                    <span>{isAr ? 'البطاقة 4: الخامات الأصلية' : 'Card 4: Quality'}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'العنوان' : 'Title'}</label>
                    <input
                      type="text"
                      value={settingsForm.guarantee4TitleAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee4TitleAr: e.target.value })}
                      placeholder="بيبي دول وحرير أصلي فاخر"
                      className="w-full bg-black/50 border border-white/20 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/80">{isAr ? 'الشرح والتفاصيل' : 'Description'}</label>
                    <textarea
                      rows={2}
                      value={settingsForm.guarantee4DescAr || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, guarantee4DescAr: e.target.value })}
                      placeholder="أقمشة حريرية فرنسية ودانتيل فائق النعومة صُمم خصيصاً لراحتك التامة."
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating/Sticky Action Bar */}
            <div className="bg-[#1C0206] border border-white/20 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  requestConfirmation({
                    title: isAr ? 'استعادة النصوص الافتراضية الأصلية' : 'Reset Texts to Default',
                    message: isAr
                      ? 'هل أنت متأكد من استعادة جميع النصوص الأصلية الافتراضية للمتجر وبنراته؟'
                      : 'Are you sure you want to reset all store copy and banners to default?',
                    confirmButtonText: isAr ? 'نعم، استعادة النصوص' : 'Reset Texts',
                    isDestructive: true,
                    onConfirm: () => {
                      const resetTexts: StoreSettings = {
                        ...settingsForm,
                        announcementTextAr: DEFAULT_STORE_SETTINGS.announcementTextAr,
                        announcementTextEn: DEFAULT_STORE_SETTINGS.announcementTextEn,
                        heroBadgeAr: DEFAULT_STORE_SETTINGS.heroBadgeAr,
                        heroBadgeEn: DEFAULT_STORE_SETTINGS.heroBadgeEn,
                        heroTitleAr: DEFAULT_STORE_SETTINGS.heroTitleAr,
                        heroTitleEn: DEFAULT_STORE_SETTINGS.heroTitleEn,
                        heroSubtitleAr: DEFAULT_STORE_SETTINGS.heroSubtitleAr,
                        heroSubtitleEn: DEFAULT_STORE_SETTINGS.heroSubtitleEn,
                        heroBtn1TextAr: DEFAULT_STORE_SETTINGS.heroBtn1TextAr,
                        heroBtn1TextEn: DEFAULT_STORE_SETTINGS.heroBtn1TextEn,
                        heroBtn2TextAr: DEFAULT_STORE_SETTINGS.heroBtn2TextAr,
                        heroBtn2TextEn: DEFAULT_STORE_SETTINGS.heroBtn2TextEn,
                        brandCardBadgeAr: DEFAULT_STORE_SETTINGS.brandCardBadgeAr,
                        brandCardBadgeEn: DEFAULT_STORE_SETTINGS.brandCardBadgeEn,
                        brandCardSubAr: DEFAULT_STORE_SETTINGS.brandCardSubAr,
                        brandCardSubEn: DEFAULT_STORE_SETTINGS.brandCardSubEn,
                        brandFeat1Ar: DEFAULT_STORE_SETTINGS.brandFeat1Ar,
                        brandFeat1En: DEFAULT_STORE_SETTINGS.brandFeat1En,
                        brandFeat2Ar: DEFAULT_STORE_SETTINGS.brandFeat2Ar,
                        brandFeat2En: DEFAULT_STORE_SETTINGS.brandFeat2En,
                        brandFeat3Ar: DEFAULT_STORE_SETTINGS.brandFeat3Ar,
                        brandFeat3En: DEFAULT_STORE_SETTINGS.brandFeat3En,
                        brandConciergeBtnAr: DEFAULT_STORE_SETTINGS.brandConciergeBtnAr,
                        brandConciergeBtnEn: DEFAULT_STORE_SETTINGS.brandConciergeBtnEn,
                        offerBadgeAr: DEFAULT_STORE_SETTINGS.offerBadgeAr,
                        offerBadgeEn: DEFAULT_STORE_SETTINGS.offerBadgeEn,
                        offerTagAr: DEFAULT_STORE_SETTINGS.offerTagAr,
                        offerTagEn: DEFAULT_STORE_SETTINGS.offerTagEn,
                        offerTitleAr: DEFAULT_STORE_SETTINGS.offerTitleAr,
                        offerTitleEn: DEFAULT_STORE_SETTINGS.offerTitleEn,
                        offerSubtitleAr: DEFAULT_STORE_SETTINGS.offerSubtitleAr,
                        offerSubtitleEn: DEFAULT_STORE_SETTINGS.offerSubtitleEn,
                        offerBtnTextAr: DEFAULT_STORE_SETTINGS.offerBtnTextAr,
                        offerBtnTextEn: DEFAULT_STORE_SETTINGS.offerBtnTextEn,
                        guarantee1TitleAr: DEFAULT_STORE_SETTINGS.guarantee1TitleAr,
                        guarantee1DescAr: DEFAULT_STORE_SETTINGS.guarantee1DescAr,
                        guarantee2TitleAr: DEFAULT_STORE_SETTINGS.guarantee2TitleAr,
                        guarantee2DescAr: DEFAULT_STORE_SETTINGS.guarantee2DescAr,
                        guarantee3TitleAr: DEFAULT_STORE_SETTINGS.guarantee3TitleAr,
                        guarantee3DescAr: DEFAULT_STORE_SETTINGS.guarantee3DescAr,
                        guarantee4TitleAr: DEFAULT_STORE_SETTINGS.guarantee4TitleAr,
                        guarantee4DescAr: DEFAULT_STORE_SETTINGS.guarantee4DescAr,
                      };
                      setSettingsForm(resetTexts);
                      updateStoreSettings(resetTexts);
                      showToast(
                        isAr ? 'تم استعادة النصوص الافتراضية بنجاح' : 'Texts reset to defaults',
                        'success'
                      );
                    },
                  });
                }}
                className="text-xs text-white/60 hover:text-white underline cursor-pointer"
              >
                {isAr ? 'استعادة النصوص الافتراضية' : 'Reset texts to default'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAr ? 'معاينة التغييرات' : 'Preview Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateStoreSettings(settingsForm);
                    showToast(
                      isAr ? 'تم حفظ جميع نصوص المتجر وبنراته بنجاح ✨' : 'All store texts saved successfully ✨',
                      'success'
                    );
                  }}
                  className="py-3 px-8 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ جميع النصوص والبنرات' : 'Save All Texts'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: GENERAL SETTINGS & ANNOUNCEMENTS (إعدادات المتجر والشحن) */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-white/15 pb-4">
                <h3 className="font-serif-luxury text-lg font-black text-white">
                  {isAr ? 'إعدادات المتجر والشحن والخصومات' : 'Store Announcements & Shipping'}
                </h3>
                <p className="text-xs text-white/70">
                  {isAr ? 'تعديل رسالة الشريط العلوي، كود الخصم، تكاليف الشحن، ورمز الـ PIN' : 'Customize top announcement text, shipping rates, coupons & admin PIN'}
                </p>
              </div>

              <div className="space-y-5">
                {/* Announcement Bar */}
                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/15">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-[#FDE047]">
                      {isAr ? 'نص الشريط الإعلاني العلوي' : 'Top Announcement Bar Text'}
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.announcementActive}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                        className="rounded accent-[#DC2626]"
                      />
                      <span>{isAr ? 'تفعيل الشريط' : 'Active'}</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={settingsForm.announcementTextAr}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementTextAr: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                {/* Shipping & Promo Rates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">
                      {isAr ? 'تكلفة الشحن القياسية (ج.م)' : 'Standard Shipping Fee (EGP)'}
                    </label>
                    <input
                      type="number"
                      value={settingsForm.standardShippingFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">
                      {isAr ? 'حد الشحن المجاني التلقائي (ج.م)' : 'Free Shipping Threshold (EGP)'}
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">
                      {isAr ? 'كود الخصم الفعّال' : 'Active Promo Code'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.activePromoCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, activePromoCode: e.target.value.toUpperCase() })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-white">
                      {isAr ? 'نسبة الخصم للكود (%)' : 'Discount Percentage (%)'}
                    </label>
                    <input
                      type="number"
                      value={settingsForm.activeDiscountPercent}
                      onChange={(e) => setSettingsForm({ ...settingsForm, activeDiscountPercent: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-2.5 px-3 text-xs font-mono text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Secret Packaging Guarantee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white">
                    {isAr ? 'نص ضمان التغليف السري والخصوصية' : 'Discreet Packaging Text'}
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.discreetPackagingNoteAr}
                    onChange={(e) => setSettingsForm({ ...settingsForm, discreetPackagingNoteAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                {/* Cloudinary CDN Media Storage Configuration */}
                <div className="p-4 rounded-2xl bg-black/40 border border-[#38BDF8]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{isAr ? 'إعدادات التخزين السحابي (Cloudinary Storage)' : 'Cloudinary Media Storage'}</span>
                        </label>
                        <p className="text-[10px] text-white/60">
                          {isAr ? 'تخزين ورفع صور وفيديوهات المنتجات والبنرات سحابياً' : 'Store & deliver product and banner media'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTestCloudinary}
                      disabled={isTestingCloudinary}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isTestingCloudinary ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Globe className="w-3 h-3 text-[#38BDF8]" />
                      )}
                      <span>{isAr ? 'فحص الاتصال' : 'Test Connection'}</span>
                    </button>
                  </div>

                  {cloudinaryTestResult && (
                    <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      cloudinaryTestResult.success 
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                        : 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                    }`}>
                      {cloudinaryTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-[11px] leading-snug">{cloudinaryTestResult.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-white/80">
                        {isAr ? 'اسم السحابة (Cloud Name)' : 'Cloud Name'}
                      </label>
                      <input
                        type="text"
                        value={cloudinaryForm.cloudName}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, cloudName: e.target.value })}
                        placeholder="e.g. edido9ui"
                        className="w-full bg-black/60 border border-white/20 rounded-xl py-2 px-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-white/80">
                        {isAr ? 'الـ Upload Preset' : 'Upload Preset'}
                      </label>
                      <input
                        type="text"
                        value={cloudinaryForm.uploadPreset}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, uploadPreset: e.target.value })}
                        placeholder="e.g. upload_rony"
                        className="w-full bg-black/60 border border-white/20 rounded-xl py-2 px-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-white/80">
                        {isAr ? 'مفتاح الـ API Key' : 'API Key'}
                      </label>
                      <input
                        type="text"
                        value={cloudinaryForm.apiKey}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, apiKey: e.target.value })}
                        placeholder="728215931316187"
                        className="w-full bg-black/60 border border-white/20 rounded-xl py-2 px-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-white/80">
                        {isAr ? 'الـ API Secret' : 'API Secret'}
                      </label>
                      <input
                        type="password"
                        value={cloudinaryForm.apiSecret}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, apiSecret: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-black/60 border border-white/20 rounded-xl py-2 px-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSaveCloudinary}
                      disabled={isSavingCloudinary}
                      className="px-3.5 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#082F49] text-xs font-black flex items-center gap-1 shadow transition-colors cursor-pointer"
                    >
                      {isSavingCloudinary ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      <span>{isAr ? 'تحديث إعدادات Cloudinary' : 'Update Cloudinary'}</span>
                    </button>
                  </div>
                </div>

                {/* Admin PIN Change */}
                <div className="p-4 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/30 space-y-2">
                  <label className="text-xs font-black text-[#FECDD3] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>{isAr ? 'تغيير رمز الأمان (Admin PIN)' : 'Change Admin Access PIN'}</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    className="w-full sm:w-48 bg-black/60 border border-white/30 rounded-xl py-2 px-3 text-center text-sm font-mono text-white"
                  />
                  <p className="text-[10px] text-white/60">
                    {isAr ? 'احفظ هذا الرمز جيداً حيث ستستخدمه لفتح لوحة التحكم.' : 'Store this PIN securely for admin access.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    requestConfirmation({
                      title: isAr ? 'استعادة إعدادات المتجر الأصلية' : 'Reset Store Settings',
                      message: isAr
                        ? 'هل تريد استعادة جميع الإعدادات وروابط التواصل الاجتماعي الافتراضية؟'
                        : 'Are you sure you want to reset all store settings and social links to default?',
                      confirmButtonText: isAr ? 'نعم، استعادة الإعدادات' : 'Reset Settings',
                      isDestructive: true,
                      onConfirm: () => {
                        resetStoreSettings();
                        setSettingsForm(storeSettings);
                      },
                    });
                  }}
                  className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                >
                  {isAr ? 'استعادة الإعدادات الافتراضية' : 'Reset to defaults'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateStoreSettings(settingsForm);
                  }}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ إعدادات المتجر' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: ORDERS LOG (سجل الطلبات والمبيعات) */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-black text-white">
                  {isAr ? 'سجل الطلبات الواردة' : 'Customer Orders Log'}
                </h3>
                <p className="text-xs text-white/70">
                  {isAr ? 'متابعة وتحديث حالة الشحنات والتواصل مع العملاء عبر واتساب' : 'Track orders, status changes & customer WhatsApp outreach'}
                </p>
              </div>

              <span className="bg-white/10 text-white font-mono text-xs px-3 py-1.5 rounded-xl border border-white/20">
                {isAr ? `إجمالي: ${orders.length} طلب` : `Total: ${orders.length} orders`}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#1C0206] border border-white/15 rounded-3xl p-12 text-center text-white/50 text-xs">
                {isAr ? 'لم يتم تسجيل أي طلبات حتى الآن.' : 'No orders recorded yet.'}
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="bg-[#1C0206] border border-white/15 rounded-3xl p-5 shadow-xl space-y-4 hover:border-white/40 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#FDE047]">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-white/60 font-mono">
                            {order.date}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            order.status === 'delivered' ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40' :
                            order.status === 'shipped' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40' :
                            order.status === 'processing' ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40' :
                            'bg-white/10 text-white border-white/20'
                          }`}>
                            {order.status === 'delivered' ? (isAr ? 'تم التسليم' : 'Delivered') :
                             order.status === 'shipped' ? (isAr ? 'تم الشحن' : 'Shipped') :
                             order.status === 'processing' ? (isAr ? 'قيد التجهيز' : 'Processing') :
                             (isAr ? 'طلب جديد' : 'Placed')}
                          </span>
                        </div>

                        {/* Customer WhatsApp Direct Contact */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${order.shippingAddress.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `مرحباً ${order.shippingAddress.fullName}، بخصوص طلبك رقم #${order.orderNumber} من روني ستور...`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-black flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'مراسلة العميل واتساب' : 'WhatsApp Customer'}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              requestConfirmation({
                                title: isAr ? 'حذف هذا الطلب' : 'Delete Order',
                                message: isAr
                                  ? `هل تريد حذف الطلب رقم #${order.orderNumber} للعميل "${order.shippingAddress.fullName}" من السجل؟`
                                  : `Delete order #${order.orderNumber} for "${order.shippingAddress.fullName}"?`,
                                confirmButtonText: isAr ? 'نعم، احذف الطلب' : 'Delete Order',
                                isDestructive: true,
                                onConfirm: () => deleteOrder(order.id),
                              });
                            }}
                            className="w-8 h-8 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626] text-[#FECDD3] hover:text-white flex items-center justify-center border border-[#DC2626]/30 transition-colors cursor-pointer"
                            title={isAr ? 'حذف الطلب' : 'Delete Order'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-black/40 p-3 rounded-2xl border border-white/10">
                          <span className="text-[10px] text-white/50 font-bold block">{isAr ? 'بيانات العميل:' : 'Customer Details:'}</span>
                          <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
                          <p className="font-mono text-white/80">{order.shippingAddress.phone}</p>
                          {order.shippingAddress.email && <p className="text-white/60">{order.shippingAddress.email}</p>}
                        </div>

                        <div className="space-y-1 bg-black/40 p-3 rounded-2xl border border-white/10">
                          <span className="text-[10px] text-white/50 font-bold block">{isAr ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
                          <p className="text-white">
                            {order.shippingAddress.governorate} - {order.shippingAddress.city} - {order.shippingAddress.street}
                          </p>
                          {order.shippingAddress.landmark && (
                            <p className="text-white/70 text-[11px]">{isAr ? 'علامة مميزة: ' : 'Landmark: '}{order.shippingAddress.landmark}</p>
                          )}
                          {order.notes && (
                            <p className="text-[#FECDD3] text-[11px] font-medium">{isAr ? 'ملاحظة: ' : 'Note: '}{order.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Ordered Items List */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-[10px] text-white/50 font-bold block">{isAr ? 'المنتجات المطلوبة:' : 'Ordered Items:'}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                              <span className="text-white font-medium line-clamp-1">
                                {isAr ? item.product.nameAr : item.product.nameEn} ({item.size})
                              </span>
                              <span className="font-mono font-bold text-white shrink-0">
                                {item.quantity} × {item.price} ج.م
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total & Status Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-white/70">{isAr ? 'الإجمالي الكلي:' : 'Total:'}</span>
                          <span className="text-base font-black text-white font-mono">{order.total.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                          <span className="text-[11px] text-white/50 font-medium">({order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'دفع إلكتروني'})</span>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/50">{isAr ? 'تغيير الحالة:' : 'Set Status:'}</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-black/50 border border-white/20 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                          >
                            <option value="placed">{isAr ? 'تم استلام الطلب' : 'Placed'}</option>
                            <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                            <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                            <option value="delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL 1: EDIT / ADD PRODUCT MODAL (نافذة تعديل وإضافة المنتج) */}
      {/* ================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#200206] border border-white/25 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-right rtl:text-right ltr:text-left my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="font-serif-luxury text-lg font-black text-white">
                {isAddingNewProduct ? (isAr ? 'إضافة منتج جديد للمتجر' : 'Add New Product') : (isAr ? 'تعديل بيانات المنتج' : 'Edit Product')}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Product ID & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'كود المنتج (ID)' : 'Product ID'}</label>
                  <input
                    type="text"
                    value={editingProduct.id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, id: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'القسم / التصنيف' : 'Category'}</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Names (Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'الاسم باللغة العربية' : 'Arabic Name'}</label>
                  <input
                    type="text"
                    value={editingProduct.nameAr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'الاسم بالإنجليزية' : 'English Name'}</label>
                  <input
                    type="text"
                    value={editingProduct.nameEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Subtitles & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'الوصف الفرعي (عربي)' : 'Arabic Subtitle'}</label>
                  <input
                    type="text"
                    value={editingProduct.subtitleAr || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subtitleAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'الوصف الفرعي (إنجليزي)' : 'English Subtitle'}</label>
                  <input
                    type="text"
                    value={editingProduct.subtitleEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subtitleEn: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'شارة المنتج (Tag)' : 'Product Tag'}</label>
                  <input
                    type="text"
                    value={editingProduct.tagAr || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Price, Original Price & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'سعر البيع الحالي (ج.م)' : 'Price (EGP)'}</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'السعر الأصلي قبل الخصم' : 'Original Price'}</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">{isAr ? 'التقييم (من 5)' : 'Rating (out of 5)'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.rating}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
                <span className="font-bold text-white">{isAr ? 'حالة توفر المنتج بالمخزون' : 'In Stock Status'}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded accent-[#22C55E]"
                  />
                  <span className={editingProduct.inStock ? 'text-[#22C55E] font-bold' : 'text-[#DC2626]'}>
                    {editingProduct.inStock ? (isAr ? 'متوفر للطلب الفوري' : 'In Stock') : (isAr ? 'نفذ من المخزون' : 'Out of Stock')}
                  </span>
                </label>
              </div>

              {/* Cloudinary Product Media Gallery */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/20 space-y-3">
                <CloudinaryGalleryUploader
                  images={editingProduct.images || []}
                  onChange={(newImages) => setEditingProduct({ ...editingProduct, images: newImages })}
                  language={language}
                  maxImages={6}
                />
              </div>

              {/* Sizes Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">{isAr ? 'المقاسات المتوفرة' : 'Available Sizes'}</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                    const isSelected = editingProduct.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const currentSizes = editingProduct.sizes || [];
                          const updated = isSelected
                            ? currentSizes.filter(s => s !== sz)
                            : [...currentSizes, sz];
                          setEditingProduct({ ...editingProduct, sizes: updated });
                        }}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-md'
                            : 'bg-white/5 border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {sz} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">{isAr ? 'نوع القماش والخامة (عربي)' : 'Fabric & Material'}</label>
                <input
                  type="text"
                  value={editingProduct.fabricAr || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabricAr: e.target.value })}
                  placeholder={isAr ? 'مثال: حرير ساتان ناعم مع دانتيل فرنسي' : 'e.g. Satin Silk with French Lace'}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Description Arabic */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">{isAr ? 'الوصف التفصيلي للمنتج (عربي)' : 'Arabic Description'}</label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionAr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAddingNewProduct) {
                    addProduct(editingProduct);
                  } else {
                    updateProduct(editingProduct);
                  }
                  setEditingProduct(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                {isAr ? 'حفظ المنتج وتثبيته ✓' : 'Save Product ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: EDIT / ADD BRANCH MODAL (نافذة تعديل وإضافة الفرع) */}
      {/* ================================================================= */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#200206] border border-white/25 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-right rtl:text-right ltr:text-left my-auto">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="font-serif-luxury text-lg font-black text-white">
                {isAddingNewBranch ? (isAr ? 'إضافة فرع جديد' : 'Add New Branch') : (isAr ? 'تعديل بيانات الفرع' : 'Edit Branch')}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'اسم الفرع (مثال: فرع بورسعيد حي الزهور)' : 'Branch Name'}</label>
                <input
                  type="text"
                  value={editingBranch.nameAr}
                  onChange={(e) => setEditingBranch({ ...editingBranch, nameAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'المدينة / المحافظة' : 'City'}</label>
                <input
                  type="text"
                  value={editingBranch.cityAr}
                  onChange={(e) => setEditingBranch({ ...editingBranch, cityAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'العنوان التفصيلي والمعالم المميزة' : 'Full Address & Landmarks'}</label>
                <textarea
                  rows={2}
                  value={editingBranch.addressAr}
                  onChange={(e) => setEditingBranch({ ...editingBranch, addressAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-white/80">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                  <input
                    type="text"
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white/80">{isAr ? 'رقم الواتساب' : 'WhatsApp'}</label>
                  <input
                    type="text"
                    value={editingBranch.whatsapp}
                    onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAddingNewBranch) {
                    addBranch(editingBranch);
                  } else {
                    updateBranch(editingBranch);
                  }
                  setEditingBranch(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase"
              >
                {isAr ? 'حفظ الفرع ✓' : 'Save Branch ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: EDIT / ADD CATEGORY MODAL (نافذة تعديل وإضافة القسم) */}
      {/* ================================================================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#200206] border border-white/25 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-right rtl:text-right ltr:text-left my-auto">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="font-serif-luxury text-lg font-black text-white">
                {isAddingNewCategory ? (isAr ? 'إضافة قسم جديد' : 'Add New Category') : (isAr ? 'تعديل القسم' : 'Edit Category')}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'اسم القسم بالعربية' : 'Category Name (AR)'}</label>
                <input
                  type="text"
                  value={editingCategory.nameAr}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'اسم القسم بالإنجليزية' : 'Category Name (EN)'}</label>
                <input
                  type="text"
                  value={editingCategory.nameEn}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <CloudinaryUploader
                  label={isAr ? 'صورة وبنر القسم (Cloudinary)' : 'Category Banner Image'}
                  value={editingCategory.image || ''}
                  onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                  language={language}
                  aspectRatio="landscape"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">{isAr ? 'الوصف' : 'Description'}</label>
                <textarea
                  rows={2}
                  value={editingCategory.descAr}
                  onChange={(e) => setEditingCategory({ ...editingCategory, descAr: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAddingNewCategory) {
                    addCategory(editingCategory);
                  } else {
                    updateCategory(editingCategory);
                  }
                  setEditingCategory(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#DC2626] text-[#4C0519] font-black text-xs uppercase"
              >
                {isAr ? 'حفظ القسم ✓' : 'Save Category ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GLOBAL IN-APP CONFIRMATION MODAL (حل آمن وفوري لعمليات الحذف والاستعادة) */}
      {/* ================================================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#240307] border border-[#DC2626]/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#DC2626] mx-auto flex items-center justify-center shadow-lg">
              <Trash2 className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-luxury text-xl font-black text-white">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-white/75 leading-relaxed font-medium">
                {confirmModal.message}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  action();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#B91C1C] text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 cursor-pointer"
              >
                {confirmModal.confirmButtonText || (isAr ? 'تأكيد الحذف' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
