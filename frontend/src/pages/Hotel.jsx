import axios from "axios";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Coffee,
  Crown,
  Filter,
  Home,
  LayoutGrid,
  Loader2,
  MapPin,
  Palmtree,
  Search,
  SlidersHorizontal,
  Star,
  Tent,
  TicketPercent, // Ikon baru ditambahkan
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HotelsPage() {
  const location = useLocation();

  // --- STATE MANAGEMENT ---
  const [suites, setSuites] = useState([]);
  const [filteredSuites, setFilteredSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(10000000);
  const [sortBy, setSortBy] = useState("recommended");

  // --- NEW STATE: Quick Category ---
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Daftar Kategori (Pastikan ini sesuai dengan data di DB nanti, atau biarkan sebagai filter visual)
  const categories = [
    { name: "Semua", icon: <LayoutGrid size={16} /> },
    { name: "Hotel", icon: <Building2 size={16} /> },
    { name: "Villa", icon: <Home size={16} /> },
    { name: "Resort", icon: <Palmtree size={16} /> },
    { name: "Cottage", icon: <Tent size={16} /> },
  ];

  // Helper: Image URL Fixer
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/600x400?text=No+Image";
    // Jika path sudah ada http (link online), pakai itu.
    // Jika tidak, gabungkan dengan URL Railway/Localhost.
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  // 1. Initial Fetch & URL Params
  useEffect(() => {
    const fetchSuites = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/suites");
        setSuites(data);

        const params = new URLSearchParams(location.search);
        const locationParam = params.get("location");
        if (locationParam) setSearchTerm(locationParam);
      } catch (err) {
        console.error("Error fetching suites:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuites();
  }, [location.search]);

  // 2. Logic Filter & Sorting
  useEffect(() => {
    let result = [...suites];

    // Filter by Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (suite) =>
          suite.name.toLowerCase().includes(term) ||
          suite.location.toLowerCase().includes(term)
      );
    }

    // Filter by Price
    result = result.filter((suite) => suite.price <= priceRange);

    // Filter by Category
    if (activeCategory !== "Semua") {
      // Asumsi: di database ada field 'type'. Jika tidak, filter ini hanya visual dummy.
      // Kita gunakan toLowerCase() agar tidak sensitif huruf besar/kecil
      result = result.filter(
        (suite) =>
          suite.type &&
          suite.type.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredSuites(result);
  }, [suites, searchTerm, priceRange, sortBy, activeCategory]);

  // Top Recommendations
  const topRecommendations = [...suites]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-[80px] pb-20 font-sans">
      {/* === HEADER & FILTER BAR (Sticky & Glassmorphism) === */}
      <div className="sticky top-14 md:top-[80px] z-30 transition-all duration-300">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full lg:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari hotel, villa, atau lokasi..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 sm:text-sm font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters & Sort Group */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Price Range Slider (Modern Custom) */}
              <div className="flex-1 min-w-[200px] bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Max Budget
                  </span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Rp {(priceRange / 1000000).toFixed(1)} Jt
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60000000"
                  step="500000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-dark transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[180px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-3 text-sm font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer appearance-none shadow-sm hover:bg-gray-50 transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Rekomendasi</option>
                  <option value="priceLow">Harga Terendah</option>
                  <option value="priceHigh">Harga Tertinggi</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* --- NEW FEATURE: CATEGORY PILLS --- */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.name
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SECTION: EDITOR'S PICK (ICON CHANGED) */}
        {!loading &&
          topRecommendations.length > 0 &&
          searchTerm === "" &&
          activeCategory === "Semua" && (
            <div className="mb-12 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Crown size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Best Choices
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Akomodasi paling eksklusif minggu ini
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topRecommendations.map((suite) => (
                  <Link
                    to={`/suites/${suite._id}`}
                    key={suite._id}
                    className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
                    <img
                      src={getImageUrl(suite.images?.[0])}
                      alt={suite.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    {/* Floating Glass Card */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-xl rounded-2xl z-20 border border-white/40 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                            {suite.name}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {suite.location}
                          </p>
                        </div>
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                          Top Tier
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200/50 flex justify-between items-center">
                        <p className="font-extrabold text-primary text-lg">
                          Rp {suite.price?.toLocaleString()}
                        </p>
                        <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          Detail <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* --- NEW FEATURE: PROMO BANNER --- */}
        {!loading && (
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 mb-12 overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 text-white">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-widest">
                <TicketPercent size={18} /> Promo Spesial
              </div>
              <h3 className="text-3xl font-bold mb-2">
                Diskon 20% Untuk Member Baru!
              </h3>
              <p className="text-gray-400 text-sm">
                Gunakan kode voucher{" "}
                <span className="text-white font-mono bg-white/20 px-2 py-1 rounded">
                  ACCOMO20
                </span>{" "}
                saat checkout.
              </p>
            </div>
            <button className="relative z-10 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg active:scale-95 whitespace-nowrap">
              Klaim Sekarang
            </button>
          </div>
        )}

        {/* SECTION: MAIN LISTING */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="text-primary" />
            {activeCategory === "Semua"
              ? "Semua Penginapan"
              : `Kategori: ${activeCategory}`}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredSuites.length} properti
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
            <p className="text-gray-500 animate-pulse">
              Sedang mencari penginapan terbaik...
            </p>
          </div>
        ) : filteredSuites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
              Kami tidak dapat menemukan penginapan dengan kriteria "
              {searchTerm}" di kategori {activeCategory}.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setPriceRange(15000000);
                setActiveCategory("Semua");
              }}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30 active:scale-95"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredSuites.map((suite) => (
              <Link
                to={`/suites/${suite._id}`}
                key={suite._id}
                className="group bg-white rounded-3xl p-3 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-60 rounded-[1.2rem] overflow-hidden mb-4">
                  <img
                    src={getImageUrl(suite.images?.[0])}
                    alt={suite.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 text-gray-800">
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500"
                    />{" "}
                    4.8
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {suite.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 pb-2 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {suite.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-primary" />{" "}
                      {suite.location}
                    </p>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                      <Wifi size={10} /> Wifi
                    </span>
                    <span className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                      <Coffee size={10} /> Breakfast
                    </span>
                    <span className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Refundable
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[10px] text-gray-400 line-through">
                        Rp {(suite.price * 1.2).toLocaleString()}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        Rp {suite.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-primary/30">
                      <ArrowRight
                        size={18}
                        className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
