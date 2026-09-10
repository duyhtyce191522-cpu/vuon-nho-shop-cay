import { Sprout, X } from "lucide-react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "26px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 110,
        background: "var(--forest-950)",
        color: "white",
        padding: "10px 18px",
        borderRadius: "var(--r-full)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "var(--shadow-lg), 0 0 20px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        animation: "toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        fontSize: "13.5px",
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "var(--leaf-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sprout size={13} color="white" />
      </div>

      <span>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: "4px",
            color: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
