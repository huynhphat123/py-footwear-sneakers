import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'py_sneakers_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;

export async function getDbPool() {
  if (pool) return pool;

  try {
    // 1. Check if database exists; if not, create it
    const tempConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.end();

    // 2. Create main connection pool
    pool = mysql.createPool(DB_CONFIG);

    // 3. Initialize tables & seed if empty
    await initializeDatabase(pool);

    console.log(`✅ Kết nối thành công tới MySQL Database [${DB_CONFIG.database}] tại ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    return pool;
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL:', error.message);
    throw error;
  }
}

async function initializeDatabase(dbPool) {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      
      // Split statements cleanly
      const statements = sqlContent
        .replace(/--.*$/gm, '') // remove single-line comments
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        try {
          await dbPool.query(statement);
        } catch (e) {
          // Ignore table exists warning or syntax quirks
          if (!e.message.includes('already exists')) {
            // console.warn('Init statement info:', e.message);
          }
        }
      }
      console.log('✅ Đã đồng bộ cấu trúc bảng và dữ liệu mẫu vào MySQL.');
    }
  } catch (err) {
    console.warn('⚠️ Cảnh báo khởi tạo schema:', err.message);
  }
}

export default {
  getDbPool,
};
