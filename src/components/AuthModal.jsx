import { useState } from "react";
import { X, Lock, User, Phone, MapPin, ShieldCheck, Sparkles, LogIn, UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  apiUrl = "http://localhost:5000",
  initialTab = "login",
}) {
  const [tab, setTab] = useState(initialTab); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // Register form state
  const [regForm, setRegForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  // Quick fill demo credentials
  const fillDemo = (role) => {
    setError("");
    setTab("login");
    if (role === "admin") {
      setLoginForm({ username: "admin", password: "admin123" });
    } else {
      setLoginForm({ username: "khachhang", password: "123456" });
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.username.trim() || !loginForm.password) {
      setError("Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.error || "Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      console.warn("Backend offline, using local mock auth fallback:", err.message);
      // Offline fallback simulation for Vercel demo
      if (loginForm.username === "admin" && loginForm.password === "admin123") {
        const mockAdmin = {
          id: 1,
          username: "admin",
          full_name: "Chủ Vườn Hải Duy",
          phone: "0912345678",
          address: "Vườn Nhỏ, TP.HCM",
          role: "admin",
        };
        onLoginSuccess(mockAdmin, "mock-admin-token");
        onClose();
      } else if (loginForm.password.length >= 6) {
        const mockCustomer = {
          id: Date.now(),
          username: loginForm.username,
          full_name: loginForm.username,
          phone: "0900000000",
          address: "Việt Nam",
          role: "customer",
        };
        onLoginSuccess(mockCustomer, "mock-customer-token");
        onClose();
      } else {
        setError("Mật khẩu cần tối thiểu 6 ký tự (Demo: admin / admin123).");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!regForm.fullName.trim() || !regForm.username.trim() || !regForm.password) {
      setError("Vui lòng điền đầy đủ Họ tên, Tên đăng nhập và Mật khẩu.");
      return;
    }

    if (regForm.password.length < 6) {
      setError("Mật khẩu bảo mật cần tối thiểu 6 ký tự.");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regForm.fullName.trim(),
          username: regForm.username.trim(),
          phone: regForm.phone.trim(),
          address: regForm.address.trim(),
          password: regForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.error || "Đăng ký không thành công. Vui lòng thử lại.");
      }
    } catch (err) {
      console.warn("Backend offline, using local mock register fallback:", err.message);
      // Offline fallback simulation
      const mockUser = {
        id: Date.now(),
        username: regForm.username.trim(),
        full_name: regForm.fullName.trim(),
        phone: regForm.phone.trim(),
        address: regForm.address.trim(),
        role: "customer",
      };
      onLoginSuccess(mockUser, "mock-registered-token");
      onClose();
    } finally {
      setLoading(false);
    }
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
        padding: "16px",
        background: "rgba(18, 38, 28, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "var(--r-xl)",
          boxShadow: "0 20px 48px rgba(18, 38, 28, 0.22)",
          border: "1px solid var(--border-light)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px 26px 18px",
            background: "linear-gradient(135deg, var(--surface) 0%, var(--moss-50) 100%)",
            borderBottom: "1px solid var(--border-light)",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              background: "rgba(22, 51, 36, 0.06)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--forest-900)",
              transition: "all var(--tr-fast)",
            }}
          >
            <X size={17} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--r-md)",
                background: "linear-gradient(135deg, var(--forest-900) 0%, var(--leaf-600) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(22, 51, 36, 0.2)",
              }}
            >
              {tab === "login" ? <LogIn size={20} color="#ffffff" /> : <UserPlus size={20} color="#ffffff" />}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--forest-950)",
                  margin: 0,
                }}
              >
                {tab === "login" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                {tab === "login"
                  ? "Chào mừng bạn quay lại với Vườn Nhỏ"
                  : "Trở thành thành viên để lưu lịch sử và ưu đãi"}
              </p>
            </div>
          </div>

          {/* Switch Tab Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "rgba(22, 51, 36, 0.06)",
              padding: "4px",
              borderRadius: "var(--r-md)",
              marginTop: "16px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => {
                setTab("login");
                setError("");
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "login" ? "#ffffff" : "transparent",
                color: tab === "login" ? "var(--forest-950)" : "var(--text-muted)",
                boxShadow: tab === "login" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                transition: "all var(--tr-fast)",
              }}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setTab("register");
                setError("");
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "register" ? "#ffffff" : "transparent",
                color: tab === "register" ? "var(--forest-950)" : "var(--text-muted)",
                boxShadow: tab === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                transition: "all var(--tr-fast)",
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "20px 26px 26px", overflowY: "auto" }}>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                background: "var(--terracotta-100)",
                border: "1px solid rgba(194, 94, 52, 0.3)",
                color: "var(--terracotta-500)",
                fontSize: "12.5px",
                fontWeight: 600,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                  Tên đăng nhập hoặc SĐT
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Nhập tên đăng nhập (vd: admin, khachhang)..."
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13.5px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "6px" }}>
                  Mật khẩu
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Nhập mật khẩu..."
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 36px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13.5px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-nature-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14px",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <span>Đang xử lý đăng nhập...</span>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Đăng nhập ngay</span>
                  </>
                )}
              </button>

              {/* Demo Fill Shortcuts */}
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "14px",
                  borderTop: "1px dashed var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)" }}>
                  Gợi ý đăng nhập nhanh để kiểm tra:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => fillDemo("admin")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--moss-100)",
                      border: "1px solid var(--moss-200)",
                      color: "var(--forest-900)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    🛡️ <strong>Admin:</strong> admin / admin123
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo("customer")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--bg-canvas)",
                      border: "1px solid var(--border-light)",
                      color: "var(--forest-900)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    👤 <strong>Khách:</strong> khachhang / 123456
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                  Họ và tên <span style={{ color: "var(--terracotta-500)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "var(--r-md)",
                    border: "1.5px solid var(--border-light)",
                    fontSize: "13px",
                    outline: "none",
                    background: "var(--bg-canvas)",
                  }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                    Tên đăng nhập <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    placeholder="nguyenvana"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0912 345 678"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                  Địa chỉ nhận cây (mặc định)
                </label>
                <input
                  type="text"
                  value={regForm.address}
                  onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  placeholder="Số nhà, tên đường, phường, quận..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "var(--r-md)",
                    border: "1.5px solid var(--border-light)",
                    fontSize: "13px",
                    outline: "none",
                    background: "var(--bg-canvas)",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                    Mật khẩu <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--forest-900)", marginBottom: "4px" }}>
                    Nhập lại mật khẩu <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Khớp với mật khẩu"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-nature-primary"
                style={{
                  width: "100%",
                  padding: "11px",
                  fontSize: "13.5px",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? <span>Đang khởi tạo tài khoản...</span> : (
                  <>
                    <UserPlus size={15} />
                    <span>Tạo tài khoản thành viên</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
