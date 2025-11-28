import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
  // State untuk Form Interaktif
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // State untuk FAQ Accordion
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi kirim data ke server (2 detik)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      // Reset form logic bisa ditambahkan disini
    }, 2000);
  };

  const faqs = [
    {
      q: "Bagaimana cara melakukan check-in?",
      a: "Tunjukkan kartu identitas (KTP/Paspor) dan bukti booking digital Anda di resepsionis. Check-in dimulai pukul 14:00.",
    },
    {
      q: "Apakah bisa refund jika batal?",
      a: "Bisa. Pembatalan gratis tersedia hingga 24 jam sebelum tanggal check-in untuk tipe kamar tertentu.",
    },
    {
      q: "Apakah tersedia jemputan bandara?",
      a: "Ya, kami menyediakan layanan antar-jemput bandara gratis untuk tamu yang menginap minimal 3 malam.",
    },
    {
      q: "Apakah sarapan sudah termasuk dalam harga kamar?",
      a: "Sebagian tipe kamar sudah termasuk sarapan. Detail ketersediaan dapat dilihat pada halaman pemesanan atau saat memilih tipe kamar.",
    },

    {
      q: "Apakah diperbolehkan membawa hewan peliharaan?",
      a: "Saat ini properti belum mengizinkan tamu membawa hewan peliharaan, kecuali yang bersifat layanan khusus (service animal) dengan pemberitahuan sebelumnya.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 1. HERO HEADER (Parallax Style) */}
      <div className="relative h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2070&auto=format&fit=crop"
            alt="Contact Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 mt-16 animate-fade-in-up">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm bg-black/30 backdrop-blur px-4 py-2 rounded-full border border-white/10">
            24/7 Support
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-2 drop-shadow-lg">
            Hubungi Kami
          </h1>
          <p className="text-gray-200 text-lg max-w-x2 mx-auto font-light">
            Tim kami siap membantu merencanakan liburan impian Anda kapan saja.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. LEFT: CONTACT INFO CARDS (Vertical Stack) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card 1: Main Info */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="text-primary" size={20} /> Kantor Pusat
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                      Alamat
                    </p>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                      Jl. Palagan Tentara Pelajar No. 45,
                      <br />
                      The Heavenly 28, Surabaya 12190
                    </p>
                  </div>
                </div>

                <a
                  href="tel:+628221782003"
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                      Telepon
                    </p>
                    <p className="text-gray-700 text-sm font-medium hover:text-primary transition">
                      +62 82 2178 2003
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@accomosuite.com"
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                      Email
                    </p>
                    <p className="text-gray-700 text-sm font-medium hover:text-primary transition">
                      support@accomosuite.com
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Card 2: Visual Map Button */}
            <div className="bg-gray-900 rounded-3xl p-1 overflow-hidden shadow-xl group relative h-64">
              <img
                src="https://asset.kompas.com/crops/7gQlOtiLIIuB1jyn3CfKZ1gKZDY=/0x0:1200x800/1200x800/data/photo/2020/11/18/5fb47dc95d0c7.jpg"
                className="w-full h-full object-cover rounded-[1.3rem] opacity-65 group-hover:opacity-40 transition duration-500"
                alt="Map"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <MapPin size={32} className="text-white mb-2 animate-bounce" />
                <h4 className="text-white font-bold text-xl">Lihat di Peta</h4>
                <p className="text-white/70 text-xs mb-4">
                  Navigasi mudah ke lokasi kami
                </p>
                <button className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition shadow-lg">
                  Buka Google Maps
                </button>
              </div>
            </div>
          </div>

          {/* 3. RIGHT: INTERACTIVE FORM & FAQ */}
          <div className="lg:col-span-2 space-y-8">
            {/* The Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Kirim Pesan
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Kami akan membalas dalam waktu 24 jam.
                  </p>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-primary/10 text-primary rounded-2xl items-center justify-center">
                  <MessageSquare size={24} />
                </div>
              </div>

              {isSent ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Pesan Terkirim!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Terima kasih telah menghubungi kami. Tim support kami akan
                    segera merespons ke email Anda.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        Nama Lengkap
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Tama Suppley"
                        className="w-full px-5 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="tama@example.com"
                        className="w-full px-5 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Topik
                    </label>
                    <select className="w-full px-5 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium cursor-pointer">
                      <option>Reservasi & Booking</option>
                      <option>Kerjasama Bisnis</option>
                      <option>Kendala Teknis</option>
                      <option>Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Pesan
                    </label>
                    <textarea
                      required
                      rows="5"
                      placeholder="Tuliskan detail pertanyaan Anda..."
                      className="w-full px-5 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 hover:bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        {" "}
                        <Loader2 size={20} className="animate-spin" />{" "}
                        Mengirim...{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <Send size={20} /> Kirim Pesan{" "}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Accordion (New Feature) */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Pertanyaan Umum (FAQ)
              </h3>
              <div className="space-y-3">
                {faqs.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                    >
                      <span className="font-semibold text-gray-700 text-sm">
                        {item.q}
                      </span>
                      {activeAccordion === idx ? (
                        <ChevronUp size={18} className="text-primary" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </button>
                    {activeAccordion === idx && (
                      <div className="p-4 bg-white text-sm text-gray-500 leading-relaxed border-t border-gray-100 animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
