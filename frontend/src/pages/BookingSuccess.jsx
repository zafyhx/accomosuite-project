import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Home, CalendarDays, Download, Copy } from "lucide-react";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const bookingId = "INV-" + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-4 font-sans">
      
      <div className={`max-w-lg w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Header Hijau */}
        <div className="bg-green-600 p-8 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-[bounce_2s_infinite]">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Pembayaran Berhasil!</h1>
              <p className="text-green-100 text-sm">Pesanan Anda telah terkonfirmasi</p>
           </div>
        </div>

        {/* Body Content */}
        <div className="p-8">
           
           {/* Info Tiket Mini */}
           <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 mb-8 text-center relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-gray-300"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-gray-300"></div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Booking ID</p>
              <div className="flex items-center justify-center gap-2">
                 <span className="text-2xl font-mono font-bold text-gray-800">{bookingId}</span>
                 <button className="text-gray-400 hover:text-primary transition" title="Salin ID">
                    <Copy size={16}/>
                 </button>
              </div>
           </div>

           {/* Timeline Steps */}
           <div className="space-y-8 mb-8 relative pl-2">
              
              {/* Garis Vertikal */}
              <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0 ring-8 ring-white z-10 relative">
                    <CheckCircle size={18}/>
                 </div>
                 <div className="pt-1"> 
                    <h4 className="font-bold text-gray-900 text-sm">E-Tiket Terkirim</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Cek email Anda untuk mengunduh bukti reservasi.</p>
                 </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative z-10">
                 <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 shrink-0 ring-8 ring-white z-10 relative">
                    <CalendarDays size={18}/>
                 </div>
                 <div className="pt-1">
                    <h4 className="font-bold text-gray-900 text-sm">Datang Sesuai Jadwal</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Pastikan Anda membawa KTP/Paspor saat check-in.</p>
                 </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative z-10">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0 ring-8 ring-white z-10 relative">
                    <Home size={18}/>
                 </div>
                 <div className="pt-1">
                    <h4 className="font-bold text-gray-900 text-sm">Selamat Menginap!</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Nikmati fasilitas dan pelayanan terbaik dari kami.</p>
                 </div>
              </div>
           </div>

           {/* Action Buttons */}
           <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => navigate("/my-bookings")} 
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/30 transform active:scale-95"
              >
                <CalendarDays size={18} />
                Lihat Pesanan Saya
              </button>

              <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition text-sm">
                    <Download size={16} /> Unduh PDF
                 </button>
                 <Link 
                   to="/"
                   className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition text-sm"
                 >
                   <Home size={16} /> Beranda
                 </Link>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;