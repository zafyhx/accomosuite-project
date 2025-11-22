import { Link, Loader2, CalendarDays } from "lucide-react";
// Ini adalah placeholder untuk halaman riwayat booking user. 
// Fitur penuhnya akan kita bangun di tahap berikutnya.

const MyBookings = () => {
    return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
             <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-primary/20">
                <CalendarDays size={48} className="text-primary mx-auto mb-4"/>
                <h1 className="text-2xl font-bold text-secondary">Halaman Booking Saya (Proyeksi)</h1>
                <p className="text-gray-500 mt-2">Sedang dalam pengembangan. Data riwayat pesanan Anda akan tampil di sini.</p>
                <Link to="/" className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded-xl transition hover:bg-primary-dark active:scale-95">
                    Kembali ke Beranda
                </Link>
             </div>
        </div>
    );
};

export default MyBookings;