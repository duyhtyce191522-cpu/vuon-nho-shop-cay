import { Search, X, Sparkles, Truck, Droplets, Sun } from "lucide-react";

export default function HeroBanner({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  categoryCounts,
  totalProductsCount,
}) {
  return (
    <section
      style={{
        marginBottom: "36px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Hero Showcase Card */}
      <div
        className="glass-panel"
        style={{
          borderRadius: "var(--r-xl)",
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 250, 244, 0.9) 100%)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-md)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          minHeight: "360px",
        }}
      >
        {/* Left Column: Text & Perks */}
        <div
          style={{
            padding: "44px 38px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            zIndex: 2,
          }}
        >
          {/* Nature Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--moss-100)",
              border: "1px solid var(--moss-200)",
              padding: "6px 14px",
              borderRadius: "var(--r-full)",
              width: "fit-content",
              boxShadow: "0 2px 8px rgba(30, 69, 49, 0.06)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--sprout-400)",
                display: "inline-block",
                animation: "pulseGlow 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--forest-800)",
                letterSpacing: "0.2px",
              }}
            >
              🌿 100% Cây khoẻ tuyển chọn tận vườn
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              color: "var(--forest-950)",
              lineHeight: 1.18,
              letterSpacing: "-0.8px",
            }}
          >
            Góc Nhỏ{" "}
            <span
              style={{
                color: "var(--leaf-600)",
                fontStyle: "italic",
                position: "relative",
              }}
            >
              An Yên
            </span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "520px",
            }}
          >
            Thêm một mầm xanh, bớt một âu lo. Bộ sưu tập cây nội thất, sen đá và chậu thủ công
            được chăm chút kỹ lưỡng, sẵn sàng đồng hành cùng không gian sống của bạn.
          </p>

          {/* Quick Perks Strip */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              paddingTop: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "var(--forest-800)" }}>
              <Truck size={16} color="var(--leaf-600)" />
              <span>Giao hoả tốc trong ngày</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "var(--forest-800)" }}>
              <Sun size={16} color="var(--amber-500)" />
              <span>Đã dưỡng thích nghi tốt</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "var(--forest-800)" }}>
              <Droplets size={16} color="var(--sprout-400)" />
              <span>Bảo hành 1 đổi 1 trong 7 ngày</span>
            </div>
          </div>
        </div>

        {/* Right Column: Botanical Artwork Image */}
        <div
          style={{
            height: "100%",
            minHeight: "360px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/478422kzG/anh-mo-ta.png"
            alt="Vườn Nhỏ của Yến Duy - Cây xanh & Chậu gốm"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Gradient Overlay blend */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 25%, rgba(22,51,36,0.08) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Floating Organic Quote Pill */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(12px)",
              padding: "8px 16px",
              borderRadius: "var(--r-full)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--forest-900)",
              animation: "floatSlow 4s ease-in-out infinite",
            }}
          >
            <Sparkles size={14} color="var(--amber-500)" />
            <span>Có {totalProductsCount} loài cây & phụ kiện đang sẵn hàng</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Search Bar with Focus Glow */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "var(--surface)",
              border: "1.5px solid var(--border-light)",
              borderRadius: "var(--r-full)",
              padding: "10px 20px",
              boxShadow: "var(--shadow-xs)",
              transition: "all var(--tr-normal)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--sprout-400)";
              e.currentTarget.style.boxShadow = "var(--shadow-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.boxShadow = "var(--shadow-xs)";
            }}
          >
            <Search size={18} color="var(--leaf-600)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên cây, đặc tính (trầu bà, sen đá, lọc không khí...)"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "14.5px",
                background: "transparent",
                color: "var(--text-main)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  color: "var(--text-light)",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  borderRadius: "50%",
                }}
                title="Xóa tìm kiếm"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Carousel / Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
            padding: "4px 0",
          }}
        >
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${isActive ? "active" : ""}`}
              >
                <span>{cat}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: "999px",
                    background: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--moss-100)",
                    color: isActive ? "white" : "var(--forest-800)",
                    transition: "all var(--tr-fast)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
