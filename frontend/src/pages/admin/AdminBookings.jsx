import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; 
import { Clock, CheckCircle2, XCircle, Calendar, Loader2, Ban, AlertTriangle, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const AdminBookings = () => {
    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isUpdating, setIsUpdating] = useState(null); 

    const fetchAllBookings = async () => {
        if (!user || user.role !== 'admin') {
            if(user) logout(); 
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get("/api/bookings", config);
            setBookings(data);
        } catch (error) {
            console.error("Gagal mengambil data booking Admin:", error);
            if (error.response && error.response.status === 401) {
                alert("Sesi Admin berakhir. Silakan login ulang.");
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchAllBookings();
        }
    }, [user]); 

    // FIX: Menambahkan parameter currentStatus agar logika alert benar
    const handleUpdateStatus = async (bookingId, newStatus, currentStatus) => {
        let actionText = "";

        if (newStatus === 'confirmed') {
            if (currentStatus === 'pending') {
                actionText = "MENERIMA (Konfirmasi) pesanan baru ini";
            } else if (currentStatus === 'cancellation_requested') {
                actionText = "MENOLAK pengajuan pembatalan ini (Pesanan kembali Aktif)";
            } else {
                actionText = "Mengubah status menjadi Confirmed";
            }
        } else if (newStatus === 'cancelled') {
            actionText = currentStatus === 'cancellation_requested' 
                ? "MENYETUJUI pembatalan ini (Dana akan dikembalikan manual)" 
                : "MEMBATALKAN pesanan ini secara sepihak";
        } else if (newStatus === 'completed') {
            actionText = "Menandai pesanan ini SELESAI (Tamu Check-out)";
        } else {
            actionText = `Mengubah status menjadi ${newStatus}`;
        }
        
        if (!window.confirm(`Yakin ingin ${actionText}?`)) {
            return;
        }

        try {
            setIsUpdating(bookingId);
            const config = {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
            };
            await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus }, config);
            
            fetchAllBookings(); 
            
        } catch (error) {
            console.error("Gagal update status:", error);
            alert("Gagal mengubah status: " + (error.response?.data?.message || "Server Error"));
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusBadge = (status) => {
        const defaultStyle = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit mx-auto";
        switch (status) {
            case 'pending': return { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-700 ' + defaultStyle };
            case 'confirmed': return { icon: <CheckCircle2 size={14} />, color: 'bg-primary/20 text-primary ' + defaultStyle }; 
            case 'checked_in': return { icon: <CheckCircle2 size={14} />, color: 'bg-blue-100 text-blue-700 ' + defaultStyle }; 
            case 'cancellation_requested': return { icon: <AlertTriangle size={14} />, color: 'bg-orange-100 text-orange-700 ' + defaultStyle }; 
            case 'cancelled': return { icon: <Ban size={14} />, color: 'bg-red-100 text-red-700 ' + defaultStyle };
            case 'completed': return { icon: <CheckCircle2 size={14} />, color: 'bg-green-100 text-green-700 ' + defaultStyle };
            default: return { icon: <Calendar size={14} />, color: 'bg-gray-100 text-gray-500 ' + defaultStyle };
        }
    }
    
    const filteredBookings = bookings.filter(b =>
        filter === 'all' ? true : b.status === filter
    );

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    if (!user || user.role !== 'admin') {
        return <div className="p-12 text-center text-red-500">Akses ditolak. Anda bukan Admin.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-secondary">Manajemen & Approval Reservasi</h1>
            <p className="text-gray-500">Pantau semua pesanan masuk dan kelola status pembatalan.</p>

            {/* Filter Status */}
            <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                {['all', 'pending', 'confirmed', 'cancellation_requested', 'cancelled', 'completed'].map(s => ( 
                    <button 
                        key={s}
                        onClick={() => setFilter(s)} 
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 ${filter === s ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {s.toUpperCase().replace(/_/g, ' ')} ({bookings.filter(b => s === 'all' ? true : b.status === s).length})
                    </button>
                ))}
            </div>

            {/* Table Reservasi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">ID / Tgl Pesan</th>
                                <th className="py-4 px-6">Properti</th>
                                <th className="py-4 px-6">Pelanggan</th>
                                <th className="py-4 px-6">Check-in</th>
                                <th className="py-4 px-6">Total Harga</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center min-w-[200px]">Aksi Admin</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((b) => {
                                    const badge = getStatusBadge(b.status);
                                    const isBusy = isUpdating === b._id;
                                    
                                    return (
                                        <tr key={b._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 font-mono text-xs">
                                                {b._id.slice(-6).toUpperCase()}
                                                <div className="text-gray-400 text-[10px] mt-1">{new Date(b.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-secondary">{b.suite?.name || "Properti Dihapus"}</td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-800 font-bold">{b.user?.name || "User Dihapus"}</div>
                                                <div className="text-xs text-gray-400">{b.user?.email}</div>
                                            </td>
                                            <td className="py-4 px-6">{new Date(b.checkInDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 font-bold text-primary">Rp {b.totalPrice.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={badge.color}>
                                                    {badge.icon} {b.status.toUpperCase().replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {b.status === 'pending' && (
                                                        // Aksi: KONFIRMASI PESANAN BARU (Admin Approve)
                                                        <button 
                                                            // FIX: Kirim status saat ini ('pending')
                                                            onClick={() => handleUpdateStatus(b._id, 'confirmed', b.status)}
                                                            disabled={isBusy}
                                                            className={`bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition flex items-center gap-1 ${isBusy && 'opacity-50 cursor-not-allowed'}`}
                                                        >
                                                            {isBusy ? <Loader2 size={14} className="animate-spin"/> : 'Konfirmasi Pesanan'}
                                                        </button>
                                                    )}
                                                    
                                                    {b.status === 'cancellation_requested' && (
                                                        // Aksi: APPROVAL PEMBATALAN
                                                        <>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(b._id, 'cancelled', b.status)}
                                                                disabled={isBusy}
                                                                title="Setujui Pembatalan"
                                                                className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition flex items-center gap-1 ${isBusy && 'opacity-50 cursor-not-allowed'}`}
                                                            >
                                                                {isBusy ? <Loader2 size={14} className="animate-spin"/> : <><Check size={14}/> Terima</>}
                                                            </button>
                                                            <button 
                                                                // FIX: Kirim status saat ini ('cancellation_requested')
                                                                onClick={() => handleUpdateStatus(b._id, 'confirmed', b.status)}
                                                                disabled={isBusy}
                                                                title="Tolak Pembatalan (Kembalikan ke Confirmed)"
                                                                className={`bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition flex items-center gap-1 ${isBusy && 'opacity-50 cursor-not-allowed'}`}
                                                            >
                                                                {isBusy ? <Loader2 size={14} className="animate-spin"/> : <><X size={14}/> Tolak</>}
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {(b.status === 'confirmed' || b.status === 'checked_in') && (
                                                        // Aksi: TANDAI SELESAI (CHECKOUT)
                                                        <button 
                                                            onClick={() => handleUpdateStatus(b._id, 'completed', b.status)}
                                                            disabled={isBusy}
                                                            className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition flex items-center gap-1 ${isBusy && 'opacity-50 cursor-not-allowed'}`}
                                                        >
                                                            {isBusy ? <Loader2 size={14} className="animate-spin"/> : 'Tandai Selesai'}
                                                        </button>
                                                    )}

                                                    {(b.status === 'cancelled' || b.status === 'completed') && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 p-2 rounded-lg">Aksi Selesai</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500">Tidak ada reservasi di status `{filter.toUpperCase().replace(/_/g, ' ')}`.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminBookings;