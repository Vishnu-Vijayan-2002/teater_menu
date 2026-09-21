import {
  LayoutDashboard,
  ShoppingBag,
  Megaphone,
  UserCheck,
  TrendingUp,
  Star,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Building2,
  Workflow,
  Send,
  UtensilsCrossed,
} from "lucide-react";

export default function AdminSidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  const sections = [
    {
      label: "OVERVIEW",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "CONTENT MANAGEMENT",
      items: [
        { id: "theater-config", label: "Theater Configuration", icon: Building2 },
        { id: "menu", label: "Product Management", icon: UtensilsCrossed },
        { id: "advertisements", label: "Advertisements", icon: Megaphone },
      ],
    },
    {
      label: "WHATSAPP AUTOMATION",
      items: [
        { id: "workflow", label: "Messaging Workflow", icon: Workflow },
        { id: "campaigns", label: "Ad Campaigns", icon: Send },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { id: "salesmen", label: "Salesmen", icon: UserCheck },
        { id: "sales", label: "Sales", icon: TrendingUp },
        { id: "orders", label: "Orders", icon: ShoppingBag },
      ],
    },
    {
      label: "ENGAGEMENT",
      items: [
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "customers", label: "Customers", icon: Users },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { id: "reports", label: "Reports", icon: FileBarChart },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const handleNavigation = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon" style={{ background: "transparent", padding: 0, overflow: "hidden" }}>
              <img src="/logo.png" alt="Logo" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
            </div>
            <div>
              <h2 style={{ color: "#fff", letterSpacing: "1px" }}>CINÉMA</h2>
              <span style={{ color: "#fff", fontWeight: "600" }}>Admin Panel</span>
            </div>
          </div>

          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, paddingBottom: "10px" }}>
          {sections.map((section) => (
            <div key={section.label} className="admin-sidebar-section" style={{ marginBottom: "4px" }}>
              <span className="sidebar-label">{section.label}</span>
              <nav className="admin-navigation">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`admin-nav-item ${
                        activePage === item.id ? "active" : ""
                      }`}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                      {activePage === item.id && (
                        <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-theater-info">
            <div className="theater-status-dot" />
            <div>
              <strong>THEATER 01</strong>
              <span>Admin Panel Live</span>
            </div>
          </div>

          <button className="admin-logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
