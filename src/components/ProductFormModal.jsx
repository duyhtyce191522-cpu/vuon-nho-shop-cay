import { useState } from "react";
import { X, Save, Sprout } from "lucide-react";

const EMOJI_OPTIONS = ["🌿", "🌵", "🪴", "🌱", "🏺", "🎋", "🍃", "🍀", "🌸", "🌺", "🌾"];

export default function ProductFormModal({
  initialProduct,
  categories,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(
    initialProduct || {
      name: "",
      desc: "",
      price: "",
      category: categories[1] || "Cây lớn",
      stock: "",
      icon: "🌿",
    }
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Vui lòng nhập tên sản phẩm";
    if (form.price === "" || Number(form.price) < 0) errs.price = "Giá tiền không hợp lệ";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Số lượng tồn kho không hợp lệ";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      desc: form.desc ? form.desc.trim() : "",
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      icon: form.icon || "🌱",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(13, 30, 21, 0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          background: "var(--surface)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          animation: "modalZoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
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
              <Sprout size={18} color="var(--forest-900)" />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "19px",
                fontWeight: 700,
                color: "var(--forest-950)",
              }}
            >
              {initialProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Cây Cảnh Mới"}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "50%",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Choose Emoji Icon */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "8px" }}>
              Biểu tượng đại diện
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setForm({ ...form, icon: emoji })}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "var(--r-md)",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: form.icon === emoji ? "var(--moss-100)" : "var(--bg-canvas)",
                    border: `1.5px solid ${form.icon === emoji ? "var(--leaf-600)" : "var(--border-light)"}`,
                    transform: form.icon === emoji ? "scale(1.1)" : "scale(1)",
                    transition: "all var(--tr-fast)",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
              Tên cây / sản phẩm <span style={{ color: "var(--terracotta-500)" }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Ví dụ: Cây Trầu Bà Đế Vương"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                border: `1.5px solid ${errors.name ? "var(--terracotta-500)" : "var(--border-light)"}`,
                fontSize: "14px",
              }}
            />
            {errors.name && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
              Danh mục
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                border: "1.5px solid var(--border-light)",
                fontSize: "14px",
                background: "var(--surface)",
              }}
            >
              {categories.filter((c) => c !== "Tất cả").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Stock Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                Giá bán (VND) <span style={{ color: "var(--terracotta-500)" }}>*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => {
                  setForm({ ...form, price: e.target.value });
                  if (errors.price) setErrors({ ...errors, price: null });
                }}
                placeholder="150000"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--r-md)",
                  border: `1.5px solid ${errors.price ? "var(--terracotta-500)" : "var(--border-light)"}`,
                  fontSize: "14px",
                }}
              />
              {errors.price && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.price}</p>}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                Tồn kho <span style={{ color: "var(--terracotta-500)" }}>*</span>
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => {
                  setForm({ ...form, stock: e.target.value });
                  if (errors.stock) setErrors({ ...errors, stock: null });
                }}
                placeholder="10"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--r-md)",
                  border: `1.5px solid ${errors.stock ? "var(--terracotta-500)" : "var(--border-light)"}`,
                  fontSize: "14px",
                }}
              />
              {errors.stock && <p style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "4px" }}>{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
              Mô tả & Đặc tính
            </label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Đặc tính ưa sáng, cách tưới nước, vị trí đặt cây phù hợp..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                border: "1.5px solid var(--border-light)",
                fontSize: "14px",
                resize: "none",
              }}
            />
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-nature-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-nature-primary"
            >
              <Save size={16} />
              <span>{initialProduct ? "Cập nhật" : "Lưu sản phẩm"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
