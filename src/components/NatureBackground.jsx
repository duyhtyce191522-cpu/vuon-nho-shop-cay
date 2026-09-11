import { useState, useMemo } from "react";
import { Leaf, Sparkles } from "lucide-react";

export default function NatureBackground() {
  const [enabled, setEnabled] = useState(true);

  // Generate deterministic leaf particles
  const leaves = useMemo(() => {
    const leafTypes = [
      // Leaf SVG paths or emojis
      "🍃", "🌿", "🌱", "🍂", "🍀"
    ];

    return Array.from({ length: 14 }).map((_, i) => {
      const left = Math.floor((i / 14) * 96 + (Math.sin(i) * 5 + 3));
      const duration = 12 + ((i * 3) % 9); // 12s to 20s
      const delay = (i * 1.7) % 11;
      const size = 16 + (i % 4) * 6; // 16px to 34px
      const opacity = 0.25 + ((i % 5) * 0.1); // 0.25 to 0.65
      const icon = leafTypes[i % leafTypes.length];

      return { id: i, left, duration, delay, size, opacity, icon };
    });
  }, []);

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        title="Bật hiệu ứng lá rơi thiên nhiên"
        style={{
          position: "fixed",
          bottom: "18px",
          right: "18px",
          zIndex: 40,
          background: "var(--surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--r-full)",
          padding: "8px 12px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--forest-800)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "var(--shadow-sm)",
          opacity: 0.85,
          transition: "all var(--tr-normal)",
        }}
      >
        <Leaf size={14} color="var(--leaf-600)" />
        <span>Bật hiệu ứng lá</span>
      </button>
    );
  }

  return (
    <>
      <div className="nature-ambient-wrap" aria-hidden="true">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="falling-leaf"
            style={{
              left: `${leaf.left}%`,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              fontSize: `${leaf.size}px`,
              opacity: leaf.opacity,
              filter: "drop-shadow(0 2px 4px rgba(22,51,36,0.12))",
            }}
          >
            {leaf.icon}
          </div>
        ))}
      </div>

      <button
        onClick={() => setEnabled(false)}
        title="Tạm tắt hiệu ứng lá rơi"
        style={{
          position: "fixed",
          bottom: "18px",
          right: "18px",
          zIndex: 40,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--r-full)",
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "var(--shadow-xs)",
          transition: "all var(--tr-normal)",
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.7";
          e.currentTarget.style.boxShadow = "var(--shadow-xs)";
        }}
      >
        <Sparkles size={13} color="var(--leaf-600)" />
        <span>Hiệu ứng lá: Bật</span>
      </button>
    </>
  );
}
