import { useState } from "react";
import { Plus, Heart, Check } from "lucide-react";
import { formatVND } from "../utils/formatters";

export default function ProductCard({
  product,
  cartQty = 0,
  onAddToCart,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = cartQty >= product.stock && !isOutOfStock;

  return (
    <article
      className="interactive-card glass-panel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        position: "relative",
      }}
    >
      {/* Top Media Showcase */}
      <div
        style={{
          height: "170px",
          background: "radial-gradient(circle at center, var(--moss-100) 0%, var(--moss-50) 80%, rgba(248, 246, 240, 0.5) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {/* Animated Botanical Icon */}
        <span
          style={{
            fontSize: "64px",
            filter: "drop-shadow(0 6px 12px rgba(22, 51, 36, 0.14))",
            transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isHovered ? "scale(1.22) rotate(6deg) translateY(-4px)" : "scale(1)",
            display: "inline-block",
          }}
        >
          {product.icon || "🌿"}
        </span>

        {/* Category Pill Over Media */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(6px)",
            padding: "4px 10px",
            borderRadius: "var(--r-full)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--forest-800)",
            boxShadow: "0 2px 6px rgba(22, 51, 36, 0.08)",
            border: "1px solid rgba(22, 51, 36, 0.06)",
          }}
        >
          {product.category}
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          aria-label="Yêu thích sản phẩm"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(22, 51, 36, 0.08)",
            transition: "all var(--tr-fast)",
            animation: isLiked ? "heartBurst 0.45s ease" : "none",
          }}
        >
          <Heart
            size={16}
            color={isLiked ? "var(--terracotta-500)" : "var(--text-light)"}
            fill={isLiked ? "var(--terracotta-500)" : "none"}
          />
        </button>

        {/* Quantity In Cart Badge */}
        {cartQty > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "12px",
              background: "linear-gradient(135deg, var(--forest-900) 0%, var(--leaf-600) 100%)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "var(--r-full)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 6px rgba(22, 51, 36, 0.2)",
            }}
          >
            <Check size={11} strokeWidth={3} />
            <span>Trong giỏ: {cartQty}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: "16px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--forest-950)",
            lineHeight: 1.3,
            transition: "color var(--tr-fast)",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "39px",
          }}
          title={product.desc}
        >
          {product.desc || "Cây cảnh tự nhiên thanh lọc không khí, mang lại sinh khí trong lành cho không gian của bạn."}
        </p>

        {/* Stock & Status Dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "6px",
            borderTop: "1px solid var(--border-light)",
            marginTop: "4px",
          }}
        >
          {/* Price */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", color: "var(--text-light)", fontWeight: 500 }}>Giá niêm yết</span>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 800,
                color: "var(--forest-900)",
                letterSpacing: "-0.3px",
              }}
            >
              {formatVND(product.price)}
            </span>
          </div>

          {/* Stock indicator badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {isOutOfStock ? (
              <span
                style={{
                  color: "var(--terracotta-500)",
                  background: "var(--terracotta-100)",
                  padding: "3px 8px",
                  borderRadius: "var(--r-full)",
                  fontSize: "11px",
                }}
              >
                Tạm hết
              </span>
            ) : product.stock <= 5 ? (
              <span
                style={{
                  color: "var(--amber-500)",
                  background: "var(--amber-100)",
                  padding: "3px 8px",
                  borderRadius: "var(--r-full)",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--amber-500)",
                    animation: "pulseGlowAmber 1.8s infinite",
                  }}
                />
                Còn {product.stock}
              </span>
            ) : (
              <span
                style={{
                  color: "var(--leaf-600)",
                  background: "var(--moss-100)",
                  padding: "3px 8px",
                  borderRadius: "var(--r-full)",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--sprout-400)",
                  }}
                />
                Còn {product.stock}
              </span>
            )}
          </div>
        </div>

        {/* Add To Cart CTA */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={isOutOfStock || isMaxInCart}
          className="btn-nature-primary"
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "9px 12px",
            fontSize: "13.5px",
          }}
        >
          {isOutOfStock ? (
            <span>Tạm hết hàng</span>
          ) : isMaxInCart ? (
            <span>Đã đạt tối đa kho ({product.stock})</span>
          ) : (
            <>
              <Plus size={16} />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
