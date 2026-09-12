import { useState } from "react";
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Sprout, User, LogIn } from "lucide-react";
import { formatVND } from "../utils/formatters";

export default function CartDrawer({
  isOpen,
  step,
  items,
  total,
  buyer,
  setBuyer,
  currentUser,
  onOpenAuth,
  onClose,
  onChangeQty,
  onRemove,
  onCheckout,
  onBackToCart,
  onPlaceOrder,
  onDone,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!buyer.name?.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!buyer.phone?.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+ ]{8,15}$/.test(buyer.phone.trim())) {
      errs.phone = "Số điện thoại không hợp lệ";
    }
    if (!buyer.address?.trim()) errs.address = "Vui lòng nhập địa chỉ nhận cây";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onPlaceOrder();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(13, 30, 21, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "opacity var(--tr-normal)",
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          background: "var(--surface)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          animation: "drawerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 2,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-canvas)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--r-sm)",
                background: "var(--moss-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBag size={18} color="var(--forest-900)" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "var(--forest-950)",
                  lineHeight: 1.2,
                }}
              >
                {step === "cart" && "Giỏ Hàng Của Bạn"}
                {step === "form" && "Thông Tin Giao Hàng"}
                {step === "done" && "Đặt Hàng Thành Công!"}
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {step === "cart" && `${items.length} mặt hàng đã chọn`}
                {step === "form" && "Giao tận nơi nhanh chóng"}
                {step === "done" && "Cảm ơn bạn đã yêu thương mầm xanh"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
            style={{
              padding: "8px",
              borderRadius: "50%",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--tr-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--moss-100)";
              e.currentTarget.style.color = "var(--forest-900)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            background: "rgba(22, 51, 36, 0.02)",
            borderBottom: "1px solid var(--border-light)",
            gap: "8px",
          }}
        >
          {["1. Giỏ hàng", "2. Giao hàng", "3. Hoàn tất"].map((s, idx) => {
            const currentIdx = step === "cart" ? 0 : step === "form" ? 1 : 2;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={s}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent
                    ? "var(--forest-900)"
                    : isCompleted
                    ? "var(--leaf-600)"
                    : "var(--text-light)",
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    background: isCurrent
                      ? "var(--forest-900)"
                      : isCompleted
                      ? "var(--moss-200)"
                      : "var(--border-light)",
                    color: isCurrent ? "white" : isCompleted ? "var(--forest-900)" : "var(--text-light)",
                  }}
                >
                  {isCompleted ? "✓" : idx + 1}
                </span>
                <span>{s.split(". ")[1]}</span>
              </div>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* STEP 1: CART ITEMS */}
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "14px",
                    padding: "40px 0",
                  }}
                >
                  <span style={{ fontSize: "56px" }}>🪴</span>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--forest-900)" }}>
                    Giỏ hàng đang trống
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "var(--text-muted)", maxWidth: "260px" }}>
                    Hãy dạo vườn và chọn cho mình những chậu cây ưng ý nhất bạn nhé.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-nature-primary"
                    style={{ marginTop: "8px" }}
                  >
                    <span>Khám phá cây cảnh ngay</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px",
                        borderRadius: "var(--r-md)",
                        border: "1px solid var(--border-light)",
                        background: "var(--surface)",
                        boxShadow: "var(--shadow-xs)",
                      }}
                    >
                      {/* Icon Thumb */}
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "var(--r-sm)",
                          background: "var(--moss-100)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon || "🌿"}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: "14.5px",
                            fontWeight: 700,
                            color: "var(--forest-950)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </h4>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--leaf-600)", marginTop: "2px" }}>
                          {formatVND(item.price)}
                        </div>
                      </div>

                      {/* Quantity Modifier */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "var(--bg-canvas)",
                          padding: "3px",
                          borderRadius: "var(--r-full)",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <button
                          onClick={() => onChangeQty(item.id, -1)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "var(--surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--forest-900)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                          }}
                          aria-label="Giảm số lượng"
                        >
                          {item.qty === 1 ? <Trash2 size={13} color="var(--terracotta-500)" /> : <Minus size={13} />}
                        </button>

                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            minWidth: "18px",
                            textAlign: "center",
                          }}
                        >
                          {item.qty}
                        </span>

                        <button
                          onClick={() => onChangeQty(item.id, 1)}
                          disabled={item.qty >= item.stock}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: item.qty >= item.stock ? "var(--border-light)" : "var(--surface)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--forest-900)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                            cursor: item.qty >= item.stock ? "not-allowed" : "pointer",
                          }}
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(item.id)}
                        title="Xóa khỏi giỏ"
                        style={{
                          color: "var(--text-light)",
                          padding: "4px",
                          transition: "color var(--tr-fast)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--terracotta-500)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light)")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  background: "var(--moss-50)",
                  border: "1px solid var(--moss-200)",
                  borderRadius: "var(--r-md)",
                  padding: "12px 16px",
                  fontSize: "12.5px",
                  color: "var(--forest-800)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ShieldCheck size={18} color="var(--leaf-600)" />
                <span>Thanh toán khi nhận hàng (COD) & kiểm tra cây thoải mái trước khi nhận.</span>
              </div>

              {/* Membership login reminder or status banner */}
              {!currentUser ? (
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(56, 124, 89, 0.08) 0%, rgba(226, 245, 236, 0.6) 100%)",
                    border: "1px solid var(--moss-200)",
                    borderRadius: "var(--r-md)",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--forest-900)" }}>
                    <User size={16} color="var(--leaf-600)" />
                    <span>Đã có tài khoản thành viên?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAuth && onOpenAuth("login")}
                    style={{
                      background: "var(--forest-900)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--r-full)",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all var(--tr-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--leaf-600)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--forest-900)")}
                  >
                    <LogIn size={13} />
                    <span>Đăng nhập</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--moss-100)",
                    border: "1px solid var(--moss-200)",
                    borderRadius: "var(--r-md)",
                    padding: "8px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    color: "var(--forest-950)",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} color="var(--leaf-600)" />
                  <span>
                    Đặt hàng với tài khoản: <strong>{currentUser.full_name || currentUser.username}</strong>
                  </span>
                </div>
              )}

              {/* Input: Name */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                  Họ và tên người nhận <span style={{ color: "var(--terracotta-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={buyer.name}
                  onChange={(e) => {
                    setBuyer({ ...buyer, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--r-md)",
                    border: `1.5px solid ${errors.name ? "var(--terracotta-500)" : "var(--border-light)"}`,
                    fontSize: "14px",
                    background: "var(--surface)",
                  }}
                />
                {errors.name && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.name}</p>}
              </div>

              {/* Input: Phone */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                  Số điện thoại nhận hàng <span style={{ color: "var(--terracotta-500)" }}>*</span>
                </label>
                <input
                  type="tel"
                  value={buyer.phone}
                  onChange={(e) => {
                    setBuyer({ ...buyer, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  placeholder="Ví dụ: 0912 345 678"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--r-md)",
                    border: `1.5px solid ${errors.phone ? "var(--terracotta-500)" : "var(--border-light)"}`,
                    fontSize: "14px",
                    background: "var(--surface)",
                  }}
                />
                {errors.phone && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.phone}</p>}
              </div>

              {/* Input: Address */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                  Địa chỉ giao nhận chi tiết <span style={{ color: "var(--terracotta-500)" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={buyer.address}
                  onChange={(e) => {
                    setBuyer({ ...buyer, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: null });
                  }}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--r-md)",
                    border: `1.5px solid ${errors.address ? "var(--terracotta-500)" : "var(--border-light)"}`,
                    fontSize: "14px",
                    background: "var(--surface)",
                    resize: "none",
                  }}
                />
                {errors.address && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.address}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS */}
          {step === "done" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "16px",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "var(--moss-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(73, 158, 114, 0.3)",
                  animation: "checkmarkPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <CheckCircle2 size={44} color="var(--leaf-600)" />
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--forest-950)",
                }}
              >
                Đặt Hàng Thành Công!
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                }}
              >
                Đơn hàng của bạn đã được ghi nhận. Vườn Nhỏ sẽ chuẩn bị những cây khoẻ nhất
                và gọi điện xác nhận trước khi giao hàng nhé!
              </p>

              <button
                onClick={onDone}
                className="btn-nature-primary"
                style={{ marginTop: "12px", width: "100%", maxWidth: "260px" }}
              >
                <Sprout size={16} />
                <span>Tiếp tục ngắm vườn</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer (Only for step 'cart' and 'form') */}
        {step !== "done" && items.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid var(--border-light)",
              background: "var(--bg-canvas)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Total calculation row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Tổng thanh toán</span>
                <div style={{ fontSize: "11px", color: "var(--leaf-600)", fontWeight: 600 }}>Miễn phí vận chuyển nội thành</div>
              </div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--forest-950)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {formatVND(total)}
              </span>
            </div>

            {/* Action buttons */}
            {step === "cart" && (
              <button
                onClick={onCheckout}
                className="btn-nature-primary"
                style={{ width: "100%", padding: "12px", fontSize: "15px" }}
              >
                <span>Điền thông tin nhận cây</span>
                <ArrowRight size={17} />
              </button>
            )}

            {step === "form" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={onBackToCart}
                  className="btn-nature-secondary"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại</span>
                </button>

                <button
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="btn-nature-primary"
                  style={{ flex: 2 }}
                >
                  <span>{isSubmitting ? "Đang gửi đơn..." : "Xác nhận đặt hàng"}</span>
                  <CheckCircle2 size={17} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
