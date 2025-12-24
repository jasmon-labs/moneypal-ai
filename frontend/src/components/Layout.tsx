import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Bot,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" }, 
    { icon: Wallet, label: "Transactions", path: "/transactions" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: Bot, label: "AI Coach", path: "/ai-coach" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Rebranded to MoneyPal */}
          <h2 className="brand-logo" style={{ color: '#8b5cf6', fontWeight: 'bold' }}>MoneyPal</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            // Logic to highlight Dashboard if path is /dashboard OR root /
            const isActive = location.pathname === item.path || 
                            (item.path === "/dashboard" && location.pathname === "/");

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="user-actions">
            <div className="notification-wrapper">
              <button className="icon-btn">
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <span className="mark-read">Mark all read</span>
                </div>
                <div className="dropdown-items">
                  <div className="notif-item unread">
                    <div className="notif-icon alert"><AlertTriangle size={16} /></div>
                    <div className="notif-text">
                      <p>Spending Alert</p>
                      <span>You've used 85% of your food budget.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-profile">
              <div className="avatar">CM</div>
              <div className="user-info">
                <span className="name">Chirag Mishra</span>
                <span className="role">Premium User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}