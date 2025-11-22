import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  MapPin, 
  Wifi, 
  Wind, 
  Star, 
  CheckCircle2, 
  CalendarDays,
  Users,
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard
} from "lucide-react";

const SuiteDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [suite, setSuite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // --- STATE FORM ---
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalDays, setTotalDays] = useState(0);

  // State Data Tamu (Fitur dari referensi lama Anda)
  const [guestInfo, setGuestInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "", 
    specialRequests: ""
  });

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

  // Update Guest Info saat user login
  useEffect(() => {
    if (user) {
      setGuestInfo(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // 2. Hitung Durasi
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      if (start >= end) {
        setTotalDays(0);
        return;
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setTotalDays(diffDays > 0 ? diffDays : 0);
    }
  }, [checkIn, checkOut]);

  // Handle Input Data Tamu
  const handleGuestChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  // 3. Handle Booking
  const handleBooking = async (e) => {
    e.preventDefault(); 

    if (!user) {
      alert("Silakan login terlebih dahulu untuk memesan!");
      navigate("/login");
      return;
    }
    if (totalDays === 0) {
      alert("Mohon pilih tanggal Check-in dan Check-out dengan benar.");
      return;
    }

    try {
      setIsBooking(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const bookingData = {
        suiteId: suite._id,
        checkIn,
        checkOut,
        totalDays,
        totalPrice: (suite.price * totalDays) + 50000, 
        guests,
        guestDetails: guestInfo 
      };

      await axios.post("/api/bookings", bookingData, config);
      
      // Redirect ke Halaman Sukses (Lebih Professional daripada Alert)
      navigate("/booking-success");

    } catch (error) {
      console.error(error);
      alert("Gagal booking: " + (error.response?.data?.message || "Server Error"));
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary"/></div>;
  if (!suite) return <div className="text-center py-20">Properti tidak ditemukan.</div>;

  const roomPriceTotal = suite.price * totalDays;
  const serviceFee = 50000;
  const grandTotal = roomPriceTotal + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition group font-medium"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition">
            <ArrowLeft size={18} />
          </div>
          Kembali ke Pencarian
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: DETAIL & FORMULIR TAMU --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Kartu Detail Properti */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="h-64 md:h-80 relative">
                <img 
                  src={suite.images[0] ? `http://localhost:5000${suite.images[0]}` : "https://via.placeholder.com/800x400"} 
                  alt={suite.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-lg">
                    {suite.type}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold shadow-black drop-shadow-lg">{suite.name}</h1>
                  <div className="flex items-center gap-2 text-gray-200 mt-2">
                    <MapPin size={16} /> {suite.location || "Lokasi Strategis"}
                    <span>•</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} fill="currentColor" /> 4.8 (24 Review)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fasilitas */}
              <div className="p-6 md:p-8 bg-white">
                <h3 className="text-lg font-bold text-secondary mb-4">Fasilitas Tersedia</h3>
                <div className="flex flex-wrap gap-3">
                  {suite.facilities.map((item, i) => (
                    <span key={i} className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg border border-gray-100 text-sm font-medium">
                      <CheckCircle2 size={16} className="text-primary" /> {item}
                    </span>
                  ))}
                  <span className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg border border-gray-100 text-sm font-medium">
                    <Wifi size={16} className="text-primary" /> Free WiFi
                  </span>
                  <span className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg border border-gray-100 text-sm font-medium">
                    <Wind size={16} className="text-primary" /> Full AC
                  </span>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-secondary mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{suite.description}</p>
                </div>
              </div>
            </div>

            {/* 2. Form Informasi Tamu (Remastered) */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-t-4 border-primary">
              <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                <User className="text-primary" /> Informasi Tamu
              </h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="text" name="fullName"
                      value={guestInfo.fullName} onChange={handleGuestChange}
                      className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                      placeholder="Nama sesuai KTP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="email" name="email"
                      value={guestInfo.email} onChange={handleGuestChange}
                      className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="tel" name="phone"
                      value={guestInfo.phone} onChange={handleGuestChange}
                      className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                      placeholder="0812..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Permintaan Khusus</label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      type="text" name="specialRequests"
                      value={guestInfo.specialRequests} onChange={handleGuestChange}
                      className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                      placeholder="Contoh: Late check-in"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: BOOKING CARD (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500">Harga mulai</p>
                  <h2 className="text-2xl font-bold text-secondary">
                    Rp {suite.price.toLocaleString()} 
                    <span className="text-sm font-normal text-gray-400"> /malam</span>
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  <CheckCircle2 size={12}/> Tersedia
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                {/* Input Tanggal */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Check-In</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Check-Out</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Input Tamu */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Jumlah Tamu</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <input 
                      type="number" min="1" max={suite.capacity}
                      className="w-full text-sm outline-none"
                      value={guests} onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                </div>

                {/* Ringkasan Harga */}
                {totalDays > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 mt-4 border border-gray-100">
                    <h4 className="font-bold text-secondary text-sm flex items-center gap-2">
                      <CreditCard size={14} /> Ringkasan Biaya
                    </h4>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{suite.price.toLocaleString()} x {totalDays} malam</span>
                      <span>Rp {roomPriceTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Biaya Layanan & Kebersihan</span>
                      <span>Rp {serviceFee.toLocaleString()}</span>
                    </div>

                    <div className="h-px bg-gray-300 my-1"></div>

                    <div className="flex justify-between font-bold text-lg text-primary">
                      <span>Total Bayar</span>
                      <span>Rp {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isBooking || totalDays <= 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2
                    ${isBooking || totalDays <= 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark active:scale-95 shadow-primary/30'}`
                  }
                >
                  {isBooking ? <Loader2 className="animate-spin"/> : "Konfirmasi Pemesanan"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Transaksi Anda aman & terenkripsi.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuiteDetail;