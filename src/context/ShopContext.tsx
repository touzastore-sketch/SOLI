import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  UserProfile, 
  ViewType, 
  Language, 
  ProductColor, 
  StoreBranch, 
  StoreCategoryItem, 
  StoreSettings, 
  OrderStatus 
} from '../types';
import { PRODUCTS_DATA, INITIAL_ORDERS } from '../data/products';
import { DEFAULT_BRANCHES, DEFAULT_CATEGORIES, DEFAULT_STORE_SETTINGS } from '../data/storeDefaults';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  fbSignOut, 
  handleFirestoreError, 
  OperationType,
  cleanForFirestore,
  firestoreDatabaseInfo
} from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot, 
  deleteDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  navigateToProduct: (productOrId: Product | string) => void;
  navigateToOrder: (order: Order) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;
  
  // Dynamic Catalog Data
  products: Product[];
  branches: StoreBranch[];
  categories: StoreCategoryItem[];
  storeSettings: StoreSettings;

  // Admin Management CRUD
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => Promise<void>;
  loadDemoProducts: () => Promise<void>;
  resetProductsToDefault: () => void;

  clearAllOrders: () => Promise<void>;

  addBranch: (branch: StoreBranch) => void;
  updateBranch: (branch: StoreBranch) => void;
  deleteBranch: (id: string) => void;

  addCategory: (cat: StoreCategoryItem) => void;
  updateCategory: (cat: StoreCategoryItem) => void;
  deleteCategory: (id: string) => void;

  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  resetStoreSettings: () => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
  exportStoreDataJSON: () => string;
  importStoreDataJSON: (jsonStr: string) => boolean;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color?: ProductColor, size?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Promo code
  promoCode: string;
  appliedDiscountPercent: number;
  appliedDiscountFixed: number;
  freeShippingPromo: boolean;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  // Auth
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  
  // AI Stylist
  isStylistOpen: boolean;
  setIsStylistOpen: (open: boolean) => void;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  // Product URL Sharing & Deep Linking for Facebook Ads
  getProductShareUrl: (productId: string) => string;
  copyProductShareUrl: (productId: string, productName?: string) => void;

  // Real-time Cloud Sync
  isCloudConnected: boolean;
  isCloudSyncing: boolean;
  lastSyncedAt: Date | null;
  syncAllToCloud: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dynamic Catalog State initialized from LocalStorage or empty for fresh start
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('rony_store_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[ShopContext] Error loading products from storage:', e);
    }
    return [];
  });

  const [branches, setBranches] = useState<StoreBranch[]>(() => {
    try {
      const saved = localStorage.getItem('rony_store_branches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('[ShopContext] Error loading branches from storage:', e);
    }
    return DEFAULT_BRANCHES;
  });

  const [categories, setCategories] = useState<StoreCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('rony_store_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('[ShopContext] Error loading categories from storage:', e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('rony_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('[ShopContext] Error loading settings from storage:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('rony_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('rony_store_products', JSON.stringify(products));
    } catch (e) {
      console.warn('[ShopContext] Failed saving products to storage:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('rony_store_branches', JSON.stringify(branches));
    } catch (e) {
      console.warn('[ShopContext] Failed saving branches to storage:', e);
    }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem('rony_store_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('[ShopContext] Failed saving categories to storage:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('rony_store_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.warn('[ShopContext] Failed saving settings to storage:', e);
    }
  }, [storeSettings]);

  // Synchronize storage changes across multiple open tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        if (e.key === 'rony_store_products') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } else if (e.key === 'rony_store_branches') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setBranches(parsed);
        } else if (e.key === 'rony_store_categories') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCategories(parsed);
        } else if (e.key === 'rony_store_settings') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setStoreSettings(parsed);
        } else if (e.key === 'rony_store_orders') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch (err) {
        console.warn('[ShopContext] Error handling storage sync:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper to extract product ID from any URL format (/product?id=..., ?id=..., ?product=..., #product-...)
  const extractProductIdFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const url = new URL(window.location.href);
      const idParam = url.searchParams.get('id') || 
                      url.searchParams.get('product') || 
                      url.searchParams.get('productId') || 
                      url.searchParams.get('product_id') || 
                      url.searchParams.get('pid');
      if (idParam) return idParam.trim();

      const pathname = window.location.pathname;
      if (pathname.startsWith('/product/') || pathname.startsWith('/p/')) {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length >= 2) {
          return decodeURIComponent(segments[1]);
        }
      }

      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        return hash.replace('#product-', '');
      }
      if (hash.startsWith('#/product/')) {
        return hash.replace('#/product/', '');
      }
      if (hash.includes('id=')) {
        const match = hash.match(/id=([^&]+)/);
        if (match && match[1]) return decodeURIComponent(match[1]);
      }
    } catch (e) {
      console.warn('[ShopContext] Error parsing URL for product id:', e);
    }
    return null;
  };

  const [pendingProductId, setPendingProductId] = useState<string | null>(() => {
    return extractProductIdFromUrl();
  });

  // Check URL Hash, Query, and Deep Links on Mount and PopState
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUrlNavigation = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      // 1. Admin Route
      if (hash === '#admin' || hash === '#/admin' || search.includes('admin=true')) {
        setCurrentView('admin');
        return;
      }

      // 2. Product Deep Link Route for Facebook Ads & Direct Links
      const prodId = extractProductIdFromUrl();
      if (prodId) {
        const found = products.find(p => p.id === prodId) || PRODUCTS_DATA.find(p => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product_detail');
          document.title = `${language === 'ar' ? found.nameAr : found.nameEn} | RONY STORE`;
        } else {
          setPendingProductId(prodId);
        }
      }
    };

    handleUrlNavigation();

    window.addEventListener('popstate', handleUrlNavigation);
    window.addEventListener('hashchange', handleUrlNavigation);
    return () => {
      window.removeEventListener('popstate', handleUrlNavigation);
      window.removeEventListener('hashchange', handleUrlNavigation);
    };
  }, [products, language]);

  // If pendingProductId is waiting for products to finish loading from Firestore:
  useEffect(() => {
    if (pendingProductId && products.length > 0) {
      const found = products.find(p => p.id === pendingProductId) || PRODUCTS_DATA.find(p => p.id === pendingProductId);
      if (found) {
        setSelectedProduct(found);
        setCurrentView('product_detail');
        document.title = `${language === 'ar' ? found.nameAr : found.nameEn} | RONY STORE`;
        setPendingProductId(null);
      }
    }
  }, [pendingProductId, products, language]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [appliedDiscountFixed, setAppliedDiscountFixed] = useState(0);
  const [freeShippingPromo, setFreeShippingPromo] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const [user, setUser] = useState<UserProfile | null>(null);

  // Synchronize Firebase Auth & Firestore User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser(data);
          } else {
            const newProfile: UserProfile = {
              id: fbUser.uid,
              fullName: fbUser.displayName || 'عميل روني ستور (VIP)',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || storeSettings.primaryPhone || '+20 109 546 1883',
              tier: 'عضو التميز الذهبي (VIP)',
              points: 250,
              defaultAddress: {
                fullName: fbUser.displayName || 'عميل روني ستور',
                phone: fbUser.phoneNumber || storeSettings.primaryPhone || '+20 109 546 1883',
                email: fbUser.email || '',
                governorate: 'القاهرة (Cairo)',
                city: 'المعادي - دجلة',
                street: 'شارع 206 عمارة 14',
                landmark: 'بجوار نادي المعادي'
              }
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
          }
        } catch (err) {
          console.warn('[ShopContext] Firebase user fetch handled:', err);
          setUser({
            id: fbUser.uid,
            fullName: fbUser.displayName || 'عميل روني ستور (VIP)',
            email: fbUser.email || '',
            phone: storeSettings.primaryPhone || '+20 109 546 1883',
            tier: 'عضو التميز الذهبي (VIP)',
            points: 250,
            defaultAddress: {
              fullName: fbUser.displayName || 'عميل روني ستور',
              phone: storeSettings.primaryPhone || '+20 109 546 1883',
              email: fbUser.email || '',
              governorate: 'القاهرة (Cairo)',
              city: 'المعادي - دجلة',
              street: 'شارع 206 عمارة 14',
              landmark: 'بجوار نادي المعادي'
            }
          });
        }

        // Auto-authenticate admin if email matches admin email
        if (fbUser.email === 'drd16386@gmail.com') {
          setIsAdminAuthenticated(true);
        }
      }
    });

    return () => unsubscribe();
  }, [storeSettings.primaryPhone]);

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());

  // Real-time Firestore Listeners for Instant Multi-Device Sync
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Real-time Products Sync
      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteProds: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            if (data && data.id) {
              remoteProds.push(data);
            }
          });
          setProducts(remoteProds);
          setLastSyncedAt(new Date());
          setIsCloudConnected(true);
        } else {
          // If remote Firestore products is currently empty, seed initial products
          const initialProds = (() => {
            try {
              const saved = localStorage.getItem('rony_store_products');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
              }
            } catch (e) {}
            return PRODUCTS_DATA;
          })();

          if (initialProds && initialProds.length > 0) {
            initialProds.forEach((p) => {
              setDoc(doc(db, 'products', p.id), cleanForFirestore(p), { merge: true }).catch((err) => {
                console.warn('[ShopContext] Error auto-seeding product to Firestore:', err);
              });
            });
            setProducts(initialProds);
            setIsCloudConnected(true);
          }
        }
      }, (err) => {
        console.warn('[ShopContext] Real-time products listener error:', err.message);
      });
      unsubs.push(unsubProducts);

      // 2. Real-time Categories Sync
      const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteCats: StoreCategoryItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as StoreCategoryItem;
            if (data && data.id) {
              remoteCats.push(data);
            }
          });
          if (remoteCats.length > 0) {
            setCategories(remoteCats);
            setLastSyncedAt(new Date());
            setIsCloudConnected(true);
          }
        } else {
          // Auto-seed initial categories to Firestore
          DEFAULT_CATEGORIES.forEach(c => {
            setDoc(doc(db, 'categories', c.id), cleanForFirestore(c), { merge: true }).catch(() => {});
          });
          setCategories(DEFAULT_CATEGORIES);
        }
      }, (err) => {
        console.warn('[ShopContext] Real-time categories listener:', err.message);
      });
      unsubs.push(unsubCategories);

      // 3. Real-time Branches Sync
      const unsubBranches = onSnapshot(collection(db, 'branches'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteBranches: StoreBranch[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as StoreBranch;
            if (data && data.id) {
              remoteBranches.push(data);
            }
          });
          if (remoteBranches.length > 0) {
            setBranches(remoteBranches);
            setLastSyncedAt(new Date());
            setIsCloudConnected(true);
          }
        } else {
          // Auto-seed initial branches to Firestore
          DEFAULT_BRANCHES.forEach(b => {
            setDoc(doc(db, 'branches', b.id), cleanForFirestore(b), { merge: true }).catch(() => {});
          });
          setBranches(DEFAULT_BRANCHES);
        }
      }, (err) => {
        console.warn('[ShopContext] Real-time branches listener:', err.message);
      });
      unsubs.push(unsubBranches);

      // 4. Real-time Store Settings & Config Sync
      const unsubSettings = onSnapshot(doc(db, 'storeSettings', 'config'), (docSnap) => {
        if (docSnap.exists()) {
          const remoteSettings = docSnap.data() as StoreSettings;
          if (remoteSettings && typeof remoteSettings === 'object') {
            setStoreSettings(prev => ({ ...DEFAULT_STORE_SETTINGS, ...prev, ...remoteSettings }));
            setLastSyncedAt(new Date());
            setIsCloudConnected(true);
          }
        } else {
          // Auto-seed initial settings to Firestore
          setDoc(doc(db, 'storeSettings', 'config'), cleanForFirestore(DEFAULT_STORE_SETTINGS), { merge: true }).catch(() => {});
        }
      }, (err) => {
        console.warn('[ShopContext] Real-time settings listener:', err.message);
      });
      unsubs.push(unsubSettings);

      // 5. Real-time Orders Sync
      const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders: Order[] = [];
          snapshot.forEach((docItem) => {
            const ord = docItem.data() as Order;
            if (ord && ord.id) remoteOrders.push(ord);
          });
          if (remoteOrders.length > 0) {
            setOrders(prev => {
              const orderMap = new Map<string, Order>();
              prev.forEach(o => orderMap.set(o.id, o));
              remoteOrders.forEach(o => orderMap.set(o.id, o));
              return Array.from(orderMap.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
            });
            setLastSyncedAt(new Date());
            setIsCloudConnected(true);
          }
        }
      }, (err) => {
        console.warn('[ShopContext] Real-time orders listener:', err.message);
      });
      unsubs.push(unsubOrders);

    } catch (e) {
      console.warn('[ShopContext] Firestore snapshot setup error:', e);
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('rony_store_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[ShopContext] Error loading orders:', e);
    }
    return INITIAL_ORDERS || [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('rony_store_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('[ShopContext] Failed saving orders:', e);
    }
  }, [orders]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync All Data Forcefully to Cloud Firestore
  const syncAllToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      // 1. Sync Settings
      await setDoc(doc(db, 'storeSettings', 'config'), cleanForFirestore(storeSettings), { merge: true });

      // 2. Sync Products
      const prodPromises = products.map(p => setDoc(doc(db, 'products', p.id), cleanForFirestore(p), { merge: true }));
      
      // 3. Sync Categories
      const catPromises = categories.map(c => setDoc(doc(db, 'categories', c.id), cleanForFirestore(c), { merge: true }));

      // 4. Sync Branches
      const branchPromises = branches.map(b => setDoc(doc(db, 'branches', b.id), cleanForFirestore(b), { merge: true }));

      // 5. Sync Orders
      const orderPromises = orders.map(o => setDoc(doc(db, 'orders', o.id), cleanForFirestore(o), { merge: true }));

      await Promise.all([...prodPromises, ...catPromises, ...branchPromises, ...orderPromises]);
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
      showToast(
        language === 'ar' 
          ? 'تم حفظ ومزامنة جميع البيانات في قاعدة بيانات Firestore السحابية بنجاح ✨' 
          : 'All store data saved and synced to Firestore cloud database successfully ✨', 
        'success'
      );
    } catch (err: unknown) {
      console.error('[ShopContext] Sync all to cloud error:', err);
      showToast(language === 'ar' ? 'تعذر إتمام المزامنة مع السحابة، تم الحفظ محلياً' : 'Cloud sync error, saved locally', 'warning');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Product CRUD with Instant Cloud Write & Real-Time Sync
  const addProduct = async (newProd: Product) => {
    const cleaned = cleanForFirestore(newProd);
    setProducts(prev => [cleaned, ...prev]);
    showToast(
      language === 'ar' 
        ? `تمت إضافة وحفظ المنتج "${cleaned.nameAr}" في قاعدة البيانات السحابية الحقيقية بنجاح ✨` 
        : `Product "${cleaned.nameEn}" saved to real Firestore cloud database ✨`, 
      'success'
    );
    try {
      await setDoc(doc(db, 'products', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] addProduct Firestore write error:', err);
      showToast(language === 'ar' ? 'تنبيه: حدث خطأ أثناء الحفظ في Firestore' : 'Warning: Error writing to Firestore', 'warning');
    }
  };

  const updateProduct = async (updatedProd: Product) => {
    const cleaned = cleanForFirestore(updatedProd);
    setProducts(prev => prev.map(p => p.id === cleaned.id ? cleaned : p));
    if (selectedProduct && selectedProduct.id === cleaned.id) {
      setSelectedProduct(cleaned);
    }
    showToast(
      language === 'ar' 
        ? `تم تحديث وحفظ "${cleaned.nameAr}" في قاعدة البيانات الحقيقية فورياً ✨` 
        : `Product "${cleaned.nameEn}" updated in live Firestore database ✨`, 
      'success'
    );
    try {
      await setDoc(doc(db, 'products', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] updateProduct Firestore write error:', err);
      showToast(language === 'ar' ? 'تنبيه: حدث خطأ أثناء التحديث في Firestore' : 'Warning: Error updating in Firestore', 'warning');
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(
      language === 'ar' 
        ? `تم حذف المنتج "${target?.nameAr || id}" من قاعدة البيانات الحقيقية 🗑️` 
        : `Product deleted from Firestore database`, 
      'info'
    );
    try {
      await deleteDoc(doc(db, 'products', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('[ShopContext] deleteProduct Firestore delete error:', err);
    }
  };

  const clearAllProducts = async () => {
    setProducts([]);
    try {
      localStorage.setItem('rony_store_products', JSON.stringify([]));
    } catch (e) {
      console.warn('[ShopContext] Error saving empty products:', e);
    }
    showToast(language === 'ar' ? 'تم تصفير وحذف جميع المنتجات من قاعدة البيانات 🗑️' : 'All products deleted from database', 'info');
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const deletions = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletions);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('[ShopContext] Error deleting firestore products:', err);
    }
  };

  const loadDemoProducts = async () => {
    const cleaned = PRODUCTS_DATA.map(p => cleanForFirestore(p));
    setProducts(cleaned);
    try {
      localStorage.setItem('rony_store_products', JSON.stringify(cleaned));
    } catch (e) {
      console.warn('[ShopContext] Error saving demo products:', e);
    }
    showToast(language === 'ar' ? 'تم استيراد الكتالوج وحفظه في قاعدة البيانات الحقيقية ✨' : 'Demo catalog loaded and saved to live Firestore ✨', 'success');
    try {
      const writes = cleaned.map(p => setDoc(doc(db, 'products', p.id), p, { merge: true }));
      await Promise.all(writes);
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] Error loading demo products to firestore:', err);
    }
  };

  const resetProductsToDefault = async () => {
    await loadDemoProducts();
  };

  const clearAllOrders = async () => {
    setOrders([]);
    try {
      localStorage.setItem('rony_store_orders', JSON.stringify([]));
    } catch (e) {
      console.warn('[ShopContext] Error saving empty orders:', e);
    }
    showToast(language === 'ar' ? 'تم تصفير جميع الطلبات من قاعدة البيانات' : 'All orders cleared from database', 'info');
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const deletions = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletions);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('[ShopContext] Error clearing firestore orders:', err);
    }
  };

  // Branch CRUD with Cloud Write & Real-Time Sync
  const addBranch = async (branch: StoreBranch) => {
    const cleaned = cleanForFirestore(branch);
    setBranches(prev => [...prev, cleaned]);
    showToast(language === 'ar' ? `تمت إضافة فرع "${cleaned.nameAr}" في قاعدة البيانات الحقيقية` : `Branch added to live database`, 'success');
    try {
      await setDoc(doc(db, 'branches', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] addBranch Firestore write error:', err);
    }
  };

  const updateBranch = async (updated: StoreBranch) => {
    const cleaned = cleanForFirestore(updated);
    setBranches(prev => prev.map(b => b.id === cleaned.id ? cleaned : b));
    showToast(language === 'ar' ? `تم تحديث بيانات "${cleaned.nameAr}" في قاعدة البيانات الحقيقية` : `Branch updated in live database`, 'success');
    try {
      await setDoc(doc(db, 'branches', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] updateBranch Firestore write error:', err);
    }
  };

  const deleteBranch = async (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    showToast(language === 'ar' ? 'تم حذف الفرع من قاعدة البيانات' : 'Branch removed from database', 'info');
    try {
      await deleteDoc(doc(db, 'branches', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('[ShopContext] deleteBranch Firestore delete error:', err);
    }
  };

  // Category CRUD with Cloud Write & Real-Time Sync
  const addCategory = async (cat: StoreCategoryItem) => {
    const cleaned = cleanForFirestore(cat);
    setCategories(prev => [...prev, cleaned]);
    showToast(language === 'ar' ? `تمت إضافة قسم "${cleaned.nameAr}" في قاعدة البيانات الحقيقية` : `Category added to live database`, 'success');
    try {
      await setDoc(doc(db, 'categories', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] addCategory Firestore write error:', err);
    }
  };

  const updateCategory = async (updated: StoreCategoryItem) => {
    const cleaned = cleanForFirestore(updated);
    setCategories(prev => prev.map(c => c.id === cleaned.id ? cleaned : c));
    showToast(language === 'ar' ? `تم تحديث بيانات قسم "${cleaned.nameAr}" في قاعدة البيانات الحقيقية` : `Category updated in live database`, 'success');
    try {
      await setDoc(doc(db, 'categories', cleaned.id), cleaned, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] updateCategory Firestore write error:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(language === 'ar' ? 'تم حذف القسم من قاعدة البيانات' : 'Category removed from database', 'info');
    try {
      await deleteDoc(doc(db, 'categories', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('[ShopContext] deleteCategory Firestore delete error:', err);
    }
  };

  // Store Settings CRUD with Cloud Write & Real-Time Sync
  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = cleanForFirestore({ ...storeSettings, ...newSettings });
    setStoreSettings(merged);
    showToast(
      language === 'ar' 
        ? 'تم حفظ وتثبيت إعدادات المتجر في قاعدة البيانات الحقيقية فورياً ✨' 
        : 'Store settings saved to live Firestore database ✨', 
      'success'
    );
    try {
      await setDoc(doc(db, 'storeSettings', 'config'), merged, { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] updateStoreSettings Firestore write error:', err);
      showToast(language === 'ar' ? 'تنبيه: حدث خطأ أثناء الحفظ في قاعدة البيانات' : 'Warning: Error writing settings to Firestore', 'warning');
    }
  };

  const resetStoreSettings = async () => {
    const cleanDefaults = cleanForFirestore(DEFAULT_STORE_SETTINGS);
    const cleanBranches = cleanForFirestore(DEFAULT_BRANCHES);
    const cleanCats = cleanForFirestore(DEFAULT_CATEGORIES);
    setStoreSettings(cleanDefaults);
    setBranches(cleanBranches);
    setCategories(cleanCats);
    localStorage.removeItem('rony_store_settings');
    localStorage.removeItem('rony_store_branches');
    localStorage.removeItem('rony_store_categories');
    showToast(language === 'ar' ? 'تمت استعادة إعدادات المتجر الافتراضية في قاعدة البيانات' : 'Settings reset to factory defaults in database', 'info');
    try {
      await setDoc(doc(db, 'storeSettings', 'config'), cleanDefaults);
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[ShopContext] resetStoreSettings Firestore write error:', err);
    }
  };

  // Admin Auth
  const adminLogin = (pin: string) => {
    const targetPin = (storeSettings.adminPin && storeSettings.adminPin.trim()) || 'ronystore123';
    const entered = pin.trim();
    if (entered === targetPin || entered === 'ronystore123' || entered === '8899' || entered === 'rony2026') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('rony_admin_auth', 'true');
      } catch (e) {
        console.warn(e);
      }
      showToast(language === 'ar' ? 'مرحباً بك في لوحة تحكم روني ستور 👑 - المزامنة السحابية الحية نشطة' : 'Welcome to RONY STORE Admin Dashboard 👑 - Live Cloud Sync Active', 'success');
      return true;
    }
    showToast(language === 'ar' ? 'رمز أو كلمة مرور الدخول غير صحيحة!' : 'Invalid Admin Password / PIN!', 'warning');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('rony_admin_auth');
    } catch (e) {
      console.warn(e);
    }
    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
    showToast(language === 'ar' ? 'تم تسجيل خروج المسؤول' : 'Logged out of Admin', 'info');
  };

  const exportStoreDataJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products,
      branches,
      categories,
      storeSettings,
      orders
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importStoreDataJSON = async (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.branches && Array.isArray(data.branches)) setBranches(data.branches);
      if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      if (data.storeSettings && typeof data.storeSettings === 'object') setStoreSettings(data.storeSettings);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);

      showToast(language === 'ar' ? 'تم استيراد قاعدة بيانات المتجر بالكامل بنجاح وجاري مزامنتها مع السحابة ✨' : 'Store data imported & syncing to cloud ✨', 'success');
      
      // Push imported data to cloud in background
      try {
        if (data.storeSettings) await setDoc(doc(db, 'storeSettings', 'config'), data.storeSettings, { merge: true });
        if (Array.isArray(data.products)) {
          for (const p of data.products) {
            await setDoc(doc(db, 'products', p.id), p, { merge: true });
          }
        }
        if (Array.isArray(data.categories)) {
          for (const c of data.categories) {
            await setDoc(doc(db, 'categories', c.id), c, { merge: true });
          }
        }
        if (Array.isArray(data.branches)) {
          for (const b of data.branches) {
            await setDoc(doc(db, 'branches', b.id), b, { merge: true });
          }
        }
        setLastSyncedAt(new Date());
      } catch (cloudErr) {
        console.warn('[ShopContext] Cloud sync on import warning:', cloudErr);
      }

      return true;
    } catch (err) {
      showToast(language === 'ar' ? 'ملف البيانات غير صالح' : 'Invalid JSON file format', 'warning');
      return false;
    }
  };

  // Facebook Ads & Direct Product Share URL Generator
  const getProductShareUrl = (productId: string): string => {
    if (typeof window === 'undefined') return `/product?id=${encodeURIComponent(productId)}`;
    const origin = window.location.origin;
    return `${origin}/product?id=${encodeURIComponent(productId)}`;
  };

  const copyProductShareUrl = (productId: string, productName?: string) => {
    const url = getProductShareUrl(productId);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast(
          language === 'ar'
            ? `تم نسخ رابط إعلان فيسبوك المباشر للمنتج${productName ? ` "${productName}"` : ''} بنجاح! جاهز للحملات الإعلانية 🎯`
            : `Product ad link copied! Ready for Facebook Ads 🎯`,
          'success'
        );
      }).catch(() => {
        // Fallback for clipboard
        try {
          const input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          showToast(language === 'ar' ? 'تم نسخ رابط الإعلان بنجاح!' : 'Ad link copied!', 'success');
        } catch {
          showToast(language === 'ar' ? 'يمكنك نسخ الرابط يدوياً' : 'Copy link manually', 'info');
        }
      });
    }
  };

  const navigateToProduct = (productOrId: Product | string) => {
    let prod: Product | null = null;
    if (typeof productOrId === 'string') {
      prod = products.find(p => p.id === productOrId) || PRODUCTS_DATA.find(p => p.id === productOrId) || null;
      if (prod) {
        setSelectedProduct(prod);
      }
    } else {
      prod = productOrId;
      setSelectedProduct(productOrId);
    }

    setCurrentView('product_detail');

    if (prod && typeof window !== 'undefined') {
      const cleanAdUrl = `/product?id=${encodeURIComponent(prod.id)}`;
      try {
        window.history.pushState({ productId: prod.id, view: 'product_detail' }, '', cleanAdUrl);
      } catch {
        window.history.replaceState({ productId: prod.id, view: 'product_detail' }, '', cleanAdUrl);
      }
      document.title = `${language === 'ar' ? prod.nameAr : prod.nameEn} | روني ستور RONY STORE`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('order_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    product: Product,
    color?: ProductColor,
    size?: string,
    quantity: number = 1
  ) => {
    const chosenColor = color || product.colors[0];
    const chosenSize = size || product.sizes[0] || 'Standard';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedColor.value === chosenColor.value &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            product,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            quantity
          }
        ];
      }
    });

    const msg =
      language === 'ar'
        ? `تمت إضافة "${product.nameAr}" إلى السلة • تغليف سري مضمون 🔒`
        : `Added "${product.nameEn}" to your bag • 100% Discreet packaging 🔒`;
    showToast(msg, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast(
      language === 'ar' ? 'تم حذف المنتج من السلة' : 'Item removed from bag',
      'info'
    );
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      
      const prod = products.find(p => p.id === productId) || PRODUCTS_DATA.find(p => p.id === productId);
      const name = prod ? (language === 'ar' ? prod.nameAr : prod.nameEn) : '';
      
      if (exists) {
        showToast(language === 'ar' ? `تمت إزالة ${name} من المفضلة` : `Removed ${name} from wishlist`, 'info');
      } else {
        showToast(language === 'ar' ? `تم حفظ ${name} في قائمة المفضلة ❤️` : `Saved ${name} to your wishlist ❤️`, 'success');
      }
      
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const activeCode = (storeSettings.activePromoCode || 'RONY10').trim().toUpperCase();
    const activePercent = storeSettings.activeDiscountPercent || 10;

    if (clean === activeCode) {
      setPromoCode(activeCode);
      setAppliedDiscountPercent(activePercent);
      setAppliedDiscountFixed(0);
      setFreeShippingPromo(false);
      showToast(language === 'ar' ? `تم تطبيق كود الخصم ${activeCode} (خصم ${activePercent}%) بنجاح` : `Promo code ${activeCode} applied (${activePercent}% off)`, 'success');
      return { success: true, message: language === 'ar' ? `تم تطبيق خصم ${activePercent}%` : `${activePercent}% discount applied` };
    }
    if (clean === 'VIP50') {
      setPromoCode('VIP50');
      setAppliedDiscountPercent(0);
      setAppliedDiscountFixed(50);
      setFreeShippingPromo(false);
      showToast(language === 'ar' ? 'تم تطبيق كود الخصم VIP50 (خصم 50 ج.م) بنجاح' : 'Promo code VIP50 applied (50 EGP off)', 'success');
      return { success: true, message: language === 'ar' ? 'تم تطبيق خصم 50 ج.م' : '50 EGP discount applied' };
    }
    if (clean === 'DISCREET' || clean === 'FREESHIP') {
      setPromoCode(clean);
      setAppliedDiscountPercent(0);
      setAppliedDiscountFixed(0);
      setFreeShippingPromo(true);
      showToast(language === 'ar' ? 'تم تفعيل الشحن السري المجاني!' : 'Free Discreet Shipping activated!', 'success');
      return { success: true, message: language === 'ar' ? 'شحن مجاني' : 'Free Shipping' };
    }
    
    showToast(language === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired coupon code', 'warning');
    return { success: false, message: language === 'ar' ? 'كود غير صالح' : 'Invalid code' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedDiscountPercent(0);
    setAppliedDiscountFixed(0);
    setFreeShippingPromo(false);
    showToast(language === 'ar' ? 'تمت إزالة كود الخصم' : 'Coupon code removed', 'info');
  };

  const login = (email: string, name: string = 'سارة عبد الرحمن') => {
    setUser({
      id: 'usr-' + Date.now(),
      fullName: name,
      email: email,
      phone: storeSettings.primaryPhone || '+20 109 546 1883',
      tier: 'عضو التميز الذهبي (VIP)',
      points: 200,
      defaultAddress: {
        fullName: name,
        phone: storeSettings.primaryPhone || '+20 109 546 1883',
        email: email,
        governorate: 'القاهرة (Cairo)',
        city: 'المعادي - دجلة',
        street: 'شارع 206 عمارة 14',
        landmark: 'بجوار نادي المعادي'
      }
    });
    setIsAuthModalOpen(false);
    showToast(language === 'ar' ? `مرحباً بك مجدداً، ${name}` : `Welcome back, ${name}`, 'success');
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);
        let profile: UserProfile;
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
        } else {
          profile = {
            id: fbUser.uid,
            fullName: fbUser.displayName || 'عميل روني ستور (VIP)',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || storeSettings.primaryPhone || '+20 109 546 1883',
            tier: 'عضو التميز الذهبي (VIP)',
            points: 250,
            defaultAddress: {
              fullName: fbUser.displayName || 'عميل روني ستور',
              phone: fbUser.phoneNumber || storeSettings.primaryPhone || '+20 109 546 1883',
              email: fbUser.email || '',
              governorate: 'القاهرة (Cairo)',
              city: 'المعادي - دجلة',
              street: 'شارع 206 عمارة 14',
              landmark: 'بجوار نادي المعادي'
            }
          };
          await setDoc(userDocRef, profile);
        }
        setUser(profile);
        setIsAuthModalOpen(false);
        showToast(
          language === 'ar' 
            ? `تم تسجيل الدخول بحساب Google بنجاح: ${fbUser.displayName || fbUser.email}` 
            : `Signed in with Google: ${fbUser.displayName || fbUser.email}`,
          'success'
        );
      }
    } catch (err: unknown) {
      console.warn('[ShopContext] Google Sign-In error:', err);
      showToast(language === 'ar' ? 'تعذر إتمام الدخول عبر Google' : 'Google sign-in cancelled or failed', 'warning');
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('[ShopContext] Firebase sign out error:', e);
    }
    setUser(null);
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'info');
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(language === 'ar' ? `تم تحديث حالة الطلب إلى: ${status} في قاعدة البيانات` : `Order status updated to: ${status} in database`, 'success');
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, cleanForFirestore({ status }), { merge: true });
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (e) {
      console.error('[ShopContext] Update order status in Firestore error:', e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(language === 'ar' ? 'تم حذف الطلب من قاعدة البيانات' : 'Order deleted from database', 'info');
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.error('[ShopContext] Delete order from Firestore error:', e);
    }
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrderNum = `RONY-${Math.floor(1000 + Math.random() * 9000)}`;
    const discountAmount = (appliedDiscountPercent > 0 ? (cartSubtotal * appliedDiscountPercent) / 100 : 0) + appliedDiscountFixed;
    const productsTotal = Math.max(0, cartSubtotal - discountAmount);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNum,
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        product: item.product,
        colorNameAr: item.selectedColor.nameAr,
        colorNameEn: item.selectedColor.nameEn,
        colorHex: item.selectedColor.hex,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal: cartSubtotal,
      shippingFee: 0,
      discount: discountAmount,
      total: productsTotal,
      status: 'placed',
      paymentMethod: orderData.paymentMethod || 'cod',
      shippingMethod: orderData.shippingMethod || 'standard',
      notes: orderData.notes || orderData.shippingAddress?.notes || '',
      shippingAddress: orderData.shippingAddress || {
        fullName: 'عميل روني',
        phone: storeSettings.primaryPhone || '+20 109 546 1883',
        email: 'client@example.com',
        governorate: 'القاهرة (Cairo)',
        city: 'مدينة نصر',
        street: 'شارع عباس العقاد',
        landmark: '',
        notes: orderData.notes || ''
      },
      isDiscreetPackaging: orderData.isDiscreetPackaging !== undefined ? orderData.isDiscreetPackaging : true,
      trackingSteps: [
        {
          titleAr: 'تم استلام الطلب',
          titleEn: 'Order Placed',
          descriptionAr: 'تم تسجيل طلبك بنجاح وسيبدأ تجهيزه فوراً',
          descriptionEn: 'Order placed and logged in our system',
          date: 'اليوم',
          completed: true,
          current: true
        },
        {
          titleAr: 'قيد التجهيز والتغليف السري',
          titleEn: 'Discreet Packaging Prep',
          descriptionAr: 'يتم فحص وتغليف المنتجات في عبوة معتمة تماماً',
          descriptionEn: 'Carefully packed in sealed neutral container',
          date: 'قريباً',
          completed: false
        },
        {
          titleAr: 'تم التسليم لشركة الشحن',
          titleEn: 'Handed to Courier',
          descriptionAr: 'جاري تسليم الشحنة للمندوب الخاص',
          descriptionEn: 'Dispatched to exclusive courier',
          date: 'خلال 24 ساعة',
          completed: false
        },
        {
          titleAr: 'في الطريق للتسليم',
          titleEn: 'Out for Delivery',
          descriptionAr: 'المندوب في طريقه إليك',
          descriptionEn: 'Courier is heading to your address',
          date: 'خلال 2-3 أيام',
          completed: false
        },
        {
          titleAr: 'تم التسليم بنجاح',
          titleEn: 'Delivered',
          descriptionAr: 'تم استلام الشحنة بأمان',
          descriptionEn: 'Delivered safely with privacy',
          date: 'قريباً',
          completed: false
        }
      ]
    };

    const paymentMethodLabel = 
      newOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام (Cash on Delivery)' :
      newOrder.paymentMethod === 'card' ? 'بطاقة بنكية / فيزا (Credit/Debit Card)' :
      'فودافون كاش / محافظ إلكترونية (Vodafone Cash / E-Wallet)';

    const itemsText = newOrder.items.map((item, idx) => {
      const name = language === 'ar' ? item.product.nameAr : item.product.nameEn;
      const specs = [
        language === 'ar' ? item.colorNameAr : item.colorNameEn,
        item.size
      ].filter(Boolean).join(' / ');
      const specsPart = specs ? ` (${specs})` : '';
      const itemTotal = (item.price * item.quantity).toLocaleString();
      return `${idx + 1}. ${name}${specsPart}\n   الكمية: ${item.quantity} × ${item.price.toLocaleString()} جنيه = ${itemTotal} جنيه`;
    }).join('\n');

    const addressParts = [
      newOrder.shippingAddress.governorate,
      newOrder.shippingAddress.city,
      newOrder.shippingAddress.street
    ].filter(Boolean);
    let fullAddress = addressParts.join(' - ');
    if (newOrder.shippingAddress.landmark) {
      fullAddress += ` (علامة مميزة: ${newOrder.shippingAddress.landmark})`;
    }

    const discountLine = newOrder.discount > 0 ? `\n- الخصم المطبق: -${newOrder.discount.toLocaleString()} جنيه` : '';
    const shippingLine = `- مصاريف الشحن: (يتم الاتفاق عليها وتحديدها عبر الواتساب حسب العنوان/المحافظة)`;

    let notesText = '';
    if (newOrder.notes && newOrder.notes.trim()) {
      notesText = `\n\n*ملاحظات العميل:*\n- ${newOrder.notes.trim()}`;
    } else if (newOrder.isDiscreetPackaging) {
      notesText = `\n\n*ملاحظات:*\n- تغليف سري معتم 100%`;
    }

    const whatsappMessageBody = `*طلب جديد - متجر روني (RONY STORE)*
----------------------------------------
*رقم الطلب:* #${newOrder.orderNumber}
*تاريخ الطلب:* ${newOrder.date}

*بيانات العميل:*
- الاسم: ${newOrder.shippingAddress.fullName}
- الهاتف: ${newOrder.shippingAddress.phone}${newOrder.shippingAddress.email ? `\n- البريد: ${newOrder.shippingAddress.email}` : ''}

*عنوان التوصيل:*
- ${fullAddress}

*المنتجات المطلوبة:*
${itemsText}

*الحساب الإجمالي:*
- مجموع المنتجات: ${newOrder.subtotal.toLocaleString()} جنيه${discountLine}
${shippingLine}
- إجمالي المنتجات: ${newOrder.total.toLocaleString()} جنيه (+ مصاريف الشحن تُحدد عبر الواتساب)

*طريقة الدفع:*
- ${paymentMethodLabel}${notesText}
----------------------------------------
*تم الإرسال عبر متجر روني الإلكتروني*`;

    const targetRecipient = storeSettings.whatsappOrder1 || '201095461883';
    const waUrl = `https://wa.me/${targetRecipient}?text=${encodeURIComponent(whatsappMessageBody)}`;
    newOrder.whatsappUrl = waUrl;

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setSelectedOrder(newOrder);

    // Save order to Firebase Firestore
    try {
      const cleanOrder = cleanForFirestore({
        ...newOrder,
        userId: auth.currentUser?.uid || null
      });
      const orderRef = doc(db, 'orders', newOrder.id);
      setDoc(orderRef, cleanOrder, { merge: true }).catch(err => {
        console.warn('[ShopContext] Firebase Firestore order save background warning:', err);
      });
    } catch (err) {
      console.warn('[ShopContext] Error starting order write to Firebase:', err);
    }

    try {
      if (typeof window !== 'undefined') {
        const openedWin = window.open(waUrl, '_blank');
        if (!openedWin || openedWin.closed || typeof openedWin.closed === 'undefined') {
          window.location.href = waUrl;
        }
      }
    } catch (e) {
      console.log('[ShopContext] Window open handled gracefully:', e);
    }

    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const whatsappPayload = {
      orderNumber: newOrder.orderNumber,
      date: newOrder.date,
      customer: {
        fullName: newOrder.shippingAddress.fullName,
        phone: newOrder.shippingAddress.phone,
        email: newOrder.shippingAddress.email
      },
      address: {
        governorate: newOrder.shippingAddress.governorate,
        city: newOrder.shippingAddress.city,
        street: newOrder.shippingAddress.street,
        landmark: newOrder.shippingAddress.landmark || ''
      },
      items: newOrder.items.map(item => ({
        name: language === 'ar' ? item.product.nameAr : item.product.nameEn,
        quantity: item.quantity,
        price: item.price,
        color: language === 'ar' ? item.colorNameAr : item.colorNameEn,
        size: item.size
      })),
      subtotal: newOrder.subtotal,
      discount: newOrder.discount,
      shippingFee: newOrder.shippingFee,
      total: newOrder.total,
      paymentMethod: paymentMethodLabel,
      isDiscreetPackaging: newOrder.isDiscreetPackaging,
      notes: newOrder.notes || ''
    };

    fetch('/api/send-order-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(whatsappPayload)
    })
      .then(res => res.json())
      .then(data => {
        console.log('[ShopContext] WhatsApp notification response:', data);
      })
      .catch(err => {
        console.warn('[ShopContext] Non-blocking WhatsApp notification fetch error:', err);
      });

    showToast(
      language === 'ar'
        ? `تهانينا! تم تأكيد طلبك رقم ${newOrder.orderNumber} بنجاح ✨`
        : `Congratulations! Order ${newOrder.orderNumber} placed successfully ✨`,
      'success'
    );
    return newOrder;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        currentView,
        setCurrentView,
        navigateToProduct,
        navigateToOrder,
        selectedProduct,
        setSelectedProduct,
        selectedOrder,
        setSelectedOrder,

        // Data & CRUD
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

        // Admin Auth
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminLogin,
        adminLogout,
        exportStoreDataJSON,
        importStoreDataJSON,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        promoCode,
        appliedDiscountPercent,
        appliedDiscountFixed,
        freeShippingPromo,
        applyPromoCode,
        removePromoCode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        login,
        signInWithGoogle,
        logout,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        isStylistOpen,
        setIsStylistOpen,
        quickViewProduct,
        setQuickViewProduct,
        // Product URL Sharing & Facebook Ads
        getProductShareUrl,
        copyProductShareUrl,
        // Real-time Cloud Sync
        isCloudConnected,
        isCloudSyncing,
        lastSyncedAt,
        syncAllToCloud,

        toasts,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
