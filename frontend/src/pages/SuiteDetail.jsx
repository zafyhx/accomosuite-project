import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  MapPin, Wifi, Wind, Star, CheckCircle2, CalendarDays, Users, ArrowLeft, Loader2 
} from "lucide-react";

const SuiteDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [suite, setSuite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false); // State loading khusus tombol pesan

  // State Form
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalDays, setTotalDays] = useState(0);

  // 1. Ambil Data Detail Kamar
  useEffect(() => {
    const fetchSuite = async () => {
      try {
        const { data } = await axios.get(`/api/suites/${id}`);
        setSuite(data);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuite();
  }, [id]);

  // 2. Hitung Durasi
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setTotalDays(diffDays > 0 ? diffDays : 0);
    }
  }, [checkIn, checkOut]);

  // 3. Handle Booking (DENGAN INDIKATOR LOADING)
  const handleBooking = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memesan!");
      navigate("/login");
      return;
    }
    if (totalDays === 0) {
      alert("Pilih tanggal check-in dan check-out dengan benar.");
      return;
    }

    try {
      setIsBooking(true); // Matikan tombol biar gak di-spam klik

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const bookingData = {
        suiteId: suite._id,
        checkIn,
        checkOut,
        totalDays,
        totalPrice: suite.price * totalDays + 50000, 
        guests
      };

      // Kirim ke Backend
      await axios.post("/api/bookings", bookingData, config);
      
      alert("✅ Booking Berhasil! Silakan cek status di dashboard.");
      
      // Arahkan user sesuai role
      if (user.role === 'admin') {
        navigate("/admin/bookings"); // Kalau admin, langsung ke tabel admin
      } else {
        navigate("/"); // Kalau user biasa, ke home (nanti ke 'my bookings')
      }

    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setIsBooking(false); // Hidupkan tombol lagi
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary"/></div>;
  if (!suite) return <div className="text-center py-20">Properti tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="container mx-auto px-4 md:px-10">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* DETAIL ATAS */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="h-[300px] md:h-[500px] relative">
            <img 
              src={suite.images[0] ? `http://localhost:5000${suite.images[0]}` : "https://via.placeholder.com/800x400"} 
              alt={suite.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold shadow-sm uppercase tracking-wide text-primary">
              {suite.type}
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-secondary mb-2">{suite.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={18} className="text-primary" />
                  <span>{suite.location || "Lokasi belum diatur"}</span>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-orange-400 fill-orange-400" />
                    <span className="font-bold text-gray-800">4.8</span>
                    <span className="text-gray-400">(120 Review)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Mulai dari</p>
                <p className="text-3xl font-bold text-primary">
                  Rp {suite.price.toLocaleString()}
                  <span className="text-base text-gray-400 font-normal"> / malam</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-4">Tentang Properti Ini</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {suite.description}
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-6">Fasilitas Utama</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {suite.facilities.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <CheckCircle2 size={18} className="text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <Wifi size={18} className="text-primary" /> Free WiFi
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <Wind size={18} className="text-primary" /> Full AC
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (FORM) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-primary/20 sticky top-28">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <CalendarDays className="text-primary" /> Atur Jadwal Menginap
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-In</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-Out</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tamu</label>
                  <div className="flex items-center bg-gray-50 border rounded-xl px-3">
                    <Users size={18} className="text-gray-400" />
                    <input 
                      type="number" min="1" max={suite.capacity}
                      className="w-full p-3 bg-transparent outline-none"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                </div>

                {totalDays > 0 && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Rp {suite.price.toLocaleString()} x {totalDays} malam</span>
                      <span>Rp {(suite.price * totalDays).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Layanan</span>
                      <span>Rp 50.000</span>
                    </div>
                    <div className="h-px bg-blue-200 my-2"></div>
                    <div className="flex justify-between font-bold text-lg text-secondary">
                      <span>Total</span>
                      <span className="text-primary">Rp {(suite.price * totalDays + 50000).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleBooking}
                  disabled={isBooking} // Disable saat loading
                  className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg shadow-primary/30 mt-4 active:scale-95 flex justify-center items-center gap-2 
                    ${isBooking ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                >
                  {isBooking ? <Loader2 className="animate-spin"/> : "Pesan Sekarang"}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-2">
                  Anda belum akan dikenakan biaya.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuiteDetail;