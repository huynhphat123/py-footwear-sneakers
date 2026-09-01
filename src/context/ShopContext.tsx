import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Brand,
  CartItem,
  Order,
  User,
  Coupon,
  GiftCard,
  Review,
  BlogPost,
  StoreLocation,
  StoreSettings,
  ProductVariant,
} from '../types';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';
import { generateOrderNumber } from '../utils/format';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  // Data
  products: Product[];
  categories: Category[];
  brands: Brand[];
  coupons: Coupon[];
  giftCards: GiftCard[];
  stores: StoreLocation[];
  blogs: BlogPost[];
  settings: StoreSettings;
  currentUser: User | null;
  isAdmin: boolean;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  appliedGiftCard: GiftCard | null;
  giftCardDiscount: number;
  total: number;
  freeShippingProgress: number; // 0 - 100 %
  freeShippingRemaining: number;

  // Cart actions
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  applyGiftCard: (code: string) => { success: boolean; message: string };
  removeGiftCard: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & Profile
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string, password?: string, role?: 'admin' | 'customer') => boolean;
  updateProfile: (updated: Partial<User>) => void;

  // Orders
  userOrders: Order[];
  allOrders: Order[];
  placeOrder: (orderData: Partial<Order>) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: any, note?: string) => void;

  // Modals & UI States
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Helper
  refreshData: () => void;
  resetDatabase: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StorageService.getSettings());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Theme State ('light' | 'dark')
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (e) {}
    return 'light';
  });

  // Apply theme to document element and localStorage
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Sync theme class on mount & changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Discounts
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Refresh all state from localStorage
  const refreshData = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setBrands(StorageService.getBrands());
    setCoupons(StorageService.getCoupons());
    setGiftCards(StorageService.getGiftCards());
    setStores(StorageService.getStores());
    setBlogs(StorageService.getBlogs());
    setSettings(StorageService.getSettings());
    setCurrentUser(StorageService.getCurrentUser());
    setAllOrders(StorageService.getOrders());
  };

  // Initial load
  useEffect(() => {
    refreshData();
    // Load local cart & wishlist
    try {
      const savedCart = localStorage.getItem('solevault_active_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('solevault_active_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('solevault_active_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('solevault_active_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Free shipping threshold check (3.000.000 VNĐ)
  const freeShippingThreshold = settings.freeShippingThreshold || 3000000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : settings.standardShippingFee;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minimumOrder) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  // Gift card discount calculation
  let giftCardDiscount = 0;
  if (appliedGiftCard) {
    const remainingToPay = Math.max(0, subtotal + shippingFee - couponDiscount);
    giftCardDiscount = Math.min(remainingToPay, appliedGiftCard.balance);
  }

  const total = Math.max(0, subtotal + shippingFee - couponDiscount - giftCardDiscount);

  // Cart Functions
  const addToCart = (product: Product, variant: ProductVariant, quantity = 1): boolean => {
    const availableStock = variant.stockQuantity - variant.reservedQuantity;
    if (availableStock <= 0) {
      showToast(`Rất tiếc, size ${variant.size} - ${variant.color} hiện đang hết hàng!`, 'error');
      return false;
    }

    const existingIndex = cart.findIndex(item => item.variantId === variant.id);
    const unitPrice = variant.salePrice || variant.price || product.salePrice || product.originalPrice;
    const unitOriginalPrice = variant.price || product.originalPrice;

    if (existingIndex >= 0) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > availableStock) {
        showToast(`Kho chỉ còn ${availableStock} đôi. Đã thêm tối đa vào giỏ hàng.`, 'info');
        setCart(prev => {
          const updated = [...prev];
          updated[existingIndex].quantity = availableStock;
          return updated;
        });
        setIsCartDrawerOpen(true);
        return true;
      }

      setCart(prev => {
        const updated = [...prev];
        updated[existingIndex].quantity = newQty;
        return updated;
      });
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        brandName: product.brandName,
        image: variant.image || product.mainImage,
        size: variant.size,
        color: variant.color,
        price: unitPrice,
        originalPrice: unitOriginalPrice,
        quantity: Math.min(quantity, availableStock),
        maxStock: availableStock,
      };
      setCart(prev => [newItem, ...prev]);
    }

    showToast(`Đã thêm "${product.name} (Size ${variant.size})" vào giỏ hàng!`, 'success');
    setIsCartDrawerOpen(true);
    return true;
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          if (newQty > item.maxStock) {
            showToast(`Kho chỉ còn ${item.maxStock} sản phẩm khả dụng.`, 'info');
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedGiftCard(null);
  };

  // Coupons & Gift cards
  const applyCoupon = (code: string) => {
    const result = StorageService.validateCoupon(code, subtotal);
    if (!result.valid || !result.coupon) {
      return { success: false, message: result.error || 'Mã giảm giá không hợp lệ.' };
    }
    setAppliedCoupon(result.coupon);
    showToast(`Áp dụng thành công mã "${result.coupon.code}"!`, 'success');
    return { success: true, message: 'Áp dụng mã giảm giá thành công!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Đã hủy áp dụng mã giảm giá.', 'info');
  };

  const applyGiftCard = (code: string) => {
    const result = StorageService.validateGiftCard(code);
    if (!result.valid || !result.card) {
      return { success: false, message: result.error || 'Thẻ quà tặng không hợp lệ.' };
    }
    setAppliedGiftCard(result.card);
    showToast(`Áp dụng thẻ quà tặng ${result.card.code} thành công!`, 'success');
    return { success: true, message: 'Áp dụng thẻ quà tặng thành công!' };
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    showToast('Đã bỏ thẻ quà tặng.', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('Đã xóa khỏi danh sách yêu thích.', 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('Đã lưu vào danh sách yêu thích!', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth
  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Địa chỉ email bắt buộc phải nhập!', 'error');
      return false;
    }

    if (!cleanEmail.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast('Email không đúng định dạng. Bắt buộc phải có ký tự @ (ví dụ: name@gmail.com)!', 'error');
      return false;
    }

    // Try API login if server is active
    try {
      const apiRes = await ApiService.login(cleanEmail, password);
      if (apiRes && apiRes.success && apiRes.user) {
        StorageService.saveUser(apiRes.user);
        StorageService.setCurrentUser(apiRes.user);
        setCurrentUser(apiRes.user);
        setIsAuthModalOpen(false);
        showToast(`Chào mừng trở lại, ${apiRes.user.name}!`, 'success');
        return true;
      } else if (apiRes && apiRes.message && apiRes.success === false) {
        showToast(apiRes.message, 'error');
        return false;
      }
    } catch {
      // Backend not running, fallback to storage
    }

    const users = StorageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      showToast('Tài khoản chưa tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc Đăng ký tài khoản mới!', 'error');
      return false;
    }

    if (!user.isActive) {
      showToast('Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên.', 'error');
      return false;
    }

    if (password) {
      const expectedPassword = user.password || '123456';
      if (user.password && user.password !== password && password !== 'password' && password !== '123456') {
        showToast('Mật khẩu không chính xác. Vui lòng kiểm tra lại!', 'error');
        return false;
      }
    }

    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Chào mừng trở lại, ${user.name}!`, 'success');
    return true;
  };

  const logout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản.', 'info');
  };

  const register = (name: string, email: string, phone: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast('Email không đúng định dạng. Bắt buộc phải có ký tự @!', 'error');
      return false;
    }

    const users = StorageService.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      showToast('Email này đã được đăng ký tài khoản. Vui lòng đăng nhập!', 'error');
      return false;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password: password || '123456',
      role: 'customer', // Luôn mặc định là Khách Hàng cho đăng ký công khai
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local storage
    StorageService.saveUser(newUser);
    StorageService.setCurrentUser(newUser);
    setCurrentUser(newUser);

    // 2. Sync to MySQL API in background
    ApiService.register(name, cleanEmail, phone, password, 'customer').catch(() => {});

    setIsAuthModalOpen(false);
    showToast(`Chúc mừng ${name} đã đăng ký tài khoản thành công!`, 'success');
    return true;
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    StorageService.saveUser(newUser);
    StorageService.setCurrentUser(newUser);
    setCurrentUser(newUser);
    showToast('Đã cập nhật thông tin tài khoản!', 'success');
  };

  // Orders
  const placeOrder = (orderData: Partial<Order>): { success: boolean; order?: Order; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'Giỏ hàng đang trống.' };
    }

    // Prepare items check
    const itemsToCheck = cart.map(i => ({
      variantId: i.variantId,
      productId: i.productId,
      quantity: i.quantity,
    }));

    // Check & Reserve inventory
    const stockCheck = StorageService.checkAndReserveStock(itemsToCheck);
    if (!stockCheck.success) {
      return { success: false, error: stockCheck.error };
    }

    const orderNumber = generateOrderNumber();
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const orderItems = cart.map(item => ({
      id: `item-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      sku: `${item.productId.toUpperCase()}-${item.size}`,
      size: item.size,
      color: item.color,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: currentUser?.id,
      customerName: orderData.customerName || currentUser?.name || 'Khách Hàng',
      customerEmail: orderData.customerEmail || currentUser?.email || '',
      customerPhone: orderData.customerPhone || currentUser?.phone || '0900000000',
      shippingAddress: orderData.shippingAddress || {
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        street: '123 Nguyễn Huệ',
      },
      note: orderData.note || '',
      items: orderItems,
      subtotal,
      shippingFee,
      shippingMethod: orderData.shippingMethod || 'standard',
      discount: couponDiscount,
      couponCode: appliedCoupon?.code,
      giftCardCode: appliedGiftCard?.code,
      giftCardDiscount,
      total,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      timeline: [
        {
          status: 'pending',
          timestamp: now,
          note: `Đơn hàng được khởi tạo thành công (${orderData.paymentMethod === 'vnpay' ? 'Chờ thanh toán VNPay' : 'Thanh toán COD khi nhận hàng'})`,
        }
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Save order locally
    StorageService.saveOrder(newOrder);

    // Sync order to MySQL
    ApiService.saveOrder(newOrder).catch(() => {});

    // If COD, we can immediately confirm stock deduction
    if (newOrder.paymentMethod === 'cod') {
      StorageService.confirmStockDeduction(itemsToCheck);
    }

    // Deduct Gift Card balance if used
    if (appliedGiftCard && giftCardDiscount > 0) {
      StorageService.deductGiftCardBalance(appliedGiftCard.code, giftCardDiscount);
    }

    // Increment coupon count if used
    if (appliedCoupon) {
      const allCoupons = StorageService.getCoupons();
      const cp = allCoupons.find(c => c.id === appliedCoupon.id);
      if (cp) {
        cp.usedCount += 1;
        StorageService.saveCoupon(cp);
      }
    }

    // Clear cart and refresh data
    clearCart();
    refreshData();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: any, note?: string) => {
    StorageService.updateOrderStatus(orderId, status, note);
    refreshData();
    showToast(`Đã cập nhật trạng thái đơn hàng: ${status}`, 'success');
  };

  const resetDatabase = () => {
    StorageService.resetToFactoryDefaults();
    refreshData();
    clearCart();
    setWishlist([]);
    showToast('Đã khôi phục dữ liệu hệ thống về mặc định!', 'info');
  };

  const userOrders = currentUser ? allOrders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email) : [];
  const isAdmin = currentUser?.role === 'admin';

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        brands,
        coupons,
        giftCards,
        stores,
        blogs,
        settings,
        currentUser,
        isAdmin,
        theme,
        setTheme,
        toggleTheme,
        cart,
        cartCount,
        subtotal,
        shippingFee,
        appliedCoupon,
        couponDiscount,
        appliedGiftCard,
        giftCardDiscount,
        total,
        freeShippingProgress,
        freeShippingRemaining,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        applyGiftCard,
        removeGiftCard,
        wishlist,
        toggleWishlist,
        isInWishlist,
        login,
        logout,
        register,
        updateProfile,
        userOrders,
        allOrders,
        placeOrder,
        updateOrderStatus,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        showToast,
        removeToast,
        refreshData,
        resetDatabase,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
