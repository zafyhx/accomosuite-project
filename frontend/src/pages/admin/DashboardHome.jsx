import axios from "axios";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_accessibility from "highcharts/modules/accessibility";
import HC_exporting from "highcharts/modules/exporting";

const initModule = (module) => {
  if (typeof module === "function") {
    module(Highcharts);
  } else if (module?.default && typeof module.default === "function") {
    module.default(Highcharts);
  }
};

if (typeof Highcharts === "object") {
  initModule(HC_exporting);
  initModule(HC_accessibility);
}

import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  FileText,
  Loader2,
  MoreHorizontal,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

const LiveClock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-100 min-w-[200px]">
      <div className="relative flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75"></div>
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Live Update
        </span>
        <span className="text-sm font-bold text-gray-800 font-mono tracking-tight">
          {time
            .toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/\./g, ":")}{" "}
          WIB
        </span>
      </div>
    </div>
  );
});

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("booking");

  const [data, setData] = useState({
    cards: {
      totalIncome: 0,
      todayBookings: 0,
      pendingCancel: 0,
      totalSuites: 0,
    },
    recentTransactions: [],
    recentCancellations: [],
    charts: {
      monthlyRevenue: [],
      monthlyReservations: [],
      monthlyCancellations: [],
      suiteDistribution: [],
    },
  });

  // Refs
  const revenueChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const activityChartRef = useRef(null);

  // Handle Download
  const handleDownload = (chartRef) => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.exportChart({
        type: "image/png",
        filename: "chart-dashboard",
      });
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token =
          user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data: responseData } = await axios.get(
          "/api/bookings/admin/stats",
          config
        );
        setData(responseData);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // --- HELPER WARNA TIPE UNIT ---
  const getTypeColor = (type) => {
    const normalizedType =
      type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase();
    switch (normalizedType) {
      case "Villa":
        return "#8B5CF6";
      case "Hotel":
        return "#3B82F6";
      case "Cottage":
        return "#F59E0B"; // Kuning
      default:
        return "#10B981";
    }
  };

  // ===== REVENUE CHART (FILTER DATA NON-ZERO) =====
  // 1. Filter hanya bulan yang memiliki pendapatan > 0
  const activeRevenueData = data.charts.monthlyRevenue
    .filter((item) => item.total > 0)
    .sort((a, b) => a._id - b._id); // Pastikan urut bulan Januari-Desember

  // 2. Mapping label dan values hanya dari data yang sudah difilter
  const revenueLabels = activeRevenueData.map(
    (item) => monthNames[item._id - 1]
  );
  const revenueValues = activeRevenueData.map((item) => item.total);

  const revenueOptions = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      style: { fontFamily: "Poppins, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories: revenueLabels,
      lineColor: "#e5e7eb",
      tickColor: "#e5e7eb",
      labels: {
        style: { color: "#6b7280", fontSize: "12px", fontWeight: "500" },
      },
    },
    yAxis: {
      title: { text: "" },
      gridLineColor: "#f3f4f6",
      labels: {
        formatter: function () {
          return "Rp " + (this.value / 1000000).toFixed(0) + "jt";
        },
        style: { color: "#6b7280", fontSize: "12px" },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: "#fff",
      borderWidth: 0,
      borderRadius: 12,
      shadow: { color: "rgba(0,0,0,0.1)", offsetX: 0, offsetY: 4, width: 8 },
      padding: 16,
      formatter: function () {
        return `<div style="min-width: 180px">
            <div style="color: #9ca3af; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px">${
              this.x
            }</div>
            <div style="color: #29D9D5; font-size: 18px; font-weight: 700">Rp ${new Intl.NumberFormat(
              "id-ID"
            ).format(this.y)}</div>
            <div style="color: #6b7280; font-size: 11px; margin-top: 4px">Total Pendapatan</div>
          </div>`;
      },
    },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "rgba(41, 217, 213, 0.3)"],
            [1, "rgba(41, 217, 213, 0)"],
          ],
        },
        lineWidth: 3,
        color: "#29D9D5",
        marker: {
          enabled: true,
          radius: 4,
          states: { hover: { enabled: true, radius: 7 } },
        }, // Enable marker agar titik data terlihat jelas meski sedikit
      },
    },
    series: [{ name: "Pendapatan", data: revenueValues, showInLegend: false }],
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: { contextButton: { enabled: false } },
    },
  };

  // ===== ACTIVITY CHART =====
  // Logika Filter: Hanya ambil bulan yang muncul di salah satu dataset (Reservasi ATAU Pembatalan)
  // Data dari backend biasanya hanya mengembalikan bulan yang ada isinya, jadi kita kumpulkan ID bulannya dulu.
  const activeMonthIds = [
    ...new Set([
      ...data.charts.monthlyReservations.map((d) => d._id),
      ...data.charts.monthlyCancellations.map((d) => d._id),
    ]),
  ].sort((a, b) => a - b); // Urutkan bulan 1-12

  const activityLabels = activeMonthIds.map((mId) => monthNames[mId - 1]);

  const getCount = (dataset, monthId) => {
    const item = dataset.find((d) => d._id === monthId);
    return item ? item.count : 0;
  };

  const activityOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: { fontFamily: "Poppins, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories: activityLabels,
      lineColor: "#e5e7eb",
      labels: {
        style: { color: "#6b7280", fontSize: "12px", fontWeight: "500" },
      },
    },
    yAxis: {
      title: { text: "" },
      gridLineColor: "#f3f4f6",
      labels: { style: { color: "#6b7280", fontSize: "12px" } },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#fff",
      borderWidth: 0,
      borderRadius: 12,
      shadow: { color: "rgba(0,0,0,0.1)", offsetX: 0, offsetY: 4, width: 8 },
      useHTML: true,
      formatter: function () {
        let s = `<div style="padding: 8px"><div style="font-weight: 600; margin-bottom: 8px; color: #1f2937">${this.x}</div>`;
        this.points.forEach((point) => {
          s += `<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${point.color}; border-radius: 2px"></span>
            <span style="color: #6b7280">${point.series.name}:</span> <strong>${point.y}</strong>
          </div>`;
        });
        return s + "</div>";
      },
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        borderWidth: 0,
        groupPadding: 0.15,
        pointPadding: 0.05,
      },
    },
    series: [
      {
        name: "Booking",
        data: activeMonthIds.map((mId) =>
          getCount(data.charts.monthlyReservations, mId)
        ),
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#29D9D5"],
            [1, "#20B2AF"],
          ],
        },
      },
      {
        name: "Pembatalan",
        data: activeMonthIds.map((mId) =>
          getCount(data.charts.monthlyCancellations, mId)
        ),
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#F87171"],
            [1, "#DC2626"],
          ],
        },
      },
    ],
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      itemStyle: { color: "#6b7280", fontWeight: "500", fontSize: "12px" },
      itemHoverStyle: { color: "#29D9D5" },
    },
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: { contextButton: { enabled: false } },
    },
  };

  // ===== PIE CHART =====
  const pieData = data.charts.suiteDistribution.map((item) => ({
    name: item._id,
    y: item.count,
    color: getTypeColor(item._id),
  }));

  const pieOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      style: { fontFamily: "Poppins, sans-serif" },
    },
    title: {
      text: `<span style="font-size: 36px; font-weight: 700; color: #1f2937">${data.cards.totalSuites}</span><br/><span style="font-size: 13px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 1px">Total Unit</span>`,
      align: "center",
      verticalAlign: "middle",
      useHTML: true,
      y: 5,
    },
    plotOptions: {
      pie: {
        innerSize: "70%",
        depth: 45,
        dataLabels: { enabled: false },
        showInLegend: true,
        borderWidth: 0,
        shadow: { color: "rgba(0,0,0,0.08)", offsetX: 0, offsetY: 2, width: 4 },
        states: { hover: { brightness: 0.1 } },
      },
    },
    series: [{ name: "Unit", data: pieData }],
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: { color: "#6b7280", fontWeight: "500", fontSize: "12px" },
      itemHoverStyle: { color: "#29D9D5" },
      symbolRadius: 4,
      symbolHeight: 10,
      symbolWidth: 10,
    },
    tooltip: {
      backgroundColor: "#fff",
      borderWidth: 0,
      borderRadius: 8,
      shadow: { color: "rgba(0,0,0,0.1)", offsetX: 0, offsetY: 4, width: 8 },
      useHTML: true,
      formatter: function () {
        return `<div style="padding: 4px">
          <div style="color: ${
            this.color
          }; font-weight: 700; font-size: 14px">${this.point.name}</div>
          <div style="color: #6b7280; font-size: 12px; margin-top: 2px">${
            this.y
          } unit (${this.percentage.toFixed(1)}%)</div>
        </div>`;
      },
    },
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: { contextButton: { enabled: false } },
    },
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  // --- STATS CARDS CONFIG (SOLID BG) ---
  const statsCards = [
    {
      title: "Pendapatan Bersih",
      value: formatRupiah(data.cards.totalIncome),
      icon: <Wallet className="text-emerald-600" size={24} />,
      bg: "bg-emerald-100",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Booking Hari Ini",
      value: data.cards.todayBookings,
      icon: <Calendar className="text-blue-600" size={24} />,
      bg: "bg-blue-100",
      trend: "+4 Order",
      trendUp: true,
    },
    {
      title: "Pengajuan Batal",
      value: data.cards.pendingCancel,
      icon: <AlertTriangle className="text-orange-600" size={24} />,
      bg: "bg-orange-100",
      trend: "Perlu Review",
      trendUp: false,
    },
    {
      title: "Total Properti",
      value: data.cards.totalSuites,
      icon: <Building2 className="text-purple-600" size={24} />,
      bg: "bg-purple-100",
      trend: "Aktif",
      trendUp: true,
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed:
        "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
      pending:
        "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200",
      cancelled:
        "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-200",
      cancellation_requested:
        "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200",
      checked_in:
        "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
    };
    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status.replace(/_/g, " ").toUpperCase()}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );

  return (
    <div className="space-y-6 p-1">
      {/* HEADER (WHITE BG) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm">
              Ringkasan performa bisnis Anda hari ini
            </p>
          </div>

          {/* KOMPONEN JAM REALTIME TERPISAH */}
          <LiveClock />
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-xl ${card.bg} shadow-sm group-hover:scale-110 transition-transform`}
                >
                  {card.icon}
                </div>
                {card.trend && (
                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      card.trendUp
                        ? "text-green-600 bg-green-50 border border-green-200"
                        : "text-orange-600 bg-orange-50 border border-orange-200"
                    }`}
                  >
                    {card.trendUp ? <TrendingUp size={12} /> : null}
                    {card.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Activity className="text-primary" size={20} /> Analisis
                Pendapatan
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Total pemasukan per bulan
              </p>
            </div>
            {/* IMPLEMENTASI TOMBOL 3 TITIK PENDAPATAN */}
            <button
              onClick={() => handleDownload(revenueChartRef)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition"
              title="Download Grafik"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80 w-full">
            <HighchartsReact
              ref={revenueChartRef}
              highcharts={Highcharts}
              options={revenueOptions}
              containerProps={{ className: "w-full h-full" }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                Distribusi Unit
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Per kategori properti
              </p>
            </div>
            {/* IMPLEMENTASI TOMBOL 3 TITIK PIE */}
            <button
              onClick={() => handleDownload(pieChartRef)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition"
              title="Download Grafik"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <HighchartsReact
              ref={pieChartRef}
              highcharts={Highcharts}
              options={pieOptions}
              containerProps={{ className: "w-full h-full" }}
            />
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                Traffic Pesanan
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Booking vs Pembatalan
              </p>
            </div>
            {/* IMPLEMENTASI TOMBOL 3 TITIK TRAFFIC */}
            <button
              onClick={() => handleDownload(activityChartRef)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition"
              title="Download Grafik"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80 w-full">
            <HighchartsReact
              ref={activityChartRef}
              highcharts={Highcharts}
              options={activityOptions}
              containerProps={{ className: "w-full h-full" }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0 flex flex-col">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "booking"
                  ? "text-primary border-b-2 border-primary bg-cyan-50/30"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileText size={16} /> Transaksi Terbaru
            </button>
            <button
              onClick={() => setActiveTab("cancellation")}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "cancellation"
                  ? "text-red-500 border-b-2 border-red-500 bg-red-50/30"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <XCircle size={16} /> Pembatalan
            </button>
          </div>

          <div className="overflow-x-auto flex-1 p-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="p-4 rounded-l-lg">Tamu</th>
                  <th className="p-4">Properti</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeTab === "booking" ? (
                  data.recentTransactions.length > 0 ? (
                    data.recentTransactions.map((trx) => (
                      <tr
                        key={trx._id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-xs uppercase shadow-sm">
                              {trx.user?.name?.charAt(0) || "G"}
                            </div>
                            <span className="font-semibold text-gray-700">
                              {trx.user?.name || "Guest"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{trx.suite?.name}</td>
                        <td className="p-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                          {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-4">{getStatusBadge(trx.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-8 text-center text-gray-400 italic"
                      >
                        Belum ada transaksi minggu ini.
                      </td>
                    </tr>
                  )
                ) : data.recentCancellations.length > 0 ? (
                  data.recentCancellations.map((trx) => (
                    <tr
                      key={trx._id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs uppercase">
                            {trx.user?.name?.charAt(0) || "G"}
                          </div>
                          <span className="font-medium text-gray-700">
                            {trx.user?.name || "Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{trx.suite?.name}</td>
                      <td className="p-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {new Date(trx.updatedAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">{getStatusBadge(trx.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-gray-400 italic"
                    >
                      Tidak ada pembatalan baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
