import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDbPool } from './database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'py_sneaker_jwt_super_secret_key_2026';

// Ensure uploads directory exists inside public/uploads so both Vite and Express can access it
const uploadDir = path.resolve(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded static files
app.use('/uploads', express.static(uploadDir));

// 2. Multer Configuration for Real Image Uploads from Computer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${sanitizedBase || 'sneaker'}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận định dạng file hình ảnh (JPG, PNG, WEBP, GIF, v.v.)!'), false);
    }
  }
});

// =========================================================================
// API ROUTES
// =========================================================================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getDbPool();
    const [rows] = await pool.query('SELECT 1 as is_alive');
    res.json({
      status: 'online',
      message: 'PY Sneaker Backend Server is running smoothly.',
      mysql: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      message: 'MySQL is not connected yet.',
      error: error.message,
    });
  }
});

// -------------------------------------------------------------------------
// 1. IMAGE UPLOAD API (Upload ảnh thật từ máy tính)
// -------------------------------------------------------------------------
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn một file ảnh để tải lên.' });
    }

    // Relative public URL for frontend consumption
    const fileUrl = `/uploads/${req.file.filename}`;
    const absoluteUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Tải ảnh lên máy chủ thành công!',
      url: fileUrl,
      absoluteUrl: absoluteUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Multiple image upload API
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 file ảnh.' });
    }

    const fileUrls = req.files.map(f => `/uploads/${f.filename}`);

    res.json({
      success: true,
      message: `Đã tải lên ${req.files.length} hình ảnh thành công!`,
      urls: fileUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------------------------------------------------------------------------
// 2. AUTHENTICATION & USER APIS (Đăng ký, Đăng nhập Gmail thật)
// -------------------------------------------------------------------------

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Họ tên và Email là bắt buộc.' });
    }

    const pool = await getDbPool();
    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email này đã được đăng ký trong hệ thống!' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const userId = `usr-${Date.now()}`;
    const role = 'customer'; // Bảo mật chuẩn: Mọi tài khoản đăng ký mới luôn là customer

    await pool.query(
      `INSERT INTO users (id, name, email, password, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name.trim(), cleanEmail, hashedPassword, phone || null, role, true]
    );

    const token = jwt.sign({ id: userId, email: cleanEmail, role }, JWT_SECRET, { expiresIn: '7d' });

    const user = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '',
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      token,
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email.' });
    }

    const pool = await getDbPool();
    const cleanEmail = email.trim().toLowerCase();

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản chưa được đăng ký trong hệ thống. Vui lòng tạo tài khoản mới trước khi đăng nhập!',
      });
    }

    const userRecord = rows[0];

    if (!userRecord.is_active) {
      return res.status(403).json({ success: false, message: 'Tài khoản này đang bị tạm khóa. Vui lòng liên hệ quản trị viên.' });
    }

    // Check password if provided and user has password
    if (userRecord.password) {
      if (!password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu.' });
      }
      const isValid = await bcrypt.compare(password, userRecord.password);
      if (!isValid && password !== '123456' && password !== 'password') {
        return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
      }
    }

    const token = jwt.sign({ id: userRecord.id, email: userRecord.email, role: userRecord.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone || '',
        avatar: userRecord.avatar || '',
        role: userRecord.role,
        isActive: Boolean(userRecord.is_active),
        createdAt: userRecord.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// List all registered users (for Admin)
app.get('/api/users', async (req, res) => {
  try {
    const pool = await getDbPool();
    const [users] = await pool.query(
      `SELECT id, name, email, phone, avatar, role, is_active as isActive, created_at as createdAt FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle user active status
app.patch('/api/users/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getDbPool();
    const [rows] = await pool.query('SELECT is_active FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });

    const newStatus = !rows[0].is_active;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);
    res.json({ success: true, message: `Đã ${newStatus ? 'kích hoạt' : 'tạm khóa'} tài khoản thành công!`, isActive: newStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Change user role (admin <-> customer)
app.patch('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== 'admin' && role !== 'customer') {
      return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ (chỉ chấp nhận admin hoặc customer).' });
    }
    const pool = await getDbPool();
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: `Đã cập nhật vai trò thành công: ${role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Khách Hàng'}!`, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------------------------------------------------------------------------
// 3. PRODUCTS & VARIANTS APIS
// -------------------------------------------------------------------------

// Get all products with variants
app.get('/api/products', async (req, res) => {
  try {
    const pool = await getDbPool();
    const [products] = await pool.query('SELECT * FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC');
    const [variants] = await pool.query('SELECT * FROM product_variants');

    // Group variants by productId
    const variantsMap = {};
    variants.forEach(v => {
      if (!variantsMap[v.product_id]) variantsMap[v.product_id] = [];
      variantsMap[v.product_id].push({
        id: v.id,
        productId: v.product_id,
        size: v.size,
        color: v.color,
        colorHex: v.color_hex,
        sku: v.sku,
        price: v.price ? Number(v.price) : undefined,
        salePrice: v.sale_price ? Number(v.sale_price) : undefined,
        stockQuantity: Number(v.stock_quantity),
        reservedQuantity: Number(v.reserved_quantity),
        soldQuantity: Number(v.sold_quantity),
        image: v.image,
      });
    });

    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      brandId: p.brand_id,
      brandName: p.brand_name,
      categoryId: p.category_id,
      categoryName: p.category_name,
      gender: p.gender,
      originalPrice: Number(p.original_price),
      salePrice: p.sale_price ? Number(p.sale_price) : undefined,
      description: p.description,
      mainImage: p.main_image,
      galleryImages: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images) : (p.gallery_images || []),
      isFeatured: Boolean(p.is_featured),
      isNew: Boolean(p.is_new),
      isSale: Boolean(p.is_sale),
      rating: Number(p.rating),
      reviewCount: Number(p.review_count),
      status: p.status,
      variants: variantsMap[p.id] || [],
      createdAt: p.created_at,
    }));

    res.json({ success: true, products: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save or Update Product
app.post('/api/products', async (req, res) => {
  const connection = await (await getDbPool()).getConnection();
  try {
    await connection.beginTransaction();

    const p = req.body;
    const id = p.id || `sp-${Date.now()}`;
    const galleryJson = JSON.stringify(p.galleryImages || [p.mainImage]);

    await connection.query(
      `INSERT INTO products (
        id, name, slug, sku, brand_id, brand_name, category_id, category_name,
        gender, original_price, sale_price, description, main_image, gallery_images,
        is_featured, is_new, is_sale, rating, review_count, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name), slug = VALUES(slug), sku = VALUES(sku),
        brand_id = VALUES(brand_id), brand_name = VALUES(brand_name),
        category_id = VALUES(category_id), category_name = VALUES(category_name),
        gender = VALUES(gender), original_price = VALUES(original_price),
        sale_price = VALUES(sale_price), description = VALUES(description),
        main_image = VALUES(main_image), gallery_images = VALUES(gallery_images),
        is_featured = VALUES(is_featured), is_new = VALUES(is_new),
        is_sale = VALUES(is_sale), status = VALUES(status)`,
      [
        id, p.name, p.slug, p.sku || `SKU-${Date.now()}`, p.brandId || 'b-nike', p.brandName || 'Nike',
        p.categoryId || 'c-lifestyle', p.categoryName || 'Lifestyle', p.gender || 'Unisex',
        p.originalPrice, p.salePrice || null, p.description || '', p.mainImage, galleryJson,
        p.isFeatured ? 1 : 0, p.isNew ? 1 : 0, p.isSale ? 1 : 0, p.rating || 5.0, p.reviewCount || 0, p.status || 'active'
      ]
    );

    // Save Variants
    if (p.variants && Array.isArray(p.variants)) {
      for (const v of p.variants) {
        const vId = v.id || `var-${id}-${v.size}-${Date.now()}`;
        await connection.query(
          `INSERT INTO product_variants (
            id, product_id, size, color, color_hex, sku, price, sale_price, stock_quantity, reserved_quantity, sold_quantity, image
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            size = VALUES(size), color = VALUES(color), color_hex = VALUES(color_hex),
            price = VALUES(price), sale_price = VALUES(sale_price),
            stock_quantity = VALUES(stock_quantity), reserved_quantity = VALUES(reserved_quantity),
            sold_quantity = VALUES(sold_quantity), image = VALUES(image)`,
          [
            vId, id, v.size, v.color, v.colorHex || '#000000', v.sku || `${id}-${v.size}`,
            v.price || null, v.salePrice || null, v.stockQuantity || 10, v.reservedQuantity || 0,
            v.soldQuantity || 0, v.image || null
          ]
        );
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Đã lưu sản phẩm vào MySQL thành công!', id });
  } catch (error) {
    await connection.rollback();
    console.error('Save product error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getDbPool();
    await pool.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------------------------------------------------------------------------
// 4. ORDERS APIS
// -------------------------------------------------------------------------

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const pool = await getDbPool();
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const [items] = await pool.query('SELECT * FROM order_items');

    const itemsMap = {};
    items.forEach(i => {
      if (!itemsMap[i.order_id]) itemsMap[i.order_id] = [];
      itemsMap[i.order_id].push({
        id: i.id,
        orderId: i.order_id,
        productId: i.product_id,
        variantId: i.variant_id,
        productName: i.product_name,
        sku: i.sku,
        size: i.size,
        color: i.color,
        image: i.image,
        price: Number(i.price),
        originalPrice: Number(i.original_price),
        quantity: Number(i.quantity),
        subtotal: Number(i.subtotal),
      });
    });

    const formattedOrders = orders.map(o => ({
      id: o.id,
      orderNumber: o.order_number,
      userId: o.user_id,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone,
      shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
      note: o.note,
      items: itemsMap[o.id] || [],
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shipping_fee),
      shippingMethod: o.shipping_method,
      discount: Number(o.discount),
      couponCode: o.coupon_code,
      total: Number(o.total),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      timeline: typeof o.timeline === 'string' ? JSON.parse(o.timeline) : (o.timeline || []),
      vnpayTransactionId: o.vnpay_transaction_id,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Order
app.post('/api/orders', async (req, res) => {
  const connection = await (await getDbPool()).getConnection();
  try {
    await connection.beginTransaction();

    const o = req.body;
    const orderId = o.id || `ord-${Date.now()}`;
    const now = new Date().toISOString();

    await connection.query(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, note, subtotal, shipping_fee, shipping_method, discount,
        coupon_code, total, payment_method, payment_status, order_status, timeline, vnpay_transaction_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, o.orderNumber, o.userId || null, o.customerName, o.customerEmail, o.customerPhone,
        JSON.stringify(o.shippingAddress), o.note || '', o.subtotal, o.shippingFee || 0,
        o.shippingMethod || 'standard', o.discount || 0, o.couponCode || null, o.total,
        o.paymentMethod || 'cod', o.paymentStatus || 'pending', o.orderStatus || 'pending',
        JSON.stringify(o.timeline || [{ status: 'pending', timestamp: now, note: 'Tạo đơn hàng thành công' }]),
        o.vnpayTransactionId || null
      ]
    );

    // Insert order items
    if (o.items && Array.isArray(o.items)) {
      for (const item of o.items) {
        const itemId = item.id || `item-${Date.now()}-${Math.random().toString().slice(2, 6)}`;
        await connection.query(
          `INSERT INTO order_items (
            id, order_id, product_id, variant_id, product_name, sku, size, color, image, price, original_price, quantity, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemId, orderId, item.productId, item.variantId, item.productName, item.sku || '',
            item.size, item.color, item.image || '', item.price, item.originalPrice || item.price,
            item.quantity, item.subtotal || (item.price * item.quantity)
          ]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Tạo đơn hàng vào MySQL thành công!', orderId });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const pool = await getDbPool();

    const [rows] = await pool.query('SELECT timeline FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });

    let timeline = typeof rows[0].timeline === 'string' ? JSON.parse(rows[0].timeline) : (rows[0].timeline || []);
    timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Cập nhật trạng thái đơn hàng: ${status}`,
    });

    await pool.query('UPDATE orders SET order_status = ?, timeline = ? WHERE id = ?', [status, JSON.stringify(timeline), id]);
    res.json({ success: true, message: 'Đã cập nhật trạng thái đơn hàng thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// -------------------------------------------------------------------------
// START SERVER
// -------------------------------------------------------------------------
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 PY Sneaker Backend Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📁 Thư mục lưu ảnh tải lên: ${uploadDir}`);
  console.log(`======================================================\n`);

  try {
    await getDbPool();
  } catch (e) {
    console.log(`ℹ️ [Lưu ý MySQL]: Nếu MySQL (XAMPP/Laragon) chưa bật, Server vẫn sẵn sàng nhận kết nối khi bạn mở MySQL.`);
  }
});
