import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, Eye, EyeOff, Clapperboard, Sparkles, UserCheck, ArrowRight } from "lucide-react";
import { auth } from "../../services/firebase";
import { useAdminAuth } from "../../admin/context/AdminAuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginDemo } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFillDemo = () => {
    setEmail("admin@cinema.com");
    setPassword("admin123");
    setError("");
  };

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check for local demo credentials bypass
    if (
      (trimmedEmail === "admin@cinema.com" && (password === "admin123" || password === "admin")) ||
      password === "admin123"
    ) {
      loginDemo(trimmedEmail);
      navigate("/admin/dashboard");
      return;
    }

    try {
      setLoading(true);

      // Attempt live Firebase sign-in if real credentials configured
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.warn("Firebase Auth error:", err);

      // If Firebase fails because API key is mock or invalid, offer demo login automatically
      if (
        err.code === "auth/api-key-not-valid" ||
        err.message?.includes("api-key-not-valid") ||
        err.message?.includes("API key not valid")
      ) {
        // Log in via demo mode so development is not blocked
        loginDemo(trimmedEmail || "admin@cinema.com");
        navigate("/admin/dashboard");
        return;
      }

      setError("Invalid admin credentials. (Demo login: admin@cinema.com / admin123)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-background-glow" />

      <div className="admin-login-card">
        <div className="login-logo" style={{ color: "#0052ff" }}>
          <div style={{ background: "transparent", padding: 0, overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
          </div>
          <span style={{ color: "#fff", letterSpacing: "1.5px" }}>CINÉMA</span>
        </div>

        <div className="login-heading">
          <span style={{ color: "#fff", letterSpacing: "1.5px", fontWeight: "700" }}>ADMINISTRATION</span>
          <h1>
            Welcome
            <br />
            back.
          </h1>
          <p>Sign in to manage your theater food operations.</p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div
          style={{
            background: "rgba(0, 82, 255, 0.1)",
            border: "1px dashed rgba(0, 82, 255, 0.4)",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} style={{ color: "#0052ff" }} />
            <span>Demo: <strong style={{ color: "#fff" }}>admin@cinema.com</strong> / <strong style={{ color: "#fff" }}>admin123</strong></span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: "linear-gradient(135deg, #0052ff, #0036b3)",
              border: "none",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "10px",
              fontWeight: "700",
            }}
          >
            Auto-fill
          </button>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <div className="admin-input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              placeholder="admin@cinema.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <label>Password</label>
          <div className="admin-input-wrapper">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px"
          }}
        >
          <Link
            to="/salesman/login"
            style={{
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600"
            }}
          >
            <UserCheck size={14} />
            <span>Salesman Portal Login</span>
          </Link>

          <Link
            to="/menu"
            style={{
              color: "#888",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>Customer Menu</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="login-footer">
          <span>CINÉMA Food Ordering System</span>
          <span>Secure Admin Access</span>
        </div>
      </div>
    </div>
  );
}