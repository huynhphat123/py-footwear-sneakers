// API Service for PY Sneaker Backend & MySQL Connection

const API_BASE_URL = 'http://localhost:5000/api';

export const ApiService = {
  /**
   * Check if backend MySQL server is running
   */
  async checkHealth(): Promise<{ isOnline: boolean; mysqlConnected: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      if (!response.ok) return { isOnline: false, mysqlConnected: false };
      const data = await response.json();
      return {
        isOnline: true,
        mysqlConnected: data.mysql === 'connected',
        message: data.message,
      };
    } catch {
      return { isOnline: false, mysqlConnected: false };
    }
  },

  /**
   * Upload a real image file from local computer
   */
  async uploadImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Lỗi tải ảnh lên máy chủ');
      }

      const data = await response.json();
      return { success: true, url: data.url };
    } catch (error: any) {
      console.warn('Backend upload failed, converting to local DataURL preview:', error.message);
      // Fallback: Convert to Base64 Data URL so user can still preview & use image even if backend is offline
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, url: '', error: 'Không thể đọc file ảnh từ máy tính' });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Register user in MySQL
   */
  async register(name: string, email: string, phone: string, password?: string, role?: string, adminPasscode?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role, adminPasscode }),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Login user from MySQL
   */
  async login(email: string, password?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Fetch all registered users for Admin
   */
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, { method: 'GET' });
      if (!response.ok) throw new Error('Không thể tải danh sách người dùng');
      const data = await response.json();
      return data.users || [];
    } catch {
      return null;
    }
  },

  /**
   * Toggle user active status in MySQL
   */
  async toggleUserStatus(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-status`, { method: 'PATCH' });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Change user role (admin <-> customer)
   */
  async changeUserRole(userId: string, role: 'admin' | 'customer') {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Sync product to MySQL
   */
  async saveProduct(product: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Sync order to MySQL
   */
  async saveOrder(order: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
};
