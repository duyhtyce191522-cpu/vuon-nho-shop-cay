import { useState } from "react";
import { Lock, Plus, Pencil, Trash2, ShieldCheck, LogOut, Package, TrendingUp, ShoppingBag, Sprout, Clock } from "lucide-react";
import { formatVND, formatDateTimeVN } from "../utils/formatters";

export default function AdminDashboard({
  authed,
  onLogin,
  onLogout,
  pwInput,
  setPwInput,
  pwError,
  products,
  orders,
  onDeleteProduct,
  onEditProduct,
  onAddNewProduct,
  onUpdateOrderStatus,
}) {
  const [adminTab, setAdminTab] = useState("products"); // "products" | "orders"

  // ------------------------------------------------------------
  // 1. LOGIN SCREEN
  // ------------------------------------------------------------
  if (!authed) {
    return (
      <div
        style={{
          maxWidth: "420px",
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "36px 30px",
            borderRadius: "var(--r-xl)",
            background: "var(--surface)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--moss-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(22, 51, 36, 0.1)",
            }}
          >
            <Lock size={26} color="var(--forest-900)" />
          </div>

          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--forest-950)",
              }}
            >
              Đăng Nhập Quản Trị
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              Khu vực dành cho chủ vườn quản lý sản phẩm & đơn hàng
            </p>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onLogin();
              }}
              placeholder="Nhập mật khẩu quản trị..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--r-md)",
                border: `1.5px solid ${pwError ? "var(--terracotta-500)" : "var(--border-light)"}`,
                fontSize: "14.5px",
                textAlign: "center",
                background: "var(--surface)",
              }}
            />

            {pwError && (
              <p style={{ fontSize: "12px", color: "var(--terracotta-500)", fontWeight: 600 }}>
                Mật khẩu chưa đúng. Vui lòng kiểm tra lại.
              </p>
            )}

            <button
              onClick={onLogin}
              className="btn-nature-primary"
              style={{ width: "100%", padding: "12px", fontSize: "14.5px", marginTop: "4px" }}
            >
              <ShieldCheck size={17} />
              <span>Đăng nhập hệ thống</span>
            </button>
          </div>

          <span style={{ fontSize: "11.5px", color: "var(--text-light)" }}>
            Gợi ý mật khẩu demo: <strong>admin123</strong>
          </span>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // 2. DASHBOARD METRICS CALCULATIONS
  // ------------------------------------------------------------
  const totalRevenue = orders
    .filter((o) => o.status !== "Đã huỷ")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Chờ xử lý").length;

  return (
    <div
      style={{
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "10px 0 60px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--forest-950)",
              lineHeight: 1.2,
            }}
          >
            Bảng Quản Trị Vườn Nhỏ
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            Cập nhật kho cây, thông tin sản phẩm và trạng thái đơn hàng của khách
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onAddNewProduct}
            className="btn-nature-primary"
          >
            <Plus size={16} />
            <span>Thêm sản phẩm mới</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-nature-secondary"
            title="Đăng xuất"
          >
            <LogOut size={15} />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* 3 Overview Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Metric 1: Revenue */}
        <div
          className="interactive-card glass-panel"
          style={{
            padding: "22px 24px",
            borderRadius: "var(--r-lg)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--r-md)",
              background: "var(--moss-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={24} color="var(--forest-900)" />
          </div>
          <div>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)" }}>
              Tổng Doanh Thu Đơn
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--forest-950)", marginTop: "2px" }}>
              {formatVND(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div
          className="interactive-card glass-panel"
          style={{
            padding: "22px 24px",
            borderRadius: "var(--r-lg)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--r-md)",
              background: "var(--amber-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={24} color="var(--amber-500)" />
          </div>
          <div>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)" }}>
              Tổng Số Đơn Hàng
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--forest-950)", marginTop: "2px" }}>
              {orders.length} đơn{" "}
              {pendingOrdersCount > 0 && (
                <span style={{ fontSize: "12px", color: "var(--amber-500)", fontWeight: 700 }}>
                  ({pendingOrdersCount} chờ)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 3: Products */}
        <div
          className="interactive-card glass-panel"
          style={{
            padding: "22px 24px",
            borderRadius: "var(--r-lg)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--r-md)",
              background: "var(--terracotta-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sprout size={24} color="var(--terracotta-500)" />
          </div>
          <div>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)" }}>
              Chủng Loại & Tồn Kho
            </span>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--forest-950)", marginTop: "2px" }}>
              {products.length} loại ({totalStockCount} cây)
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border-light)",
          paddingBottom: "12px",
        }}
      >
        <button
          onClick={() => setAdminTab("products")}
          className={`category-pill ${adminTab === "products" ? "active" : ""}`}
        >
          <Package size={15} />
          <span>Danh sách sản phẩm ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("orders")}
          className={`category-pill ${adminTab === "orders" ? "active" : ""}`}
        >
          <Clock size={15} />
          <span>Quản lý đơn hàng ({orders.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PRODUCTS TABLE */}
      {adminTab === "products" && (
        <div
          className="glass-panel"
          style={{
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            background: "var(--surface)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13.5px",
                minWidth: "680px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--bg-canvas)",
                    borderBottom: "1.5px solid var(--border-light)",
                    color: "var(--forest-900)",
                  }}
                >
                  <th style={{ padding: "14px 18px", width: "50px" }}></th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Tên cây cảnh</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Danh mục</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Giá bán</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700 }}>Tồn kho</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                      transition: "background var(--tr-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--moss-50)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 18px", fontSize: "24px", textAlign: "center" }}>
                      {p.icon || "🌿"}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--forest-950)" }}>{p.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.desc}
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        style={{
                          background: "var(--moss-100)",
                          color: "var(--forest-800)",
                          padding: "3px 10px",
                          borderRadius: "var(--r-full)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "var(--forest-900)" }}>
                      {formatVND(p.price)}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: p.stock > 0 ? "var(--forest-800)" : "var(--terracotta-500)",
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => onEditProduct(p)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--r-sm)",
                            background: "var(--moss-100)",
                            color: "var(--forest-900)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                          }}
                        >
                          <Pencil size={13} />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--r-sm)",
                            background: "var(--terracotta-100)",
                            color: "var(--terracotta-500)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ORDERS MANAGEMENT */}
      {adminTab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--r-lg)", textAlign: "center", color: "var(--text-muted)" }}>
              Chưa có đơn hàng nào từ khách.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="interactive-card glass-panel"
                style={{
                  padding: "18px 22px",
                  borderRadius: "var(--r-lg)",
                  background: "var(--surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--forest-950)", fontSize: "15px" }}>
                      {order.buyer?.name} · {order.buyer?.phone}
                    </span>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Địa chỉ: {order.buyer?.address}
                    </div>
                  </div>

                  {/* Status update dropdown */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>Trạng thái:</span>
                    <select
                      value={order.status || "Chờ xử lý"}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--r-md)",
                        border: "1.5px solid var(--border-light)",
                        fontSize: "13px",
                        fontWeight: 600,
                        background:
                          order.status === "Hoàn tất"
                            ? "var(--moss-100)"
                            : order.status === "Đang giao"
                            ? "#EFF6FF"
                            : order.status === "Đã huỷ"
                            ? "var(--terracotta-100)"
                            : "var(--amber-100)",
                        color:
                          order.status === "Hoàn tất"
                            ? "var(--leaf-600)"
                            : order.status === "Đang giao"
                            ? "#2563EB"
                            : order.status === "Đã huỷ"
                            ? "var(--terracotta-500)"
                            : "var(--amber-500)",
                      }}
                    >
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn tất">Hoàn tất</option>
                      <option value="Đã huỷ">Đã huỷ</option>
                    </select>
                  </div>
                </div>

                {/* Items preview */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--forest-800)",
                    background: "var(--bg-canvas)",
                    padding: "8px 12px",
                    borderRadius: "var(--r-sm)",
                  }}
                >
                  {(order.items || []).map((it) => `${it.name} (×${it.qty})`).join(" · ")}
                </div>

                {/* Footer of card */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "var(--text-light)",
                  }}
                >
                  <span>Mã đơn: #{order.id} · {formatDateTimeVN(order.createdAt || new Date())}</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--forest-950)" }}>
                    {formatVND(order.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
