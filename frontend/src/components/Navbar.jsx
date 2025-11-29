import { LogOut, Menu, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../assets/Logo.png";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const transparentMode = isHome && !isScrolled;

  const navBg = transparentMode
    ? "bg-transparent"
    : "bg-white/90 backdrop-blur-md shadow-sm"; // Update: opacity 90 biar lebih jelas
  const textColor = transparentMode ? "text-white" : "text-secondary";
  const lineColor = transparentMode ? "bg-white" : "bg-primary";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative group ${textColor} font-bold text-base transition-colors hover:text-primary flex items-center`}
      >
        {label}
        <span
          className={`absolute -bottom-2 left-0 h-[3px] rounded-full transition-all duration-300 
          ${lineColor} ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        ></span>
      </Link>
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="container mx-auto px-4 md:px-8 py-3 md:py-5 flex items-center justify-between relative">
        {/* 1. LOGO & BRAND */}
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 group z-20 relative shrink-0"
        >
          <img
            src={LogoImage}
            alt="Accomosuite Logo"
            className="h-8 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />

          <span
            className={`text-lg md:text-2xl font-bold ${textColor} tracking-tight pb-0.5`}
          >
            Accomosuite
          </span>
        </Link>

        {/* 2. MENU TENGAH (Desktop Only - Absolute Center) */}
        <div className="hidden md:flex gap-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NavLink to="/" label="Home" />
          <NavLink to="/hotel" label="Hotels" />
          <NavLink to="/blog" label="Blogs" />
          <NavLink to="/contact" label="Contacts" />
        </div>

        {/* 3. USER/LOGIN & HAMBURGER */}
        <div className="flex items-center gap-3 md:gap-5 z-20 relative">
          {user ? (
            <div className={`flex items-center gap-2 md:gap-4 ${textColor}`}>
              <div className="hidden md:block text-right leading-tight">
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-xs opacity-80 uppercase font-semibold tracking-wider">
                  {user.role}
                </p>
              </div>

              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border ${
                  transparentMode
                    ? "border-white/50 bg-white/10"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <User size={18} className="md:w-5 md:h-5" />
              </div>

              <button
                onClick={handleLogout}
                className="ml-1 text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 md:p-2 rounded-full transition"
                title="Logout"
              >
                <LogOut size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 md:px-7 md:py-3 rounded-full font-bold text-xs md:text-base transition shadow-lg shadow-primary/30 active:scale-95"
            >
              Login
            </Link>
          )}

          {/* Hamburger Mobile */}
          <button
            className={`md:hidden ${textColor} p-1 focus:outline-none`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-xl border-t animate-fade-in-down">
          <div className="flex flex-col p-6 gap-6 text-secondary font-bold text-center text-lg">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-primary py-2 border-b border-gray-50"
            >
              Home
            </Link>
            <Link
              to="/hotel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-primary py-2 border-b border-gray-50"
            >
              Hotels
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-primary py-2 border-b border-gray-50"
            >
              Blogs
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-primary py-2"
            >
              Contacts
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
