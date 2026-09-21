import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  Clock3,
  CheckCircle2,
  RefreshCw,
  X,
  Megaphone,
  ImagePlay,
  Tag,
  Images,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Globe,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Calendar,
  Upload,
  UserCheck,
  TrendingUp,
  Star,
  Users,
  FileBarChart,
  Phone,
  Mail,
  MapPin,
  Award,
  MessageSquare,
  ChevronDown,
  BarChart3,
  DollarSign,
  Clock,
  XCircle,
  ChefHat,
  Search,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertTriangle,
  Key,
  Lock,
  Building2,
  Workflow,
  Send,
  CalendarClock,
  MessageCircle,
  Save,
  ChevronRight,
} from "lucide-react";

import AdminSidebar from "../../admin/components/AdminSidebar";
import AdminHeader from "../../admin/components/AdminHeader";
import StatCard from "../../admin/components/StatCard";
import OrderTable from "../../admin/components/OrderTable";
import MenuTable from "../../admin/components/MenuTable";
import OrderStatusBadge from "../../admin/components/OrderStatusBadge";

import { useAdminAuth } from "../../admin/context/AdminAuthContext";
import { getSalesmen, saveSalesmen, setSalesmanPassword, getReviews, saveReviews } from "../../services/salesmanService";
import { getTheaterConfig, saveTheaterConfig as persistTheaterConfig } from "../../utils/theaterConfig";

const initialOrders = [
  {
    id: "ORD-1042",
    customerName: "Rahul",
    phone: "9876543210",
    seat: "A12",
    status: "PREPARING",
    total: 420,
    time: "10:32 AM",
    items: [
      {
        name: "Classic Popcorn",
        quantity: 2,
        price: 150,
      },
      {
        name: "Coke",
        quantity: 1,
        price: 120,
      },
    ],
  },

  {
    id: "ORD-1041",
    customerName: "Anjali",
    phone: "9847012345",
    seat: "B08",
    status: "READY",
    total: 580,
    time: "10:28 AM",
    items: [
      {
        name: "Chicken Burger",
        quantity: 1,
        price: 280,
      },
      {
        name: "Fries",
        quantity: 1,
        price: 150,
      },
      {
        name: "Coke",
        quantity: 1,
        price: 150,
      },
    ],
  },

  {
    id: "ORD-1040",
    customerName: "Arjun",
    phone: "9995123456",
    seat: "C15",
    status: "RECEIVED",
    total: 350,
    time: "10:22 AM",
    items: [
      {
        name: "Nachos",
        quantity: 1,
        price: 200,
      },
      {
        name: "Water",
        quantity: 1,
        price: 50,
      },
    ],
  },

  {
    id: "ORD-1039",
    customerName: "Meera",
    phone: "9567123456",
    seat: "A04",
    status: "DELIVERED",
    total: 720,
    time: "10:10 AM",
    items: [
      {
        name: "Chicken Burger",
        quantity: 2,
        price: 280,
      },
      {
        name: "Coke",
        quantity: 1,
        price: 160,
      },
    ],
  },

  {
    id: "ORD-1038",
    customerName: "Vishnu",
    phone: "9496755714",
    seat: "D20",
    status: "DELIVERED",
    total: 280,
    time: "09:58 AM",
    items: [
      {
        name: "Classic Popcorn",
        quantity: 1,
        price: 150,
      },
      {
        name: "Water",
        quantity: 1,
        price: 50,
      },
    ],
  },
];

const initialMenu = [
  {
    id: "menu-1",
    name: "Classic Popcorn",
    description: "Fresh buttery cinema popcorn",
    category: "Popcorn",
    price: 150,
    stock: 42,
    available: true,
    image: "/images/popcorn.jpg",
  },

  {
    id: "menu-2",
    name: "Chicken Burger",
    description: "Crispy chicken burger",
    category: "Meals",
    price: 280,
    stock: 18,
    available: true,
    image: "/images/burger.jpg",
  },

  {
    id: "menu-3",
    name: "Loaded Nachos",
    description: "Nachos with cheese and salsa",
    category: "Snacks",
    price: 200,
    stock: 25,
    available: true,
    image: "/images/nachos.jpg",
  },

  {
    id: "menu-4",
    name: "Coke",
    description: "Chilled Coca-Cola",
    category: "Drinks",
    price: 120,
    stock: 8,
    available: true,
    image: "/images/coke.jpg",
  },

  {
    id: "menu-5",
    name: "French Fries",
    description: "Crispy golden fries",
    category: "Snacks",
    price: 150,
    stock: 3,
    available: true,
    image: "/images/fries.jpg",
  },

  {
    id: "menu-6",
    name: "Mineral Water",
    description: "500ml bottled water",
    category: "Drinks",
    price: 50,
    stock: 60,
    available: true,
    image: "/images/water.jpg",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    adminData,
    user,
    logout,
  } = useAdminAuth();

  const [activePage, setActivePage] =
    useState("dashboard");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [orders, setOrders] =
    useState(initialOrders);

  const [menuItems, setMenuItems] =
    useState(initialMenu);

  const [theaterConfig, setTheaterConfig] = useState(() => {
    return getTheaterConfig();
  });
  const [configSaved, setConfigSaved] = useState(false);
  const [templates, setTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("theater_message_templates")) || []; } catch { return []; }
  });
  const [templateDraft, setTemplateDraft] = useState({ name: "Order received", trigger: "Order received", body: "Hi {{customer_name}}, we’ve received order {{order_id}}. We’ll notify you when it’s ready." });
  const [workflowSteps, setWorkflowSteps] = useState(() => {
    try { return JSON.parse(localStorage.getItem("theater_workflow")) || [{ id: "received", label: "Order received", delay: "Immediately", enabled: true }, { id: "preparing", label: "Preparing", delay: "When kitchen starts", enabled: true }, { id: "ready", label: "Ready for pickup", delay: "When marked ready", enabled: true }]; } catch { return []; }
  });
  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem("theater_campaigns")) || [{ id: "weekend", name: "Weekend combo reminder", segment: "Frequent guests", schedule: "Sat, 11:30 AM", status: "Scheduled", recipients: 248 }]; } catch { return []; }
  });
  const [campaignDraft, setCampaignDraft] = useState({ name: "", message: "Hi {{customer_name}}, enjoy 15% off your next cinema combo this weekend.", segment: "Frequent guests", schedule: "" });

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orderFilter, setOrderFilter] =
    useState("ALL");

  const [orderSearch, setOrderSearch] =
    useState("");

  const [menuModal, setMenuModal] =
    useState(null);

  const [menuForm, setMenuForm] =
    useState({
      name: "",
      description: "",
      category: "Snacks",
      price: "",
      stock: "",
      image: "/images/popcorn.jpg",
      available: true,
    });

  // ── Advertisement Management State ────────────────────────────
  const defaultAds = [
    {
      id: "ad-001",
      type: "advertisement",
      title: "Avengers: Secret Wars — Now Showing",
      description: "The most anticipated Marvel event of the decade. Book your IMAX seats before they sell out!",
      buttonText: "Book Tickets",
      redirectUrl: "https://your-movie-site.com/movies/avengers",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
      startDate: "2026-09-20",
      endDate: "2026-10-20",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ad-002",
      type: "advertisement",
      title: "Stree 3 — Pre-Booking Open",
      description: "India's biggest horror comedy is back! Pre-book your seats and enjoy exclusive combo deals.",
      buttonText: "Pre-Book Now",
      redirectUrl: "https://your-movie-site.com/movies/stree3",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const defaultBanners = [
    {
      id: "ban-001",
      title: "Weekend Special",
      subtitle: "Enjoy 20% off on all combo meals this weekend",
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80",
      position: "Hero",
      isActive: true,
    },
    {
      id: "ban-002",
      title: "Dolby Atmos Experience",
      subtitle: "Upgrade to Dolby Atmos for the ultimate sound",
      imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=80",
      position: "Sidebar",
      isActive: false,
    },
  ];

  const defaultOffers = [
    {
      id: "off-001",
      title: "Intermission Combo",
      description: "Popcorn (Large) + Any Cold Drink",
      originalPrice: 350,
      offerPrice: 280,
      imageUrl: "/images/popcorn.svg",
      validUntil: "2026-10-31",
      isActive: true,
    },
    {
      id: "off-002",
      title: "IMAX Double Deal",
      description: "2x Burger + 2x Cold Drink",
      originalPrice: 800,
      offerPrice: 599,
      imageUrl: "/images/burger.svg",
      validUntil: "2026-09-30",
      isActive: true,
    },
  ];

  const [ads, setAds] = useState(() => {
    try {
      const s = localStorage.getItem("cinema_ads");
      return s ? JSON.parse(s) : defaultAds;
    } catch { return defaultAds; }
  });

  const [banners, setBanners] = useState(() => {
    try {
      const s = localStorage.getItem("cinema_banners");
      return s ? JSON.parse(s) : defaultBanners;
    } catch { return defaultBanners; }
  });

  const [offers, setOffers] = useState(() => {
    try {
      const s = localStorage.getItem("cinema_offers");
      return s ? JSON.parse(s) : defaultOffers;
    } catch { return defaultOffers; }
  });

  const [mainSiteUrl, setMainSiteUrl] = useState(
    () => localStorage.getItem("cinema_main_site_url") || "https://your-movie-site.com"
  );
  const [mainSiteUrlDraft, setMainSiteUrlDraft] = useState(
    () => localStorage.getItem("cinema_main_site_url") || "https://your-movie-site.com"
  );

  // Ad form modal
  const emptyAdForm = {
    title: "",
    description: "",
    buttonText: "Book Tickets",
    redirectUrl: "",
    imageUrl: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
  };
  const [adModal, setAdModal] = useState(null); // null | { mode:'add'|'edit', id? }
  const [adForm, setAdForm] = useState(emptyAdForm);
  const [adPreview, setAdPreview] = useState(false);

  // Banner form modal
  const emptyBanForm = { title: "", subtitle: "", imageUrl: "", position: "Hero", isActive: true };
  const [banModal, setBanModal] = useState(null);
  const [banForm, setBanForm] = useState(emptyBanForm);

  // Offer form modal
  const emptyOffForm = { title: "", description: "", originalPrice: "", offerPrice: "", imageUrl: "", validUntil: "", isActive: true };
  const [offModal, setOffModal] = useState(null);
  const [offForm, setOffForm] = useState(emptyOffForm);

  const saveAds = (next) => { setAds(next); localStorage.setItem("cinema_ads", JSON.stringify(next)); };
  const saveBanners = (next) => { setBanners(next); localStorage.setItem("cinema_banners", JSON.stringify(next)); };
  const saveOffers = (next) => { setOffers(next); localStorage.setItem("cinema_offers", JSON.stringify(next)); };

  // ── Salesmen State ─────────────────────────────────────────────────
  const [salesmen, setSalesmen] = useState(() => getSalesmen());
  const [salesmanModal, setSalesmanModal] = useState(null); // null | { mode:'add'|'edit', id? }
  const emptySalesmanForm = {
    name: "", email: "", password: "password123", phone: "", role: "Concession Specialist",
    assignedScreens: "", active: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  };
  const [salesmanForm, setSalesmanForm] = useState(emptySalesmanForm);
  const [salesmanFilter, setSalesmanFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null); // null | { id, name, currentPassword, newPassword }
  const [salesmanSuccessMsg, setSalesmanSuccessMsg] = useState("");

  function handleSaveSalesman(e) {
    e.preventDefault();
    if (!salesmanForm.name.trim()) return;
    const screens = salesmanForm.assignedScreens.split(",").map(s => s.trim()).filter(Boolean);
    if (salesmanModal.mode === "add") {
      const next = [...salesmen, {
        ...salesmanForm,
        id: `SM-${Date.now()}`,
        password: salesmanForm.password?.trim() || "password123",
        assignedScreens: screens,
        totalSales: 0, monthlySales: 0, todaySales: 0,
        totalOrders: 0, todayOrders: 0, pendingOrders: 0, completedOrders: 0,
        rating: 5.0, joinedDate: new Date().toISOString().split("T")[0]
      }];
      setSalesmen(next); saveSalesmen(next);
      setSalesmanSuccessMsg(`Salesman "${salesmanForm.name}" created with password!`);
      setTimeout(() => setSalesmanSuccessMsg(""), 4500);
    } else {
      const next = salesmen.map(s => s.id === salesmanModal.id ? {
        ...s,
        ...salesmanForm,
        password: salesmanForm.password?.trim() || s.password || "password123",
        assignedScreens: screens
      } : s);
      setSalesmen(next); saveSalesmen(next);
      setSalesmanSuccessMsg(`Salesman "${salesmanForm.name}" updated successfully.`);
      setTimeout(() => setSalesmanSuccessMsg(""), 4500);
    }
    setSalesmanModal(null);
  }

  function handleSavePassword(e) {
    e.preventDefault();
    if (!passwordModal || !passwordModal.newPassword.trim()) return;
    const updated = setSalesmanPassword(passwordModal.id, passwordModal.newPassword.trim());
    if (updated) {
      setSalesmen(updated);
      setSalesmanSuccessMsg(`🔑 Password for ${passwordModal.name} updated to "${passwordModal.newPassword.trim()}". Salesman can now log in with it!`);
      setTimeout(() => setSalesmanSuccessMsg(""), 5000);
    }
    setPasswordModal(null);
  }

  function handleToggleSalesman(id) {
    const next = salesmen.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setSalesmen(next); saveSalesmen(next);
  }

  function handleDeleteSalesman(id) {
    if (!window.confirm("Remove this salesman?")) return;
    const next = salesmen.filter(s => s.id !== id);
    setSalesmen(next); saveSalesmen(next);
  }

  // ── Sales Filter State ──────────────────────────────────────────────
  const [salesFilter, setSalesFilter] = useState("all"); // all | today | weekly | monthly | bySalesman
  const [salesSalesmanFilter, setSalesSalesmanFilter] = useState("ALL");

  // ── Reviews State ────────────────────────────────────────────────────
  const [reviews, setReviews] = useState(() => getReviews());
  const [reviewReplyModal, setReviewReplyModal] = useState(null); // { id, currentReply }
  const [reviewReplyText, setReviewReplyText] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState(0); // 0 = all

  function handleReviewReply(id) {
    const next = reviews.map(r => r.id === id ? { ...r, reply: reviewReplyText } : r);
    setReviews(next); saveReviews(next);
    setReviewReplyModal(null); setReviewReplyText("");
  }

  function handleToggleHideReview(id) {
    const next = reviews.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
    setReviews(next); saveReviews(next);
  }

  function handleDeleteReview(id) {
    if (!window.confirm("Delete this review?")) return;
    const next = reviews.filter(r => r.id !== id);
    setReviews(next); saveReviews(next);
  }

  // ── Customers derived from orders ────────────────────────────────────
  const customers = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const key = o.phone || o.customerName;
      if (!key) return;
      if (!map[key]) {
        map[key] = {
          name: o.customerName || "Guest",
          phone: o.phone || "N/A",
          totalOrders: 0, totalSpent: 0,
          lastOrder: o.time || "-", lastSeat: o.seat || "-",
        };
      }
      map[key].totalOrders++;
      map[key].totalSpent += Number(o.total) || 0;
    });
    return Object.values(map);
  }, [orders]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(
        (order) =>
          order.status !== "CANCELLED"
      )
      .reduce(
        (sum, order) =>
          sum + order.total,
        0
      );

    const activeOrders = orders.filter(
      (order) =>
        !["DELIVERED", "CANCELLED"].includes(
          order.status
        )
    ).length;

    const deliveredOrders = orders.filter(
      (order) =>
        order.status === "DELIVERED"
    ).length;

    return {
      orders: orders.length,
      revenue: totalRevenue,
      activeOrders,
      deliveredOrders,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        orderFilter === "ALL" ||
        order.status === orderFilter;

      const search =
        orderSearch.toLowerCase();

      const matchesSearch =
        !search ||
        order.id
          .toLowerCase()
          .includes(search) ||
        order.customerName
          .toLowerCase()
          .includes(search) ||
        order.seat
          .toLowerCase()
          .includes(search);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [
    orders,
    orderFilter,
    orderSearch,
  ]);

  function handleStatusChange(
    orderId,
    status
  ) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  }

  function handleDeleteMenuItem(id) {
    const confirmed =
      window.confirm(
        "Delete this menu item?"
      );

    if (!confirmed) return;

    setMenuItems((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  }

  function openAddMenu() {
    setMenuForm({
      name: "",
      description: "",
      category: "Snacks",
      price: "",
      stock: "",
      image: "/images/popcorn.jpg",
      available: true,
    });

    setMenuModal({
      mode: "add",
    });
  }

  function openEditMenu(item) {
    setMenuForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      stock: item.stock,
      image: item.image,
      available: item.available,
    });

    setMenuModal({
      mode: "edit",
      id: item.id,
    });
  }

  function handleMenuSubmit(event) {
    event.preventDefault();

    if (!menuForm.name.trim()) return;

    if (menuModal.mode === "add") {
      const newItem = {
        id: `menu-${Date.now()}`,
        ...menuForm,
        price: Number(menuForm.price),
        stock: Number(menuForm.stock),
      };

      setMenuItems((items) => [
        ...items,
        newItem,
      ]);
    } else {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === menuModal.id
            ? {
                ...item,
                ...menuForm,
                price: Number(
                  menuForm.price
                ),
                stock: Number(
                  menuForm.stock
                ),
              }
            : item
        )
      );
    }

    setMenuModal(null);
  }

  async function handleLogout() {
    if (logout) {
      await logout();
    } else {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("../../services/firebase");
      await signOut(auth);
    }
  }

  function saveTheaterConfig() {
    persistTheaterConfig(theaterConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTheaterConfig((current) => ({ ...current, logo: reader.result }));
    reader.readAsDataURL(file);
  }

  function saveTemplate() {
    if (!templateDraft.name.trim() || !templateDraft.body.trim()) return;
    const next = [...templates.filter((item) => item.trigger !== templateDraft.trigger), { ...templateDraft, id: `template-${Date.now()}` }];
    setTemplates(next);
    localStorage.setItem("theater_message_templates", JSON.stringify(next));
  }

  function saveWorkflow(next) {
    setWorkflowSteps(next);
    localStorage.setItem("theater_workflow", JSON.stringify(next));
  }

  function scheduleCampaign() {
    if (!campaignDraft.name.trim() || !campaignDraft.schedule) return;
    const next = [...campaigns, { ...campaignDraft, id: `campaign-${Date.now()}`, status: "Scheduled", recipients: campaignDraft.segment === "All customers" ? 1240 : campaignDraft.segment === "Frequent guests" ? 248 : 96 }];
    setCampaigns(next);
    localStorage.setItem("theater_campaigns", JSON.stringify(next));
    setCampaignDraft({ name: "", message: "Hi {{customer_name}}, enjoy 15% off your next cinema combo this weekend.", segment: "Frequent guests", schedule: "" });
  }

  const pageConfig = {
    dashboard: { title: "Admin Dashboard", subtitle: "Real-time overview of theater operations." },
    advertisements: { title: "Advertisements", subtitle: "Create and manage promotional ads redirecting to your main movie website." },
    salesmen: { title: "Salesmen Management", subtitle: "Add, edit, and manage your concession sales team." },
    sales: { title: "Sales Reports", subtitle: "Track revenue by time period or salesman." },
    orders: { title: "Orders", subtitle: "View all customer orders. Salesman handles status updates." },
    reviews: { title: "Reviews & Ratings", subtitle: "Manage customer feedback and replies." },
    customers: { title: "Customers", subtitle: "View customer profiles and purchase history." },
    reports: { title: "Reports", subtitle: "Comprehensive analytics across all system modules." },
    settings: { title: "Settings", subtitle: "Configure main website URL, theater info, and admin preferences." },
    menu: { title: "Menu Management", subtitle: "Manage your theater food menu." },
    banners: { title: "Banners", subtitle: "Manage hero and sidebar image banners." },
    offers: { title: "Offers & Combos", subtitle: "Create food combo offers and special deals." },
    "image-library": { title: "Image Library", subtitle: "All images used across advertisements, banners, and offers." },
    analytics: { title: "Analytics", subtitle: "Track sales and ordering performance." },
    "theater-config": { title: "Theater Configuration", subtitle: "Manage your white-label identity and location details." },
    workflow: { title: "Messaging Workflow", subtitle: "Design WhatsApp templates and automated order updates." },
    campaigns: { title: "Ad Campaigns", subtitle: "Draft, target, and schedule promotional WhatsApp broadcasts." },
  };

  // ── Shared modal styles ───────────────────────────────────────────
  const modalBackdrop = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  };
  const modalBox = {
    background: "var(--cinema-surface)", border: "1px solid var(--cinema-border)",
    borderRadius: "16px", width: "100%", maxWidth: "640px",
    maxHeight: "90vh", overflowY: "auto", padding: "28px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
  };
  const fieldStyle = {
    width: "100%", background: "var(--cinema-surface-2)",
    border: "1px solid var(--cinema-border)", borderRadius: "8px",
    padding: "10px 14px", color: "#fff", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: "700",
    color: "#888", letterSpacing: "0.5px", marginBottom: "6px", textTransform: "uppercase" };

  // ── ADVERTISEMENTS render ─────────────────────────────────────────
  function handleAdSave(e) {
    e.preventDefault();
    if (!adForm.title.trim()) return;
    if (adModal.mode === "add") {
      const next = [...ads, { ...adForm, id: `ad-${Date.now()}`, createdAt: new Date().toISOString() }];
      saveAds(next);
    } else {
      saveAds(ads.map(a => a.id === adModal.id ? { ...a, ...adForm } : a));
    }
    setAdModal(null);
    setAdPreview(false);
  }

  function renderAdvertisements() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
              Main site: <span style={{ color: "#fff", fontWeight: 600 }}>{mainSiteUrl}</span>
            </p>
          </div>
          <button
            onClick={() => { setAdForm(emptyAdForm); setAdModal({ mode: "add" }); setAdPreview(false); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}
          >
            <Plus size={16} /> New Advertisement
          </button>
        </div>

        {/* Ad Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "18px" }}>
          {ads.map(ad => (
            <div key={ad.id} style={{ background: "var(--admin-surface, #0e1526)", border: `1px solid ${ad.isActive ? "rgba(0, 82, 255, 0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>

              {/* Image Preview */}
              <div style={{ position: "relative", height: "180px", background: "#111", overflow: "hidden" }}>
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: ad.isActive ? 1 : 0.4 }} />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>
                    <Megaphone size={40} />
                  </div>
                )}
                <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: ad.isActive ? "rgba(34,197,94,0.9)" : "rgba(100,100,100,0.9)", color: "#fff" }}>
                    {ad.isActive ? "● LIVE" : "● PAUSED"}
                  </span>
                </div>
                {/* Gradient overlay with button preview */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "20px 16px 14px" }}>
                  <span style={{ display: "inline-block", background: "#0052ff", color: "#fff", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", fontWeight: "700" }}>
                    {ad.buttonText}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "16px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "14px", color: "#fff", lineHeight: 1.3 }}>{ad.title}</h3>
                <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#888", lineHeight: 1.5 }}>{ad.description}</p>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <LinkIcon size={12} style={{ color: "#666", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.redirectUrl}</span>
                  {ad.redirectUrl && (
                    <a href={ad.redirectUrl} target="_blank" rel="noreferrer" style={{ flexShrink: 0 }}>
                      <ExternalLink size={11} style={{ color: "#fff" }} />
                    </a>
                  )}
                </div>

                {(ad.startDate || ad.endDate) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                    <Calendar size={12} style={{ color: "#666" }} />
                    <span style={{ fontSize: "11px", color: "#666" }}>{ad.startDate} → {ad.endDate || "No end"}</span>
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setAdForm({ title: ad.title, description: ad.description, buttonText: ad.buttonText, redirectUrl: ad.redirectUrl, imageUrl: ad.imageUrl, startDate: ad.startDate, endDate: ad.endDate, isActive: ad.isActive });
                      setAdModal({ mode: "edit", id: ad.id });
                      setAdPreview(false);
                    }}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.35)", color: "#fff", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => saveAds(ads.map(a => a.id === ad.id ? { ...a, isActive: !a.isActive } : a))}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
                  >
                    {ad.isActive ? <EyeOff size={14} /> : <Eye size={14} />} {ad.isActive ? "Pause" : "Enable"}
                  </button>
                  <button
                    onClick={() => { if (window.confirm("Delete this advertisement?")) saveAds(ads.filter(a => a.id !== ad.id)); }}
                    style={{ padding: "8px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "8px", cursor: "pointer" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {ads.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#555" }}>
              <Megaphone size={48} style={{ marginBottom: "16px", opacity: 0.4 }} />
              <p style={{ fontSize: "14px" }}>No advertisements yet. Create your first one!</p>
            </div>
          )}
        </div>

        {/* Advertisement Modal */}
        {adModal && (
          <div style={modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setAdModal(null); }}>
            <div style={modalBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>{adModal.mode === "add" ? "New Advertisement" : "Edit Advertisement"}</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#777" }}>Fill in the details below. The button URL can be your main movie website.</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setAdPreview(!adPreview)} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: "8px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Eye size={14} /> {adPreview ? "Hide" : "Preview"}
                  </button>
                  <button onClick={() => setAdModal(null)} style={{ background: "transparent", border: "none", color: "#777", cursor: "pointer" }}><X size={20} /></button>
                </div>
              </div>

              {/* Live Preview */}
              {adPreview && (
                <div style={{ marginBottom: "24px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0, 82, 255, 0.3)" }}>
                  <div style={{ position: "relative", minHeight: "180px", background: adForm.imageUrl ? `url(${adForm.imageUrl}) center/cover` : "#111", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "24px" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.75))" }} />
                    <div style={{ position: "relative" }}>
                      <h3 style={{ margin: "0 0 6px", color: "#fff", fontSize: "18px" }}>{adForm.title || "Advertisement Title"}</h3>
                      <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{adForm.description || "Your description here."}</p>
                      <span style={{ display: "inline-block", background: "#0052ff", color: "#fff", borderRadius: "8px", padding: "8px 20px", fontWeight: "700", fontSize: "14px" }}>
                        {adForm.buttonText || "Book Tickets"}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: "#0d0d0d", padding: "10px 16px", fontSize: "11px", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Globe size={12} /> Redirects to: <span style={{ color: "#fff" }}>{adForm.redirectUrl || mainSiteUrl}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAdSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Advertisement Title *</label>
                  <input style={fieldStyle} placeholder="e.g. Avengers: Secret Wars — Now Showing" value={adForm.title} onChange={e => setAdForm(f => ({ ...f, title: e.target.value }))} required />
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...fieldStyle, minHeight: "72px", resize: "vertical" }} placeholder="Short description shown under the title..." value={adForm.description} onChange={e => setAdForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Button Text</label>
                    <input style={fieldStyle} placeholder="Book Tickets" value={adForm.buttonText} onChange={e => setAdForm(f => ({ ...f, buttonText: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select style={fieldStyle} value={adForm.isActive ? "active" : "inactive"} onChange={e => setAdForm(f => ({ ...f, isActive: e.target.value === "active" }))}>
                      <option value="active">● Active (Live)</option>
                      <option value="inactive">○ Inactive (Paused)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Redirect URL</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...fieldStyle, paddingLeft: "36px" }} placeholder={`${mainSiteUrl}/movies/movie-slug`} value={adForm.redirectUrl} onChange={e => setAdForm(f => ({ ...f, redirectUrl: e.target.value }))} />
                    <LinkIcon size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#666" }}>
                    Base URL: <button type="button" onClick={() => setAdForm(f => ({ ...f, redirectUrl: mainSiteUrl }))} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "11px", padding: 0 }}>{mainSiteUrl}</button>
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Image URL</label>
                  <input style={fieldStyle} placeholder="https://example.com/movie-banner.jpg" value={adForm.imageUrl} onChange={e => setAdForm(f => ({ ...f, imageUrl: e.target.value }))} />
                  {adForm.imageUrl && (
                    <div style={{ marginTop: "8px", borderRadius: "8px", overflow: "hidden", height: "80px" }}>
                      <img src={adForm.imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type="date" style={fieldStyle} value={adForm.startDate} onChange={e => setAdForm(f => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date</label>
                    <input type="date" style={fieldStyle} value={adForm.endDate} onChange={e => setAdForm(f => ({ ...f, endDate: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    {adModal.mode === "add" ? "Create Advertisement" : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setAdModal(null)} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: "8px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── BANNERS render ────────────────────────────────────────────────
  function handleBanSave(e) {
    e.preventDefault();
    if (!banForm.title.trim()) return;
    if (banModal.mode === "add") {
      saveBanners([...banners, { ...banForm, id: `ban-${Date.now()}` }]);
    } else {
      saveBanners(banners.map(b => b.id === banModal.id ? { ...b, ...banForm } : b));
    }
    setBanModal(null);
  }

  function renderBanners() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { setBanForm(emptyBanForm); setBanModal({ mode: "add" }); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}>
            <Plus size={16} /> Add Banner
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {banners.map(b => (
            <div key={b.id} style={{ display: "flex", gap: "16px", background: "var(--admin-surface, #0e1526)", borderRadius: "12px", overflow: "hidden", border: `1px solid ${b.isActive ? "rgba(0, 82, 255, 0.35)" : "rgba(255,255,255,0.06)"}` }}>
              <div style={{ width: "160px", flexShrink: 0, background: "#111" }}>
                {b.imageUrl ? <img src={b.imageUrl} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: b.isActive ? 1 : 0.4 }} /> : <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}><ImagePlay size={32} /></div>}
              </div>
              <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <strong style={{ color: "#fff", fontSize: "15px" }}>{b.title}</strong>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: b.isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", color: b.isActive ? "#22c55e" : "#666" }}>{b.isActive ? "LIVE" : "PAUSED"}</span>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "10px", background: "rgba(0, 82, 255, 0.12)", color: "#fff", border: "1px solid rgba(0, 82, 255, 0.3)" }}>{b.position}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{b.subtitle}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button onClick={() => { setBanForm({ title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl, position: b.position, isActive: b.isActive }); setBanModal({ mode: "edit", id: b.id }); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.35)", color: "#fff", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "12px" }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => saveBanners(banners.map(x => x.id === b.id ? { ...x, isActive: !x.isActive } : x))}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "12px" }}>
                    {b.isActive ? <EyeOff size={13} /> : <Eye size={13} />} {b.isActive ? "Pause" : "Enable"}
                  </button>
                  <button onClick={() => { if (window.confirm("Delete banner?")) saveBanners(banners.filter(x => x.id !== b.id)); }}
                    style={{ padding: "7px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "7px", cursor: "pointer" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banModal && (
          <div style={modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setBanModal(null); }}>
            <div style={modalBox}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>{banModal.mode === "add" ? "New Banner" : "Edit Banner"}</h2>
                <button onClick={() => setBanModal(null)} style={{ background: "transparent", border: "none", color: "#777", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleBanSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div><label style={labelStyle}>Banner Title *</label><input style={fieldStyle} placeholder="Weekend Special" value={banForm.title} onChange={e => setBanForm(f => ({ ...f, title: e.target.value }))} required /></div>
                <div><label style={labelStyle}>Subtitle / Tagline</label><input style={fieldStyle} placeholder="20% off all combos this weekend" value={banForm.subtitle} onChange={e => setBanForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
                <div><label style={labelStyle}>Image URL *</label>
                  <input style={fieldStyle} placeholder="https://example.com/banner.jpg" value={banForm.imageUrl} onChange={e => setBanForm(f => ({ ...f, imageUrl: e.target.value }))} />
                  {banForm.imageUrl && <div style={{ marginTop: "8px", borderRadius: "8px", overflow: "hidden", height: "80px" }}><img src={banForm.imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div><label style={labelStyle}>Position</label>
                    <select style={fieldStyle} value={banForm.position} onChange={e => setBanForm(f => ({ ...f, position: e.target.value }))}>
                      <option>Hero</option><option>Sidebar</option><option>Footer</option><option>Popup</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Status</label>
                    <select style={fieldStyle} value={banForm.isActive ? "active" : "inactive"} onChange={e => setBanForm(f => ({ ...f, isActive: e.target.value === "active" }))}>
                      <option value="active">● Active</option><option value="inactive">○ Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    {banModal.mode === "add" ? "Add Banner" : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setBanModal(null)} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── OFFERS render ─────────────────────────────────────────────────
  function handleOffSave(e) {
    e.preventDefault();
    if (!offForm.title.trim()) return;
    if (offModal.mode === "add") {
      saveOffers([...offers, { ...offForm, id: `off-${Date.now()}`, originalPrice: Number(offForm.originalPrice), offerPrice: Number(offForm.offerPrice) }]);
    } else {
      saveOffers(offers.map(o => o.id === offModal.id ? { ...o, ...offForm, originalPrice: Number(offForm.originalPrice), offerPrice: Number(offForm.offerPrice) } : o));
    }
    setOffModal(null);
  }

  function renderOffers() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { setOffForm(emptyOffForm); setOffModal({ mode: "add" }); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}>
            <Plus size={16} /> New Offer
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {offers.map(o => (
            <div key={o.id} style={{ background: "var(--admin-surface, #0e1526)", border: `1px solid ${o.isActive ? "rgba(0, 82, 255, 0.35)" : "rgba(255,255,255,0.06)"}`, borderRadius: "14px", overflow: "hidden" }}>
              {o.imageUrl && <div style={{ height: "120px", background: "#111" }}><img src={o.imageUrl} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: o.isActive ? 1 : 0.4 }} /></div>}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <strong style={{ color: "#fff", fontSize: "14px" }}>{o.title}</strong>
                  <span style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: o.isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", color: o.isActive ? "#22c55e" : "#666" }}>{o.isActive ? "LIVE" : "OFF"}</span>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#888" }}>{o.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>₹{o.offerPrice}</span>
                  <span style={{ fontSize: "13px", color: "#666", textDecoration: "line-through" }}>₹{o.originalPrice}</span>
                  {o.originalPrice > 0 && <span style={{ fontSize: "11px", background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "2px 7px", borderRadius: "20px", fontWeight: "700" }}>
                    -{Math.round((1 - o.offerPrice / o.originalPrice) * 100)}%
                  </span>}
                </div>
                {o.validUntil && <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>Valid until {o.validUntil}</p>}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setOffForm({ title: o.title, description: o.description, originalPrice: o.originalPrice, offerPrice: o.offerPrice, imageUrl: o.imageUrl, validUntil: o.validUntil, isActive: o.isActive }); setOffModal({ mode: "edit", id: o.id }); }}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.35)", color: "#fff", padding: "8px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => saveOffers(offers.map(x => x.id === o.id ? { ...x, isActive: !x.isActive } : x))}
                    style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: "8px", cursor: "pointer" }}>
                    {o.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => { if (window.confirm("Delete this offer?")) saveOffers(offers.filter(x => x.id !== o.id)); }}
                    style={{ padding: "8px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "8px", cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {offModal && (
          <div style={modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setOffModal(null); }}>
            <div style={modalBox}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>{offModal.mode === "add" ? "New Offer" : "Edit Offer"}</h2>
                <button onClick={() => setOffModal(null)} style={{ background: "transparent", border: "none", color: "#777", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleOffSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div><label style={labelStyle}>Offer Title *</label><input style={fieldStyle} placeholder="Intermission Combo" value={offForm.title} onChange={e => setOffForm(f => ({ ...f, title: e.target.value }))} required /></div>
                <div><label style={labelStyle}>Description</label><input style={fieldStyle} placeholder="Popcorn (Large) + Cold Drink" value={offForm.description} onChange={e => setOffForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div><label style={labelStyle}>Original Price (₹)</label><input type="number" style={fieldStyle} placeholder="350" value={offForm.originalPrice} onChange={e => setOffForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
                  <div><label style={labelStyle}>Offer Price (₹)</label><input type="number" style={fieldStyle} placeholder="280" value={offForm.offerPrice} onChange={e => setOffForm(f => ({ ...f, offerPrice: e.target.value }))} /></div>
                </div>
                <div><label style={labelStyle}>Image URL</label><input style={fieldStyle} placeholder="https://example.com/combo.jpg" value={offForm.imageUrl} onChange={e => setOffForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div><label style={labelStyle}>Valid Until</label><input type="date" style={fieldStyle} value={offForm.validUntil} onChange={e => setOffForm(f => ({ ...f, validUntil: e.target.value }))} /></div>
                  <div><label style={labelStyle}>Status</label>
                    <select style={fieldStyle} value={offForm.isActive ? "active" : "inactive"} onChange={e => setOffForm(f => ({ ...f, isActive: e.target.value === "active" }))}>
                      <option value="active">● Active</option><option value="inactive">○ Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #0052ff, #0036b3)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    {offModal.mode === "add" ? "Create Offer" : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setOffModal(null)} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── IMAGE LIBRARY render ──────────────────────────────────────────
  function renderImageLibrary() {
    const allImages = [
      ...ads.filter(a => a.imageUrl).map(a => ({ url: a.imageUrl, label: a.title, source: "Advertisement" })),
      ...banners.filter(b => b.imageUrl).map(b => ({ url: b.imageUrl, label: b.title, source: "Banner" })),
      ...offers.filter(o => o.imageUrl).map(o => ({ url: o.imageUrl, label: o.title, source: "Offer" })),
    ];
    const unique = Array.from(new Map(allImages.map(i => [i.url, i])).values());

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{unique.length} image{unique.length !== 1 ? "s" : ""} across all content</p>
          <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>Images are loaded from URLs — paste an image URL in any Advertisement, Banner, or Offer to add it here automatically.</p>
        </div>

        {unique.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
            <Images size={48} style={{ marginBottom: "16px", opacity: 0.4 }} />
            <p>No images yet. Add image URLs to your advertisements, banners, or offers.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            {unique.map((img, idx) => (
              <div key={idx} style={{ background: "var(--admin-surface, #0e1526)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ height: "140px", background: "#111" }}>
                  <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.label}</p>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "20px", background: "rgba(0, 82, 255, 0.12)", color: "#fff", border: "1px solid rgba(0, 82, 255, 0.25)" }}>{img.source}</span>
                </div>
                <div style={{ padding: "0 12px 10px", display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(img.url)}
                    style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "6px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}>
                    Copy URL
                  </button>
                  <a href={img.url} target="_blank" rel="noreferrer"
                    style={{ padding: "6px 10px", background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.3)", color: "#fff", borderRadius: "6px", display: "flex", alignItems: "center" }}>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }



  function renderDashboard() {
    return (
      <>
        <section className="admin-dashboard-hero">
          <div>
            <span className="admin-eyebrow">THEATER 01 · LIVE OPERATIONS</span>
            <h2>Everything is running smoothly.</h2>
            <p>Monitor in-seat orders, revenue, and kitchen activity from one place.</p>
          </div>
          <div className="admin-hero-actions">
            <div className="admin-hero-live"><span /> Live updates enabled</div>
            <button className="primary-admin-button" onClick={() => setActivePage("orders")}>
              <ShoppingBag size={16} /> Manage orders
            </button>
          </div>
        </section>

        <div className="stats-grid">
          <StatCard
            title="Total Orders"
            value={stats.orders}
            change="+12.5%"
            icon={ShoppingBag}
            variant="gold"
          />

          <StatCard
            title="Today's Revenue"
            value={`₹${stats.revenue.toLocaleString(
              "en-IN"
            )}`}
            change="+8.2%"
            icon={IndianRupee}
            variant="green"
          />

          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            change="Live"
            icon={Clock3}
            variant="blue"
          />

          <StatCard
            title="Delivered"
            value={stats.deliveredOrders}
            change="+5.4%"
            icon={CheckCircle2}
            variant="purple"
          />
        </div>

        <div className="dashboard-grid">
          <section className="admin-panel recent-orders-panel">
            <div className="panel-heading">
              <div>
                <span>LIVE ORDERS</span>
                <h2>Recent Orders</h2>
              </div>

              <button
                className="panel-link"
                onClick={() =>
                  setActivePage("orders")
                }
              >
                View all
              </button>
            </div>

            <OrderTable
              orders={orders.slice(0, 5)}
              onStatusChange={
                handleStatusChange
              }
              onViewOrder={
                setSelectedOrder
              }
            />
          </section>

          <section className="admin-panel quick-panel">
            <div className="panel-heading">
              <div>
                <span>QUICK OVERVIEW</span>
                <h2>Order Status</h2>
              </div>
            </div>

            <div className="status-overview">
              {[
                "RECEIVED",
                "PREPARING",
                "READY",
                "DELIVERED",
              ].map((status) => {
                const count =
                  orders.filter(
                    (order) =>
                      order.status === status
                  ).length;

                return (
                  <div
                    className="status-overview-row"
                    key={status}
                  >
                    <OrderStatusBadge
                      status={status}
                    />

                    <strong>{count}</strong>
                  </div>
                );
              })}
            </div>

            <div className="quick-revenue">
              <span>Average Order Value</span>
              <strong>
                ₹
                {orders.length
                  ? Math.round(
                      stats.revenue /
                        orders.length
                    ).toLocaleString(
                      "en-IN"
                    )
                  : 0}
              </strong>
            </div>
          </section>
        </div>

        <section className="admin-panel admin-action-panel">
          <div className="panel-heading">
            <div>
              <span>WORKSPACE</span>
              <h2>Keep operations moving</h2>
            </div>
          </div>
          <div className="admin-action-grid">
            <button onClick={() => setActivePage("orders")}>
              <span className="admin-action-icon orders"><ShoppingBag size={19} /></span>
              <span><strong>Review orders</strong><small>See every active seat delivery</small></span>
            </button>
            <button onClick={() => setActivePage("menu")}>
              <span className="admin-action-icon menu"><ChefHat size={19} /></span>
              <span><strong>Update menu</strong><small>Manage items, stock, and pricing</small></span>
            </button>
            <button onClick={() => setActivePage("sales")}>
              <span className="admin-action-icon sales"><TrendingUp size={19} /></span>
              <span><strong>View sales</strong><small>Track today’s performance</small></span>
            </button>
          </div>
        </section>
      </>
    );
  }

  function renderOrders() {
    return (
      <section className="admin-panel orders-page-panel">
        <div className="orders-toolbar">
          <div>
            <h2>All Orders</h2>
            <p>
              View customer food orders across all screens (Status updates are performed by assigned salesmen).
            </p>
          </div>

          <div className="orders-controls">
            <input
              type="text"
              placeholder="Search order, customer or seat..."
              value={orderSearch}
              onChange={(event) =>
                setOrderSearch(
                  event.target.value
                )
              }
            />

            <select
              value={orderFilter}
              onChange={(event) =>
                setOrderFilter(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                All Orders
              </option>

              <option value="RECEIVED">
                Received
              </option>

              <option value="PREPARING">
                Preparing
              </option>

              <option value="READY">
                Ready
              </option>

              <option value="DELIVERED">
                Delivered
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

            <button className="refresh-button">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <OrderTable
          orders={filteredOrders}
          onStatusChange={
            handleStatusChange
          }
          onViewOrder={
            setSelectedOrder
          }
        />
      </section>
    );
  }

  function renderMenu() {
    return (
      <section className="admin-panel">
        <MenuTable
          items={menuItems}
          onAdd={openAddMenu}
          onEdit={openEditMenu}
          onDelete={handleDeleteMenuItem}
        />
      </section>
    );
  }

  function renderAnalytics() {
    return (
      <div className="analytics-grid">
        <section className="admin-panel analytics-main">
          <div className="panel-heading">
            <div>
              <span>PERFORMANCE</span>
              <h2>Sales Overview</h2>
            </div>

            <select className="analytics-select">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="fake-chart">
            <div className="chart-y-axis">
              <span>₹10K</span>
              <span>₹7.5K</span>
              <span>₹5K</span>
              <span>₹2.5K</span>
              <span>₹0</span>
            </div>

            <div className="chart-area">
              <div className="chart-line">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="chart-labels">
                <span>10 AM</span>
                <span>12 PM</span>
                <span>2 PM</span>
                <span>4 PM</span>
                <span>6 PM</span>
                <span>8 PM</span>
                <span>10 PM</span>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>TOP ITEMS</span>
              <h2>Popular Menu</h2>
            </div>
          </div>

          <div className="popular-items">
            {menuItems
              .slice(0, 5)
              .map((item, index) => (
                <div
                  className="popular-item"
                  key={item.id}
                >
                  <span className="popular-rank">
                    0{index + 1}
                  </span>

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <strong>
                      {item.name}
                    </strong>
                    <span>
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    );
  }

  function renderCustomers() {
    const customers = [
      { id: "C001", name: "Rahul Menon", seat: "A12", screen: "Screen 1", orders: 3, total: 980, lastOrder: "10:32 AM", phone: "9876543210" },
      { id: "C002", name: "Anjali Nair", seat: "B08", screen: "Screen 2", orders: 2, total: 760, lastOrder: "10:28 AM", phone: "9847012345" },
      { id: "C003", name: "Arjun Pillai", seat: "C15", screen: "IMAX", orders: 1, total: 350, lastOrder: "10:22 AM", phone: "9995123456" },
      { id: "C004", name: "Meera Krishnan", seat: "A04", screen: "Screen 1", orders: 4, total: 1420, lastOrder: "10:10 AM", phone: "9567123456" },
      { id: "C005", name: "Vishnu Dev", seat: "D20", screen: "VIP Lounge", orders: 2, total: 560, lastOrder: "09:58 AM", phone: "9496755714" },
    ];

    return (
      <section className="admin-panel orders-page-panel">
        <div className="orders-toolbar">
          <div>
            <h2>Guest Profiles</h2>
            <p>Customers who ordered today via QR seat scan.</p>
          </div>
          <div className="orders-controls">
            <input type="text" placeholder="Search name, seat or phone..." />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cinema-border)", color: "#888", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}>Guest</th>
                <th style={{ padding: "10px 12px" }}>Seat / Screen</th>
                <th style={{ padding: "10px 12px" }}>Phone</th>
                <th style={{ padding: "10px 12px" }}>Orders</th>
                <th style={{ padding: "10px 12px" }}>Total Spend</th>
                <th style={{ padding: "10px 12px" }}>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 82, 255, 0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #0052ff, #0036b3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#fff", flexShrink: 0 }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ color: "#fff" }}>{c.name}</strong>
                        <div style={{ fontSize: "11px", color: "#777" }}>#{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: "rgba(0, 82, 255, 0.12)", border: "1px solid rgba(0, 82, 255, 0.3)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "#fff" }}>{c.seat}</span>
                    <div style={{ fontSize: "11px", color: "#777", marginTop: "3px" }}>{c.screen}</div>
                  </td>
                  <td style={{ padding: "12px", color: "#aaa", fontSize: "12px" }}>{c.phone}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontWeight: "700", color: "#fff" }}>{c.orders}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontWeight: "700", color: "#fff" }}>₹{c.total.toLocaleString("en-IN")}</span>
                  </td>
                  <td style={{ padding: "12px", color: "#aaa", fontSize: "12px" }}>{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(0, 82, 255, 0.06)", border: "1px dashed rgba(0, 82, 255, 0.25)", borderRadius: "10px", fontSize: "12px", color: "#888", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>💡</span>
          <span>Customer profiles are built from today's seat-scan orders. Full CRM with reorder links and WhatsApp segmentation coming in the next release.</span>
        </div>
      </section>
    );
  }

  function renderPromotions() {
    const promos = [
      { id: "PROMO-001", name: "Intermission Combo", type: "Bundle", discount: "15% off", items: "Popcorn + Coke", active: true, used: 12 },
      { id: "PROMO-002", name: "IMAX Double Deal", type: "Bundle", discount: "₹50 off", items: "2x Burger", active: true, used: 7 },
      { id: "PROMO-003", name: "First Order Offer", type: "Discount", discount: "10% off", items: "Any item", active: false, used: 34 },
      { id: "PROMO-004", name: "VIP Gold Tray", type: "Bundle", discount: "Free nachos", items: "Burger + Coke", active: true, used: 5 },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>ACTIVE PROMOS</span>
              <h2>Offers & Combos</h2>
            </div>
            <button className="primary-admin-button" style={{ padding: "8px 16px", fontSize: "12px" }}>
              + New Promotion
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px", marginTop: "16px" }}>
            {promos.map((p) => (
              <div key={p.id} style={{ background: "var(--admin-surface, #0e1526)", border: `1px solid ${p.active ? "rgba(0, 82, 255, 0.35)" : "rgba(255,255,255,0.06)"}`, borderRadius: "12px", padding: "16px", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14px" }}>{p.name}</strong>
                    <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>{p.id}</div>
                  </div>
                  <span style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: p.active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", color: p.active ? "#22c55e" : "#666" }}>
                    {p.active ? "LIVE" : "PAUSED"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ background: "rgba(0, 82, 255, 0.12)", color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: "700" }}>{p.discount}</span>
                  <span style={{ background: "rgba(255,255,255,0.06)", color: "#aaa", borderRadius: "6px", padding: "3px 8px", fontSize: "11px" }}>{p.type}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>Applies to: <span style={{ color: "#ccc" }}>{p.items}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#666" }}>Used {p.used}x today</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button style={{ background: "rgba(0, 82, 255, 0.15)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>Edit</button>
                    <button style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>{p.active ? "Pause" : "Enable"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <span>WHATSAPP CAMPAIGNS</span>
              <h2>Automated Notifications</h2>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
            {[
              { label: "Order Confirmed", desc: "Sent instantly on order placement", status: "Active", sent: 47 },
              { label: "Order Ready", desc: "Notifies guest when tray is at seat", status: "Active", sent: 38 },
              { label: "Reorder Reminder", desc: "Sent 30 min after delivery", status: "Coming Soon", sent: 0 },
              { label: "Combo Offer", desc: "Personalized upsell during show", status: "Coming Soon", sent: 0 },
            ].map((n) => (
              <div key={n.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--admin-surface, #0e1526)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>💬</span>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#fff" }}>{n.label}</strong>
                    <div style={{ fontSize: "11px", color: "#777" }}>{n.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {n.sent > 0 && <span style={{ fontSize: "11px", color: "#888" }}>{n.sent} sent today</span>}
                  <span style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: n.status === "Active" ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.07)", color: n.status === "Active" ? "#25D366" : "#555" }}>
                    {n.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="settings-grid">

        {/* Main Website URL — top priority card */}
        <section className="admin-panel settings-card" style={{ gridColumn: "1 / -1", border: "1px solid rgba(0, 82, 255, 0.3)" }}>
          <div className="panel-heading">
            <div>
              <span>ADVERTISEMENT REDIRECT</span>
              <h2>Main Website URL</h2>
            </div>
            <Globe size={20} style={{ color: "#fff" }} />
          </div>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 16px" }}>
            This is the base URL of your main movie-booking website. All advertisements can use this as their redirect destination.
          </p>
          <div className="settings-form">
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Main Website Base URL</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Globe size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  <input
                    value={mainSiteUrlDraft}
                    onChange={e => setMainSiteUrlDraft(e.target.value)}
                    placeholder="https://your-movie-site.com"
                    style={{ width: "100%", background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.2)", borderRadius: "8px", padding: "10px 14px 10px 34px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  onClick={() => {
                    setMainSiteUrl(mainSiteUrlDraft);
                    localStorage.setItem("cinema_main_site_url", mainSiteUrlDraft);
                  }}
                  className="primary-admin-button"
                  style={{ whiteSpace: "nowrap", padding: "10px 20px" }}
                >
                  Save URL
                </button>
              </div>
            </label>
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(0, 82, 255, 0.06)", borderRadius: "8px", border: "1px dashed rgba(0, 82, 255, 0.2)", fontSize: "12px", color: "#888" }}>
              Saved: <span style={{ color: "#fff", fontWeight: 600 }}>{mainSiteUrl}</span>
              <a href={mainSiteUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "8px" }}>
                <ExternalLink size={12} style={{ color: "#fff" }} />
              </a>
            </div>
          </div>
        </section>

        <section className="admin-panel settings-card">
          <div className="panel-heading">
            <div>
              <span>THEATER</span>
              <h2>Theater Settings</h2>
            </div>
          </div>

          <div className="settings-form">
            <label>
              Theater Name

              <input
                value="CINÉMA Theater 01"
                readOnly
              />
            </label>

            <label>
              Theater ID

              <input
                value="THEATER-001"
                readOnly
              />
            </label>

            <label>
              Default Tax

              <input
                value="5%"
                readOnly
              />
            </label>

            <button className="primary-admin-button">
              Save Settings
            </button>
          </div>
        </section>

        <section className="admin-panel settings-card">
          <div className="panel-heading">
            <div>
              <span>ADMIN ACCOUNT</span>
              <h2>Your Account</h2>
            </div>
          </div>

          <div className="account-details">
            <div className="account-avatar">
              {user?.email
                ?.charAt(0)
                .toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.email || "Admin"}
              </strong>

              <span>
                {adminData?.role ||
                  "ADMIN"}
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderTheaterConfig() {
    return (
      <div className="configuration-layout">
        <section className="admin-panel configuration-hero">
          <div>
            <span className="config-kicker">WHITE-LABEL WORKSPACE</span>
            <h2>Your theater, your identity.</h2>
            <p>These details appear across customer menus, confirmations, and campaign messages for this theater.</p>
          </div>
          <div className="config-live"><span /> Brand profile active</div>
        </section>
        <div className="configuration-grid">
          <section className="admin-panel configuration-card">
            <div className="panel-heading"><div><span>BRAND IDENTITY</span><h2>Visual profile</h2></div><Building2 size={20} /></div>
            <div className="logo-upload-row">
              <div className="theater-logo-preview"><img src={theaterConfig.logo} alt="Theater logo preview" /></div>
              <div><strong>Custom theater logo</strong><p>PNG, JPG, or SVG. Best at 256 × 256 px.</p><label className="secondary-admin-button"><Upload size={15} /> Upload logo<input type="file" accept="image/*" onChange={handleLogoUpload} hidden /></label></div>
            </div>
            <div className="config-fields">
              <label>Theater name<input value={theaterConfig.name} onChange={(e) => setTheaterConfig({ ...theaterConfig, name: e.target.value })} /></label>
              <label>Theater code<input value={theaterConfig.code} onChange={(e) => setTheaterConfig({ ...theaterConfig, code: e.target.value })} /></label>
              <label className="full-field">City / location<input value={theaterConfig.city} onChange={(e) => setTheaterConfig({ ...theaterConfig, city: e.target.value })} /></label>
            </div>
            <button className="primary-admin-button" onClick={saveTheaterConfig}><Save size={16} /> {configSaved ? "Configuration saved" : "Save configuration"}</button>
          </section>
          <section className="admin-panel configuration-card catalog-summary">
            <div className="panel-heading"><div><span>THEATER CATALOG</span><h2>Product management</h2></div><ChefHat size={20} /></div>
            <p>Each theater keeps its own food catalog, prices, stock, and availability.</p>
            <div className="catalog-stat"><strong>{menuItems.length}</strong><span>products in this catalog</span></div>
            <div className="catalog-stat"><strong>{menuItems.filter((item) => item.available).length}</strong><span>currently available</span></div>
            <button className="secondary-admin-button" onClick={() => setActivePage("menu")}>Manage products <ChevronRight size={16} /></button>
          </section>
        </div>
      </div>
    );
  }

  function renderWorkflow() {
    const variables = ["{{customer_name}}", "{{order_id}}", "{{theater_name}}", "{{order_total}}", "{{pickup_time}}"];
    return (
      <div className="workflow-layout">
        <div className="workflow-grid">
          <section className="admin-panel workflow-card">
            <div className="panel-heading"><div><span>MESSAGE TEMPLATE</span><h2>Compose WhatsApp update</h2></div><MessageCircle size={20} /></div>
            <div className="config-fields">
              <label>Template name<input value={templateDraft.name} onChange={(e) => setTemplateDraft({ ...templateDraft, name: e.target.value })} /></label>
              <label>Automatic trigger<select value={templateDraft.trigger} onChange={(e) => setTemplateDraft({ ...templateDraft, trigger: e.target.value })}><option>Order received</option><option>Preparing</option><option>Ready for pickup</option></select></label>
              <label className="full-field">Message<textarea value={templateDraft.body} onChange={(e) => setTemplateDraft({ ...templateDraft, body: e.target.value })} rows="6" /></label>
            </div>
            <div className="variable-row">{variables.map((variable) => <button key={variable} onClick={() => setTemplateDraft({ ...templateDraft, body: `${templateDraft.body} ${variable}`.trim() })}>{variable}</button>)}</div>
            <button className="primary-admin-button" onClick={saveTemplate}><Save size={16} /> Save template</button>
          </section>
          <section className="admin-panel workflow-card phone-preview">
            <div className="panel-heading"><div><span>LIVE PREVIEW</span><h2>WhatsApp message</h2></div><span className="whatsapp-dot" /></div>
            <div className="phone-frame"><div className="chat-top"><MessageCircle size={16} /> {theaterConfig.name}</div><div className="chat-bubble">{templateDraft.body.replace("{{customer_name}}", "Aarav").replace("{{order_id}}", "ORD-1042").replace("{{theater_name}}", theaterConfig.name).replace("{{order_total}}", "₹420").replace("{{pickup_time}}", "10 minutes")}</div><small>Delivered now</small></div>
          </section>
        </div>
        <section className="admin-panel flow-builder">
          <div className="panel-heading"><div><span>AUTOMATION FLOW</span><h2>Order status workflow</h2><p>Toggle any stage on or off; status messages follow the order journey.</p></div><Workflow size={21} /></div>
          <div className="flow-steps">{workflowSteps.map((step, index) => <div className="flow-step" key={step.id}><div className="flow-number">{index + 1}</div><div className="flow-content"><strong>{step.label}</strong><span>{step.delay}</span></div><button className={`workflow-toggle ${step.enabled ? "on" : ""}`} onClick={() => saveWorkflow(workflowSteps.map((item) => item.id === step.id ? { ...item, enabled: !item.enabled } : item))}><span /></button>{index < workflowSteps.length - 1 && <div className="flow-connector" />}</div>)}</div>
        </section>
      </div>
    );
  }

  function renderCampaigns() {
    return (
      <div className="campaign-layout">
        <div className="campaign-kpis"><div><span>Scheduled broadcasts</span><strong>{campaigns.filter((campaign) => campaign.status === "Scheduled").length}</strong></div><div><span>Reach this week</span><strong>{campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0).toLocaleString()}</strong></div><div><span>Primary channel</span><strong>WhatsApp</strong></div></div>
        <div className="workflow-grid">
          <section className="admin-panel workflow-card"><div className="panel-heading"><div><span>NEW CAMPAIGN</span><h2>Plan a broadcast</h2></div><Megaphone size={20} /></div><div className="config-fields"><label>Campaign name<input placeholder="e.g. Friday combo offer" value={campaignDraft.name} onChange={(e) => setCampaignDraft({ ...campaignDraft, name: e.target.value })} /></label><label>Audience segment<select value={campaignDraft.segment} onChange={(e) => setCampaignDraft({ ...campaignDraft, segment: e.target.value })}><option>Frequent guests</option><option>Recent customers</option><option>High-value customers</option><option>All customers</option></select></label><label className="full-field">Promotional message<textarea rows="5" value={campaignDraft.message} onChange={(e) => setCampaignDraft({ ...campaignDraft, message: e.target.value })} /></label><label className="full-field">Send time<input type="datetime-local" value={campaignDraft.schedule} onChange={(e) => setCampaignDraft({ ...campaignDraft, schedule: e.target.value })} /></label></div><button className="primary-admin-button" onClick={scheduleCampaign}><CalendarClock size={16} /> Schedule broadcast</button></section>
          <section className="admin-panel segment-card"><div className="panel-heading"><div><span>AUDIENCE ESTIMATE</span><h2>Who will receive it?</h2></div><Users size={20} /></div><div className="segment-list"><div><span className="segment-icon gold"><Star size={16} /></span><p><strong>Frequent guests</strong><small>3+ orders in the last 60 days</small></p><b>248</b></div><div><span className="segment-icon blue"><Clock3 size={16} /></span><p><strong>Recent customers</strong><small>Ordered in the last 30 days</small></p><b>684</b></div><div><span className="segment-icon green"><TrendingUp size={16} /></span><p><strong>High-value customers</strong><small>₹1,000+ lifetime spend</small></p><b>96</b></div></div></section>
        </div>
        <section className="admin-panel campaign-list"><div className="panel-heading"><div><span>CAMPAIGN CALENDAR</span><h2>Scheduled messages</h2></div></div>{campaigns.map((campaign) => <div className="campaign-row" key={campaign.id}><span className="campaign-channel"><Send size={16} /></span><div><strong>{campaign.name}</strong><small>{campaign.segment} · {campaign.recipients} recipients</small></div><span className="campaign-time">{campaign.schedule}</span><span className="campaign-status">{campaign.status}</span></div>)}</section>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // SALESMEN render
  // ─────────────────────────────────────────────────────────────────
  function renderSalesmen() {
    const filtered = salesmen.filter(s =>
      salesmanFilter === "ALL" ? true :
      salesmanFilter === "ACTIVE" ? s.active :
      !s.active
    );
    return (
      <div>
        {/* KPI Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "14px", marginBottom: "24px" }}>
          {[
            { label: "Total Salesmen", val: salesmen.length, icon: UserCheck, color: "#0052ff" },
            { label: "Active Now", val: salesmen.filter(s => s.active).length, icon: CheckCircle2, color: "#25D366" },
            { label: "Total Orders Handled", val: salesmen.reduce((a, s) => a + (s.totalOrders || 0), 0), icon: ShoppingBag, color: "#fff" },
            { label: "Combined Monthly Sales", val: `₹${salesmen.reduce((a, s) => a + (s.monthlySales || 0), 0).toLocaleString()}`, icon: TrendingUp, color: "#0052ff" },
          ].map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label} style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#888", fontWeight: "700", textTransform: "uppercase" }}>{c.label}</span>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{c.val}</div>
              </div>
            );
          })}
        </div>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {["ALL", "ACTIVE", "INACTIVE"].map(f => (
              <button key={f} onClick={() => setSalesmanFilter(f)}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: salesmanFilter === f ? "#0052ff" : "rgba(255,255,255,0.05)", color: salesmanFilter === f ? "#fff" : "#aaa", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
              >{f}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/salesman/dashboard")}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.4)", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
            >
              <ExternalLink size={14} /> <span>Salesman Dashboard</span>
            </button>
            <button
              onClick={() => { setSalesmanForm(emptySalesmanForm); setSalesmanModal({ mode: "add" }); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #0052ff, #0036b3)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}
            >
              <Plus size={14} /> <span>Add Salesman</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {salesmanSuccessMsg && (
          <div style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", borderRadius: "10px", padding: "12px 18px", marginBottom: "18px", color: "#25D366", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} />
            <strong>{salesmanSuccessMsg}</strong>
          </div>
        )}

        {/* Salesmen Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          {filtered.map(sm => (
            <div key={sm.id} style={{
              background: "var(--admin-surface, #0e1526)",
              border: sm.active ? "1px solid rgba(0, 82, 255, 0.3)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "18px",
              opacity: sm.active ? 1 : 0.65
            }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
                <img src={sm.avatar} alt={sm.name}
                  style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid #0052ff" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>{sm.name}</strong>
                    <span style={{
                      padding: "2px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: "700",
                      background: sm.active ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.06)",
                      color: sm.active ? "#25D366" : "#888"
                    }}>{sm.active ? "Active" : "Inactive"}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#fff", marginBottom: "2px" }}>{sm.role}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>ID: {sm.id} • {sm.email}</div>
                </div>
              </div>

              {/* Password & Credential Tag */}
              <div style={{
                background: "rgba(0, 82, 255, 0.08)",
                border: "1px dashed rgba(0, 82, 255, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#aaa" }}>
                  <Key size={13} style={{ color: "#fff" }} />
                  <span>Portal Pass:</span>
                  <strong style={{ color: "#fff", fontFamily: "monospace", letterSpacing: "1px" }}>
                    {sm.password || "password123"}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordModal({
                    id: sm.id,
                    name: sm.name,
                    currentPassword: sm.password || "password123",
                    newPassword: sm.password || "password123"
                  })}
                  style={{
                    background: "rgba(0, 82, 255, 0.2)",
                    border: "1px solid rgba(0, 82, 255, 0.4)",
                    color: "#fff",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Change
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                {[
                  { l: "Today Sales", v: `₹${(sm.todaySales || 0).toLocaleString()}` },
                  { l: "Month Sales", v: `₹${(sm.monthlySales || 0).toLocaleString()}` },
                  { l: "Rating", v: `⭐ ${sm.rating || 5.0}` },
                ].map(it => (
                  <div key={it.l} style={{ background: "rgba(0,0,0,0.25)", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#777" }}>{it.l}</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginTop: "2px" }}>{it.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "11px", color: "#888", marginBottom: "12px" }}>
                Screens: {sm.assignedScreens?.join(", ") || "–"}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => {
                  setSalesmanForm({
                    name: sm.name, email: sm.email, password: sm.password || "password123", phone: sm.phone,
                    role: sm.role, assignedScreens: sm.assignedScreens?.join(", ") || "",
                    active: sm.active, avatar: sm.avatar
                  });
                  setSalesmanModal({ mode: "edit", id: sm.id });
                }}
                  style={{ flex: 1, background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.35)", color: "#fff", padding: "7px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                ><Pencil size={12} /> Edit</button>

                <button onClick={() => setPasswordModal({
                  id: sm.id,
                  name: sm.name,
                  currentPassword: sm.password || "password123",
                  newPassword: sm.password || "password123"
                })}
                  style={{ flex: 1.2, background: "rgba(0, 210, 255, 0.15)", border: "1px solid rgba(0, 210, 255, 0.35)", color: "#0052ff", padding: "7px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                ><Key size={12} /> Set Pass</button>

                <button onClick={() => handleToggleSalesman(sm.id)}
                  style={{ flex: 1, background: sm.active ? "rgba(255,179,0,0.12)" : "rgba(37,211,102,0.12)", border: `1px solid ${sm.active ? "rgba(255,179,0,0.3)" : "rgba(37,211,102,0.3)"}`, color: sm.active ? "#FFB300" : "#25D366", padding: "7px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                >{sm.active ? "Deactivate" : "Activate"}</button>

                <button onClick={() => handleDeleteSalesman(sm.id)}
                  style={{ background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.25)", color: "#ff6b6b", padding: "7px 9px", borderRadius: "6px", cursor: "pointer" }}
                ><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Set Password Modal */}
        {passwordModal && (
          <div style={modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setPasswordModal(null); }}>
            <div style={{ ...modalBox, maxWidth: "440px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: "rgba(0, 82, 255, 0.15)", padding: "8px", borderRadius: "8px", color: "#fff" }}>
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>Set Salesman Password</h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Account: <strong>{passwordModal.name}</strong></p>
                  </div>
                </div>
                <button onClick={() => setPasswordModal(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>New Login Password *</label>
                  <input
                    type="text"
                    style={{ ...fieldStyle, fontSize: "14px", fontWeight: "700", letterSpacing: "1px" }}
                    value={passwordModal.newPassword}
                    onChange={(e) => setPasswordModal(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    required
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#777" }}>Salesman will use this to sign into Salesman Portal</span>
                    <button
                      type="button"
                      onClick={() => {
                        const randomWords = ["Cinema", "Popcorn", "Movie", "Ticket", "Lounge"];
                        const gen = `${randomWords[Math.floor(Math.random() * randomWords.length)]}@${Math.floor(100 + Math.random() * 900)}`;
                        setPasswordModal(prev => ({ ...prev, newPassword: gen }));
                      }}
                      style={{ background: "transparent", border: "none", color: "#fff", fontSize: "11px", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}
                    >
                      🎲 Generate
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setPasswordModal(null)}
                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1.2, background: "linear-gradient(135deg, #0052ff, #0036b3)", border: "none", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}
                  >
                    Save Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Salesman Add/Edit Modal */}
        {salesmanModal && (
          <div style={modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setSalesmanModal(null); }}>
            <div style={{ ...modalBox, maxWidth: "520px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>
                  {salesmanModal.mode === "add" ? "Add New Salesman" : "Edit Salesman"}
                </h3>
                <button onClick={() => setSalesmanModal(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveSalesman} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[{l:"Full Name",k:"name"},{l:"Email Address",k:"email"},{l:"Login Password (for Salesman Portal)",k:"password"},{l:"Phone Number",k:"phone"},{l:"Role / Title",k:"role"},{l:"Assigned Screens (comma-separated)",k:"assignedScreens"},{l:"Avatar URL",k:"avatar"}].map(f => (
                  <label key={f.k}>
                    <span style={labelStyle}>{f.l}</span>
                    <input style={fieldStyle} value={salesmanForm[f.k] || ""} onChange={e => setSalesmanForm(p => ({ ...p, [f.k]: e.target.value }))} />
                  </label>
                ))}
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={salesmanForm.active} onChange={e => setSalesmanForm(p => ({ ...p, active: e.target.checked }))} />
                  <span style={{ fontSize: "13px", color: "#ccc" }}>Active (can login and receive orders)</span>
                </label>
                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <button type="button" onClick={() => setSalesmanModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #0052ff, #0036b3)", border: "none", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}>Save Salesman</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // SALES render
  // ─────────────────────────────────────────────────────────────────
  function renderSales() {
    const totalRevenue = orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + (Number(o.total) || 0), 0);
    const salesBySalesman = salesmen.map(sm => ({
      name: sm.name, id: sm.id,
      today: sm.todaySales || 0, monthly: sm.monthlySales || 0, total: sm.totalSales || 0,
      orders: sm.totalOrders || 0, rating: sm.rating || 5
    }));
    const filteredBySalesman = salesSalesmanFilter === "ALL" ? salesBySalesman : salesBySalesman.filter(s => s.id === salesSalesmanFilter);

    return (
      <div>
        {/* Time filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[{id:"all",l:"All Time"},{id:"today",l:"Today"},{id:"weekly",l:"This Week"},{id:"monthly",l:"This Month"},{id:"bySalesman",l:"By Salesman"}].map(f => (
            <button key={f.id} onClick={() => setSalesFilter(f.id)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: salesFilter === f.id ? "#0052ff" : "rgba(255,255,255,0.05)", color: salesFilter === f.id ? "#fff" : "#aaa", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
            >{f.l}</button>
          ))}
        </div>

        {/* Summary KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "14px", marginBottom: "24px" }}>
          {[
            { l: "Total Revenue (All Orders)", v: `₹${totalRevenue.toLocaleString()}`, c: "#25D366" },
            { l: "Today's Collective Sales", v: `₹${salesmen.reduce((a, s) => a + (s.todaySales || 0), 0).toLocaleString()}`, c: "#fff" },
            { l: "This Month", v: `₹${salesmen.reduce((a, s) => a + (s.monthlySales || 0), 0).toLocaleString()}`, c: "#0052ff" },
            { l: "Total Orders", v: orders.length, c: "#fff" },
            { l: "Cancelled", v: orders.filter(o => o.status === "CANCELLED").length, c: "#ff6b6b" },
            { l: "Delivered", v: orders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED").length, c: "#4CAF50" },
          ].map(c => (
            <div key={c.l} style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#888", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>{c.l}</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: c.c }}>{c.v}</div>
            </div>
          ))}
        </div>

        {/* By Salesman breakdown */}
        <section style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#fff", fontWeight: "700" }}>SALESMAN BREAKDOWN</div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>Sales by Salesman</h3>
            </div>
            <select
              value={salesSalesmanFilter}
              onChange={e => setSalesSalesmanFilter(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0, 82, 255, 0.2)", borderRadius: "8px", padding: "6px 12px", color: "#fff", fontSize: "12px", cursor: "pointer" }}
            >
              <option value="ALL">All Salesmen</option>
              {salesmen.map(sm => <option key={sm.id} value={sm.id}>{sm.name}</option>)}
            </select>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.3)", color: "#888", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 14px", textAlign: "left" }}>Salesman</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Today's Sales</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Monthly Sales</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Total Sales</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Orders</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredBySalesman.map(sm => (
                  <tr key={sm.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: "700", color: "#fff" }}>{sm.name}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#fff" }}>₹{sm.today.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#0052ff" }}>₹{sm.monthly.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#25D366" }}>₹{sm.total.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>{sm.orders}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#fff" }}>⭐ {sm.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // REVIEWS render
  // ─────────────────────────────────────────────────────────────────
  function renderReviews() {
    const filteredReviews = reviews.filter(r =>
      reviewRatingFilter === 0 ? true : r.rating === reviewRatingFilter
    );
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
      <div>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "24px" }}>
          {[
            { l: "Total Reviews", v: reviews.length, c: "#fff" },
            { l: "Avg Rating", v: `${avgRating} / 5 ⭐`, c: "#0052ff" },
            { l: "5-Star Reviews", v: reviews.filter(r => r.rating === 5).length, c: "#25D366" },
            { l: "Pending Replies", v: reviews.filter(r => !r.reply && !r.hidden).length, c: "#ff6b6b" },
          ].map(c => (
            <div key={c.l} style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#888", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>{c.l}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: c.c }}>{c.v}</div>
            </div>
          ))}
        </div>

        {/* Rating filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[0,5,4,3,2,1].map(r => (
            <button key={r} onClick={() => setReviewRatingFilter(r)}
              style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: reviewRatingFilter === r ? "#0052ff" : "rgba(255,255,255,0.05)", color: reviewRatingFilter === r ? "#fff" : "#aaa", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
            >{r === 0 ? "All" : `${r} ⭐`}</button>
          ))}
        </div>

        {/* Reviews list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredReviews.map(rev => (
            <div key={rev.id} style={{
              background: "var(--admin-surface, #0e1526)",
              border: `1px solid ${rev.hidden ? "rgba(255,255,255,0.04)" : "rgba(0, 82, 255, 0.15)"}`,
              borderRadius: "10px", padding: "18px",
              opacity: rev.hidden ? 0.5 : 1
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>{rev.customerName}</strong>
                    <span style={{ fontSize: "14px", color: "#fff" }}>{'⭐'.repeat(rev.rating)}</span>
                    {rev.hidden && <span style={{ fontSize: "10px", color: "#888", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px" }}>HIDDEN</span>}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>Order #{rev.orderId} • {rev.seat} • {rev.date}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setReviewReplyModal({ id: rev.id }); setReviewReplyText(rev.reply || ""); }}
                    style={{ background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.35)", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  ><MessageSquare size={12} /> Reply</button>
                  <button onClick={() => handleToggleHideReview(rev.id)}
                    style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                  >{rev.hidden ? "Show" : "Hide"}</button>
                  <button onClick={() => handleDeleteReview(rev.id)}
                    style={{ background: "rgba(244,67,54,0.1)", border: "none", color: "#ff6b6b", padding: "5px 8px", borderRadius: "6px", cursor: "pointer" }}
                  ><Trash2 size={12} /></button>
                </div>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#ccc", fontStyle: "italic" }}>"{rev.comment}"</p>
              {rev.reply && (
                <div style={{ background: "rgba(0, 82, 255, 0.06)", border: "1px dashed rgba(0, 82, 255, 0.2)", borderRadius: "6px", padding: "10px 12px", fontSize: "12px", color: "#aaa" }}>
                  <span style={{ color: "#fff", fontWeight: "700" }}>Admin Reply: </span>{rev.reply}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply Modal */}
        {reviewReplyModal && (
          <div style={modalBackdrop}>
            <div style={{ ...modalBox, maxWidth: "480px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: "#fff" }}>Reply to Review</h3>
                <button onClick={() => setReviewReplyModal(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <textarea
                value={reviewReplyText}
                onChange={e => setReviewReplyText(e.target.value)}
                rows={4}
                placeholder="Type your reply to this customer..."
                style={{ ...fieldStyle, resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button onClick={() => setReviewReplyModal(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button onClick={() => handleReviewReply(reviewReplyModal.id)} style={{ flex: 1, background: "linear-gradient(135deg, #0052ff, #0036b3)", border: "none", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 82, 255, 0.3)" }}>Send Reply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // CUSTOMERS render
  // ─────────────────────────────────────────────────────────────────
  function renderCustomers() {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "24px" }}>
          {[
            { l: "Total Customers", v: customers.length, c: "#fff" },
            { l: "Total Orders Placed", v: orders.length, c: "#0052ff" },
            { l: "Total Revenue", v: `₹${customers.reduce((a, c) => a + c.totalSpent, 0).toLocaleString()}`, c: "#25D366" },
            { l: "Avg. Spend/Customer", v: customers.length ? `₹${Math.round(customers.reduce((a, c) => a + c.totalSpent, 0) / customers.length)}` : "₹0", c: "#0052ff" },
          ].map(c => (
            <div key={c.l} style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#888", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>{c.l}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: c.c }}>{c.v}</div>
            </div>
          ))}
        </div>

        <section style={{ background: "var(--admin-surface, #0e1526)", border: "1px solid rgba(0, 82, 255, 0.15)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.3)", color: "#888", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>Customer Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Orders</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Spent</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>Last Order</th>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>Last Seat</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#777" }}>No customer data yet. Orders placed will appear here.</td></tr>
                ) : customers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: "700", color: "#fff" }}>{c.name}</td>
                    <td style={{ padding: "12px 16px", color: "#aaa" }}>{c.phone}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#fff", fontWeight: "700" }}>{c.totalOrders}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#25D366", fontWeight: "700" }}>₹{c.totalSpent.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: "#888", fontSize: "11px" }}>{c.lastOrder}</td>
                    <td style={{ padding: "12px 16px", color: "#fff" }}>{c.lastSeat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // REPORTS render
  // ─────────────────────────────────────────────────────────────────
  function renderReports() {
    const totalRevenue = orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + (Number(o.total) || 0), 0);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
    const topSalesman = [...salesmen].sort((a, b) => (b.monthlySales || 0) - (a.monthlySales || 0))[0];

    const reportCards = [
      {
        label: "Sales Report", icon: TrendingUp, color: "#25D366",
        stats: [
          { l: "Total Revenue", v: `₹${totalRevenue.toLocaleString()}` },
          { l: "Today's Collective", v: `₹${salesmen.reduce((a, s) => a + (s.todaySales || 0), 0).toLocaleString()}` },
          { l: "Total Orders", v: orders.length },
        ],
        action: () => setActivePage("sales")
      },
      {
        label: "Salesman Report", icon: UserCheck, color: "#0052ff",
        stats: [
          { l: "Total Salesmen", v: salesmen.length },
          { l: "Active", v: salesmen.filter(s => s.active).length },
          { l: "Top Performer", v: topSalesman?.name || "–" },
        ],
        action: () => setActivePage("salesmen")
      },
      {
        label: "Orders Report", icon: ShoppingBag, color: "#2196F3",
        stats: [
          { l: "Total Orders", v: orders.length },
          { l: "Delivered", v: orders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED").length },
          { l: "Cancelled", v: orders.filter(o => o.status === "CANCELLED").length },
        ],
        action: () => setActivePage("orders")
      },
      {
        label: "Customer Report", icon: Users, color: "#fff",
        stats: [
          { l: "Total Customers", v: customers.length },
          { l: "Avg. Spend", v: customers.length ? `₹${Math.round(customers.reduce((a, c) => a + c.totalSpent, 0) / customers.length)}` : "₹0" },
          { l: "Repeat Customers", v: customers.filter(c => c.totalOrders > 1).length },
        ],
        action: () => setActivePage("customers")
      },
      {
        label: "Reviews Report", icon: Star, color: "#0052ff",
        stats: [
          { l: "Total Reviews", v: reviews.length },
          { l: "Avg. Rating", v: `${avgRating} ⭐` },
          { l: "5-Star Reviews", v: reviews.filter(r => r.rating === 5).length },
        ],
        action: () => setActivePage("reviews")
      },
      {
        label: "Advertisements Report", icon: Megaphone, color: "#E91E63",
        stats: [
          { l: "Total Ads", v: ads.length },
          { l: "Active Ads", v: ads.filter(a => a.isActive).length },
          { l: "Total Banners", v: banners.length },
        ],
        action: () => setActivePage("advertisements")
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ background: "rgba(0, 82, 255, 0.06)", border: "1px dashed rgba(0, 82, 255, 0.25)", borderRadius: "10px", padding: "14px 18px", fontSize: "12px", color: "#aaa" }}>
            📊 Click any report card to navigate to the detailed page for that module.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" }}>
          {reportCards.map(rc => {
            const Icon = rc.icon;
            return (
              <div key={rc.label}
                onClick={rc.action}
                style={{ background: "var(--cinema-surface, #161820)", border: `1px solid ${rc.color}22`, borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "transform 0.15s", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.06 }}>
                  <Icon size={80} style={{ color: rc.color }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ background: `${rc.color}20`, padding: "8px", borderRadius: "8px" }}>
                    <Icon size={18} style={{ color: rc.color }} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#fff" }}>{rc.label}</h3>
                  <ExternalLink size={12} style={{ marginLeft: "auto", color: "#666" }} />
                </div>
                {rc.stats.map(s => (
                  <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: "12px", color: "#888" }}>{s.l}</span>
                    <strong style={{ fontSize: "13px", color: "#fff" }}>{s.v}</strong>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <AdminHeader
          title={
            pageConfig[activePage]?.title ?? "Admin"
          }
          subtitle={
            pageConfig[activePage]?.subtitle ?? ""
          }
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <div className="admin-content">
          {activePage === "dashboard" &&
            renderDashboard()}

          {activePage === "advertisements" &&
            renderAdvertisements()}

          {activePage === "salesmen" &&
            renderSalesmen()}

          {activePage === "sales" &&
            renderSales()}

          {activePage === "orders" &&
            renderOrders()}

          {activePage === "reviews" &&
            renderReviews()}

          {activePage === "customers" &&
            renderCustomers()}

          {activePage === "reports" &&
            renderReports()}

          {activePage === "settings" &&
            renderSettings()}

          {activePage === "theater-config" &&
            renderTheaterConfig()}

          {activePage === "workflow" &&
            renderWorkflow()}

          {activePage === "campaigns" &&
            renderCampaigns()}

          {activePage === "menu" &&
            renderMenu()}

          {activePage === "banners" &&
            renderBanners()}

          {activePage === "offers" &&
            renderOffers()}

          {activePage === "image-library" &&
            renderImageLibrary()}

          {activePage === "analytics" &&
            renderAnalytics()}
        </div>
      </main>

      {selectedOrder && (
        <div className="admin-modal-backdrop">
          <div className="order-detail-modal">
            <button
              className="modal-close"
              onClick={() =>
                setSelectedOrder(null)
              }
            >
              <X size={20} />
            </button>

            <div className="modal-heading">
              <span>ORDER DETAILS</span>

              <h2>
                {selectedOrder.id}
              </h2>

              <OrderStatusBadge
                status={
                  selectedOrder.status
                }
              />
            </div>

            <div className="order-detail-customer">
              <div>
                <span>Customer</span>
                <strong>
                  {
                    selectedOrder.customerName
                  }
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {selectedOrder.phone}
                </strong>
              </div>

              <div>
                <span>Seat</span>
                <strong>
                  {selectedOrder.seat}
                </strong>
              </div>
            </div>

            <div className="order-detail-items">
              <h3>Items</h3>

              {selectedOrder.items.map(
                (item, index) => (
                  <div
                    className="order-detail-item"
                    key={`${item.name}-${index}`}
                  >
                    <span>
                      {item.name} ×{" "}
                      {item.quantity}
                    </span>

                    <strong>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div className="order-detail-total">
              <span>Total</span>

              <strong>
                ₹
                {selectedOrder.total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                background: "rgba(0, 82, 255, 0.08)",
                border: "1px dashed rgba(0, 82, 255, 0.35)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                fontSize: "12px"
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: "700", marginBottom: "2px" }}>
                  Status: <span style={{ color: "#fff" }}>{selectedOrder.status}</span> (View Only)
                </div>
                <span style={{ color: "#888", fontSize: "11px" }}>
                  Order status can only be updated by the assigned Salesman in the Salesman Portal.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#ccc",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {menuModal && (
        <div className="admin-modal-backdrop">
          <div className="menu-modal">
            <button
              className="modal-close"
              onClick={() =>
                setMenuModal(null)
              }
            >
              <X size={20} />
            </button>

            <div className="modal-heading">
              <span>
                MENU MANAGEMENT
              </span>

              <h2>
                {menuModal.mode === "add"
                  ? "Add Menu Item"
                  : "Edit Menu Item"}
              </h2>
            </div>

            <form
              className="menu-form"
              onSubmit={handleMenuSubmit}
            >
              <label>
                Item Name

                <input
                  value={menuForm.name}
                  onChange={(event) =>
                    setMenuForm({
                      ...menuForm,
                      name: event.target
                        .value,
                    })
                  }
                  placeholder="Classic Popcorn"
                />
              </label>

              <label>
                Description

                <textarea
                  value={
                    menuForm.description
                  }
                  onChange={(event) =>
                    setMenuForm({
                      ...menuForm,
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="Fresh buttery popcorn"
                />
              </label>

              <div className="form-two-columns">
                <label>
                  Category

                  <select
                    value={
                      menuForm.category
                    }
                    onChange={(event) =>
                      setMenuForm({
                        ...menuForm,
                        category:
                          event.target
                            .value,
                      })
                    }
                  >
                    <option>
                      Popcorn
                    </option>
                    <option>
                      Snacks
                    </option>
                    <option>
                      Meals
                    </option>
                    <option>
                      Drinks
                    </option>
                    <option>
                      Desserts
                    </option>
                  </select>
                </label>

                <label>
                  Price

                  <input
                    type="number"
                    min="0"
                    value={menuForm.price}
                    onChange={(event) =>
                      setMenuForm({
                        ...menuForm,
                        price:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Stock

                <input
                  type="number"
                  min="0"
                  value={menuForm.stock}
                  onChange={(event) =>
                    setMenuForm({
                      ...menuForm,
                      stock:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={
                    menuForm.available
                  }
                  onChange={(event) =>
                    setMenuForm({
                      ...menuForm,
                      available:
                        event.target.checked,
                    })
                  }
                />

                Available for customers
              </label>

              <button
                type="submit"
                className="primary-admin-button full-width"
              >
                {menuModal.mode === "add"
                  ? "Add Item"
                  : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
