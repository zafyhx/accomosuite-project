import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User, Menu } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Deteksi Scroll untuk ubah background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logika Warna: Transparan di Home (sebelum scroll), Putih di halaman lain
  const isHome = location.pathname === "/";
  const transparentMode = isHome && !isScrolled;
  
  const navBg = transparentMode ? "bg-transparent" : "bg-white shadow-md";
  const textColor = transparentMode ? "text-white" : "text-secondary";
  const logoColor = transparentMode ? "text-white" : "text-primary";
  const lineColor = transparentMode ? "bg-white" : "bg-primary"; // Warna garis bawah

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- SUB-COMPONENT: Link Navigasi dengan Garis Bawah ---
  // Ini komponen kecil khusus untuk membuat link yang ada garisnya
  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to; // Cek apakah kita sedang di halaman ini?
    
    return (
      <Link to={to} className={`relative group ${textColor} font-medium transition-colors hover:text-primary`}>
        {label}
        {/* Garis Bawah Ajaib */}
        <span className={`absolute -bottom-2 left-0 h-[2px] rounded-full transition-all duration-300 
          ${lineColor} 
          ${isActive ? "w-full" : "w-0 group-hover:w-full"} 
        `}></span>
      </Link>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 1. LOGO */}
        <Link to="/" className={`text-2xl font-bold flex items-center gap-2 ${logoColor}`}>
          Accomosuite
        </Link>

        {/* 2. MENU TENGAH (Desktop) */}
        <div className="hidden md:flex gap-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/hotel" label="Hotels" />
          <NavLink to="/blog" label="Blogs" />
          <NavLink to="/contact" label="Contacts" />
        </div>

        {/* 3. MENU KANAN (User/Login) */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className={`flex items-center gap-3 ${textColor}`}>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs opacity-80 uppercase">{user.role}</p>
              </div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${transparentMode ? 'border-white/50 bg-white/20' : 'border-gray-200 bg-gray-100'}`}>
                <User size={20} />
              </div>

              <button 
                onClick={handleLogout}
                className="ml-2 text-red-500 hover:text-red-400 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-medium transition shadow-lg shadow-primary/30"
            >
              Login
            </Link>
          )}

          {/* Tombol Hamburger (Mobile) */}
          <button 
            className={`md:hidden ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-lg border-t animate-fade-in-down">
          <div className="flex flex-col p-4 gap-4 text-secondary font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">Home</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">About</Link>
            <Link to="/destination" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">Destination</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;