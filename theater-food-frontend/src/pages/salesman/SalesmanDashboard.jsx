import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Phone,
  Search,
  RefreshCw,
  Award,
  IndianRupee,
  Key,
  ShieldCheck,
  MessageSquare,
  LogOut,
  Flame,
  ChevronRight,
  X,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { getSalesmen, getSalesmanSession, clearSalesmanSession } from "../../services/salesmanService";

// Helper to format Indian phone numbers for WhatsApp API
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    digits = "91" + digits;
  }
  return digits;
}

// Build professional theater concession delivery message
export function buildWhatsAppMessage(order, currentSalesman) {
  const customerName = order?.customerName || "Valued Guest";
  const seatLocation = `Seat ${order?.seat || "Your Seat"}${order?.screen ? ` (${order.screen})` : ""}`;
  const itemsSummary =
    order?.items && order.items.length > 0
      ? order.items.map((it) => `• ${it.quantity}x ${it.name}`).join("\n")
      : "Your concession items";
  const attendant = currentSalesman?.name || "Concession Attendant";

  return `🍿 *CINÉMA CONCESSION ALERT* 🎬\n\nHello *${customerName}*,\nYour food order *#${order?.id}* is *READY FOR DELIVERY* to your seat!\n\n📍 *Delivery Location:* ${seatLocation}\n🍱 *Items Ordered:*\n${itemsSummary}\n💰 *Total:* ₹${order?.total} (${order?.paymentStatus || "PAID"})\n🏃 *Runner:* ${attendant} is on the way to your seat.\n\nPlease remain seated. Enjoy your movie! 🎥✨`;
}

export default function SalesmanDashboard() {
  const navigate = useNavigate();

  // Active salesman session
  const [salesman, setSalesman] = useState(() => getSalesmanSession());

  useEffect(() => {
    const session = getSalesmanSession();
    if (!session || !session.id) {
      navigate("/salesman/login");
    } else {
      const all = getSalesmen();
      const fresh = all.find((s) => s.id === session.id) || session;
      setSalesman(fresh);
    }
  }, [navigate]);

  // Navigation & Filter states
  const [activeTab, setActiveTab] = useState("dispatch"); // 'dispatch' | 'ledger' | 'sales' | 'profile'
  const [selectedScreen, setSelectedScreen] = useState("ALL");
  const [orderFilter, setOrderFilter] = useState("ALL"); // 'ALL' | 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState("");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [newStatusSelection, setNewStatusSelection] = useState("");
  const [notification, setNotification] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // WhatsApp Alert Modal State
  const [whatsappModalData, setWhatsappModalData] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOrders = async () => {
    const list = await getAllOrders();
    if (!list || list.length === 0) {
      const seedOrders = [
        {
          id: "ORD-1045",
          customerName: "Rahul Sharma",
          phone: "9876543210",
          seat: "A12",
          screen: "Screen 1",
          items: [
            { name: "Jumbo Caramel Popcorn", quantity: 2, price: 300 },
            { name: "Large Coke (750ml)", quantity: 2, price: 125 }
          ],
          total: 850,
          paymentStatus: "PAID",
          paymentMethod: "UPI (Google Pay)",
          status: "PREPARING",
          createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
          assignedSalesman: "Arun Kumar"
        },
        {
          id: "ORD-1044",
          customerName: "Sneha Patel",
          phone: "9820011223",
          seat: "C08",
          screen: "Screen 2",
          items: [
            { name: "Loaded Cheese Nachos", quantity: 1, price: 280 },
            { name: "Iced Cold Coffee", quantity: 1, price: 180 }
          ],
          total: 460,
          paymentStatus: "PAID",
          paymentMethod: "Credit Card",
          status: "RECEIVED",
          createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
          assignedSalesman: "Arun Kumar"
        },
        {
          id: "ORD-1043",
          customerName: "Vikram Reddy",
          phone: "9940022334",
          seat: "VIP-04",
          screen: "IMAX Lounge",
          items: [
            { name: "Gourmet Chicken Burger", quantity: 1, price: 340 },
            { name: "Peri Peri Fries", quantity: 1, price: 190 },
            { name: "Sprite (500ml)", quantity: 1, price: 110 }
          ],
          total: 640,
          paymentStatus: "PAID",
          paymentMethod: "UPI (PhonePe)",
          status: "READY",
          createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
          assignedSalesman: "Arun Kumar"
        },
        {
          id: "ORD-1042",
          customerName: "Meera Krishnan",
          phone: "9710033445",
          seat: "B14",
          screen: "Screen 1",
          items: [
            { name: "Butter Salt Popcorn", quantity: 1, price: 220 },
            { name: "Mineral Water (Cold)", quantity: 2, price: 40 }
          ],
          total: 300,
          paymentStatus: "PAID",
          paymentMethod: "Cash at Seat",
          status: "DELIVERED",
          createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
          assignedSalesman: "Arun Kumar"
        },
        {
          id: "ORD-1041",
          customerName: "Karan Johar",
          phone: "9988776655",
          seat: "D02",
          screen: "Screen 2",
          items: [{ name: "Sweet Corn Cups (Masala)", quantity: 2, price: 150 }],
          total: 300,
          paymentStatus: "CANCELLED",
          paymentMethod: "UPI",
          status: "CANCELLED",
          createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
          assignedSalesman: "Arun Kumar"
        }
      ];
      setOrders(seedOrders);
      localStorage.setItem("cinema_all_orders", JSON.stringify(seedOrders));
      return;
    }
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  // Trigger WhatsApp delivery message for an order
  const triggerWhatsAppForOrder = (targetOrder) => {
    if (!targetOrder || !targetOrder.phone) {
      alert("No phone number found for this customer.");
      return;
    }
    const cleanPhone = formatPhoneForWhatsApp(targetOrder.phone);
    const message = buildWhatsAppMessage(targetOrder, salesman);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    setWhatsappModalData({
      order: targetOrder,
      phone: targetOrder.phone,
      cleanPhone,
      message,
      url: whatsappUrl
    });

    // Auto-open WhatsApp
    try {
      window.open(whatsappUrl, "_blank");
    } catch (e) {
      console.warn("Popup blocked:", e);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setStatusModalOrder(null);

      // IF CHANGED TO READY (Ready for Delivery), TRIGGER WHATSAPP!
      if (newStatus === "READY") {
        const targetOrder = orders.find((o) => o.id === orderId);
        if (targetOrder) {
          triggerWhatsAppForOrder({ ...targetOrder, status: "READY" });
          setNotification(`📲 Status set to READY: WhatsApp message sent to ${targetOrder.customerName} (${targetOrder.phone})!`);
        }
      } else {
        setNotification(`Order #${orderId} marked as "${newStatus}"`);
      }
      setTimeout(() => setNotification(""), 4500);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    clearSalesmanSession();
    navigate("/salesman/login");
  };

  // Calculations
  const pendingOrders = orders.filter((o) => o.status === "RECEIVED" || o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING" || o.status === "PROCESSING");
  const readyOrders = orders.filter((o) => o.status === "READY");
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED");

  const todayRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const availableScreens = useMemo(() => {
    const screens = new Set(["Screen 1", "Screen 2", "Screen 3", "Screen 4", "IMAX Lounge", "VIP Balcony"]);
    orders.forEach((o) => {
      if (o.screen) screens.add(o.screen);
    });
    if (salesman?.assignedScreens) {
      salesman.assignedScreens.forEach((s) => screens.add(s));
    }
    return Array.from(screens);
  }, [orders, salesman]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesScreen = selectedScreen === "ALL" || (o.screen && o.screen.toLowerCase() === selectedScreen.toLowerCase());
      const matchesStatus =
        orderFilter === "ALL"
          ? true
          : orderFilter === "RECEIVED"
          ? o.status === "RECEIVED" || o.status === "PENDING"
          : orderFilter === "PREPARING"
          ? o.status === "PREPARING" || o.status === "PROCESSING"
          : orderFilter === "READY"
          ? o.status === "READY"
          : orderFilter === "DELIVERED"
          ? o.status === "DELIVERED" || o.status === "COMPLETED"
          : orderFilter === "CANCELLED"
          ? o.status === "CANCELLED"
          : true;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        o.id?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.seat?.toLowerCase().includes(q) ||
        o.phone?.includes(q) ||
        o.items?.some((it) => it.name?.toLowerCase().includes(q));

      return matchesScreen && matchesStatus && matchesSearch;
    });
  }, [orders, selectedScreen, orderFilter, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "RECEIVED":
      case "PENDING":
        return {
          label: "Received",
          bg: "rgba(245, 158, 11, 0.15)",
          color: "#f59e0b",
          border: "rgba(245, 158, 11, 0.35)",
          icon: Clock
        };
      case "PREPARING":
      case "PROCESSING":
        return {
          label: "In Kitchen",
          bg: "rgba(0, 82, 255, 0.18)",
          color: "#fff",
          border: "rgba(0, 82, 255, 0.4)",
          icon: ChefHat
        };
      case "READY":
        return {
          label: "Ready for Delivery",
          bg: "rgba(0, 210, 255, 0.18)",
          color: "#0052ff",
          border: "rgba(0, 210, 255, 0.45)",
          icon: Send
        };
      case "DELIVERED":
      case "COMPLETED":
        return {
          label: "Delivered",
          bg: "rgba(16, 185, 129, 0.15)",
          color: "#10b981",
          border: "rgba(16, 185, 129, 0.35)",
          icon: CheckCircle2
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          bg: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "rgba(239, 68, 68, 0.35)",
          icon: XCircle
        };
      default:
        return {
          label: status,
          bg: "rgba(255, 255, 255, 0.08)",
          color: "#fff",
          border: "rgba(255, 255, 255, 0.15)",
          icon: Clock
        };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #0d1730 0%, #070b14 60%, #04070d 100%)",
        color: "#f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* ── TOP LOGO-BRANDED EXECUTIVE HEADER ──────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(11, 18, 34, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0, 82, 255, 0.28)",
          boxShadow: "0 6px 24px rgba(0, 8, 20, 0.7)",
          padding: "12px 28px"
        }}
      >
        <div
          style={{
            maxWidth: "1550px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          {/* Brand Logo & Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(0, 82, 255, 0.12)",
                border: "1px solid rgba(0, 82, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(0, 82, 255, 0.35)",
                overflow: "hidden"
              }}
            >
              <img src="/logo.png" alt="Logo" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "900",
                    letterSpacing: "1px",
                    color: "#ffffff"
                  }}
                >
                  CINÉMA
                </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, rgba(0,82,255,0.25), rgba(0,82,255,0.1))",
                    border: "1px solid rgba(0, 82, 255, 0.45)",
                    color: "#fff",
                    padding: "2px 10px",
                    borderRadius: "14px",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "0.5px"
                  }}
                >
                  SALESMAN PORTAL
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#10b981",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981"
                    }}
                  />
                  WHATSAPP READY
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                Auditoriums: <span style={{ color: "#fff", fontWeight: "600" }}>{salesman?.assignedScreens?.join(", ") || "All Screens"}</span>
              </div>
            </div>
          </div>

          {/* Center: Live Terminal Clock */}
          <div
            style={{
              background: "rgba(14, 21, 38, 0.8)",
              border: "1px solid rgba(0, 82, 255, 0.25)",
              borderRadius: "10px",
              padding: "6px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <Clock size={16} style={{ color: "#0052ff" }} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", letterSpacing: "1px" }}>
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Cinema Local Time
              </div>
            </div>
          </div>

          {/* Right: Salesman Badge & Quick Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              onClick={() => setActiveTab("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(14, 21, 38, 0.8)",
                border: "1px solid rgba(0, 82, 255, 0.25)",
                padding: "6px 14px",
                borderRadius: "10px",
                cursor: "pointer"
              }}
              title="View Salesman Profile & Portal Password"
            >
              <img
                src={salesman?.avatar}
                alt={salesman?.name}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #0052ff"
                }}
              />
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#fff" }}>
                  {salesman?.name || "Salesman"}
                </div>
                <div style={{ fontSize: "10px", color: "#fff" }}>
                  ID: {salesman?.id}
                </div>
              </div>
            </div>

            <Link
              to="/admin/dashboard"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0, 82, 255, 0.12)",
                border: "1px solid rgba(0, 82, 255, 0.35)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700"
              }}
            >
              <ShieldCheck size={14} />
              <span>Admin Panel</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── NOTIFICATION TOAST ────────────────────────────────────── */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 90,
            background: "linear-gradient(135deg, #0e1b38, #070e22)",
            border: "1px solid #0052ff",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "10px",
            boxShadow: "0 8px 30px rgba(0, 82, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            fontWeight: "700"
          }}
        >
          <Sparkles size={16} style={{ color: "#0052ff" }} />
          <span>{notification}</span>
        </div>
      )}

      {/* ── WHATSAPP READY NOTIFICATION MODAL ───────────────────────── */}
      {whatsappModalData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(4, 8, 18, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setWhatsappModalData(null);
          }}
        >
          <div
            style={{
              background: "#0c152a",
              border: "1px solid #0052ff",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0, 40, 150, 0.4)",
              position: "relative"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    background: "rgba(37, 211, 102, 0.15)",
                    border: "1px solid rgba(37, 211, 102, 0.4)",
                    padding: "8px",
                    borderRadius: "10px",
                    color: "#25d366"
                  }}
                >
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "#fff", fontWeight: "800" }}>
                    WhatsApp Notification Dispatched
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                    Sending "Ready for Delivery" alert to customer phone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalData(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Recipient Details */}
            <div
              style={{
                background: "rgba(0, 82, 255, 0.08)",
                border: "1px solid rgba(0, 82, 255, 0.25)",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "14px",
                fontSize: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>Recipient Guest:</span>
                <strong style={{ color: "#fff" }}>{whatsappModalData.order?.customerName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>Target Phone Number:</span>
                <strong style={{ color: "#25d366", letterSpacing: "0.5px" }}>+{whatsappModalData.cleanPhone}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Auditorium & Seat:</span>
                <strong style={{ color: "#fff" }}>
                  Seat {whatsappModalData.order?.seat} ({whatsappModalData.order?.screen || "Screen 1"})
                </strong>
              </div>
            </div>

            {/* WhatsApp Message Preview Bubble */}
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Message Preview:
              </div>
              <div
                style={{
                  background: "#081022",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  color: "#cbd5e1",
                  whiteSpace: "pre-line",
                  maxHeight: "180px",
                  overflowY: "auto",
                  fontFamily: "monospace"
                }}
              >
                {whatsappModalData.message}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(whatsappModalData.message);
                  setCopiedMsg(true);
                  setTimeout(() => setCopiedMsg(false), 2000);
                }}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                {copiedMsg ? <Check size={14} color="#25d366" /> : <Copy size={14} />}
                <span>{copiedMsg ? "Copied!" : "Copy Text"}</span>
              </button>

              <a
                href={whatsappModalData.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1.5,
                  background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
                  border: "none",
                  color: "#000",
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "800",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)"
                }}
              >
                <ExternalLink size={15} />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE ────────────────────────────────────────── */}
      <div style={{ maxWidth: "1550px", margin: "0 auto", padding: "26px" }}>
        {/* KPI METRIC CARDS (Logo Theme) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "26px"
          }}
        >
          {[
            {
              label: "NEW ORDERS",
              val: pendingOrders.length,
              sub: "Requires kitchen prep",
              icon: Clock,
              color: "#f59e0b",
              filterId: "RECEIVED",
              active: pendingOrders.length > 0
            },
            {
              label: "IN KITCHEN",
              val: preparingOrders.length,
              sub: "Cooking & packing",
              icon: ChefHat,
              color: "#0052ff",
              filterId: "PREPARING",
              active: preparingOrders.length > 0
            },
            {
              label: "READY FOR DELIVERY",
              val: readyOrders.length,
              sub: "WhatsApp notified to guest",
              icon: Send,
              color: "#0052ff",
              filterId: "READY",
              active: readyOrders.length > 0
            },
            {
              label: "DELIVERED TO SEATS",
              val: deliveredOrders.length,
              sub: "Successfully served",
              icon: CheckCircle2,
              color: "#10b981",
              filterId: "DELIVERED",
              active: false
            },
            {
              label: "TODAY'S SHIFT SALES",
              val: `₹${todayRevenue.toLocaleString("en-IN")}`,
              sub: `${orders.length} total orders`,
              icon: IndianRupee,
              color: "#fff",
              filterId: "ALL",
              active: false
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                onClick={() => {
                  if (card.filterId) {
                    setActiveTab("dispatch");
                    setOrderFilter(card.filterId);
                  }
                }}
                style={{
                  background: "#0c152a",
                  border: card.active
                    ? `1px solid ${card.color}`
                    : "1px solid rgba(0, 82, 255, 0.18)",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  cursor: card.filterId ? "pointer" : "default",
                  boxShadow: card.active ? `0 0 16px ${card.color}25` : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {card.label}
                  </span>
                  <Icon size={16} style={{ color: card.color }} />
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "900",
                    color: "#fff",
                    marginBottom: "4px"
                  }}
                >
                  {card.val}
                </div>
                <div style={{ fontSize: "11px", color: card.active ? card.color : "#64748b" }}>
                  {card.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            borderBottom: "1px solid rgba(0, 82, 255, 0.2)",
            paddingBottom: "12px",
            marginBottom: "24px"
          }}
        >
          {/* Tab Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { id: "dispatch", label: "Live Order Dispatch", badge: pendingOrders.length + preparingOrders.length + readyOrders.length },
              { id: "ledger", label: "Orders Ledger", badge: null },
              { id: "sales", label: "Sales & Performance", badge: null },
              { id: "profile", label: "Profile & Credentials", badge: null }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? "linear-gradient(135deg, #0052ff, #0036b3)" : "transparent",
                    border: isActive ? "1px solid #0052ff" : "1px solid transparent",
                    color: isActive ? "#fff" : "#94a3b8",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: isActive ? "0 4px 15px rgba(0, 82, 255, 0.35)" : "none",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span
                      style={{
                        background: isActive ? "#fff" : "#0052ff",
                        color: isActive ? "#0052ff" : "#fff",
                        padding: "2px 7px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "900"
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Refresh */}
          <button
            onClick={loadOrders}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0, 82, 255, 0.12)",
              border: "1px solid rgba(0, 82, 255, 0.35)",
              color: "#fff",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={13} />
            <span>Sync Live Orders</span>
          </button>
        </div>

        {/* ── TAB 1: LIVE ORDER DISPATCH ─────────────────────────── */}
        {activeTab === "dispatch" && (
          <div>
            {/* Filter Bar: Auditorium & Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
                marginBottom: "20px"
              }}
            >
              {/* Screen Filters */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginRight: "4px" }}>
                  Auditorium:
                </span>
                {["ALL", ...availableScreens].map((scr) => {
                  const isSel = selectedScreen === scr;
                  return (
                    <button
                      key={scr}
                      onClick={() => setSelectedScreen(scr)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: isSel ? "1px solid #0052ff" : "1px solid rgba(0, 82, 255, 0.15)",
                        background: isSel ? "rgba(0, 82, 255, 0.25)" : "#0c152a",
                        color: isSel ? "#fff" : "#94a3b8",
                        fontSize: "12px",
                        fontWeight: isSel ? "700" : "500",
                        cursor: "pointer"
                      }}
                    >
                      {scr === "ALL" ? "All Auditoriums" : scr}
                    </button>
                  );
                })}
              </div>

              {/* Status Filter */}
              <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
                {[
                  { id: "ALL", label: "All Active", count: orders.length },
                  { id: "RECEIVED", label: "Received", count: pendingOrders.length },
                  { id: "PREPARING", label: "In Kitchen", count: preparingOrders.length },
                  { id: "READY", label: "Ready (WhatsApp)", count: readyOrders.length },
                  { id: "DELIVERED", label: "Delivered", count: deliveredOrders.length }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setOrderFilter(s.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: orderFilter === s.id ? "1px solid #0052ff" : "1px solid transparent",
                      background: orderFilter === s.id ? "rgba(0, 82, 255, 0.2)" : "transparent",
                      color: orderFilter === s.id ? "#fff" : "#94a3b8",
                      fontSize: "12px",
                      fontWeight: orderFilter === s.id ? "700" : "500",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {s.label} ({s.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  background: "#0c152a",
                  border: "1px dashed rgba(0, 82, 255, 0.25)",
                  borderRadius: "12px",
                  padding: "50px 20px",
                  textAlign: "center"
                }}
              >
                <ShoppingBag size={40} style={{ color: "#64748b", marginBottom: "12px" }} />
                <h3 style={{ margin: "0 0 6px", color: "#fff", fontSize: "16px" }}>
                  No Orders in this View
                </h3>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
                  Switch to "All Auditoriums" or clear status filter.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "18px"
                }}
              >
                {filteredOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={ord.id}
                      style={{
                        background: "#0c152a",
                        border: `1px solid ${badge.border}`,
                        borderRadius: "14px",
                        padding: "18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 4px 18px rgba(0, 8, 25, 0.6)",
                        position: "relative"
                      }}
                    >
                      {/* Ticket Header */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff", letterSpacing: "0.5px" }}>
                                #{ord.id}
                              </span>
                              <span
                                style={{
                                  background: badge.bg,
                                  color: badge.color,
                                  border: `1px solid ${badge.border}`,
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                <BadgeIcon size={12} />
                                {badge.label}
                              </span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent"}
                            </div>
                          </div>

                          {/* Seat Badge */}
                          <div
                            style={{
                              background: "rgba(0, 82, 255, 0.15)",
                              border: "1px solid rgba(0, 82, 255, 0.4)",
                              borderRadius: "8px",
                              padding: "5px 12px",
                              textAlign: "right"
                            }}
                          >
                            <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>
                              SEAT {ord.seat}
                            </div>
                            <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                              {ord.screen || "Screen 1"}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info & Direct WhatsApp Trigger */}
                        <div
                          style={{
                            background: "rgba(7, 11, 20, 0.6)",
                            border: "1px solid rgba(0, 82, 255, 0.15)",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "12px"
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: "700", color: "#fff" }}>{ord.customerName}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{ord.phone}</div>
                          </div>
                          {ord.phone && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <a
                                href={`tel:${ord.phone}`}
                                style={{
                                  background: "rgba(255, 255, 255, 0.06)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  color: "#fff",
                                  padding: "6px 8px",
                                  borderRadius: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  textDecoration: "none"
                                }}
                                title="Call Guest"
                              >
                                <Phone size={13} />
                              </a>
                              <button
                                type="button"
                                onClick={() => triggerWhatsAppForOrder(ord)}
                                style={{
                                  background: "rgba(37, 211, 102, 0.15)",
                                  border: "1px solid rgba(37, 211, 102, 0.4)",
                                  color: "#25d366",
                                  padding: "6px 9px",
                                  borderRadius: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  fontWeight: "700"
                                }}
                                title="Send WhatsApp Update to this customer"
                              >
                                <MessageSquare size={13} />
                                <span>WhatsApp</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Items Breakdown */}
                        <div
                          style={{
                            background: "rgba(7, 11, 20, 0.6)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            marginBottom: "14px"
                          }}
                        >
                          <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>
                            Concession Items:
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {ord.items?.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "12px"
                                }}
                              >
                                <div>
                                  <span style={{ color: "#fff", fontWeight: "700", marginRight: "6px" }}>
                                    {item.quantity}×
                                  </span>
                                  <span style={{ color: "#e2e8f0" }}>{item.name}</span>
                                </div>
                                <span style={{ color: "#94a3b8" }}>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div
                            style={{
                              marginTop: "8px",
                              paddingTop: "8px",
                              borderTop: "1px dashed rgba(0, 82, 255, 0.2)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Total:</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong style={{ fontSize: "14px", color: "#fff" }}>₹{ord.total}</strong>
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "1px 5px",
                                  borderRadius: "3px",
                                  background: ord.paymentStatus === "PAID" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                  color: ord.paymentStatus === "PAID" ? "#10b981" : "#f59e0b"
                                }}
                              >
                                {ord.paymentStatus || "PAID"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Primary Actions with WhatsApp Trigger */}
                      <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                        {ord.status === "RECEIVED" && (
                          <button
                            onClick={() => handleStatusChange(ord.id, "PREPARING")}
                            disabled={updatingOrderId === ord.id}
                            style={{
                              width: "100%",
                              background: "rgba(0, 82, 255, 0.18)",
                              border: "1px solid rgba(0, 82, 255, 0.4)",
                              color: "#fff",
                              padding: "10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}
                          >
                            <ChefHat size={14} />
                            <span>Start Kitchen Prep</span>
                          </button>
                        )}

                        {/* If in kitchen, ONE-CLICK READY FOR DELIVERY & WHATSAPP NOTIFICATION */}
                        {ord.status === "PREPARING" && (
                          <button
                            onClick={() => handleStatusChange(ord.id, "READY")}
                            disabled={updatingOrderId === ord.id}
                            style={{
                              width: "100%",
                              background: "linear-gradient(135deg, #0052ff 0%, #0036b3 100%)",
                              border: "none",
                              color: "#fff",
                              padding: "11px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "800",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              boxShadow: "0 4px 15px rgba(0, 82, 255, 0.4)"
                            }}
                          >
                            <Send size={14} />
                            <span>Ready for Delivery & Send WhatsApp</span>
                          </button>
                        )}

                        {/* If ready, Deliver to Seat */}
                        {ord.status === "READY" && (
                          <button
                            onClick={() => handleStatusChange(ord.id, "DELIVERED")}
                            disabled={updatingOrderId === ord.id}
                            style={{
                              width: "100%",
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              border: "none",
                              color: "#fff",
                              padding: "11px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "800",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Delivered to Seat</span>
                          </button>
                        )}

                        {ord.status === "DELIVERED" && (
                          <div
                            style={{
                              width: "100%",
                              background: "rgba(16, 185, 129, 0.12)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              color: "#10b981",
                              padding: "9px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textAlign: "center"
                            }}
                          >
                            ✓ Order Delivered to Seat
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "6px" }}>
                          {/* Resend WhatsApp button */}
                          <button
                            onClick={() => triggerWhatsAppForOrder(ord)}
                            style={{
                              flex: 1,
                              background: "rgba(37, 211, 102, 0.12)",
                              border: "1px solid rgba(37, 211, 102, 0.3)",
                              color: "#25d366",
                              padding: "8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px"
                            }}
                          >
                            <MessageSquare size={12} />
                            <span>WhatsApp Alert</span>
                          </button>

                          <button
                            onClick={() => {
                              setStatusModalOrder(ord);
                              setNewStatusSelection(ord.status);
                            }}
                            style={{
                              background: "rgba(255, 255, 255, 0.06)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#94a3b8",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer"
                            }}
                            title="More status options"
                          >
                            •••
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ORDERS LEDGER TABLE ──────────────────────────── */}
        {activeTab === "ledger" && (
          <div
            style={{
              background: "#0c152a",
              border: "1px solid rgba(0, 82, 255, 0.2)",
              borderRadius: "12px",
              padding: "20px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
                marginBottom: "20px"
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#fff", fontWeight: "800" }}>
                  Orders Ledger
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                  View all past tickets and trigger customer WhatsApp notifications.
                </p>
              </div>

              {/* Search */}
              <div style={{ position: "relative", minWidth: "260px" }}>
                <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Search by order ID, seat, guest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#070b14",
                    border: "1px solid rgba(0, 82, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "8px 12px 8px 34px",
                    color: "#fff",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#070b14", borderBottom: "1px solid rgba(0, 82, 255, 0.2)", color: "#94a3b8", fontSize: "11px", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 14px" }}>Ticket ID</th>
                    <th style={{ padding: "12px 14px" }}>Seat / Screen</th>
                    <th style={{ padding: "12px 14px" }}>Guest</th>
                    <th style={{ padding: "12px 14px" }}>Items</th>
                    <th style={{ padding: "12px 14px" }}>Total</th>
                    <th style={{ padding: "12px 14px" }}>Status</th>
                    <th style={{ padding: "12px 14px", textAlign: "right" }}>WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
                    const badge = getStatusBadge(ord.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <tr key={ord.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                        <td style={{ padding: "12px 14px" }}>
                          <strong style={{ color: "#fff" }}>#{ord.id}</strong>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ color: "#fff", fontWeight: "700" }}>Seat {ord.seat}</span>
                          <span style={{ color: "#94a3b8", marginLeft: "6px" }}>({ord.screen || "Screen 1"})</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ color: "#fff", fontWeight: "600" }}>{ord.customerName}</div>
                          <div style={{ color: "#64748b", fontSize: "11px" }}>{ord.phone}</div>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#cbd5e1" }}>
                          {ord.items?.map((it, i) => (
                            <span key={i} style={{ marginRight: "8px" }}>
                              {it.quantity}× {it.name}
                            </span>
                          ))}
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: "700", color: "#fff" }}>
                          ₹{ord.total}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "700"
                            }}
                          >
                            <BadgeIcon size={11} />
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            onClick={() => triggerWhatsAppForOrder(ord)}
                            style={{
                              background: "rgba(37, 211, 102, 0.15)",
                              border: "1px solid rgba(37, 211, 102, 0.35)",
                              color: "#25d366",
                              padding: "5px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <MessageSquare size={12} />
                            <span>Notify</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: SALES & INCENTIVES ──────────────────────────── */}
        {activeTab === "sales" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#fff", fontWeight: "800" }}>
                Sales & Performance
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                Concession delivery volume and runner commission report.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
                marginBottom: "24px"
              }}
            >
              {[
                { title: "TODAY'S SHIFT SALES", val: `₹${todayRevenue.toLocaleString("en-IN")}`, sub: `${orders.length} orders delivered`, color: "#10b981" },
                { title: "WEEKLY CONCESSION REVENUE", val: "₹68,450", sub: "142 orders handled", color: "#0052ff" },
                { title: "MONTHLY VOLUME", val: `₹${(salesman?.monthlySales || 184200).toLocaleString("en-IN")}`, sub: "Target: ₹2,00,000 (92% reached)", color: "#fff" },
                { title: "RUNNER INCENTIVE BONUS", val: "₹9,210", sub: "5% concession incentive credited", color: "#0052ff" }
              ].map((s) => (
                <div
                  key={s.title}
                  style={{
                    background: "#0c152a",
                    border: "1px solid rgba(0, 82, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "18px"
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "900", color: s.color, margin: "6px 0" }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: MY PROFILE & CREDENTIALS ─────────────────────── */}
        {activeTab === "profile" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#fff", fontWeight: "800" }}>
                Salesman Employee Profile & Security Credentials
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                Duty records and credentials managed by Cinema Administration.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {/* Profile Card */}
              <div
                style={{
                  background: "#0c152a",
                  border: "1px solid rgba(0, 82, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center"
                }}
              >
                <img
                  src={salesman?.avatar}
                  alt={salesman?.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0052ff",
                    margin: "0 auto 14px"
                  }}
                />
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#fff", fontWeight: "800" }}>
                  {salesman?.name}
                </h3>
                <div style={{ fontSize: "12px", color: "#fff", fontWeight: "700", marginBottom: "12px" }}>
                  {salesman?.role}
                </div>
                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#10b981",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "700"
                  }}
                >
                  ● Active On Duty
                </span>

                <div
                  style={{
                    borderTop: "1px solid rgba(0, 82, 255, 0.2)",
                    marginTop: "18px",
                    paddingTop: "14px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Employee ID:</span>
                    <strong style={{ color: "#fff" }}>{salesman?.id}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Service Rating:</span>
                    <strong style={{ color: "#fff" }}>⭐ {salesman?.rating || "4.9"} / 5.0</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Career Orders:</span>
                    <strong style={{ color: "#fff" }}>{salesman?.totalOrders || "412"}</strong>
                  </div>
                </div>
              </div>

              {/* Security Credentials Box */}
              <div
                style={{
                  background: "#0c152a",
                  border: "1px solid rgba(0, 82, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <h4 style={{ margin: 0, fontSize: "15px", color: "#fff", fontWeight: "700" }}>
                  Portal Security & Auditorium Duty
                </h4>

                {/* Password Tag */}
                <div
                  style={{
                    background: "rgba(0, 82, 255, 0.08)",
                    border: "1px dashed rgba(0, 82, 255, 0.35)",
                    borderRadius: "8px",
                    padding: "14px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", fontWeight: "700", fontSize: "11px", marginBottom: "4px" }}>
                    <Key size={14} />
                    <span>PORTAL LOGIN PASSWORD:</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "1px" }}>
                      {salesman?.password || "password123"}
                    </span>
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                      Configured by Admin
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                    Registered Email
                  </label>
                  <div style={{ fontSize: "13px", color: "#fff", marginTop: "2px" }}>
                    {salesman?.email}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                    Assigned Auditoriums / Screens
                  </label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                    {salesman?.assignedScreens?.map((scr) => (
                      <span
                        key={scr}
                        style={{
                          background: "rgba(0, 82, 255, 0.15)",
                          border: "1px solid rgba(0, 82, 255, 0.3)",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "700"
                        }}
                      >
                        {scr}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "12px",
                    color: "#10b981"
                  }}
                >
                  ✓ <strong>WhatsApp Notification Permission Active:</strong> Orders moved to "Ready for Delivery" automatically trigger WhatsApp updates to customers.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STATUS ADJUSTMENT MODAL ────────────────────────── */}
      {statusModalOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setStatusModalOrder(null);
          }}
        >
          <div
            style={{
              background: "#0c152a",
              border: "1px solid #0052ff",
              borderRadius: "14px",
              padding: "22px",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#fff", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Status Controller
                </span>
                <h3 style={{ margin: "2px 0 0", fontSize: "17px", color: "#fff" }}>
                  Update Order #{statusModalOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setStatusModalOrder(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                background: "#070b14",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "16px",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Guest:</span>
                <strong style={{ color: "#fff" }}>{statusModalOrder.customerName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Phone:</span>
                <strong style={{ color: "#25d366" }}>{statusModalOrder.phone}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Location:</span>
                <strong style={{ color: "#fff" }}>Seat {statusModalOrder.seat} ({statusModalOrder.screen || "Screen 1"})</strong>
              </div>
            </div>

            <label style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
              Choose Status:
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {[
                { id: "RECEIVED", label: "Received", desc: "Guest placed order from seat", color: "#f59e0b" },
                { id: "PREPARING", label: "In Kitchen", desc: "Staff assembling food and drinks", color: "#0052ff" },
                { id: "READY", label: "🚀 Ready for Delivery", desc: "Triggers WhatsApp alert to customer phone!", color: "#0052ff" },
                { id: "DELIVERED", label: "Delivered to Seat", desc: "Delivered to guest in auditorium", color: "#10b981" },
                { id: "CANCELLED", label: "Cancelled", desc: "Order voided or refunded", color: "#ef4444" }
              ].map((st) => {
                const isChecked = newStatusSelection === st.id;
                return (
                  <label
                    key={st.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: isChecked ? "rgba(0, 82, 255, 0.18)" : "#070b14",
                      border: isChecked ? "1px solid #0052ff" : "1px solid rgba(255, 255, 255, 0.06)",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="radio"
                      name="logoModalStatusChoice"
                      value={st.id}
                      checked={isChecked}
                      onChange={(e) => setNewStatusSelection(e.target.value)}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: isChecked ? "#fff" : "#fff" }}>
                        {st.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{st.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                style={{
                  flex: 1,
                  background: "#070b14",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94a3b8",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(statusModalOrder.id, newStatusSelection)}
                disabled={updatingOrderId === statusModalOrder.id}
                style={{
                  flex: 1.2,
                  background: "linear-gradient(135deg, #0052ff 0%, #0036b3 100%)",
                  border: "none",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0, 82, 255, 0.4)"
                }}
              >
                {updatingOrderId === statusModalOrder.id ? "Updating..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
