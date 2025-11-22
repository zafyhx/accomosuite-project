import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Home, CalendarDays } from "lucide-react";

const BookingSuccess = () => {
  const navigate = useNavigate();

  // Efek visual saat halaman dibuka
  useEffect(() => {
    // Otomatis scroll ke atas
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100 transform transition-all hover:scale-105 duration-500">
        
        {/* Ikon Centang Animasi */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
        <p className="text-gray-500 mb-8">
          Terima kasih telah memesan di Accomosuite. Pesanan Anda telah kami terima dan sedang diproses.
        </p>

        {/* Detail Singkat (Hardcode atau ambil dari state navigate nanti) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-200">
          <p className="text-xs text-gray-400 uppercase font-bold mb-2">Langkah Selanjutnya</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Cek email Anda untuk detail tiket.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Datang ke lokasi sesuai tanggal Check-in.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Tunjukkan ID Booking saat resepsionis.
            </li>
          </ul>
        </div>

        {/* Tombol Aksi */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate("/")} // Nanti bisa diarahkan ke /my-bookings kalau sudah ada
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary/30 active:scale-95"
          >
            <CalendarDays size={20} />
            Lihat Pesanan Saya
          </button>

          <Link 
            to="/"
            className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition hover:bg-gray-50"
          >
            <Home size={20} />
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccess;