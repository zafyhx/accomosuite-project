import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
// Import Bar dan Doughnut
import { Bar, Doughnut } from "react-chartjs-2"; 
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, // Pastikan BarElement terdaftar
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { 
  DollarSign, 
  CalendarDays, 
  Clock, 
  BedDouble, 
  Loader2, 
  ArrowUpRight, 
  User, 
  CheckCircle, 
  XCircle,
  FileText,
  AlertTriangle,
  BarChart3
} from "lucide-react";

// Registrasi Komponen ChartJS
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, // Penting untuk Diagram Batang
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('booking'); 
  const [data, setData] = useState({
    cards: { totalIncome: 0, todayBookings: 0, pendingCancel: 0, totalSuites: 0 },
    recentTransactions: [], 
    recentCancellations: [],
    charts: { monthlyRevenue: [], monthlyReservations: [], monthlyCancellations: [], suiteDistribution: [] }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data: responseData } = await axios.get('/api/bookings/admin/stats', config);
        setData(responseData);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // --- DATA PROCESSING UNTUK CHART ---
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Fungsi helper untuk mapping data dari backend (format {_id: bulan, total/count: nilai}) ke array 12 bulan
  const mapChartData = (sourceData, key) => {
    // Jika data kosong, return array 0
    if (!sourceData || sourceData.length === 0) return [];
    
    // Ambil label bulan yang ada di data
    const availableMonths = sourceData.map(item => item._id);
    
    // Kita hanya ambil data yang tersedia saja untuk label, atau bisa juga fix 6 bulan terakhir
    // Untuk simpelnya, kita mapping berdasarkan data yang ada
    return sourceData.map(item => item[key]);
  };

  const revenueLabels = data.charts.monthlyRevenue.map(item => monthNames[item._id - 1]);
  const revenueValues = data.charts.monthlyRevenue.map(item => item.total / 1000000); // Dalam Juta

  // Chart 1: Pendapatan (Bar)
  const revenueChartData = {
    labels: revenueLabels.length > 0 ? revenueLabels : ['No Data'],
    datasets: [{
        label: 'Pendapatan (Juta Rp)',
        data: revenueValues.length > 0 ? revenueValues : [0],
        backgroundColor: '#29D9D5', // Cyan Segar
        borderRadius: 4,
        barPercentage: 0.6,
    }],
  };

  // Chart 2: Reservasi vs Pembatalan (Grouped Bar)
  // Kita perlu menyamakan label bulan karena mungkin ada bulan yang ada reservasi tapi tidak ada pembatalan
  const activityLabels = [...new Set([
    ...data.charts.monthlyReservations.map(d => d._id),
    ...data.charts.monthlyCancellations.map(d => d._id)
  ])].sort((a, b) => a - b).map(m => monthNames[m - 1]);

  // Mapping data agar sesuai urutan bulan gabungan
  const getCountForMonth = (dataset, monthName) => {
    const monthIndex = monthNames.indexOf(monthName) + 1;
    const item = dataset.find(d => d._id === monthIndex);
    return item ? item.count : 0;
  };

  const activityChartData = {
    labels: activityLabels.length > 0 ? activityLabels : ['No Data'],
    datasets: [
      {
        label: 'Reservasi Baru',
        data: activityLabels.map(m => getCountForMonth(data.charts.monthlyReservations, m)),
        backgroundColor: '#3B82F6', // Blue
        borderRadius: 4,
      },
      {
        label: 'Pembatalan',
        data: activityLabels.map(m => getCountForMonth(data.charts.monthlyCancellations, m)),
        backgroundColor: '#EF4444', // Red
        borderRadius: 4,
      }
    ],
  };

  // Chart 3: Pie
  const pieData = {
    labels: data.charts.suiteDistribution.map(item => item._id),
    datasets: [{
        data: data.charts.suiteDistribution.map(item => item.count),
        backgroundColor: ['#29D9D5', '#0E7490', '#1E293B', '#F59E0B'],
        borderWidth: 0
    }]
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><CheckCircle size={10}/> Confirmed</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><Clock size={10}/> Pending</span>;
      case 'cancellation_requested': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><AlertTriangle size={10}/> Cancel Req</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full w-fit">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full w-fit">{status}</span>;
    }
  };

  const statsCards = [
    { title: "Reservasi Hari Ini", value: data.cards.todayBookings, icon: <CalendarDays className="text-blue-600" />, color: "bg-blue-100", desc: "Booking baru masuk" },
    { title: "Batal Menunggu Acc", value: data.cards.pendingCancel, icon: <Clock className="text-yellow-600" />, color: "bg-yellow-100", desc: "Perlu tindakan admin" },
    { title: "Total Pendapatan", value: formatRupiah(data.cards.totalIncome), icon: <DollarSign className="text-green-600" />, color: "bg-green-100", desc: "Akumulasi confirmed" },
    { title: "Total Properti", value: data.cards.totalSuites, icon: <BedDouble className="text-purple-600" />, color: "bg-purple-100", desc: "Unit terdaftar" },
  ];

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10"/></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm">Pantau performa bisnis dan aktivitas terbaru.</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Update Terakhir:</p>
          <p className="font-bold">{new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>
      
      {/* 1. KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-50`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold text-secondary mt-1">{stat.value}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. AREA GRAFIK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Grafik Pendapatan (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-secondary mb-6 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-primary"/> Tren Pendapatan
          </h3>
          <div className="h-64">
             <Bar 
               data={revenueChartData} 
               options={{ 
                 responsive: true, maintainAspectRatio: false,
                 plugins: { legend: { display: false } },
                 scales: { y: { beginAtZero: true, grid: { borderDash: [2, 4] } }, x: { grid: { display: false } } }
               }} 
             />
          </div>
        </div>

        {/* Grafik Reservasi vs Pembatalan (Grouped Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-secondary mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500"/> Tren Reservasi & Pembatalan
          </h3>
          <div className="h-64">
             <Bar 
               data={activityChartData} 
               options={{ 
                 responsive: true, maintainAspectRatio: false,
                 plugins: { legend: { position: 'bottom' } },
                 scales: { y: { beginAtZero: true, grid: { borderDash: [2, 4] } }, x: { grid: { display: false } } }
               }} 
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. LOG TABEL (TAB SYSTEM) - Ambil 2/3 lebar */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab('booking')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'booking' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <FileText size={16}/> Log Reservasi
            </button>
            <button onClick={() => setActiveTab('cancellation')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'cancellation' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <XCircle size={16}/> Log Pembatalan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="p-4">Tamu</th>
                  <th className="p-4">Properti</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === 'booking' ? (
                  data.recentTransactions.length > 0 ? (
                    data.recentTransactions.map((trx) => (
                      <tr key={trx._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-secondary flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs uppercase">{trx.user?.name?.charAt(0) || "G"}</div>
                          {trx.user?.name || "Guest"}
                        </td>
                        <td className="p-4 text-gray-600">{trx.suite?.name}</td>
                        <td className="p-4 text-gray-500">{new Date(trx.createdAt).toLocaleDateString('id-ID')}</td>
                        <td className="p-4">{getStatusBadge(trx.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada transaksi.</td></tr>
                  )
                ) : (
                  data.recentCancellations.length > 0 ? (
                    data.recentCancellations.map((trx) => (
                      <tr key={trx._id} className="hover:bg-red-50 transition">
                        <td className="p-4 font-medium text-secondary flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs uppercase">{trx.user?.name?.charAt(0) || "G"}</div>
                          {trx.user?.name || "Guest"}
                        </td>
                        <td className="p-4 text-gray-600">{trx.suite?.name}</td>
                        <td className="p-4 text-gray-500">{new Date(trx.updatedAt).toLocaleDateString('id-ID')}</td>
                        <td className="p-4">{getStatusBadge(trx.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada pembatalan.</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PIE CHART (KANAN) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-secondary mb-4">Grafik Properti</h3>
          <div className="flex-1 flex items-center justify-center h-64">
             <Doughnut 
               data={pieData} 
               options={{ 
                 responsive: true, maintainAspectRatio: false,
                 plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
               }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;