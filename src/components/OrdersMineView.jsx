import { ClipboardList, Clock, Truck, XCircle, CheckCircle2, MapPin, Store } from "lucide-react";
import { formatVND, formatDateTimeVN } from "../utils/formatters";

export default function OrdersMineView({ orders, onBrowseShop }) {
  const getStatusBadge = (status) => {
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
        return {
          label: "Đã huỷ",
          color: "var(--terracotta-500)",
          bg: "var(--terracotta-100)",
          border: "rgba(194, 94, 52, 0.2)",
          icon: XCircle,
        };
      case "Chờ xử lý":
      default:
        return {
          label: "Chờ xử lý",
          color: "var(--amber-500)",
          bg: "var(--amber-100)",
          border: "rgba(217, 130, 43, 0.25)",
          icon: Clock,
        };
    }
  };

  return (
    <div
      style={{
        maxWidth: "840px",
        margin: "0 auto",
        padding: "16px 0 60px",
      }}
    >
      {/* Header section */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--moss-100)",
            padding: "5px 14px",
            borderRadius: "var(--r-full)",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--forest-800)",
            marginBottom: "10px",
          }}
        >
          <ClipboardList size={14} />
          <span>Theo dõi đơn mua cá nhân</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3vw, 34px)",
            fontWeight: 700,
            color: "var(--forest-950)",
            lineHeight: 1.2,
          }}
        >
          Đơn Hàng Của Tôi
        </h1>

        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>
          Thông tin các chậu cây bạn đã đặt mua tại Vườn Nhỏ của Yến Duy
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "60px 24px",
            borderRadius: "var(--r-xl)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "56px" }}>🌱</span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--forest-900)" }}>
            Bạn chưa có đơn hàng nào
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "340px" }}>
            Khi bạn đặt mua cây cảnh hoặc phụ kiện, danh sách đơn hàng sẽ tự động lưu và hiển thị tại đây.
          </p>
          <button
            onClick={onBrowseShop}
            className="btn-nature-primary"
            style={{ marginTop: "10px" }}
          >
            <Store size={16} />
            <span>Khám phá cây cảnh ngay</span>
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const StatusIcon = badge.icon;

            return (
              <div
                key={order.id}
                className="interactive-card glass-panel"
                style={{
                  borderRadius: "var(--r-lg)",
                  padding: "20px 24px",
                  background: "var(--surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "var(--forest-900)",
                      }}
                    >
                      Mã đơn #{order.id}
                    </span>
                    <span style={{ fontSize: "12.5px", color: "var(--text-light)" }}>
                      · {formatDateTimeVN(order.createdAt || new Date())}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      borderRadius: "var(--r-full)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: badge.color,
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    <StatusIcon size={14} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Items in order */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {(order.items || []).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--leaf-600)", fontWeight: 700 }}>{item.qty}×</span>
                        <span style={{ fontWeight: 600, color: "var(--forest-950)" }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>
                        {formatVND(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Buyer info & Total summary */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                    gap: "12px",
                    paddingTop: "12px",
                    borderTop: "1px dashed var(--border-light)",
                    background: "var(--bg-canvas)",
                    padding: "12px 16px",
                    borderRadius: "var(--r-md)",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ fontWeight: 600, color: "var(--forest-900)" }}>
                      Người nhận: {order.buyer?.name} · {order.buyer?.phone}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                      <MapPin size={13} color="var(--text-light)" />
                      <span>{order.buyer?.address}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11.5px", color: "var(--text-light)" }}>Tổng đơn hàng</span>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "var(--forest-950)",
                      }}
                    >
                      {formatVND(order.total)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
