import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, UserCheck, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import { getSalesmen, saveSalesmanSession } from "../../services/salesmanService";

export default function SalesmanLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const salesmenList = getSalesmen();

  const handleSelectQuickSalesman = (sm) => {
    setEmail(sm.email);
    setPassword(sm.password || "password123");
    setError("");
  };

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your salesman email and password.");
      return;
    }

    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const allSalesmen = getSalesmen();

      // Find salesman by email (case-insensitive) or by ID
      const matchedSalesman = allSalesmen.find(
        (s) =>
          s.email.toLowerCase() === trimmedEmail ||
          s.id.toLowerCase() === trimmedEmail
      );

      if (!matchedSalesman) {
        setError("Salesman account not found. Please check your email or contact Admin.");
        return;
      }

      if (matchedSalesman.active === false) {
        setError(`Account for ${matchedSalesman.name} is DEACTIVATED. Contact Admin to reactivate.`);
        return;
      }

      // Check salesman password configured by Admin
      const validPassword = matchedSalesman.password || "password123";
      if (password !== validPassword) {
        setError(`Incorrect password for ${matchedSalesman.name}. Contact Admin if password was reset.`);
        return;
      }

      // Save salesman session
      saveSalesmanSession(matchedSalesman);

      // Navigate to Salesman Dashboard
      navigate("/salesman/dashboard");
    } catch (err) {
      console.error("Salesman login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-background-glow" />

      <div className="admin-login-card" style={{ maxWidth: "440px" }}>
        <div className="login-logo" style={{ color: "#0052ff" }}>
          <div style={{ background: "transparent", padding: 0, overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
          </div>
          <span style={{ color: "#fff", letterSpacing: "1.5px" }}>CINÉMA</span>
        </div>

        <div className="login-heading">
          <span style={{ color: "#fff", letterSpacing: "1.5px", fontSize: "10px", fontWeight: "700" }}>SALESMAN PORTAL</span>
          <h1>
            Order
            <br />
            Fulfillment.
          </h1>
          <p>Sign in to manage food prep, seat delivery & update order status.</p>
        </div>

        {/* Quick-fill selector for salesmen */}
        <div
          style={{
            background: "rgba(0, 82, 255, 0.08)",
            border: "1px dashed rgba(0, 82, 255, 0.35)",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#fff",
              fontWeight: "700",
              marginBottom: "8px"
            }}
          >
            <Sparkles size={14} style={{ color: "#0052ff" }} />
            <span>Select Active Salesman to Test:</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {salesmenList.slice(0, 3).map((sm) => (
              <button
                key={sm.id}
                type="button"
                onClick={() => handleSelectQuickSalesman(sm)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: email === sm.email ? "rgba(0, 82, 255, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: email === sm.email ? "1px solid #0052ff" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  color: "#fff",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img
                    src={sm.avatar}
                    alt={sm.name}
                    style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span>
                    <strong>{sm.name}</strong> ({sm.id})
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: "#fff", fontWeight: "700" }}>
                  {email === sm.email ? "Selected" : "Fill"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Salesman Email or ID</label>
          <div className="admin-input-wrapper">
            <Mail size={18} />
            <input
              type="text"
              placeholder="e.g. arun@cinema.com or SM-101"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
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
              autoComplete="current-password"
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
            {loading ? "Signing in..." : "Sign In to Salesman Portal"}
          </button>
        </form>

        {/* Links to switch to Admin Login */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px"
          }}
        >
          <Link
            to="/admin/login"
            style={{
              color: "#aaa",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <ShieldAlert size={14} />
            <span>Admin Login</span>
          </Link>

          <Link
            to="/menu"
            style={{
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>Customer Menu</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="login-footer">
          <span>CINÉMA Theater Concessions</span>
          <span>Order Status Controller</span>
        </div>
      </div>
    </div>
  );
}
