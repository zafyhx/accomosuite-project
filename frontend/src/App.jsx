import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/auth/Login";

// Import Icon Modern
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  ShieldCheck, 
  MapPin, 
  Star, 
  ArrowRight 
} from "lucide-react";

// --- 1. KOMPONEN HOME (DASHBOARD) ---
const Home = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Hero />

      {/* Container Utama */}
      <div className="container mx-auto px-4 md:px-10 -mt-10 md:-mt-12 relative z-20">
        
        {/* === DASHBOARD CARD (Hanya muncul jika login) === */}
        {user && (
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 mb-10 border border-gray-100">
            
            {/* Header Dashboard */}
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
                <p className="text-xs md:text-sm text-gray-500 mt-1">Aktivitas akun Anda</p>
              </div>
            </div>

            {/* Grid Menu Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {user.role === 'admin' ? (
                <>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3">
                    <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-blue-500/20 group-hover:scale-105 transition">
                      <LayoutDashboard size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">Kelola Kamar</h3>
                      <p className="text-xs text-gray-500">Tambah/Edit Data</p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3">
                    <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-indigo-500/20 group-hover:scale-105 transition">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">Reservasi</h3>
                      <p className="text-xs text-gray-500">Cek Booking</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3">
                    <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-primary/30 group-hover:scale-105 transition">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">Booking Saya</h3>
                      <p className="text-xs text-gray-500">Riwayat Pesanan</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3">
                <div className="bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-gray-500/20 group-hover:scale-105 transition">
                  <Settings size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">Pengaturan</h3>
                  <p className="text-xs text-gray-500">Profil & Keamanan</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === SECTION JUDUL === */}
        <div className={`flex justify-between items-end mb-6 ${!user ? 'mt-8' : ''}`}>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-secondary">Destinasi Populer</h2>
            <p className="text-sm text-gray-500 mt-1">Pilihan akomodasi terbaik minggu ini</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline text-sm">
            Lihat Semua <ArrowRight size={16} />
          </button>
        </div>

        {/* === GRID KAMAR (Compact Desktop) === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
           {[1, 2, 3, 4].map((item) => (
             <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
               
               {/* Gambar Kamar */}
               <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/800x600?luxury,hotel&sig=${item}`} 
                    alt="Kamar" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-secondary text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star size={10} className="text-orange-400 fill-orange-400" /> 4.8
                  </div>
               </div>

               {/* Info Kamar */}
               <div className="p-4 flex flex-col flex-grow justify-between">
                 <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary group-hover:text-primary transition line-clamp-1">
                      Grand Deluxe Suite {item}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <MapPin size={12} />
                        <span>Bali, Indonesia</span>
                    </div>
                 </div>
                 
                 <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-gray-400 text-[10px] uppercase tracking-wide">Mulai dari</span>
                        <div className="text-primary font-bold text-sm md:text-base">Rp 1.500.000</div>
                    </div>
                    <button className="bg-secondary active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary transition">
                        Pesan
                    </button>
                 </div>
               </div>
             </div>
           ))}
        </div>

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
      </Routes>
    </div>
  );
}

export default App;