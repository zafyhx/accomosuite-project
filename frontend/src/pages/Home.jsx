import axios from "axios";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Heart,
  LayoutDashboard,
  Loader2,
  MapPin,
  Quote,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  // State Data Real
  const [suites, setSuites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE SLIDER TESTIMONI ---
  const [currentTestiPage, setCurrentTestiPage] = useState(0);

  const testimonials = [
    {
      name: "Andi Smith",
      city: "Jakarta",
      text: "Pelayanan luar biasa! Kamar sangat bersih dan staf sangat ramah.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Wijaya",
      city: "Surabaya",
      text: "Lokasi strategis dan makanannya enak. Sangat direkomendasikan.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Budi Santoso",
      city: "Bandung",
      text: "Interior hotel sangat mewah dan instagramable. Proses check-in cepat.",
      img: "https://randomuser.me/api/portraits/men/85.jpg",
    },
    {
      name: "Jessica Lee",
      city: "Singapore",
      text: "The best staycation experience ever! Fasilitas kolam renangnya juara.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Michael Chen",
      city: "Medan",
      text: "Sangat worth it dengan harganya. Suasana tenang cocok untuk healing.",
      img: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      name: "Linda Kusuma",
      city: "Bali",
      text: "Resepsionis sangat membantu saat kami butuh late check-out.",
      img: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    {
      name: "Tom Holland",
      city: "Australia",
      text: "Amazing hospitality. The breakfast menu is diverse and delicious.",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Siti Nurhaliza",
      city: "Malaysia",
      text: "Suka banget sama desain kamarnya yang modern tapi homey.",
      img: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
      name: "Riko Simanjuntak",
      city: "Yogyakarta",
      text: "Parkiran luas dan keamanan terjamin. Pasti bakal balik lagi.",
      img: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => setCurrentTestiPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentTestiPage((prev) => (prev - 1 + totalPages) % totalPages);

  const currentTestimonials = testimonials.slice(
    currentTestiPage * itemsPerPage,
    (currentTestiPage + 1) * itemsPerPage
  );

  // Fetch Data Suites & Blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suitesRes, blogsRes] = await Promise.all([
          axios.get("/api/suites"),
          axios.get("/api/blogs"),
        ]);
        setSuites(suitesRes.data.slice(0, 4));
        setBlogs(blogsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/600x400?text=No+Image";

    // FIX UTAMA: Gunakan import.meta.env (Vite standard)
    // Ubah nama variabel menjadi VITE_API_URL
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <Hero />

      <div className="container mx-auto px-4 md:px-10 -mt-10 md:-mt-12 relative z-20">
        {/* 2. DASHBOARD CARD */}
        {user && (
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 mb-20 border border-gray-100 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-secondary flex flex-wrap items-center gap-2">
                  Halo, {user.name}
                  {user.role === "admin" && (
                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider font-bold">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  )}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Mau menginap di mana hari ini?
                </p>
              </div>
            </div>

            {/* Menu Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {user.role === "admin" ? (
                <>
                  <Link to="/admin">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                      <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-primary/30 group-hover:scale-105 transition">
                        <LayoutDashboard size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base">
                          Dashboard
                        </h3>
                        <p className="text-xs text-gray-500">Panel Admin</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="/admin/bookings">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                      <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-indigo-500/20 group-hover:scale-105 transition">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base">
                          Reservasi
                        </h3>
                        <p className="text-xs text-gray-500">Cek Booking</p>
                      </div>
                    </div>
                  </Link>
                </>
              ) : (
                <Link to="/my-bookings">
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                    <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-primary/30 group-hover:scale-105 transition">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">
                        Booking Saya
                      </h3>
                      <p className="text-xs text-gray-500">Riwayat Pesanan</p>
                    </div>
                  </div>
                </Link>
              )}
              <Link to="/profile">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer active:scale-95 hover:shadow-md transition group flex items-center gap-3 h-full">
                  <div className="bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-gray-500/20 group-hover:scale-105 transition">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">
                      Pengaturan
                    </h3>
                    <p className="text-xs text-gray-500">Profil & Keamanan</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 3. ABOUT SECTION */}
      <section className={`py-20 ${!user ? "mt-0" : "-mt-10"}`}>
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <div className="space-y-6">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">
                Kenapa Harus Accomosuite?
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Temukan hotel yang mendefinisikan dimensi baru kemewahan.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Kami menyediakan pengalaman menginap yang tak terlupakan dengan
                memadukan kenyamanan modern dan sentuhan budaya lokal yang
                hangat.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Restoran</h4>
                    <p className="text-xs text-gray-500">
                      Cita rasa lokal & internasional.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Wellness & Spa</h4>
                    <p className="text-xs text-gray-500">
                      Relaksasi total untuk Anda.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <Wifi size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Free Wifi</h4>
                    <p className="text-xs text-gray-500">
                      Koneksi cepat di setiap sudut.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Gamepad2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Game Zone</h4>
                    <p className="text-xs text-gray-500">
                      Hiburan untuk keluarga.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/hotel"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary transition shadow-lg"
                >
                  Lihat Kamar <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right Image Composition */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop"
                  alt="Hotel 1"
                  className="rounded-2xl object-cover h-64 w-full shadow-lg translate-y-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop"
                  alt="Hotel 2"
                  className="rounded-2xl object-cover h-64 w-full shadow-lg"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-xs border border-gray-100 z-10 animate-bounce-slow">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                  ))}
                </div>
                <p className="font-bold text-gray-800">
                  "Pengalaman menginap terbaik!"
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  — Sarah J., Google Reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROOMS & SUITES (Feature Rich Cards) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="w-8 h-[2px] bg-primary"></div> Akomodasi Pilihan
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3 leading-tight">
                Kenyamanan Istirahat <br /> Tanpa Kompromi
              </h2>
            </div>
            <Link
              to="/hotel"
              className="hidden md:flex items-center gap-2 text-gray-500 font-semibold hover:text-primary transition group"
            >
              Lihat Semua Kamar
              <span className="bg-gray-200 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center h-64 items-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {suites.map((suite, index) => (
                <div
                  key={suite._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden relative"
                >
                  {/* Image Area */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(suite.images?.[0])}
                      alt={suite.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />

                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 backdrop-blur-sm transition-all shadow-sm z-10">
                      <Heart
                        size={18}
                        className="hover:fill-red-500 transition-colors"
                      />
                    </button>

                    {/* Tags (Dummy Logic for visual variety) */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {suite.type}
                      </span>
                      {index % 2 === 0 && (
                        <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                          Terlaris
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Rating & Location */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={14} className="text-primary" />{" "}
                        {suite.location || "Lokasi Strategis"}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />{" "}
                        4.8{" "}
                        <span className="text-gray-400 font-normal">(86)</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                      {suite.name}
                    </h3>

                    {/* Amenities Badges (Lebih Berisi) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <Users size={10} /> 2 Org
                      </span>
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <LayoutDashboard size={10} /> 30m²
                      </span>
                      <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <Wifi size={10} /> Free Wifi
                      </span>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 line-through">
                          Rp {(suite.price * 1.2).toLocaleString()}
                        </p>
                        <p className="text-primary font-bold text-lg">
                          Rp {suite.price.toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={`/suites/${suite._id}`}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary transition shadow-lg active:scale-95"
                      >
                        Pilih Kamar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Link
              to="/hotel"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold shadow-sm"
            >
              Lihat Semua Kamar <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. STATS (Premium Parallax) */}
      <section
        className="relative py-28 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://www.smartparents.sg/sites/default/files/image-8932980-5f5cdff82231ecb676c38909398a2c34-parents--9-great-tips-for-a-happy-family-holiday-1_4.jpg')",
        }}
      >
        {/* Overlay Gelap dengan Gradasi */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/90"></div>

        <div className="container mx-auto px-4 md:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Stat Item 1 */}
            <div className="group text-center p-4 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <LayoutDashboard
                  size={32}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:text-primary transition-colors">
                150+
              </h3>
              <div className="h-1 w-12 bg-primary/50 mx-auto mb-3 rounded-full group-hover:w-20 transition-all duration-500"></div>
              <p className="text-gray-300 uppercase tracking-[0.2em] text-xs font-bold">
                Kamar Mewah
              </p>
            </div>

            {/* Stat Item 2 */}
            <div className="group text-center p-4 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Users
                  size={32}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:text-primary transition-colors">
                50K+
              </h3>
              <div className="h-1 w-12 bg-primary/50 mx-auto mb-3 rounded-full group-hover:w-20 transition-all duration-500"></div>
              <p className="text-gray-300 uppercase tracking-[0.2em] text-xs font-bold">
                Tamu Bahagia
              </p>
            </div>

            {/* Stat Item 3 */}
            <div className="group text-center p-4 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Star
                  size={32}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:text-primary transition-colors">
                4.9
              </h3>
              <div className="h-1 w-12 bg-primary/50 mx-auto mb-3 rounded-full group-hover:w-20 transition-all duration-500"></div>
              <p className="text-gray-300 uppercase tracking-[0.2em] text-xs font-bold">
                Rating Bintang
              </p>
            </div>

            {/* Stat Item 4 */}
            <div className="group text-center p-4 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <ShieldCheck
                  size={32}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:text-primary transition-colors">
                24/7
              </h3>
              <div className="h-1 w-12 bg-primary/50 mx-auto mb-3 rounded-full group-hover:w-20 transition-all duration-500"></div>
              <p className="text-gray-300 uppercase tracking-[0.2em] text-xs font-bold">
                Layanan Staff
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR SERVICES */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">
                Layanan Kami
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                Fasilitas Eksklusif Untuk Anda
              </h2>
              <p className="text-gray-500 mb-8">
                Nikmati berbagai fasilitas premium yang kami sediakan untuk
                menunjang kenyamanan istirahat dan aktivitas bisnis Anda.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Free Wi-Fi",
                  desc: "Koneksi internet kecepatan tinggi.",
                  icon: <Wifi size={24} />,
                },
                {
                  title: "Meeting Events",
                  desc: "Ruang pertemuan modern.",
                  icon: <Users size={24} />,
                },
                {
                  title: "Free Cancellation",
                  desc: "Fleksibilitas pembatalan.",
                  icon: <CheckCircle2 size={24} />,
                },
                {
                  title: "Best Price",
                  desc: "Jaminan harga terbaik.",
                  icon: <Star size={24} />,
                },
              ].map((srv, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition duration-300 border border-gray-100 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                    {srv.icon}
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {srv.title}
                  </h4>
                  <p className="text-sm text-gray-500">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SLIDER (3 ITEMS PER SLIDE) */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">
              Testimoni
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Kata Mereka
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="relative">
            {/* Tombol Navigasi */}
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>

            {/* Grid 3 Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in px-4">
              {currentTestimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative hover:-translate-y-2 transition duration-300 h-full flex flex-col"
                >
                  <div className="absolute -top-4 right-8 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Quote size={18} fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {item.city}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed flex-grow">
                    "{item.text}"
                  </p>
                  <div className="flex gap-1 mt-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicators */}
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestiPage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentTestiPage
                      ? "bg-primary w-8"
                      : "bg-gray-300 w-2"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. PARTNERS (TRUSTED BY) */}
      <section className="py-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            Trusted by Global Partners
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {[
              {
                name: "Airbnb",
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
                h: "h-16 md:h-18",
              },
              {
                name: "BCA",
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD55a8Qe28T83fYzjQYN1OynHljfAcP0Fy1Q&s",
                h: "h-12 md:h-14",
              },
              {
                name: "Agoda",
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Agoda_logo_2019.svg/1200px-Agoda_logo_2019.svg.png",
                h: "h-16 md:h-18",
              },
              {
                name: "Booking.com",
                url: "https://content.presspage.com/clients/o_685.jpg",
                h: "h-22 md:h-24",
              },
              {
                name: "Tokopedia",
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tokopedia.svg/1200px-Tokopedia.svg.png",
                h: "h-10 md:h-12",
              },
            ].map((logo, idx) => (
              <div key={idx} className="group transition-all duration-300">
                <img
                  src={logo.url}
                  alt={logo.name}
                  className={`${logo.h} object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer filter`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LATEST BLOG */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm">
                Blog & Berita
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                Artikel Terbaru
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-gray-500 hover:text-primary font-medium transition"
            >
              Lihat Semua Blog <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition border border-gray-100"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img
                      src={getImageUrl(blog.imageUrl)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {blog.content}
                  </p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-wider group-hover:text-primary transition"
                  >
                    Baca Selengkapnya <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 10. NEWSLETTER CTA (Compact & Elegant) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="relative bg-gray-900 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background Pattern Halus */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

            {/* Text Section */}
            <div className="relative z-10 md:w-1/2 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="p-2 bg-white/10 rounded-lg">
                  <ShieldCheck size={20} className="text-primary" />
                </span>
                Berlangganan Newsletter
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dapatkan info promo eksklusif, diskon member, dan rekomendasi
                liburan terbaik langsung di inbox Anda.
              </p>
            </div>

            {/* Form Section */}
            <div className="relative z-10 w-full md:w-auto flex-1 max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-primary/50 transition-all outline-none text-sm"
                  required
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/25 whitespace-nowrap text-sm flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
