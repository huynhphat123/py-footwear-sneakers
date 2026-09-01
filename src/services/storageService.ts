import {
  Product,
  Category,
  Brand,
  Coupon,
  GiftCard,
  Review,
  BlogPost,
  StoreLocation,
  StoreSettings,
  User,
  Order,
  Address,
  OrderStatus,
  PaymentStatus,
  ProductVariant,
} from '../types';

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COUPONS,
  INITIAL_GIFTCARDS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_BLOGS,
  INITIAL_STORES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '../data/initialData';

const KEYS = {
  PRODUCTS: 'solevault_products_v3',
  CATEGORIES: 'solevault_categories_v3',
  BRANDS: 'solevault_brands_v3',
  COUPONS: 'solevault_coupons_v3',
  GIFTCARDS: 'solevault_giftcards_v3',
  REVIEWS: 'solevault_reviews_v3',
  ORDERS: 'solevault_orders_v3',
  BLOGS: 'solevault_blogs_v3',
  STORES: 'solevault_stores_v3',
  SETTINGS: 'solevault_settings_v3',
  USERS: 'solevault_users_v3',
  CURRENT_USER: 'solevault_current_user_v3',
  ADDRESSES: 'solevault_addresses_v3',
  WISHLIST: 'solevault_wishlist_v3',
  CART: 'solevault_cart_v3',
};

// Safe JSON parser
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS).filter(p => !p.deletedAt);
  },

  getAllProductsIncludingSoftDeleted(): Product[] {
    return getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(p => p.slug === slug);
  },

  saveProduct(product: Product): void {
    const all = this.getAllProductsIncludingSoftDeleted();
    const index = all.findIndex(p => p.id === product.id);
    if (index >= 0) {
      all[index] = product;
    } else {
      all.unshift(product);
    }
    setStored(KEYS.PRODUCTS, all);
  },

  deleteProduct(id: string, soft = true): void {
    const all = this.getAllProductsIncludingSoftDeleted();
    if (soft) {
      const updated = all.map(p => p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p);
      setStored(KEYS.PRODUCTS, updated);
    } else {
      const updated = all.filter(p => p.id !== id);
      setStored(KEYS.PRODUCTS, updated);
    }
  },

  restoreProduct(id: string): void {
    const all = this.getAllProductsIncludingSoftDeleted();
    const updated = all.map(p => p.id === id ? { ...p, deletedAt: null } : p);
    setStored(KEYS.PRODUCTS, updated);
  },

  // INVENTORY TRANSACTION & RESERVATION LOGIC
  checkAndReserveStock(items: { variantId: string; productId: string; quantity: number }[]): { success: boolean; error?: string } {
    const allProducts = this.getAllProductsIncludingSoftDeleted();
    
    // Step 1: Validate stock without mutating
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId);
      if (!product) return { success: false, error: `Sản phẩm không tồn tại (ID: ${item.productId})` };
      
      const variant = product.variants.find(v => v.id === item.variantId);
      if (!variant) return { success: false, error: `Biến thể size/màu không tồn tại` };

      const available = variant.stockQuantity - variant.reservedQuantity;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Sản phẩm "${product.name}" (Size ${variant.size} - ${variant.color}) chỉ còn ${available} đôi trong kho.`,
        };
      }
    }

    // Step 2: Reserve stock in transaction
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId)!;
      const variant = product.variants.find(v => v.id === item.variantId)!;
      variant.reservedQuantity += item.quantity;
    }

    setStored(KEYS.PRODUCTS, allProducts);
    return { success: true };
  },

  confirmStockDeduction(items: { variantId: string; productId: string; quantity: number }[]): void {
    const allProducts = this.getAllProductsIncludingSoftDeleted();
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
          variant.reservedQuantity = Math.max(0, variant.reservedQuantity - item.quantity);
          variant.soldQuantity += item.quantity;
        }
      }
    }
    setStored(KEYS.PRODUCTS, allProducts);
  },

  releaseReservedStock(items: { variantId: string; productId: string; quantity: number }[]): void {
    const allProducts = this.getAllProductsIncludingSoftDeleted();
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          variant.reservedQuantity = Math.max(0, variant.reservedQuantity - item.quantity);
        }
      }
    }
    setStored(KEYS.PRODUCTS, allProducts);
  },

  restoreCancelledOrderStock(items: { variantId: string; productId: string; quantity: number }[]): void {
    const allProducts = this.getAllProductsIncludingSoftDeleted();
    for (const item of items) {
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          variant.stockQuantity += item.quantity;
          variant.soldQuantity = Math.max(0, variant.soldQuantity - item.quantity);
        }
      }
    }
    setStored(KEYS.PRODUCTS, allProducts);
  },

  updateVariantDirectly(productId: string, variantId: string, updates: Partial<ProductVariant>): void {
    const allProducts = this.getAllProductsIncludingSoftDeleted();
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      const variantIndex = product.variants.findIndex(v => v.id === variantId);
      if (variantIndex >= 0) {
        product.variants[variantIndex] = { ...product.variants[variantIndex], ...updates };
        setStored(KEYS.PRODUCTS, allProducts);
      }
    }
  },

  // CATEGORIES
  getCategories(): Category[] {
    return getStored<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory(cat: Category): void {
    const all = this.getCategories();
    const idx = all.findIndex(c => c.id === cat.id);
    if (idx >= 0) all[idx] = cat;
    else all.push(cat);
    setStored(KEYS.CATEGORIES, all);
  },

  deleteCategory(id: string): void {
    const all = this.getCategories().filter(c => c.id !== id);
    setStored(KEYS.CATEGORIES, all);
  },

  // BRANDS
  getBrands(): Brand[] {
    return getStored<Brand[]>(KEYS.BRANDS, INITIAL_BRANDS);
  },

  saveBrand(brand: Brand): void {
    const all = this.getBrands();
    const idx = all.findIndex(b => b.id === brand.id);
    if (idx >= 0) all[idx] = brand;
    else all.push(brand);
    setStored(KEYS.BRANDS, all);
  },

  deleteBrand(id: string): void {
    const all = this.getBrands().filter(b => b.id !== id);
    setStored(KEYS.BRANDS, all);
  },

  // ORDERS
  getOrders(): Order[] {
    return getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  },

  saveOrder(order: Order): void {
    const all = this.getOrders();
    const idx = all.findIndex(o => o.id === order.id);
    if (idx >= 0) all[idx] = order;
    else all.unshift(order);
    setStored(KEYS.ORDERS, all);
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | undefined {
    const all = this.getOrders();
    const order = all.find(o => o.id === orderId);
    if (!order) return undefined;

    const oldStatus = order.orderStatus;
    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    
    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Cập nhật trạng thái đơn hàng sang: ${newStatus}`,
    });

    // Handle inventory transitions
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      if (order.paymentStatus === 'paid' || oldStatus === 'confirmed' || oldStatus === 'processing' || oldStatus === 'shipping') {
        this.restoreCancelledOrderStock(order.items.map(i => ({ variantId: i.variantId, productId: i.productId, quantity: i.quantity })));
      } else {
        this.releaseReservedStock(order.items.map(i => ({ variantId: i.variantId, productId: i.productId, quantity: i.quantity })));
      }
    } else if (newStatus === 'confirmed' && oldStatus === 'pending') {
      // confirm stock deduction from reserved
      this.confirmStockDeduction(order.items.map(i => ({ variantId: i.variantId, productId: i.productId, quantity: i.quantity })));
    }

    setStored(KEYS.ORDERS, all);
    return order;
  },

  updateOrderPayment(orderId: string, status: PaymentStatus, transactionId?: string): Order | undefined {
    const all = this.getOrders();
    const order = all.find(o => o.id === orderId);
    if (!order) return undefined;

    order.paymentStatus = status;
    if (transactionId) order.vnpayTransactionId = transactionId;
    if (status === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
      order.timeline.push({
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        note: `Thanh toán thành công qua VNPay (Mã GD: ${transactionId})`,
      });
      this.confirmStockDeduction(order.items.map(i => ({ variantId: i.variantId, productId: i.productId, quantity: i.quantity })));
    }
    order.updatedAt = new Date().toISOString();
    setStored(KEYS.ORDERS, all);
    return order;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getStored<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; error?: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.status === 'active');
    
    if (!coupon) {
      return { valid: false, discount: 0, error: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }

    const now = new Date();
    if (new Date(coupon.endDate) < now) {
      return { valid: false, discount: 0, error: 'Mã giảm giá đã quá hạn sử dụng.' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, error: 'Mã giảm giá đã hết lượt sử dụng.' };
    }

    if (subtotal < coupon.minimumOrder) {
      return {
        valid: false,
        discount: 0,
        error: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(coupon.minimumOrder)} ₫ để áp dụng mã này.`,
      };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return { valid: true, coupon, discount };
  },

  saveCoupon(coupon: Coupon): void {
    const all = this.getCoupons();
    const idx = all.findIndex(c => c.id === coupon.id);
    if (idx >= 0) all[idx] = coupon;
    else all.push(coupon);
    setStored(KEYS.COUPONS, all);
  },

  deleteCoupon(id: string): void {
    const all = this.getCoupons().filter(c => c.id !== id);
    setStored(KEYS.COUPONS, all);
  },

  // GIFT CARDS
  getGiftCards(): GiftCard[] {
    return getStored<GiftCard[]>(KEYS.GIFTCARDS, INITIAL_GIFTCARDS);
  },

  saveGiftCard(card: GiftCard): void {
    const all = this.getGiftCards();
    const idx = all.findIndex(c => c.id === card.id);
    if (idx >= 0) all[idx] = card;
    else all.push(card);
    setStored(KEYS.GIFTCARDS, all);
  },

  validateGiftCard(code: string): { valid: boolean; card?: GiftCard; error?: string } {
    const cards = this.getGiftCards();
    const card = cards.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.status === 'active');
    if (!card) return { valid: false, error: 'Thẻ quà tặng không hợp lệ hoặc đã sử dụng.' };
    if (card.balance <= 0) return { valid: false, error: 'Thẻ quà tặng đã hết số dư khả dụng.' };
    return { valid: true, card };
  },

  deductGiftCardBalance(code: string, amount: number): void {
    const cards = this.getGiftCards();
    const card = cards.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (card) {
      card.balance = Math.max(0, card.balance - amount);
      if (card.balance === 0) card.status = 'used';
      setStored(KEYS.GIFTCARDS, cards);
    }
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const all = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) return all.filter(r => r.productId === productId && r.status === 'approved');
    return all;
  },

  getProductReviews(productId: string): Review[] {
    return this.getReviews(productId);
  },

  addReview(review: Review): void {
    this.saveReview(review);
  },

  getAllReviewsForAdmin(): Review[] {
    return getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  saveReview(review: Review): void {
    const all = this.getAllReviewsForAdmin();
    all.unshift(review);
    setStored(KEYS.REVIEWS, all);

    // Update product rating and review count
    const approved = all.filter(r => r.productId === review.productId && r.status === 'approved');
    if (approved.length > 0) {
      const avg = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
      const product = this.getProductById(review.productId);
      if (product) {
        product.rating = Number(avg.toFixed(1));
        product.reviewCount = approved.length;
        this.saveProduct(product);
      }
    }
  },

  updateReviewStatus(id: string, status: 'approved' | 'hidden' | 'pending'): void {
    const all = this.getAllReviewsForAdmin();
    const review = all.find(r => r.id === id);
    if (review) {
      review.status = status;
      setStored(KEYS.REVIEWS, all);

      // Recalculate product rating
      const approved = all.filter(r => r.productId === review.productId && r.status === 'approved');
      const product = this.getProductById(review.productId);
      if (product) {
        if (approved.length > 0) {
          const avg = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
          product.rating = Number(avg.toFixed(1));
          product.reviewCount = approved.length;
        } else {
          product.rating = 5.0;
          product.reviewCount = 0;
        }
        this.saveProduct(product);
      }
    }
  },

  deleteReview(id: string): void {
    const all = this.getAllReviewsForAdmin().filter(r => r.id !== id);
    setStored(KEYS.REVIEWS, all);
  },

  // BLOGS
  getBlogs(): BlogPost[] {
    return getStored<BlogPost[]>(KEYS.BLOGS, INITIAL_BLOGS);
  },

  saveBlog(blog: BlogPost): void {
    const all = this.getBlogs();
    const idx = all.findIndex(b => b.id === blog.id);
    if (idx >= 0) all[idx] = blog;
    else all.unshift(blog);
    setStored(KEYS.BLOGS, all);
  },

  deleteBlog(id: string): void {
    const all = this.getBlogs().filter(b => b.id !== id);
    setStored(KEYS.BLOGS, all);
  },

  // STORES
  getStores(): StoreLocation[] {
    return getStored<StoreLocation[]>(KEYS.STORES, INITIAL_STORES);
  },

  saveStore(store: StoreLocation): void {
    const all = this.getStores();
    const idx = all.findIndex(s => s.id === store.id);
    if (idx >= 0) all[idx] = store;
    else all.push(store);
    setStored(KEYS.STORES, all);
  },

  // USERS & AUTH
  getUsers(): User[] {
    return getStored<User[]>(KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return getStored<User | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    setStored(KEYS.CURRENT_USER, user);
  },

  saveUser(user: User): void {
    const all = this.getUsers();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) all[idx] = user;
    else all.push(user);
    setStored(KEYS.USERS, all);
  },

  // ADDRESS BOOK
  getAddresses(userId: string): Address[] {
    const all = getStored<Address[]>(KEYS.ADDRESSES, [
      {
        id: 'addr-1',
        userId: 'usr-cust-1',
        fullName: 'Nguyễn Văn An',
        phone: '0912345678',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        street: '45 Lê Duẩn',
        isDefault: true,
      }
    ]);
    return all.filter(a => a.userId === userId);
  },

  saveAddress(address: Address): void {
    const all = getStored<Address[]>(KEYS.ADDRESSES, []);
    if (address.isDefault) {
      all.forEach(a => {
        if (a.userId === address.userId) a.isDefault = false;
      });
    }
    const idx = all.findIndex(a => a.id === address.id);
    if (idx >= 0) all[idx] = address;
    else all.push(address);
    setStored(KEYS.ADDRESSES, all);
  },

  deleteAddress(id: string): void {
    const all = getStored<Address[]>(KEYS.ADDRESSES, []).filter(a => a.id !== id);
    setStored(KEYS.ADDRESSES, all);
  },

  // SETTINGS
  getSettings(): StoreSettings {
    return getStored<StoreSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: StoreSettings): void {
    setStored(KEYS.SETTINGS, settings);
  },

  // RESET TO DEFAULT SEED DATA
  resetToFactoryDefaults(): void {
    localStorage.clear();
    setStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStored(KEYS.BRANDS, INITIAL_BRANDS);
    setStored(KEYS.COUPONS, INITIAL_COUPONS);
    setStored(KEYS.GIFTCARDS, INITIAL_GIFTCARDS);
    setStored(KEYS.REVIEWS, INITIAL_REVIEWS);
    setStored(KEYS.ORDERS, INITIAL_ORDERS);
    setStored(KEYS.BLOGS, INITIAL_BLOGS);
    setStored(KEYS.STORES, INITIAL_STORES);
    setStored(KEYS.SETTINGS, INITIAL_SETTINGS);
    setStored(KEYS.USERS, INITIAL_USERS);
  }
};
