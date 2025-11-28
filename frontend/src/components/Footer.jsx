import {
  ArrowRight,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-white pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
      {/* Background Decoration (Glow Halus) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        {/* TOP SECTION: Grid 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* 1. Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              {/* PERBAIKAN DISINI: Menghapus 'flex' & 'gap' agar teks menyatu */}
              <h2 className="text-3xl font-bold tracking-tight text-white">
                <span className="text-primary">Accomo</span>suite
                <span className="text-primary">.</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform pemesanan akomodasi premium yang menghubungkan Anda
              dengan hotel, villa, dan resort terbaik di seluruh Indonesia.
              Kenyamanan Anda adalah prioritas kami.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                <Facebook size={18} />,
                <Instagram size={18} />,
                <Twitter size={18} />,
                <Youtube size={18} />,
              ].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links (Perusahaan) */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
              Perusahaan
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Tentang Kami",
                "Karir",
                "Blog Official",
                "Partner Hotel",
                "Press Kit",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-primary text-sm flex items-center gap-2 transition-all group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support (Bantuan) */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
              Bantuan
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Pusat Bantuan",
                "Kebijakan Privasi",
                "Syarat & Ketentuan",
                "Cara Pemesanan",
                "Hubungi Kami",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-primary text-sm flex items-center gap-2 transition-all group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter & Contact (Mini) */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
              Tetap Terhubung
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Dapatkan info promo eksklusif langsung ke inbox Anda.
            </p>

            <form className="relative mb-6">
              <input
                type="email"
                placeholder="Email Anda..."
                className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button className="absolute right-1.5 top-1.5 bg-primary p-2 rounded-lg text-white hover:bg-primary-dark transition-colors shadow-lg">
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-1 shrink-0" />
                <span>
                  SCBD Lot 28, Jakarta Selatan,
                  <br />
                  Indonesia 12190
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+62 21 5050 8888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <span>cs@accomosuite.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Separator, Copyright & Payments */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm text-center md:text-left">
            <p>
              © {new Date().getFullYear()} Accomosuite Inc. All rights reserved.
            </p>
          </div>

          {/* Payment Icons (Visual Only) */}
          <div className="flex flex-wrap justify-center gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {["Visa", "Mastercard", "PayPal", "BCA", "Mandiri"].map((pay) => (
              <div
                key={pay}
                className="h-8 px-3 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white tracking-wider cursor-default"
              >
                {pay}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Globe size={16} />
            <span>Bahasa Indonesia (ID)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
