import {
  BedDouble,
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
  Users, // Tambah Icon Menu
  X, // Tambah Icon Close
} from "lucide-react";
import { useState } from "react"; // Tambah useState
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// CATATAN: Warna Primary adalah Cyan Segar (#29D9D5)
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // STATE UNTUK SIDEBAR MOBILE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Asumsi data user disimpan di localStorage atau Context
  const userString =
    localStorage.getItem("userInfo") || localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard Utama",
    },
    {
      path: "/admin/suites",
      icon: <BedDouble size={20} />,
      label: "Manajemen Suite",
    },
    {
      path: "/admin/bookings",
      icon: <CalendarCheck size={20} />,
      label: "Approval Reservasi",
    },
    {
      path: "/admin/blogs",
      icon: <BookOpen size={20} />,
      label: "Manajemen Blog",
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Manajemen User",
    },
    {
      path: "/admin/logs",
      icon: <ShieldAlert size={20} />,
      label: "Activity Logs",
    },
  ];

  const getNavLinkClass = (path) => {
    const isActive =
      path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(path);

    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? "bg-cyan-50 text-cyan-600 shadow-sm border border-cyan-100 translate-x-1"
        : "text-gray-500 hover:bg-gray-50 hover:text-cyan-600"
    }`;
  };

  return (
    // UBAH STRUKTUR DISINI: Gunakan Flex Container
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* 1. OVERLAY GELAP (Hanya muncul di Mobile saat Sidebar terbuka) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR RESPONSIVE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <div className="h-full flex flex-col">
          {/* Header Sidebar */}
          <div className="h-20 flex items-center justify-between px-8 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
                <ShieldAlert className="fill-current" /> Accomosuite
              </div>
            </Link>
            {/* Tombol Close (Hanya di Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
              Main Menu
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)} // Tutup sidebar saat klik menu di HP
                  className={getNavLinkClass(item.path)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer Sidebar (Logout) */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3 text-sm text-secondary">
              <Settings size={16} className="text-gray-500" /> Anda Login
              Sebagai:
            </div>
            {user ? (
              <div className="text-sm font-semibold text-gray-700 mb-4 truncate">
                {user.name} ({user.role})
              </div>
            ) : (
              <div className="text-sm font-semibold text-gray-400 mb-4">
                Admin User
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-all font-medium border border-red-100 active:scale-95"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 3. KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER MOBILE (Hanya muncul di layar kecil) */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800 text-lg">Dashboard</span>
        </div>

        {/* OUTLET CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
