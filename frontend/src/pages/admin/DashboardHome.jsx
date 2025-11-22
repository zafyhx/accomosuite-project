import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DollarSign, Users, BedDouble, Activity, Clock } from "lucide-react";

// Registrasi ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardHome = () => {
  // Data Dummy (Nanti diganti API Real)
  const stats = [
    { title: "Total Pendapatan", value: "Rp 45.2Jt", icon: <DollarSign className="text-green-600" />, color: "bg-green-100" },
    { title: "Reservasi Aktif", value: "128", icon: <Activity className="text-blue-600" />, color: "bg-blue-100" },
    { title: "Pending Cancel", value: "3", icon: <Clock className="text-yellow-600" />, color: "bg-yellow-100" },
    { title: "Suite Tersedia", value: "12", icon: <BedDouble className="text-purple-600" />, color: "bg-purple-100" },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Pendapatan (Juta)',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: '#29D9D5', // Cyan Segar
        borderRadius: 4,
      },
    ],
  };
  
  const pieData = {
    labels: ['Hotel', 'Villa', 'Apartment'],
    datasets: [{
        data: [60, 30, 10],
        backgroundColor: ['#29D9D5', '#0E7490', '#1E293B'],
        hoverBackgroundColor: ['#29D9D5', '#0E7490', '#1E293B'],
        borderWidth: 0
    }]
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-secondary">Dashboard Admin</h2>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-all">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-secondary mb-4">Tren Pendapatan Bulanan (6 Bulan Terakhir)</h3>
          <Bar data={chartData} options={{ 
            responsive: true,
            scales: { y: { beginAtZero: true } }
          }} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-secondary mb-4">Distribusi Tipe Properti</h3>
          <div className="h-64 flex justify-center">
             <Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;