import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarCheck, BookOpen, LogOut, ShieldAlert, Settings, User } from "lucide-react";

// CATATAN: Warna Primary adalah Cyan Segar (#29D9D5)
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Asumsi data user disimpan di localStorage atau Context
  // Kita coba ambil dari localStorage secara langsung
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null; 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard Utama" },
    { path: "/admin/suites", icon: <BedDouble size={20} />, label: "Manajemen Suite" },
    { path: "/admin/bookings", icon: <CalendarCheck size={20} />, label: "Approval Reservasi" },
    { path: "/admin/blog", icon: <BookOpen size={20} />, label: "Manajemen Blog" },
    { path: "/admin/logs", icon: <ShieldAlert size={20} />, label: "Security Logs" },
    { path: "/profile", icon: <User size={20} />, label: "Profil Saya (User)" },
  ];

  const getNavLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
      location.pathname === path 
        ? "bg-primary text-white shadow-md shadow-primary/40" 
        : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar (Responsive) */}
      <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Accomo<span className="text-secondary">suite</span>
            </h1>
          </div>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className={getNavLinkClass(item.path)}>
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 text-sm text-secondary">
             <Settings size={16} className="text-gray-500" /> Anda Login Sebagai:
          </div>
          {/* Cek user sebelum menampilkan nama/role */}
          {user ? (
            <div className="text-sm font-semibold text-gray-700 mb-4">{user.name} ({user.role})</div>
          ) : (
            <div className="text-sm font-semibold text-gray-400 mb-4">Memuat data user...</div>
          )}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-all font-medium border border-red-100 active:scale-95"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;