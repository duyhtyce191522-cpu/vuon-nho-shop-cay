import { useState, useEffect } from "react";
import { Store, ClipboardList, ShieldCheck, ShoppingBag, Sprout } from "lucide-react";
import { formatVND } from "../utils/formatters";

export default function Navbar({
  currentView,
  onSelectView,
  cartCount,
  cartTotal,
  onOpenCart,
}) {
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for glassmorphism shadow intensification
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "shop", label: "Cửa hàng", icon: Store },
    { id: "orders", label: "Đơn của tôi", icon: ClipboardList },
    { id: "admin", label: "Quản trị", icon: ShieldCheck },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all var(--tr-normal)",
        background: scrolled
          ? "rgba(248, 246, 240, 0.94)"
          : "rgba(248, 246, 240, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${scrolled ? "var(--border-light)" : "rgba(22, 51, 36, 0.05)"}`,
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Brand Section */}
        <div
          onClick={() => onSelectView("shop")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--r-md)",
              background: "linear-gradient(135deg, var(--forest-900) 0%, var(--leaf-600) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(22, 51, 36, 0.2)",
              transition: "transform var(--tr-spring)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08) rotate(6deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            }}
          >
            <Sprout size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--forest-950)",
                  letterSpacing: "-0.5px",
                }}
              >
                Vườn Nhỏ
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--leaf-600)",
                  letterSpacing: "-0.5px",
                }}
              >
                Yến Duy
              </span>
            </div>
            <p
              style={{
                fontSize: "11.5px",
                color: "var(--text-muted)",
                fontWeight: 500,
                marginTop: "-2px",
              }}
            >
              Cây cảnh & Gốm đất nung tuyển chọn
            </p>
          </div>
        </div>

        {/* Navigation & Cart Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Nav pills */}
          <nav
            style={{
              display: "flex",
              background: "rgba(22, 51, 36, 0.05)",
              padding: "4px",
              borderRadius: "var(--r-full)",
              gap: "2px",
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "var(--r-full)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isActive ? "var(--text-inverse)" : "var(--text-muted)",
                    background: isActive
                      ? "linear-gradient(135deg, var(--forest-900) 0%, var(--leaf-600) 100%)"
                      : "transparent",
                    boxShadow: isActive ? "0 3px 10px rgba(22, 51, 36, 0.2)" : "none",
                    transition: "all var(--tr-normal)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--forest-900)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Mở giỏ hàng"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 100%)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "var(--r-full)",
              fontSize: "13.5px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(22, 51, 36, 0.2)",
              transition: "all var(--tr-normal)",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(22, 51, 36, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(22, 51, 36, 0.2)";
            }}
          >
            <ShoppingBag size={17} />
            <span style={{ display: "inline-block" }}>Giỏ hàng</span>

            {cartCount > 0 ? (
              <span
                key={cartCount}
                style={{
                  background: "linear-gradient(135deg, var(--terracotta-500) 0%, var(--terracotta-600) 100%)",
                  color: "white",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                  boxShadow: "0 2px 6px rgba(168, 76, 38, 0.35)",
                  animation: "badgePop 0.4s ease",
                }}
              >
                {cartCount}
              </span>
            ) : null}

            {cartTotal > 0 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  opacity: 0.9,
                  borderLeft: "1px solid rgba(255, 255, 255, 0.25)",
                  paddingLeft: "8px",
                  marginLeft: "2px",
                }}
              >
                {formatVND(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
