import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// --- KOMPONEN HOME SEMENTARA  ---
const Home = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="container mx-auto p-10 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Selamat Datang di <span className="text-primary">Accomosuite</span>
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Sistem Reservasi Hotel Modern & Terpercaya
        </p>
        
        {/* LOGIKA TAMPILAN DASHBOARD */}
        {user ? (
          // JIKA SUDAH LOGIN
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Halo, {user.name}! 👋
            </h2>
            <p className="text-gray-500 mb-6">
              Anda login sebagai <strong className="uppercase text-primary">{user.role}</strong>
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition">
                {user.role === 'admin' ? '⚙️ Kelola Kamar' : '🏨 Cari Kamar'}
              </button>
              <button className="p-4 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition">
                👤 Edit Profil
              </button>
            </div>
          </div>
        ) : (
          // JIKA BELUM LOGIN
          <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-gray-700 mb-4">
              Silakan login untuk mulai memesan kamar impian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP UTAMA ---
function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar ditaruh di luar Routes agar selalu muncul */}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;