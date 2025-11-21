import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CalendarDays, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  // AMBIL STATE 'loading' DARI CONTEXT
  const { user, loading } = useContext(AuthContext);

  // Ambil Data Booking
  useEffect(() => {
    const fetchBookings = async () => {
      // PROTEKSI: Jangan fetch kalau user belum siap/kosong
      if (!user) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get("/api/bookings", config);
        setBookings(data);
      } catch (error) {
        console.error("Gagal ambil booking", error);
      }
    };

    // Jalankan fetch HANYA jika loading selesai dan user ada
    if (!loading && user) {
      fetchBookings();
    }
  }, [user, loading]); // Tambahkan dependency agar bereaksi saat user/loading berubah

  // --- TAMPILAN SAAT MASIH LOADING (MENCEGAH CRASH) ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-24">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // --- PROTEKSI JIKA USER LOGOUT TAPI PAKSA MASUK ---
  if (!user) {
    return (
      <div className="text-center pt-32 text-gray-500">
        Anda tidak memiliki akses. Silakan login.
      </div>
    );
  }

  // Fungsi render status dengan warna
  const renderStatus = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> Confirmed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> Cancelled</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> Pending</span>;
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Daftar Reservasi</h1>
          <p className="text-gray-500 text-sm">Pantau semua pesanan masuk di sini.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <th className="py-4 px-6">ID Booking</th>
              <th className="py-4 px-6">Tamu</th>
              <th className="py-4 px-6">Properti</th>
              <th className="py-4 px-6">Check-In / Out</th>
              <th className="py-4 px-6">Total</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                  #{booking._id.slice(-6).toUpperCase()}
                </td>
                <td className="py-4 px-6">
                  <div className="text-gray-800 font-bold">{booking.user?.name || "User Terhapus"}</div>
                  <div className="text-xs text-gray-400">{booking.user?.email}</div>
                </td>
                <td className="py-4 px-6">
                  {booking.suite?.name || "Properti Terhapus"}
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1"><CalendarDays size={12}/> {new Date(booking.checkInDate).toLocaleDateString()}</span>
                    <span className="text-gray-400">sampai</span>
                    <span className="flex items-center gap-1"><CalendarDays size={12}/> {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-primary">
                  Rp {booking.totalPrice.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  {renderStatus(booking.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Belum ada pesanan masuk.
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;