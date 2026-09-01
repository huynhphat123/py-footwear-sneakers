-- ============================================================
-- DATABASE SCHEMA: py_sneakers_db
-- Hệ Thống Quản Lý Thương Mại Điện Tử PY Footwear & Sneakers
-- ============================================================

CREATE DATABASE IF NOT EXISTS `py_sneakers_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `py_sneakers_db`;

-- 1. BẢNG USERS (Người dùng & Quản trị viên)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `avatar` TEXT NULL,
  `role` ENUM('admin', 'customer') DEFAULT 'customer',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG BRANDS (Thương hiệu)
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `logo` TEXT NOT NULL,
  `banner` TEXT NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG CATEGORIES (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `image` TEXT NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG PRODUCTS (Sản phẩm giày)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `sku` VARCHAR(100) NOT NULL,
  `brand_id` VARCHAR(50) NOT NULL,
  `brand_name` VARCHAR(100) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `category_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Men', 'Women', 'Unisex', 'Kids') DEFAULT 'Unisex',
  `original_price` BIGINT NOT NULL,
  `sale_price` BIGINT NULL,
  `description` TEXT NULL,
  `main_image` TEXT NOT NULL,
  `gallery_images` JSON NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_new` BOOLEAN DEFAULT TRUE,
  `is_sale` BOOLEAN DEFAULT FALSE,
  `rating` DECIMAL(3, 1) DEFAULT 5.0,
  `review_count` INT DEFAULT 0,
  `status` ENUM('active', 'inactive', 'draft') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_brand` (`brand_id`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG PRODUCT_VARIANTS (Biến thể Size, Màu sắc, Tồn kho)
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `size` VARCHAR(20) NOT NULL,
  `color` VARCHAR(100) NOT NULL,
  `color_hex` VARCHAR(20) NOT NULL DEFAULT '#000000',
  `sku` VARCHAR(100) NOT NULL,
  `price` BIGINT NULL,
  `sale_price` BIGINT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 10,
  `reserved_quantity` INT NOT NULL DEFAULT 0,
  `sold_quantity` INT NOT NULL DEFAULT 0,
  `image` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG ORDERS (Đơn hàng)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` VARCHAR(50) NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `shipping_address` JSON NOT NULL,
  `note` TEXT NULL,
  `subtotal` BIGINT NOT NULL,
  `shipping_fee` BIGINT NOT NULL DEFAULT 0,
  `shipping_method` VARCHAR(50) DEFAULT 'standard',
  `discount` BIGINT NOT NULL DEFAULT 0,
  `coupon_code` VARCHAR(50) NULL,
  `total` BIGINT NOT NULL,
  `payment_method` ENUM('cod', 'vnpay') DEFAULT 'cod',
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  `order_status` ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned') DEFAULT 'pending',
  `timeline` JSON NULL,
  `vnpay_transaction_id` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG ORDER_ITEMS (Chi tiết sản phẩm trong đơn)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `variant_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `size` VARCHAR(20) NOT NULL,
  `color` VARCHAR(100) NOT NULL,
  `image` TEXT NULL,
  `price` BIGINT NOT NULL,
  `original_price` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `subtotal` BIGINT NOT NULL,
  CONSTRAINT `fk_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG COUPONS (Mã giảm giá)
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('percentage', 'fixed') DEFAULT 'percentage',
  `value` INT NOT NULL,
  `minimum_order` BIGINT NOT NULL DEFAULT 0,
  `max_discount` BIGINT NULL,
  `usage_limit` INT NOT NULL DEFAULT 100,
  `used_count` INT NOT NULL DEFAULT 0,
  `start_date` VARCHAR(50) NOT NULL,
  `end_date` VARCHAR(50) NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ============================================================

-- Seed Users (Mật khẩu mặc định: '123456' đã được mã hóa bcrypt hoặc kiểm tra plain text)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `is_active`)
VALUES 
('usr-admin-1', 'PY Administrator', 'admin@example.com', '$2a$10$76gXQ85X491X7fP2u5m3ee0iA9mO5QfRj4sF4g4d1.k6a7K0t6Vp6', '0908123456', 'admin', TRUE),
('usr-cust-1', 'Nguyễn Văn An', 'customer@example.com', '$2a$10$76gXQ85X491X7fP2u5m3ee0iA9mO5QfRj4sF4g4d1.k6a7K0t6Vp6', '0912345678', 'customer', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Brands
INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `banner`, `description`, `status`)
VALUES
('b-nike', 'Nike', 'nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=80', 'Thương hiệu đồ thể thao và sneaker hàng đầu thế giới.', 'active'),
('b-adidas', 'Adidas', 'adidas', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&auto=format&fit=crop&q=80', 'Biểu tượng 3 sọc nổi tiếng với Samba, Superstar, Stan Smith.', 'active'),
('b-jordan', 'Jordan', 'jordan', 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&auto=format&fit=crop&q=80', 'Dòng giày bóng rổ di sản của huyền thoại Michael Jordan.', 'active'),
('b-newbalance', 'New Balance', 'new-balance', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=120&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=80', 'Chất lượng gia công đỉnh cao cùng phong cách dad-shoe retro thời thượng.', 'active')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `description`, `status`)
VALUES
('c-lifestyle', 'Sneakers & Lifestyle', 'lifestyle', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80', 'Phong cách dạo phố, thời trang thường nhật năng động.', 'active'),
('c-running', 'Giày Chạy Bộ (Running)', 'running', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80', 'Đế đệm đàn hồi êm ái tối ưu hóa hiệu suất chạy cự ly ngắn & marathon.', 'active'),
('c-basketball', 'Giày Bóng Rổ (Basketball)', 'basketball', 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop&q=80', 'Hỗ trợ bảo vệ cổ chân, độ bám sân vượt trội.', 'active')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Coupons
INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `minimum_order`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `status`, `description`)
VALUES
('cp-1', 'WELCOME10', 'percentage', 10, 1000000, 300000, 500, 12, '2025-01-01', '2027-12-31', 'active', 'Giảm 10% tối đa 300.000₫ cho khách hàng mới'),
('cp-2', 'SALE100K', 'fixed', 100000, 2000000, 100000, 200, 45, '2025-01-01', '2027-12-31', 'active', 'Giảm trực tiếp 100.000₫ cho đơn từ 2.000.000₫')
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);
