import { useState } from "react";
import { Clock, CheckCircle2, XCircle, Search, Calendar } from "lucide-react";

// Halaman dummy untuk Approval Reservasi (fitur selanjutnya)
const AdminBookings = () => {
    const [filter, setFilter] = useState('pending');
    
    // Data Dummy untuk ilustrasi
    const dummyBookings = [
        { id: "B1001", suite: "Luxury Penthouse Suite", user: "Bagus Satyo", checkIn: "2025-12-01", total: 1500000, status: 'pending' },
        { id: "B1002", suite: "Standard Single Room", user: "Rudi Hartono", checkIn: "2025-11-25", total: 750000, status: 'confirmed' },
        { id: "B1003", suite: "Villa Ubud Private Pool", user: "Sari Dewi", checkIn: "2025-10-15", total: 3200000, status: 'cancelled' },
    ];

    const filteredBookings = dummyBookings.filter(b => 
        filter === 'all' ? true : b.status === filter
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { icon: <Clock size={16} />, color: 'bg-yellow-100 text-yellow-700' };
            case 'confirmed': return { icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700' };
            case 'cancelled': return { icon: <XCircle size={16} />, color: 'bg-red-100 text-red-700' };
            default: return { icon: <Calendar size={16} />, color: 'bg-gray-100 text-gray-500' };
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-secondary">Approval & Daftar Reservasi</h1>
            <p className="text-gray-500">Kelola permintaan pembatalan dan pantau status booking.</p>

            {/* Filter & Search */}
            <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <button 
                    onClick={() => setFilter('all')} 
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'all' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Semua ({dummyBookings.length})
                </button>
                <button 
                    onClick={() => setFilter('pending')} 
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'pending' ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Menunggu ({dummyBookings.filter(b => b.status === 'pending').length})
                </button>
                <button 
                    onClick={() => setFilter('confirmed')} 
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'confirmed' ? 'bg-green-500 text-white shadow-md shadow-green-500/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Dikonfirmasi ({dummyBookings.filter(b => b.status === 'confirmed').length})
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Properti</th>
                            <th className="py-4 px-6">Pelanggan</th>
                            <th className="py-4 px-6">Check-in</th>
                            <th className="py-4 px-6">Total Harga</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                        {filteredBookings.map((b) => {
                            const badge = getStatusBadge(b.status);
                            return (
                                <tr key={b.id} className="hover:bg-gray-50 transition">
                                    <td className="py-4 px-6 font-mono text-xs">{b.id}</td>
                                    <td className="py-4 px-6 font-semibold text-secondary">{b.suite}</td>
                                    <td className="py-4 px-6">{b.user}</td>
                                    <td className="py-4 px-6">{b.checkIn}</td>
                                    <td className="py-4 px-6 font-bold text-primary">Rp {b.total.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 mx-auto w-fit ${badge.color}`}>
                                            {badge.icon} {b.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {b.status === 'pending' ? (
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium active:scale-95 transition">
                                                Approve
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Selesai</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center text-gray-500">Tidak ada reservasi di status ini.</div>
                )}
            </div>
        </div>
    );
}

export default AdminBookings;