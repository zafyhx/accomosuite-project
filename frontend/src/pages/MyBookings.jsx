import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// Path benar: pages/ ke context/
import { AuthContext } from "../context/AuthContext"; 
import { 
  CalendarDays, 
  MapPin, 
  CreditCard, 
  Loader2, 
  BedDouble,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Ban,
  AlertTriangle 
} from "lucide-react";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(null); 

  // --- 1. Fetch Data Riwayat Booking ---
  const fetchMyBookings = async () => {
    if (!user || !user.token) {
        setLoading(false);
        return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }, 
      };
      
      const { data } = await axios.get("/api/bookings/my-bookings", config);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err.response || err);
      if (err.response && err.response.status === 401) {
          setError("Sesi Anda berakhir. Silakan login kembali.");
      } else {
          setError("Gagal memuat riwayat pesanan. Pastikan server backend berjalan.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);
  
  // --- 2. Handle Pembatalan Pesanan (Aksi Nyata) ---
  const handleCancelBooking = async (bookingId, suiteName) => {
    if (!window.confirm(`Anda yakin ingin MENGIRIM PENGAJUAN pembatalan untuk pesanan di ${suiteName}? Proses ini membutuhkan persetujuan Admin.`)) {
      return;
    }

    try {
        setIsCancelling(bookingId);
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };
        // API akan mengubah status menjadi 'cancellation_requested'
        await axios.put(`/api/bookings/${bookingId}/cancel`, {}, config);
        
        alert(`Pengajuan pembatalan untuk ${suiteName} berhasil dikirim. Menunggu persetujuan Admin.`);
        
        // Refresh data setelah pengajuan sukses
        fetchMyBookings(); 

    } catch (err) {
        console.error("Cancellation failed:", err.response || err);
        alert("Gagal mengajukan pembatalan: " + (err.response?.data?.message || "Kesalahan server."));
    } finally {
        setIsCancelling(null);
    }
  };


  // Helper untuk format tanggal (Indonesia)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Helper untuk warna status (Sesuai Cyan Segar)
  const getStatusBadge = (status) => {
    const defaultStyle = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 w-fit";
    switch (status) {
      case 'confirmed': return { icon: <CheckCircle2 size={14} />, color: 'bg-green-100 text-green-700 border-green-200 ' + defaultStyle };
      case 'cancelled': return { icon: <Ban size={14} />, color: 'bg-red-100 text-red-700 border-red-200 ' + defaultStyle };
      case 'cancellation_requested': return { icon: <AlertTriangle size={14} />, color: 'bg-orange-100 text-orange-700 border-orange-200 ' + defaultStyle }; // STATUS BARU
      default: return { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200 ' + defaultStyle }; // pending
    }
  };


  if (loading) return <div className="min-h-screen pt-24 flex justify-center items-center"><Loader2 className="animate-spin text-primary w-10 h-10"/></div>;
  if (error) return (
    <div className="min-h-screen pt-24 text-center p-12">
        <div className="bg-red-100 border border-red-300 text-red-800 p-6 rounded-xl shadow-lg max-w-lg mx-auto">
            <XCircle size={24} className="mx-auto mb-3"/>
            <h3 className="font-bold mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm">{error}</p>
            <button 
                onClick={fetchMyBookings}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition"
            >
                Coba Muat Ulang
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        
        <h1 className="text-3xl font-bold text-secondary mb-2">Riwayat Pemesanan Anda</h1>
        <p className="text-gray-500 mb-8">Kelola dan pantau semua pesanan akomodasi Anda di sini.</p>

        {bookings.length === 0 ? (
          // Tampilan Empty State
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BedDouble className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum ada riwayat pesanan</h3>
            <p className="text-gray-500 mb-6">Mulai jelajahi dan pesan tempat menginap impian Anda!</p>
            <Link 
              to="/" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-primary/30 active:scale-95 inline-flex items-center gap-2"
            >
              Cari Akomodasi
            </Link>
          </div>
        ) : (
          // List Booking
          <div className="grid gap-6">
            {bookings.map((item) => {
              const status = getStatusBadge(item.status);
              const isActionDisabled = isCancelling === item._id; 
              
              return (
              <div 
                key={item._id} 
                className="bg-white rounded-2xl shadow-lg shadow-gray-100 overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  
                  {/* Bagian Gambar Kamar */}
                  <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative">
                    <img 
                      src={item.suite?.images?.[0] 
                        ? `http://localhost:5000${item.suite.images[0]}` 
                        : "https://via.placeholder.com/400?text=No+Image"} 
                      alt={item.suite?.name || "Properti Dihapus"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={status.color}>
                        {status.icon} {item.status.replace(/_/g, ' ').toUpperCase()} {/* Tampilkan status baru */}
                      </span>
                    </div>
                  </div>

                  {/* Bagian Detail */}
                  <div className="p-6 md:w-2/3 lg:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-secondary">{item.suite?.name || "PROPERTI DIHAPUS"}</h3>
                        <p className="text-xs text-gray-400 font-mono">Booking ID: {item._id.substring(0, 10)}...</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <MapPin size={16} className="text-primary"/>
                        {item.suite?.location || "Lokasi tidak diketahui"}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="text-xs text-gray-400 block mb-1">Check-In</span>
                          <div className="font-semibold text-secondary flex items-center gap-2">
                            <CalendarDays size={16} className="text-primary"/>
                            {formatDate(item.checkInDate)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="text-xs text-gray-400 block mb-1">Check-Out</span>
                          <div className="font-semibold text-secondary flex items-center gap-2">
                            <CalendarDays size={16} className="text-primary"/>
                            {formatDate(item.checkOutDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Total Pembayaran</p>
                        <p className="text-lg font-bold text-secondary flex items-center gap-1">
                          <CreditCard size={18} className="text-primary"/>
                          Rp {item.totalPrice.toLocaleString()}
                        </p>
                      </div>

                      {/* Tombol Aksi Pembatalan */}
                      {/* Hanya muncul jika status confirmed atau pending */}
                      {(item.status === 'confirmed' || item.status === 'pending') ? (
                        <button 
                            onClick={() => handleCancelBooking(item._id, item.suite?.name)}
                            disabled={isActionDisabled}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition active:scale-95 shadow-lg flex items-center gap-2
                                ${isActionDisabled 
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                                }`}
                        >
                            {isActionDisabled ? <Loader2 size={16} className="animate-spin"/> : <Ban size={16}/>}
                            {isActionDisabled ? 'Memproses Kirim' : 'Ajukan Pembatalan'}
                        </button>
                      ) : item.status === 'cancellation_requested' ? (
                          <span className="text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 flex items-center gap-1">
                            <AlertTriangle size={16}/> Menunggu Admin
                          </span>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Aksi selesai</span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;