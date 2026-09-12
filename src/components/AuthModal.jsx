import { useState, useEffect } from "react";
import {
  X,
  Lock,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ArrowRight,
} from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  apiUrl = "http://localhost:5000",
  initialTab = "login",
}) {
  const [tab, setTab] = useState(initialTab || "login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  // Synchronize active tab whenever modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab || "login");
      setError("");
      setSuccessMsg("");
      setShowPassword(false);
    }
  }, [isOpen, initialTab]);

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
    setSuccessMsg("");

    const userOrPhone = loginForm.username.trim();
    if (!userOrPhone || !loginForm.password) {
      setError("Vui lòng nhập đầy đủ Tên đăng nhập / SĐT và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userOrPhone,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          onClose();
        }, 400);
      } else {
        setError(data.error || "Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      console.warn("Backend offline, using local mock auth fallback:", err.message);
      // Offline fallback simulation for Vercel demo
      if (userOrPhone === "admin" && loginForm.password === "admin123") {
        const mockAdmin = {
          id: 1,
          username: "admin",
          full_name: "Chủ Vườn Hải Duy",
          phone: "0912345678",
          address: "Vườn Nhỏ, TP.HCM",
          role: "admin",
        };
        setSuccessMsg("Đăng nhập Admin thành công (Demo)");
        setTimeout(() => {
          onLoginSuccess(mockAdmin, "mock-admin-token");
          onClose();
        }, 400);
      } else if (loginForm.password.length >= 6) {
        const mockCustomer = {
          id: Date.now(),
          username: userOrPhone,
          full_name: userOrPhone,
          phone: "0912345678",
          address: "Việt Nam",
          role: "customer",
        };
        setSuccessMsg("Đăng nhập thành công!");
        setTimeout(() => {
          onLoginSuccess(mockCustomer, "mock-customer-token");
          onClose();
        }, 400);
      } else {
        setError("Mật khẩu cần tối thiểu 6 ký tự (Demo: admin / admin123 hoặc khachhang / 123456).");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const fullName = regForm.fullName.trim();
    const username = regForm.username.trim().toLowerCase().replace(/\s+/g, "");
    const phone = regForm.phone.trim();
    const address = regForm.address.trim();

    if (!fullName || !username || !regForm.password) {
      setError("Vui lòng điền đầy đủ Họ tên, Tên đăng nhập và Mật khẩu.");
      return;
    }

    if (username.length < 3) {
      setError("Tên đăng nhập cần có ít nhất 3 ký tự (không dấu cách).");
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
          full_name: fullName,
          username,
          phone,
          address,
          password: regForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setSuccessMsg("Đăng ký thành công! Đang tự động đăng nhập...");
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          onClose();
        }, 500);
      } else {
        setError(data.error || "Đăng ký không thành công. Tên đăng nhập có thể đã tồn tại.");
      }
    } catch (err) {
      console.warn("Backend offline, using local mock register fallback:", err.message);
      // Offline fallback simulation
      const mockUser = {
        id: Date.now(),
        username,
        full_name: fullName,
        phone,
        address,
        role: "customer",
      };
      setSuccessMsg("Đăng ký tài khoản thành công!");
      setTimeout(() => {
        onLoginSuccess(mockUser, "mock-registered-token");
        onClose();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMatch =
    regForm.confirmPassword.length > 0 && regForm.password === regForm.confirmPassword;
  const isPasswordMismatch =
    regForm.confirmPassword.length > 0 && regForm.password !== regForm.confirmPassword;

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
        background: "rgba(13, 30, 21, 0.58)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "470px",
          background: "var(--surface)",
          borderRadius: "var(--r-xl)",
          boxShadow: "0 24px 60px rgba(13, 30, 21, 0.25), 0 4px 16px rgba(13, 30, 21, 0.08)",
          border: "1px solid rgba(22, 51, 36, 0.12)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          animation: "modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px 26px 18px",
            background: "linear-gradient(135deg, var(--surface) 0%, var(--moss-50) 60%, var(--moss-100) 100%)",
            borderBottom: "1px solid var(--border-light)",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            title="Đóng cửa sổ"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(22, 51, 36, 0.05)",
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--terracotta-100)";
              e.currentTarget.style.color = "var(--terracotta-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(22, 51, 36, 0.05)";
              e.currentTarget.style.color = "var(--forest-900)";
            }}
          >
            <X size={17} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              }}
            >
              {tab === "login" ? (
                <LogIn size={21} color="#ffffff" />
              ) : (
                <UserPlus size={21} color="#ffffff" />
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "21px",
                    fontWeight: 700,
                    color: "var(--forest-950)",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {tab === "login" ? "Đăng Nhập" : "Tạo Tài Khoản"}
                </span>
                <span style={{ fontSize: "12px" }}>🌿</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {tab === "login"
                  ? "Vào tài khoản để theo dõi đơn và lưu chậu cây yêu thích"
                  : "Trở thành thành viên của Vườn Nhỏ để nhận ưu đãi"}
              </p>
            </div>
          </div>

          {/* Switch Tab Pill Selector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "rgba(22, 51, 36, 0.07)",
              padding: "4px",
              borderRadius: "var(--r-full)",
              marginTop: "16px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => {
                setTab("login");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "var(--r-full)",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "login" ? "#ffffff" : "transparent",
                color: tab === "login" ? "var(--forest-950)" : "var(--text-muted)",
                boxShadow: tab === "login" ? "0 2px 8px rgba(22, 51, 36, 0.08)" : "none",
                transition: "all var(--tr-fast)",
              }}
            >
              <LogIn size={14} color={tab === "login" ? "var(--leaf-600)" : "currentColor"} />
              <span>Đăng nhập</span>
            </button>

            <button
              onClick={() => {
                setTab("register");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "var(--r-full)",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                background: tab === "register" ? "#ffffff" : "transparent",
                color: tab === "register" ? "var(--forest-950)" : "var(--text-muted)",
                boxShadow: tab === "register" ? "0 2px 8px rgba(22, 51, 36, 0.08)" : "none",
                transition: "all var(--tr-fast)",
              }}
            >
              <UserPlus size={14} color={tab === "register" ? "var(--leaf-600)" : "currentColor"} />
              <span>Đăng ký mới</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "20px 24px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                background: "var(--terracotta-100)",
                border: "1px solid rgba(194, 94, 52, 0.35)",
                color: "var(--terracotta-500)",
                fontSize: "12.5px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeIn 0.2s ease",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--r-md)",
                background: "var(--moss-100)",
                border: "1px solid var(--leaf-500)",
                color: "var(--forest-950)",
                fontSize: "12.5px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeIn 0.2s ease",
              }}
            >
              <CheckCircle2 size={16} color="var(--leaf-600)" style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM ĐĂNG NHẬP */}
          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "var(--forest-900)",
                    marginBottom: "6px",
                  }}
                >
                  Tên đăng nhập hoặc Số điện thoại
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    color="var(--text-muted)"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Tên đăng nhập hoặc SĐT (vd: admin, khachhang)..."
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13.5px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                      transition: "all var(--tr-fast)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--leaf-600)";
                      e.target.style.background = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(56, 124, 89, 0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-light)";
                      e.target.style.background = "var(--bg-canvas)";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "var(--forest-900)",
                    marginBottom: "6px",
                  }}
                >
                  Mật khẩu
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Nhập mật khẩu của bạn..."
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 36px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13.5px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                      transition: "all var(--tr-fast)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--leaf-600)";
                      e.target.style.background = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(56, 124, 89, 0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-light)";
                      e.target.style.background = "var(--bg-canvas)";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                  fontWeight: 700,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? (
                  <span>Đang kiểm tra thông tin...</span>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Đăng nhập ngay</span>
                  </>
                )}
              </button>

              {/* Chuyển sang tab Đăng ký */}
              <div style={{ textAlign: "center", fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                  style={{
                    color: "var(--leaf-600)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Đăng ký thành viên ngay
                </button>
              </div>

              {/* Phím tắt điền tài khoản mẫu */}
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "14px",
                  borderTop: "1px dashed var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={13} color="var(--amber-500)" />
                  <span>Điền nhanh tài khoản mẫu để trải nghiệm:</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => fillDemo("admin")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "var(--r-md)",
                      background: "var(--moss-100)",
                      border: "1px solid var(--moss-200)",
                      color: "var(--forest-950)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      transition: "all var(--tr-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--leaf-500)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--moss-200)")}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--forest-900)" }}>
                      🛡️ Admin Quản Trị
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>admin / admin123</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemo("customer")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "var(--r-md)",
                      background: "var(--bg-canvas)",
                      border: "1px solid var(--border-light)",
                      color: "var(--forest-950)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      transition: "all var(--tr-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--moss-200)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--forest-900)" }}>
                      🌱 Khách Mua Hàng
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>khachhang / 123456</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* TAB 2: FORM ĐĂNG KÝ */
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--forest-900)",
                    marginBottom: "4px",
                  }}
                >
                  Họ và tên của bạn <span style={{ color: "var(--terracotta-500)" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={15}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 34px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--leaf-600)";
                      e.target.style.background = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-light)";
                      e.target.style.background = "var(--bg-canvas)";
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--forest-900)",
                      marginBottom: "4px",
                    }}
                  >
                    Tên đăng nhập <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Sparkles
                      size={14}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      value={regForm.username}
                      onChange={(e) =>
                        setRegForm({
                          ...regForm,
                          username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                        })
                      }
                      placeholder="nguyenan99"
                      style={{
                        width: "100%",
                        padding: "9px 10px 9px 30px",
                        borderRadius: "var(--r-md)",
                        border: "1.5px solid var(--border-light)",
                        fontSize: "13px",
                        outline: "none",
                        background: "var(--bg-canvas)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--leaf-600)";
                        e.target.style.background = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-light)";
                        e.target.style.background = "var(--bg-canvas)";
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--forest-900)",
                      marginBottom: "4px",
                    }}
                  >
                    Số điện thoại
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone
                      size={14}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="0912 345 678"
                      style={{
                        width: "100%",
                        padding: "9px 10px 9px 30px",
                        borderRadius: "var(--r-md)",
                        border: "1.5px solid var(--border-light)",
                        fontSize: "13px",
                        outline: "none",
                        background: "var(--bg-canvas)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--leaf-600)";
                        e.target.style.background = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-light)";
                        e.target.style.background = "var(--bg-canvas)";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--forest-900)",
                    marginBottom: "4px",
                  }}
                >
                  Địa chỉ nhận cây (mặc định)
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin
                    size={15}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="text"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 34px",
                      borderRadius: "var(--r-md)",
                      border: "1.5px solid var(--border-light)",
                      fontSize: "13px",
                      outline: "none",
                      background: "var(--bg-canvas)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--leaf-600)";
                      e.target.style.background = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-light)";
                      e.target.style.background = "var(--bg-canvas)";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--forest-900)",
                      marginBottom: "4px",
                    }}
                  >
                    Mật khẩu <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={14}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Tối thiểu 6 ký tự"
                      style={{
                        width: "100%",
                        padding: "9px 10px 9px 30px",
                        borderRadius: "var(--r-md)",
                        border: "1.5px solid var(--border-light)",
                        fontSize: "13px",
                        outline: "none",
                        background: "var(--bg-canvas)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--leaf-600)";
                        e.target.style.background = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-light)";
                        e.target.style.background = "var(--bg-canvas)";
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--forest-900)",
                      marginBottom: "4px",
                    }}
                  >
                    Nhập lại mật khẩu <span style={{ color: "var(--terracotta-500)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <ShieldCheck
                      size={14}
                      color={
                        isPasswordMatch
                          ? "var(--leaf-600)"
                          : isPasswordMismatch
                          ? "var(--terracotta-500)"
                          : "var(--text-muted)"
                      }
                      style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="Khớp với mật khẩu"
                      style={{
                        width: "100%",
                        padding: "9px 10px 9px 30px",
                        borderRadius: "var(--r-md)",
                        border: `1.5px solid ${
                          isPasswordMatch
                            ? "var(--leaf-500)"
                            : isPasswordMismatch
                            ? "var(--terracotta-500)"
                            : "var(--border-light)"
                        }`,
                        fontSize: "13px",
                        outline: "none",
                        background: "var(--bg-canvas)",
                      }}
                      onFocus={(e) => {
                        e.target.style.background = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "var(--bg-canvas)";
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {isPasswordMismatch && (
                <div style={{ fontSize: "11.5px", color: "var(--terracotta-500)", marginTop: "-6px" }}>
                  ✗ Mật khẩu xác nhận chưa khớp với mật khẩu ở trên.
                </div>
              )}
              {isPasswordMatch && (
                <div style={{ fontSize: "11.5px", color: "var(--leaf-600)", marginTop: "-6px" }}>
                  ✓ Mật khẩu xác nhận trùng khớp!
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-nature-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? (
                  <span>Đang khởi tạo tài khoản...</span>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Tạo tài khoản thành viên</span>
                  </>
                )}
              </button>

              {/* Chuyển sang tab Đăng nhập */}
              <div style={{ textAlign: "center", fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                Đã có tài khoản thành viên?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  style={{
                    color: "var(--leaf-600)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
