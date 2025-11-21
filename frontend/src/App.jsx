import { useContext, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios"; // JANGAN LUPA IMPORT AXIOS
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/auth/Login";

//--- HALAMAN ADMIN ---//
import ManageSuites from "./pages/admin/ManageSuites";
import AddSuite from "./pages/admin/AddSuite";

import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Star, 
  ArrowRight,
  Loader2 // Icon loading
} from "lucide-react";

// --- 1. KOMPONEN HOME (DASHBOARD) ---
const Home = () => {
  const { user } = useContext(AuthContext);
  const [suites, setSuites] = useState([]); // Tempat simpan data kamar
  const [loading, setLoading] = useState(true);

  // AMBIL DATA DARI BACKEND SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const { data } = await axios.get("/api/suites");
        setSuites(data); // Simpan ke state
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuites();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Hero />

      {/* Container Utama */}
      <div className="container mx-auto px-4 md:px-10 -mt-10 md:-mt-12 relative z-20">
        
        {/* === DASHBOARD CARD (User Login) === */}
        {user && (
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 mb-10 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-secondary flex flex-wrap items-center gap-2">
                  Halo, {user.name}
                  {user.role === 'admin' && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider font-bold">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  )}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Mau menginap di mana hari ini?</p>
              </div>
            </div>

            {/* Menu Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/suites">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                      <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-blue-500/20 group-hover:scale-105 transition">
                        <LayoutDashboard size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base">Kelola Properti</h3>
                        <p className="text-xs text-gray-500">Tambah/Edit Data</p>
                      </div>
                    </div>
                  </Link>
                  {/* ... Menu lain sama seperti sebelumnya ... */}
                </>
              ) : (
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                   <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-primary/30 group-hover:scale-105 transition">
                     <CalendarDays size={18} />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-800 text-sm md:text-base">Booking Saya</h3>
                     <p className="text-xs text-gray-500">Riwayat Pesanan</p>
                   </div>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* === DAFTAR PROPERTI (REAL DATA) === */}
        <div className={`flex justify-between items-end mb-6 ${!user ? 'mt-8' : ''}`}>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-secondary">Rekomendasi Akomodasi</h2>
            <p className="text-sm text-gray-500 mt-1">Temukan tempat menginap terbaik sesuai gaya liburanmu</p>
          </div>
        </div>

        {loading ? (
          // TAMPILAN LOADING
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : suites.length === 0 ? (
          // TAMPILAN JIKA KOSONG
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada properti yang tersedia saat ini.</p>
          </div>
        ) : (
          // TAMPILAN GRID DATA ASLI
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {suites.map((suite) => (
               <div key={suite._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
                 
                 {/* Gambar */}
                 <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img 
                      src={suite.images[0] ? `http://localhost:5000${suite.images[0]}` : "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={suite.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    
                    {/* Badge Tipe Properti */}
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {suite.type}
                    </div>

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Star size={10} className="text-orange-400 fill-orange-400" /> 4.8
                    </div>
                 </div>

                 {/* Konten */}
                 <div className="p-4 flex flex-col flex-grow justify-between">
                   <div>
                      <h3 className="text-base md:text-lg font-bold text-secondary group-hover:text-primary transition line-clamp-1">
                        {suite.name}
                      </h3>
                      {/* Lokasi Asli */}
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <MapPin size={12} />
                          <span>{suite.location || "Lokasi belum diatur"}</span>
                      </div>
                   </div>
                   
                   <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                          <span className="text-gray-400 text-[10px] uppercase tracking-wide">Mulai dari</span>
                          <div className="text-primary font-bold text-sm md:text-base">
                            Rp {suite.price.toLocaleString()}
                          </div>
                      </div>
                      <button className="bg-secondary active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary transition">
                          Lihat
                      </button>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

// --- 2. APP UTAMA ---
function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/suites" element={<ManageSuites />} />
        <Route path="/admin/suites/add" element={<AddSuite />} />
      </Routes>
    </div>
  );
}

export default App;