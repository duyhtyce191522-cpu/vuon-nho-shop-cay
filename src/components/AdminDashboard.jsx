import { useState } from "react";
import {
  Lock,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  LogOut,
  Package,
  TrendingUp,
  ShoppingBag,
  Sprout,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Check,
  X,
  RotateCcw,
  EyeOff,
  Filter,
} from "lucide-react";
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
  hiddenOrderIds = [],
  onHideOrder,
  onUnhideAllOrders,
}) {
  const [adminTab, setAdminTab] = useState("products"); // "products" | "orders"
  const [orderStatusFilter, setOrderStatusFilter] = useState("Tất cả");
  const [editingStatusOrderId, setEditingStatusOrderId] = useState(null);
  const [tempStatus, setTempStatus] = useState("Chờ xử lý");

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
  // 2. DASHBOARD METRICS & ORDERS FILTERING
  // ------------------------------------------------------------
  // Filter out hidden orders (soft-deleted from UI, preserved in DB)
  const visibleOrders = (orders || []).filter(
    (o) => !hiddenOrderIds.includes(String(o.id))
  );

  const countAll = visibleOrders.length;
  const countPending = visibleOrders.filter((o) => (o.status || "Chờ xử lý") === "Chờ xử lý").length;
  const countShipping = visibleOrders.filter((o) => o.status === "Đang giao").length;
  const countCompleted = visibleOrders.filter((o) => o.status === "Hoàn tất").length;
  const countCancelled = visibleOrders.filter((o) => o.status === "Đã huỷ" || o.status === "Đã hủy").length;

  const totalRevenue = visibleOrders
    .filter((o) => o.status !== "Đã huỷ" && o.status !== "Đã hủy")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const pendingOrdersCount = countPending;

  const filteredOrders = visibleOrders.filter((order) => {
    if (orderStatusFilter === "Tất cả") return true;
    if (orderStatusFilter === "Đã huỷ") {
      return order.status === "Đã huỷ" || order.status === "Đã hủy";
    }
    return (order.status || "Chờ xử lý") === orderStatusFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "Đang giao":
        return {
          label: "Đang giao",
          color: "#2563EB",
          bg: "#EFF6FF",
          border: "#BFDBFE",
          icon: Truck,
        };
      case "Hoàn tất":
        return {
          label: "Hoàn tất",
          color: "var(--leaf-600)",
          bg: "var(--moss-100)",
          border: "var(--moss-200)",
          icon: CheckCircle2,
        };
      case "Đã huỷ":
      case "Đã hủy":
        return {
          label: "Đã huỷ",
          color: "var(--terracotta-500)",
          bg: "var(--terracotta-100)",
          border: "rgba(194, 94, 52, 0.25)",
          icon: XCircle,
        };
      case "Chờ xử lý":
      default:
        return {
          label: "Chờ xử lý",
          color: "var(--amber-600)",
          bg: "var(--amber-100)",
          border: "rgba(217, 130, 43, 0.3)",
          icon: Clock,
        };
    }
  };

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
          <span>Quản lý đơn hàng ({visibleOrders.length})</span>
          {countPending > 0 && (
            <span
              style={{
                marginLeft: "4px",
                background: "var(--amber-500)",
                color: "#ffffff",
                padding: "1px 6px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {countPending} mới
            </span>
          )}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Status Filter Tabs Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              background: "var(--surface)",
              padding: "12px 18px",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border-light)",
              boxShadow: "0 2px 6px rgba(22, 51, 36, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--forest-950)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  marginRight: "4px",
                }}
              >
                <Filter size={14} color="var(--leaf-600)" />
                Lọc trạng thái:
              </span>

              {[
                { key: "Tất cả", label: "Tất cả", count: countAll, color: "var(--forest-900)" },
                { key: "Chờ xử lý", label: "Chờ xử lý", count: countPending, color: "var(--amber-600)" },
                { key: "Đang giao", label: "Đang giao", count: countShipping, color: "#2563EB" },
                { key: "Hoàn tất", label: "Hoàn tất", count: countCompleted, color: "var(--leaf-600)" },
                { key: "Đã huỷ", label: "Đã huỷ", count: countCancelled, color: "var(--terracotta-500)" },
              ].map((tab) => {
                const isActive = orderStatusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setOrderStatusFilter(tab.key);
                      setEditingStatusOrderId(null);
                    }}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "var(--r-full)",
                      fontSize: "12.5px",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "var(--forest-900)" : "var(--bg-canvas)",
                      color: isActive ? "#ffffff" : "var(--forest-900)",
                      border: `1px solid ${isActive ? "var(--forest-900)" : "var(--border-light)"}`,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all var(--tr-fast)",
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        padding: "1px 7px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(22, 51, 36, 0.08)",
                        color: isActive ? "#ffffff" : tab.color,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If there are hidden orders, show unhide option */}
            {hiddenOrderIds.length > 0 && onUnhideAllOrders && (
              <button
                onClick={onUnhideAllOrders}
                title="Khôi phục các đơn hàng đã ẩn"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "var(--r-sm)",
                  transition: "color var(--tr-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--forest-900)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <RotateCcw size={12} />
                <span>Hiện lại {hiddenOrderIds.length} đơn đã xóa (ẩn)</span>
              </button>
            )}
          </div>

          {/* Orders List or Empty State */}
          {filteredOrders.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: "48px 24px",
                borderRadius: "var(--r-lg)",
                textAlign: "center",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--bg-canvas)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={22} color="var(--text-light)" />
              </div>
              <div style={{ color: "var(--forest-950)", fontWeight: 600, fontSize: "15px" }}>
                {orderStatusFilter === "Tất cả"
                  ? "Chưa có đơn hàng nào từ khách."
                  : `Không có đơn hàng nào ở trạng thái "${orderStatusFilter}".`}
              </div>
              {orderStatusFilter !== "Tất cả" && (
                <button
                  onClick={() => setOrderStatusFilter("Tất cả")}
                  className="btn-nature-secondary"
                  style={{ padding: "6px 14px", fontSize: "12.5px" }}
                >
                  Xem tất cả đơn hàng ({countAll})
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const StatusIcon = statusCfg.icon;
              const isEditingStatus = editingStatusOrderId === order.id;
              const isCancelled = order.status === "Đã huỷ" || order.status === "Đã hủy";

              return (
                <div
                  key={order.id}
                  className="interactive-card glass-panel"
                  style={{
                    padding: "20px 24px",
                    borderRadius: "var(--r-lg)",
                    background: "var(--surface)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    borderLeft: `4px solid ${statusCfg.color}`,
                  }}
                >
                  {/* Top Bar of Order Card */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, color: "var(--forest-950)", fontSize: "16px" }}>
                          {order.buyer?.name || "Khách hàng"}
                        </span>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
                          · {order.buyer?.phone || "Chưa có SĐT"}
                        </span>
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                        📍 {order.buyer?.address || "Chưa có địa chỉ nhận hàng"}
                      </div>
                    </div>

                    {/* Action Area: Status Badge, Edit Button, Delete Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {!isEditingStatus ? (
                        <>
                          {/* Current Status Badge */}
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "5px 12px",
                              borderRadius: "var(--r-full)",
                              background: statusCfg.bg,
                              border: `1px solid ${statusCfg.border}`,
                              color: statusCfg.color,
                              fontSize: "12.5px",
                              fontWeight: 700,
                            }}
                          >
                            <StatusIcon size={14} />
                            <span>{order.status || "Chờ xử lý"}</span>
                          </div>

                          {/* Nút "Sửa trạng thái" */}
                          <button
                            onClick={() => {
                              setEditingStatusOrderId(order.id);
                              setTempStatus(order.status || "Chờ xử lý");
                            }}
                            title="Đặt lại trạng thái đơn hàng"
                            style={{
                              padding: "5px 10px",
                              borderRadius: "var(--r-sm)",
                              background: "var(--moss-100)",
                              color: "var(--forest-900)",
                              border: "1px solid var(--moss-200)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all var(--tr-fast)",
                            }}
                          >
                            <Pencil size={12} />
                            <span>Sửa</span>
                          </button>

                          {/* Nút "Xóa đơn" (CHỈ HIỆN KHI ĐƠN Ở TRẠNG THÁI ĐÃ HỦY) */}
                          {isCancelled && onHideOrder && (
                            <button
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Bạn có chắc chắn muốn xóa đơn hàng #${order.id} khỏi hệ thống?\n\n(Lưu ý: Đơn hàng chỉ được ẩn đi khỏi danh sách quản lý, hoàn toàn KHÔNG xóa trong database)`
                                );
                                if (confirmed) {
                                  onHideOrder(order.id);
                                }
                              }}
                              title="Xóa đơn hàng này khỏi hệ thống (chỉ ẩn đi, không xóa trong database)"
                              style={{
                                padding: "5px 10px",
                                borderRadius: "var(--r-sm)",
                                background: "var(--terracotta-100)",
                                color: "var(--terracotta-500)",
                                border: "1px solid rgba(194, 94, 52, 0.3)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all var(--tr-fast)",
                              }}
                            >
                              <Trash2 size={12} />
                              <span>Xóa đơn</span>
                            </button>
                          )}
                        </>
                      ) : (
                        /* Inline Status Editor */
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "var(--bg-canvas)",
                            padding: "4px 8px",
                            borderRadius: "var(--r-md)",
                            border: "1.5px solid var(--leaf-600)",
                            boxShadow: "0 2px 8px rgba(22, 51, 36, 0.08)",
                          }}
                        >
                          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--forest-900)" }}>
                            Đặt lại:
                          </span>
                          <select
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "var(--r-sm)",
                              border: "1px solid var(--border-light)",
                              fontSize: "12px",
                              fontWeight: 700,
                              background: "#ffffff",
                              color: "var(--forest-950)",
                              cursor: "pointer",
                            }}
                          >
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Đang giao">Đang giao</option>
                            <option value="Hoàn tất">Hoàn tất</option>
                            <option value="Đã huỷ">Đã huỷ</option>
                          </select>

                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, tempStatus);
                              setEditingStatusOrderId(null);
                            }}
                            className="btn-nature-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: "11.5px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                            title="Lưu trạng thái mới"
                          >
                            <Check size={12} />
                            <span>Lưu</span>
                          </button>

                          <button
                            onClick={() => setEditingStatusOrderId(null)}
                            className="btn-nature-secondary"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11.5px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                            title="Hủy bỏ"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--forest-800)",
                      background: "var(--bg-canvas)",
                      padding: "10px 14px",
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Chi tiết sản phẩm ({(order.items || []).reduce((s, it) => s + (it.qty || 1), 0)} món):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {(order.items || []).map((it, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "#ffffff",
                            padding: "4px 10px",
                            borderRadius: "var(--r-sm)",
                            border: "1px solid var(--border-light)",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "var(--forest-950)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>🌿 {it.name}</span>
                          <strong style={{ color: "var(--leaf-600)" }}>×{it.qty}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer of Card */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                      color: "var(--text-light)",
                      borderTop: "1px dashed var(--border-light)",
                      paddingTop: "10px",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <span>
                      Mã đơn: <strong style={{ color: "var(--forest-900)" }}>#{order.id}</strong> · {formatDateTimeVN(order.createdAt || new Date())}
                    </span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Tổng tiền:</span>
                      <span style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--forest-950)" }}>
                        {formatVND(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
