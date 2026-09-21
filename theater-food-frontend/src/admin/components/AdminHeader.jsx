import {
  Menu,
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

export default function AdminHeader({
  title,
  subtitle,
  onMenuClick,
}) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-mobile-menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1>{title}</h1>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>
      </div>

      <div className="admin-header-right">
        <div className="admin-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className="admin-icon-button notification-button">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <button className="admin-profile">
          <UserCircle size={28} />

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </button>
      </div>
    </header>
  );
}