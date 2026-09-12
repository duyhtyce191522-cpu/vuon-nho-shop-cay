import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool, initDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "vuon_nho_secret_key_2026";

app.use(cors());
app.use(express.json());

// Initialize database tables on startup
initDB();

// ----------------------------------------------------
// Middleware: Verify JWT Token (Optional or Required)
// ----------------------------------------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Không có quyền truy cập. Vui lòng đăng nhập." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ." });
  }
}

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, full_name, phone, address } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: "Vui lòng nhập đủ Tên đăng nhập, Mật khẩu và Họ tên." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu cần tối thiểu 6 ký tự." });
    }

    // Check if username already taken
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [username.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác." });
    }

    // Hash password & insert
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, 'customer')",
      [username.trim(), password_hash, full_name.trim(), phone?.trim() || "", address?.trim() || ""]
    );

    const newUser = {
      id: result.insertId,
      username: username.trim(),
      full_name: full_name.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      role: "customer",
    };

    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: "30d" });

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Lỗi máy chủ khi đăng ký tài khoản." });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Vui lòng nhập Tên đăng nhập và Mật khẩu." });
    }

    const [rows] = await pool.query(
      "SELECT id, username, password_hash, full_name, phone, address, role FROM users WHERE username = ? OR phone = ?",
      [username.trim(), username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Tài khoản không tồn tại." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu chưa chính xác. Vui lòng thử lại." });
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      message: "Đăng nhập thành công!",
      user: userInfo,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Lỗi máy chủ khi đăng nhập." });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, full_name, phone, address, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy thông tin người dùng." });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi lấy thông tin tài khoản." });
  }
});

// ----------------------------------------------------
// 2. PRODUCTS ENDPOINTS
// ----------------------------------------------------

// GET /api/products
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id ASC");
    return res.json(rows);
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ error: "Lỗi tải danh sách sản phẩm." });
  }
});

// POST /api/products
app.post("/api/products", async (req, res) => {
  try {
    const { id, name, desc, price, category, stock, icon } = req.body;
    const prodId = id || "p-" + Date.now();

    await pool.query(
      "INSERT INTO products (id, name, `desc`, price, category, stock, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [prodId, name, desc || "", Number(price) || 0, category || "Sen đá", Number(stock) || 0, icon || "🌿"]
    );

    const [created] = await pool.query("SELECT * FROM products WHERE id = ?", [prodId]);
    return res.status(201).json(created[0]);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ error: "Lỗi tạo sản phẩm mới." });
  }
});

// PUT /api/products/:id
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, desc, price, category, stock, icon } = req.body;
    await pool.query(
      "UPDATE products SET name = ?, `desc` = ?, price = ?, category = ?, stock = ?, icon = ? WHERE id = ?",
      [name, desc || "", Number(price) || 0, category, Number(stock) || 0, icon || "🌿", req.params.id]
    );

    const [updated] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    return res.json(updated[0]);
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ error: "Lỗi cập nhật sản phẩm." });
  }
});

// DELETE /api/products/:id
app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ error: "Lỗi xóa sản phẩm." });
  }
});

// ----------------------------------------------------
// 3. ORDERS ENDPOINTS
// ----------------------------------------------------

// GET /api/orders
app.get("/api/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = "SELECT * FROM orders WHERE is_hidden = 0";
    const params = [];

    if (userId) {
      query += " AND user_id = ?";
      params.push(userId);
    }

    query += " ORDER BY created_at DESC";

    const [orders] = await pool.query(query, params);

    // Fetch items for each order
    const orderIds = orders.map((o) => o.id);
    let allItems = [];
    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => "?").join(",");
      const [items] = await pool.query(
        `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
        orderIds
      );
      allItems = items;
    }

    const result = orders.map((order) => {
      const items = allItems.filter((it) => it.order_id === order.id);
      return {
        id: order.id,
        userId: order.user_id,
        buyer: {
          name: order.buyer_name,
          phone: order.buyer_phone,
          address: order.buyer_address,
        },
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
        items: items.map((it) => ({
          productId: it.product_id,
          name: it.name,
          price: it.price,
          qty: it.qty,
        })),
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Get orders error:", err);
    return res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng." });
  }
});

// POST /api/orders
app.post("/api/orders", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, userId, buyer, items, total, status } = req.body;
    const orderId = id || "ORD-" + Math.floor(100000 + Math.random() * 900000);

    await connection.query(
      "INSERT INTO orders (id, user_id, buyer_name, buyer_phone, buyer_address, status, total) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        userId || null,
        buyer?.name?.trim() || "Khách",
        buyer?.phone?.trim() || "",
        buyer?.address?.trim() || "",
        status || "Chờ xử lý",
        Number(total) || 0,
      ]
    );

    // Insert items & decrement stock
    if (Array.isArray(items)) {
      for (const it of items) {
        await connection.query(
          "INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES (?, ?, ?, ?, ?)",
          [orderId, it.productId || it.id || "", it.name || "", Number(it.price) || 0, Number(it.qty) || 1]
        );

        if (it.productId || it.id) {
          await connection.query(
            "UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?",
            [Number(it.qty) || 1, it.productId || it.id]
          );
        }
      }
    }

    await connection.commit();

    const savedOrder = {
      id: orderId,
      userId: userId || null,
      buyer,
      items: items || [],
      total: Number(total) || 0,
      status: status || "Chờ xử lý",
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json(savedOrder);
  } catch (err) {
    await connection.rollback();
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Lỗi khi lưu đơn hàng." });
  } finally {
    connection.release();
  }
});

// PUT /api/orders/:id/status
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);

    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy đơn hàng." });

    const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [req.params.id]);
    const order = rows[0];

    return res.json({
      id: order.id,
      userId: order.user_id,
      buyer: {
        name: order.buyer_name,
        phone: order.buyer_phone,
        address: order.buyer_address,
      },
      status: order.status,
      total: order.total,
      createdAt: order.created_at,
      items: items.map((it) => ({
        productId: it.product_id,
        name: it.name,
        price: it.price,
        qty: it.qty,
      })),
    });
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ error: "Lỗi cập nhật trạng thái đơn hàng." });
  }
});

// PUT /api/orders/:id/hide (Soft delete / Hide without deleting DB record)
app.put("/api/orders/:id/hide", async (req, res) => {
  try {
    await pool.query("UPDATE orders SET is_hidden = 1 WHERE id = ?", [req.params.id]);
    return res.json({ success: true, message: "Đã ẩn đơn hàng khỏi hệ thống (database vẫn giữ)." });
  } catch (err) {
    console.error("Hide order error:", err);
    return res.status(500).json({ error: "Lỗi ẩn đơn hàng." });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Vuon Nho Backend API", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Vuon Nho Backend Server running on http://localhost:${PORT}`);
});
