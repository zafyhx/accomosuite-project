import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User } from "lucide-react"; // Import Ikon

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fungsi saat tombol Logout ditekan
  const handleLogout = () => {
    logout(); // 1. Hapus data user di memori
    navigate("/login"); // 2. Tendang ke halaman login
    alert("Anda berhasil logout!"); // 3. Beri notifikasi
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* LOGO KIRI */}
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          🏨 Accomosuite
        </Link>

        {/* MENU KANAN */}
        <div className="flex items-center gap-6">
          {user ? (
            // === TAMPILAN JIKA SUDAH LOGIN ===
            <div className="flex items-center gap-4">
              {/* Info Nama & Role (Hilang di HP, Muncul di Laptop) */}
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              
              {/* Lingkaran Avatar */}
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User size={20} className="text-gray-600" />
              </div>

              {/* Garis Pemisah Kecil */}
              <div className="h-8 w-px bg-gray-300 mx-2"></div>

              {/* Tombol Logout */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                title="Keluar Aplikasi"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            // === TAMPILAN JIKA BELUM LOGIN (TAMU) ===
            <Link 
              to="/login" 
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/30"
            >
              Login Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;