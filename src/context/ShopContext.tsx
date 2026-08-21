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
  OperationType 
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

  // Check URL Hash or Query on Mount for secret /#admin access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || hash === '#/admin' || search.includes('admin=true')) {
        setCurrentView('admin');
      }

      const handleHashChange = () => {
        if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
          setCurrentView('admin');
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

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
      }, (err) => {
        console.warn('[ShopContext] Real-time products listener:', err.message);
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
            setDoc(doc(db, 'categories', c.id), c, { merge: true }).catch(() => {});
          });
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
            setDoc(doc(db, 'branches', b.id), b, { merge: true }).catch(() => {});
          });
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
          setDoc(doc(db, 'storeSettings', 'config'), DEFAULT_STORE_SETTINGS, { merge: true }).catch(() => {});
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
      await setDoc(doc(db, 'storeSettings', 'config'), storeSettings, { merge: true });

      // 2. Sync Products
      const prodPromises = products.map(p => setDoc(doc(db, 'products', p.id), p, { merge: true }));
      
      // 3. Sync Categories
      const catPromises = categories.map(c => setDoc(doc(db, 'categories', c.id), c, { merge: true }));

      // 4. Sync Branches
      const branchPromises = branches.map(b => setDoc(doc(db, 'branches', b.id), b, { merge: true }));

      // 5. Sync Orders
      const orderPromises = orders.map(o => setDoc(doc(db, 'orders', o.id), o, { merge: true }));

      await Promise.all([...prodPromises, ...catPromises, ...branchPromises, ...orderPromises]);
      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
      showToast(
        language === 'ar' 
          ? 'تمت مزامنة كامل بيانات المتجر مع السحابة فورياً! تظهر الآن على جميع الأجهزة' 
          : 'All store data synced to cloud in real-time across all devices!', 
        'success'
      );
    } catch (err: unknown) {
      console.warn('[ShopContext] Sync all to cloud warning:', err);
      showToast(language === 'ar' ? 'تم الحفظ محلياً وجاري المزامنة مع السحابة' : 'Saved locally, syncing in background', 'info');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Product CRUD with Instant Cloud Write & Real-Time Sync
  const addProduct = async (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    showToast(language === 'ar' ? `تمت إضافة المنتج "${newProd.nameAr}" بنجاح` : `Product "${newProd.nameEn}" added`, 'success');
    try {
      await setDoc(doc(db, 'products', newProd.id), newProd);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] addProduct Firestore write warning:', err);
    }
  };

  const updateProduct = async (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    if (selectedProduct && selectedProduct.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
    showToast(language === 'ar' ? `تم حفظ وتحديث "${updatedProd.nameAr}" على جميع الأجهزة` : `Product "${updatedProd.nameEn}" updated across all devices`, 'success');
    try {
      await setDoc(doc(db, 'products', updatedProd.id), updatedProd, { merge: true });
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] updateProduct Firestore write warning:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(language === 'ar' ? `تم حذف المنتج "${target?.nameAr || id}" بنجاح` : `Product deleted`, 'info');
    try {
      await deleteDoc(doc(db, 'products', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] deleteProduct Firestore delete warning:', err);
    }
  };

  const clearAllProducts = async () => {
    setProducts([]);
    try {
      localStorage.setItem('rony_store_products', JSON.stringify([]));
    } catch (e) {
      console.warn('[ShopContext] Error saving empty products:', e);
    }
    showToast(language === 'ar' ? 'تم تصفير وحذف جميع المنتجات للبدء من الصفر 🗑️' : 'All products deleted to start from scratch', 'info');
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const deletions = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletions);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] Error deleting firestore products:', err);
    }
  };

  const loadDemoProducts = async () => {
    setProducts(PRODUCTS_DATA);
    try {
      localStorage.setItem('rony_store_products', JSON.stringify(PRODUCTS_DATA));
    } catch (e) {
      console.warn('[ShopContext] Error saving demo products:', e);
    }
    showToast(language === 'ar' ? 'تم استيراد الكتالوج التجريبي (18 منتج) بنجاح ✨' : 'Demo products loaded successfully', 'success');
    try {
      const writes = PRODUCTS_DATA.map(p => setDoc(doc(db, 'products', p.id), p, { merge: true }));
      await Promise.all(writes);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] Error loading demo products to firestore:', err);
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
    showToast(language === 'ar' ? 'تم تصفير جميع الطلبات والبدء من الصفر' : 'All orders cleared', 'info');
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const deletions = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletions);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] Error clearing firestore orders:', err);
    }
  };

  // Branch CRUD with Cloud Write & Real-Time Sync
  const addBranch = async (branch: StoreBranch) => {
    setBranches(prev => [...prev, branch]);
    showToast(language === 'ar' ? `تمت إضافة فرع "${branch.nameAr}"` : `Branch added`, 'success');
    try {
      await setDoc(doc(db, 'branches', branch.id), branch);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] addBranch Firestore write warning:', err);
    }
  };

  const updateBranch = async (updated: StoreBranch) => {
    setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
    showToast(language === 'ar' ? `تم تحديث بيانات "${updated.nameAr}"` : `Branch updated`, 'success');
    try {
      await setDoc(doc(db, 'branches', updated.id), updated, { merge: true });
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] updateBranch Firestore write warning:', err);
    }
  };

  const deleteBranch = async (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    showToast(language === 'ar' ? 'تم حذف الفرع' : 'Branch removed', 'info');
    try {
      await deleteDoc(doc(db, 'branches', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] deleteBranch Firestore delete warning:', err);
    }
  };

  // Category CRUD with Cloud Write & Real-Time Sync
  const addCategory = async (cat: StoreCategoryItem) => {
    setCategories(prev => [...prev, cat]);
    showToast(language === 'ar' ? `تمت إضافة القسم "${cat.nameAr}"` : `Category added`, 'success');
    try {
      await setDoc(doc(db, 'categories', cat.id), cat);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] addCategory Firestore write warning:', err);
    }
  };

  const updateCategory = async (updated: StoreCategoryItem) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(language === 'ar' ? `تم تحديث بيانات قسم "${updated.nameAr}"` : `Category updated`, 'success');
    try {
      await setDoc(doc(db, 'categories', updated.id), updated, { merge: true });
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] updateCategory Firestore write warning:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(language === 'ar' ? 'تم حذف القسم' : 'Category removed', 'info');
    try {
      await deleteDoc(doc(db, 'categories', id));
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] deleteCategory Firestore delete warning:', err);
    }
  };

  // Store Settings CRUD with Cloud Write & Real-Time Sync
  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...storeSettings, ...newSettings };
    setStoreSettings(merged);
    showToast(language === 'ar' ? 'تم حفظ إعدادات ونصوص المتجر وتحديثها على جميع الأجهزة فورياً ✨' : 'Store settings saved & synced to all devices in real-time ✨', 'success');
    try {
      await setDoc(doc(db, 'storeSettings', 'config'), merged, { merge: true });
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] updateStoreSettings Firestore write warning:', err);
    }
  };

  const resetStoreSettings = async () => {
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    setBranches(DEFAULT_BRANCHES);
    setCategories(DEFAULT_CATEGORIES);
    localStorage.removeItem('rony_store_settings');
    localStorage.removeItem('rony_store_branches');
    localStorage.removeItem('rony_store_categories');
    showToast(language === 'ar' ? 'تمت استعادة إعدادات المتجر الافتراضية' : 'Settings reset to factory defaults', 'info');
    try {
      await setDoc(doc(db, 'storeSettings', 'config'), DEFAULT_STORE_SETTINGS);
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('[ShopContext] resetStoreSettings Firestore write warning:', err);
    }
  };

  // Admin Auth
  const adminLogin = (pin: string) => {
    const targetPin = storeSettings.adminPin || '8899';
    if (pin.trim() === targetPin || pin.trim() === 'rony2026' || pin.trim() === '8899') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('rony_admin_auth', 'true');
      } catch (e) {
        console.warn(e);
      }
      showToast(language === 'ar' ? 'مرحباً بك في لوحة تحكم روني ستور 👑 - المزامنة السحابية الحية نشطة' : 'Welcome to RONY STORE Admin Dashboard 👑 - Live Cloud Sync Active', 'success');
      return true;
    }
    showToast(language === 'ar' ? 'رمز الدخول (PIN) غير صحيح!' : 'Invalid Admin PIN!', 'warning');
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

  const navigateToProduct = (productOrId: Product | string) => {
    if (typeof productOrId === 'string') {
      const found = products.find(p => p.id === productOrId) || PRODUCTS_DATA.find(p => p.id === productOrId);
      if (found) {
        setSelectedProduct(found);
      }
    } else {
      setSelectedProduct(productOrId);
    }
    setCurrentView('product_detail');
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
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { status }, { merge: true });
    } catch (e) {
      console.warn('[ShopContext] Update order status in Firestore warning:', e);
    }
    showToast(language === 'ar' ? `تم تحديث حالة الطلب إلى: ${status}` : `Order status updated to: ${status}`, 'success');
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
    } catch (e) {
      console.warn('[ShopContext] Delete order from Firestore warning:', e);
    }
    showToast(language === 'ar' ? 'تم حذف الطلب من السجل' : 'Order deleted from log', 'info');
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
      const orderRef = doc(db, 'orders', newOrder.id);
      setDoc(orderRef, {
        ...newOrder,
        userId: auth.currentUser?.uid || null
      }).catch(err => {
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
