import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "vuonnho_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const SEED_PRODUCTS = [
  {
    id: "p1",
    name: "Trầu bà Nam Mỹ",
    desc: "Lá xẻ to bản xanh mướt, hợp góc phòng khách nhiều nắng gián tiếp, thanh lọc không khí.",
    price: 185000,
    category: "Cây lớn",
    stock: 8,
    icon: "🌿",
  },
  {
    id: "p2",
    name: "Sen đá Ngọc Lan",
    desc: "Cánh mọng nước xếp xoay đều, biểu tượng may mắn, tưới 1 lần/tuần, hợp bàn làm việc.",
    price: 45000,
    category: "Sen đá",
    stock: 24,
    icon: "🌵",
  },
  {
    id: "p3",
    name: "Lưỡi hổ vàng",
    desc: "Nhả oxy vào ban đêm cực tốt, chịu hạn và bóng râm cao, hợp đặt phòng ngủ hoặc bàn học.",
    price: 95000,
    category: "Cây lớn",
    stock: 15,
    icon: "🪴",
  },
  {
    id: "p4",
    name: "Xương rồng tai thỏ",
    desc: "Dáng tai thỏ ngộ nghĩnh, sức sống bền bỉ, mang lại cảm giác bình yên nơi góc làm việc.",
    price: 39000,
    category: "Sen đá",
    stock: 30,
    icon: "🌵",
  },
  {
    id: "p5",
    name: "Trầu bà lá phượng",
    desc: "Dáng rủ leo mềm mại, xanh mượt mà, rất hợp treo giá sách, ban công hoặc kệ tường cao.",
    price: 68000,
    category: "Cây leo",
    stock: 12,
    icon: "🌱",
  },
  {
    id: "p6",
    name: "Chậu gốm nung tay",
    desc: "Chậu đất nung thủ công men mộc, đường kính 14cm, có lỗ thoát nước thoáng khí chống úng rễ.",
    price: 55000,
    category: "Chậu & phụ kiện",
    stock: 20,
    icon: "🏺",
  },
];

export async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL successfully.");

    // 1. Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) DEFAULT '',
        address TEXT,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`desc\` TEXT,
        price INT NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        icon VARCHAR(20) DEFAULT '🌿',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id INT NULL,
        buyer_name VARCHAR(150) NOT NULL,
        buyer_phone VARCHAR(30) NOT NULL,
        buyer_address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Chờ xử lý',
        total INT NOT NULL DEFAULT 0,
        is_hidden TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        qty INT NOT NULL DEFAULT 1,
        INDEX (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Seed Admin user
    const [adminRows] = await connection.query("SELECT id FROM users WHERE username = 'admin'");
    if (adminRows.length === 0) {
      const adminHash = await bcrypt.hash("admin123", 10);
      await connection.query(
        "INSERT INTO users (username, password_hash, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
        ["admin", adminHash, "Chủ Vườn Hải Duy", "0912345678", "Vườn Nhỏ, TP.HCM", "admin"]
      );
      console.log("Seeded default Admin user: admin / admin123");
    }

    // 3. Seed Sample Customer
    const [custRows] = await connection.query("SELECT id FROM users WHERE username = 'khachhang'");
    if (custRows.length === 0) {
      const custHash = await bcrypt.hash("123456", 10);
      await connection.query(
        "INSERT INTO users (username, password_hash, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
        ["khachhang", custHash, "Nguyễn Văn Khách", "0987654321", "123 Đường Cây Xanh, Quận 1, TP.HCM", "customer"]
      );
      console.log("Seeded sample Customer user: khachhang / 123456");
    }

    // 4. Seed Products
    const [prodRows] = await connection.query("SELECT COUNT(*) as count FROM products");
    if (prodRows[0].count === 0) {
      for (const p of SEED_PRODUCTS) {
        await connection.query(
          "INSERT INTO products (id, name, `desc`, price, category, stock, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [p.id, p.name, p.desc, p.price, p.category, p.stock, p.icon]
        );
      }
      console.log("Seeded default plant products.");
    }

    connection.release();
  } catch (err) {
    console.error("Database initialization failed (will retry on next request):", err.message);
  }
}
