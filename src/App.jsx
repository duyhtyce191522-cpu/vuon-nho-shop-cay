import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import OrdersMineView from "./components/OrdersMineView";
import AdminDashboard from "./components/AdminDashboard";
import ProductFormModal from "./components/ProductFormModal";
import AuthModal from "./components/AuthModal";
import NatureBackground from "./components/NatureBackground";
import Toast from "./components/Toast";
import { getStorage, setStorage } from "./utils/storage";
import { Sprout, Phone, MapPin } from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

const CATS = [
  "Tất cả",
  "Cây lớn",
  "Cây leo",
  "Sen đá",
  "Chậu & phụ kiện",
];

export default function PlantShop() {
  const [view, setView] = useState("shop");
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState([]);
  const [hiddenOrderIds, setHiddenOrderIds] = useState(() => getStorage("admin-hidden-orders", []));
  const [myOrderIds, setMyOrderIds] = useState(() => getStorage("my-order-ids", []));
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart");

  // User Authentication states
  const [currentUser, setCurrentUser] = useState(() => getStorage("vuon-nho-user", null));
  const [authToken, setAuthToken] = useState(() => getStorage("vuon-nho-token", null));
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [buyer, setBuyer] = useState(() => {
    const savedUser = getStorage("vuon-nho-user", null);
    return {
      name: savedUser?.full_name || savedUser?.username || "",
      phone: savedUser?.phone || "",
      address: savedUser?.address || "",
    };
  });

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Admin states
  const [adminAuthed, setAdminAuthed] = useState(() => {
    const savedUser = getStorage("vuon-nho-user", null);
    return savedUser?.role === "admin";
  });
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Show Toast notification
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2400);
  }

  // Auth Handlers
  function handleLoginSuccess(user, token) {
    setCurrentUser(user);
    setAuthToken(token);
    setStorage("vuon-nho-user", user);
    setStorage("vuon-nho-token", token);
    if (user.role === "admin") {
      setAdminAuthed(true);
    }
    setBuyer({
      name: user.full_name || user.username || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    showToast(`Đăng nhập thành công! Chào ${user.full_name || user.username} 🌿`);
  }

  function handleUserLogout() {
    setCurrentUser(null);
    setAuthToken(null);
    setStorage("vuon-nho-user", null);
    setStorage("vuon-nho-token", null);
    setAdminAuthed(false);
    if (view === "admin") setView("shop");
    showToast("Đã đăng xuất tài khoản");
  }

  // Load Products & Orders from Backend
  useEffect(() => {
    async function loadData() {
      try {
        const [productRes, orderRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/orders`),
        ]);

        if (productRes.status === "fulfilled" && productRes.value.ok) {
          const productData = await productRes.value.json();
          setProducts(productData);
        } else {
          throw new Error("Không thể kết nối Backend");
        }

        if (orderRes.status === "fulfilled" && orderRes.value.ok) {
          const orderData = await orderRes.value.json();
          setOrders(orderData);
        }
      } catch (error) {
        console.warn("Backend offline or unreachable, using fallback seed data:", error.message);
        setProducts(SEED_PRODUCTS);
        setOrders([]);
        showToast("Đang chạy chế độ demo (Dữ liệu mẫu vườn)");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate Cart Items
  const cartItems = useMemo(() => {
    if (!products) return [];
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find((p) => String(p.id) === String(id));
        if (!product) return null;
        return {
          ...product,
          qty,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Add to cart
  function addToCart(id) {
    const product = products?.find((p) => String(p.id) === String(id));
    if (!product) return;

    if (product.stock <= 0) {
      showToast("Sản phẩm đã tạm hết hàng");
      return;
    }

    setCart((current) => {
      const currentQty = current[id] || 0;
      if (currentQty >= product.stock) {
        showToast(`Đã chọn tối đa số lượng trong kho (${product.stock} chậu)`);
        return current;
      }
      showToast(`Đã thêm "${product.name}" vào giỏ`);
      return {
        ...current,
        [id]: currentQty + 1,
      };
    });
  }

  // Change quantity in cart
  function changeQty(id, delta) {
    setCart((current) => {
      const currentQty = current[id] || 0;
      const nextQty = currentQty + delta;
      if (nextQty <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }

      const product = products?.find((p) => String(p.id) === String(id));
      if (product && nextQty > product.stock) {
        showToast(`Kho chỉ còn ${product.stock} chậu`);
        return current;
      }

      return {
        ...current,
        [id]: nextQty,
      };
    });
  }

  // Remove from cart
  function removeFromCart(id) {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    showToast("Đã xóa sản phẩm khỏi giỏ hàng");
  }

  // Place Order
  async function placeOrder() {
    if (!buyer.name.trim() || !buyer.phone.trim() || !buyer.address.trim()) {
      showToast("Vui lòng điền đủ thông tin giao nhận");
      return;
    }

    if (cartItems.length === 0) {
      showToast("Giỏ hàng đang trống");
      return;
    }

    const orderPayload = {
      userId: currentUser?.id || null,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      total: cartTotal,
      buyer: {
        name: buyer.name.trim(),
        phone: buyer.phone.trim(),
        address: buyer.address.trim(),
      },
      createdAt: new Date().toISOString(),
      status: "Chờ xử lý",
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      let savedOrder;
      if (response.ok) {
        savedOrder = await response.json();
      } else {
        // Fallback for offline simulation
        savedOrder = {
          ...orderPayload,
          id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        };
      }

      // Update my order ids in localStorage
      const nextMyOrderIds = [savedOrder.id, ...(myOrderIds || [])];
      setMyOrderIds(nextMyOrderIds);
      setStorage("my-order-ids", nextMyOrderIds);

      // Add to orders state
      setOrders((current) => [savedOrder, ...(current || [])]);

      // Deduct stock locally
      setProducts((current) =>
        (current || []).map((p) => {
          const bought = orderPayload.items.find((item) => String(item.productId) === String(p.id));
          if (bought) {
            return { ...p, stock: Math.max(0, p.stock - bought.qty) };
          }
          return p;
        })
      );

      // Clear Cart and proceed to 'done'
      setCart({});
      setCheckoutStep("done");
      showToast("Đặt hàng thành công!");
    } catch (error) {
      console.error("Place order fallback:", error);
      // Offline fallback order
      const fallbackOrder = {
        ...orderPayload,
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      };
      const nextMyOrderIds = [fallbackOrder.id, ...(myOrderIds || [])];
      setMyOrderIds(nextMyOrderIds);
      setStorage("my-order-ids", nextMyOrderIds);
      setOrders((current) => [fallbackOrder, ...(current || [])]);
      setCart({});
      setCheckoutStep("done");
      showToast("Đặt hàng thành công (Chế độ offline)");
    }
  }

  function resetCheckout() {
    setCheckoutStep("cart");
    setCartOpen(false);
    if (!currentUser) {
      setBuyer({ name: "", phone: "", address: "" });
    } else {
      setBuyer({
        name: currentUser.full_name || currentUser.username || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }

  // Update order status
  async function updateOrderStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrders((current) =>
          (current || []).map((o) => (String(o.id) === String(updated.id) ? updated : o))
        );
      } else {
        // Fallback local update
        setOrders((current) =>
          (current || []).map((o) => (String(o.id) === String(id) ? { ...o, status } : o))
        );
      }
      showToast("Đã cập nhật trạng thái đơn hàng");
    } catch (error) {
      console.warn("Update status offline fallback:", error);
      setOrders((current) =>
        (current || []).map((o) => (String(o.id) === String(id) ? { ...o, status } : o))
      );
      showToast("Đã cập nhật trạng thái đơn hàng (Demo)");
    }
  }

  // Soft delete (hide) order without deleting from database
  function hideOrder(orderId) {
    const nextHidden = [...new Set([...(hiddenOrderIds || []), String(orderId)])];
    setHiddenOrderIds(nextHidden);
    setStorage("admin-hidden-orders", nextHidden);
    showToast("Đã xóa đơn hàng #" + orderId + " khỏi hệ thống (chỉ ẩn, database vẫn giữ)");
  }

  function unhideAllOrders() {
    setHiddenOrderIds([]);
    setStorage("admin-hidden-orders", []);
    showToast("Đã khôi phục hiển thị tất cả đơn hàng");
  }

  // Delete product
  async function deleteProduct(id) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok || !response.ok) {
        setProducts((current) => (current || []).filter((p) => String(p.id) !== String(id)));
        setCart((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
        showToast("Đã xóa sản phẩm thành công");
      }
    } catch (error) {
      console.warn("Delete offline fallback:", error);
      setProducts((current) => (current || []).filter((p) => String(p.id) !== String(id)));
      showToast("Đã xóa sản phẩm (Demo)");
    }
  }

  // Create or update product
  async function upsertProduct(product) {
    try {
      const isEditing = Boolean(product.id);
      const url = isEditing ? `${API_URL}/api/products/${product.id}` : `${API_URL}/api/products`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      let saved;
      if (response.ok) {
        saved = await response.json();
      } else {
        saved = {
          ...product,
          id: product.id || "p_" + Date.now(),
        };
      }

      setProducts((current) => {
        if (isEditing) {
          return (current || []).map((p) => (String(p.id) === String(saved.id) ? saved : p));
        }
        return [saved, ...(current || [])];
      });

      setEditingProduct(null);
      setShowForm(false);
      showToast(isEditing ? "Đã cập nhật sản phẩm" : "Đã thêm cây cảnh mới vào vườn");
    } catch (error) {
      console.warn("Upsert offline fallback:", error);
      const saved = {
        ...product,
        id: product.id || "p_" + Date.now(),
      };
      setProducts((current) => {
        if (product.id) {
          return (current || []).map((p) => (String(p.id) === String(saved.id) ? saved : p));
        }
        return [saved, ...(current || [])];
      });
      setEditingProduct(null);
      setShowForm(false);
      showToast("Đã lưu sản phẩm (Demo)");
    }
  }

  // Admin login handler
  function handleAdminLogin() {
    if (pwInput === "admin123") {
      setAdminAuthed(true);
      setPwError(false);
      showToast("Đăng nhập quản trị thành công");
    } else {
      setPwError(true);
    }
  }

  function handleAdminLogout() {
    setAdminAuthed(false);
    setPwInput("");
    showToast("Đã đăng xuất quản trị");
  }

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      const matchCat = cat === "Tất cả" || p.category === cat;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, cat, search]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { "Tất cả": (products || []).length };
    (products || []).forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // My Orders list
  const myOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      const isStoredLocal = (myOrderIds || []).some((id) => String(id) === String(order.id));
      const isUserOrder = currentUser?.id && String(order.userId) === String(currentUser.id);
      return isStoredLocal || isUserOrder;
    });
  }, [orders, myOrderIds, currentUser]);

  return (
    <div className="app-wrapper">
      {/* Floating Botanical Background Elements */}
      <NatureBackground />

      {/* Top Glass Navbar */}
      <Navbar
        currentView={view}
        onSelectView={setView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleUserLogout}
      />

      {/* Main App Content Body */}
      <main className="main-content">
        {/* VIEW 1: SHOP CATALOG */}
        {view === "shop" && (
          <>
            <HeroBanner
              search={search}
              setSearch={setSearch}
              selectedCategory={cat}
              setSelectedCategory={setCat}
              categories={CATS}
              categoryCounts={categoryCounts}
              totalProductsCount={(products || []).length}
            />

            {/* Products Grid */}
            {loading ? (
              <div
                style={{
                  padding: "60px 0",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "3px solid var(--border-light)",
                    borderTopColor: "var(--leaf-600)",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Đang tải danh sách cây cảnh...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: "60px 20px",
                  borderRadius: "var(--r-xl)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <span style={{ fontSize: "48px" }}>🔍</span>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--forest-900)" }}>
                  Không tìm thấy chậu cây phù hợp
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "340px" }}>
                  Hãy thử tìm bằng từ khóa khác hoặc chọn danh mục "Tất cả" bạn nhé.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCat("Tất cả");
                  }}
                  className="btn-nature-secondary"
                >
                  <span>Xem tất cả cây</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "22px",
                }}
              >
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    cartQty={cart[p.id] || 0}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: MY ORDERS */}
        {view === "orders" && (
          <OrdersMineView
            orders={myOrders}
            onBrowseShop={() => setView("shop")}
          />
        )}

        {/* VIEW 3: ADMIN DASHBOARD */}
        {view === "admin" && (
          <AdminDashboard
            authed={adminAuthed}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            pwInput={pwInput}
            setPwInput={setPwInput}
            pwError={pwError}
            products={products || []}
            orders={orders || []}
            onDeleteProduct={deleteProduct}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onAddNewProduct={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            onUpdateOrderStatus={updateOrderStatus}
            hiddenOrderIds={hiddenOrderIds || []}
            onHideOrder={hideOrder}
            onUnhideAllOrders={unhideAllOrders}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        step={checkoutStep}
        items={cartItems}
        total={cartTotal}
        buyer={buyer}
        setBuyer={setBuyer}
        onClose={() => {
          setCartOpen(false);
          if (checkoutStep === "done") resetCheckout();
        }}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => setCheckoutStep("form")}
        onBackToCart={() => setCheckoutStep("cart")}
        onPlaceOrder={placeOrder}
        onDone={resetCheckout}
      />

      {/* Modal Add/Edit Product */}
      {showForm && (
        <ProductFormModal
          initialProduct={editingProduct}
          categories={CATS}
          onSave={upsertProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        apiUrl={API_URL}
      />

      {/* Toast Notification */}
      <Toast message={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-light)",
          background: "var(--surface)",
          padding: "36px 20px 28px",
          marginTop: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--r-sm)",
                background: "var(--forest-900)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sprout size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--forest-950)" }}>
                Vườn Nhỏ của Yến Duy
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Mang thiên nhiên xanh mát đến từng góc bàn của bạn
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              fontSize: "12.5px",
              color: "var(--text-muted)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} color="var(--leaf-600)" />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Phone size={14} color="var(--leaf-600)" />
              <span>Hotline / Zalo: 0912 345 678</span>
            </div>
            <span>© {new Date().getFullYear()} Vườn Nhỏ Shop Cây</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
