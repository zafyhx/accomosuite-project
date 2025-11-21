import { Search, Calendar, MapPin } from "lucide-react";

const Hero = () => {
  return (
    // REVISI: Tinggi di Laptop (md) jadi 500px biar ga terlalu raksasa
    <div className="relative h-[85vh] md:h-[500px] w-full flex items-center justify-center">
      
      {/* BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop')" 
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* KONTEN */}
      <div className="relative z-10 text-center text-white px-4 w-full max-w-5xl">
        {/* REVISI: Font size md:text-5xl (sebelumnya 6xl) */}
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg leading-tight">
          Temukan Penginapan Impian
        </h1>
        <p className="text-sm md:text-lg mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
          Nikmati kenyamanan dan kemewahan di lokasi terbaik Indonesia.
        </p>

        {/* SEARCH BAR */}
        <div className="bg-white p-3 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3 mx-auto max-w-4xl">
          
          {/* Input Lokasi - Lebih ramping di desktop (py-2) */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 md:py-2.5 rounded-xl w-full md:flex-1 border border-gray-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
            <MapPin className="text-primary shrink-0" size={18} />
            <input 
              type="text" 
              placeholder="Mau kemana?" 
              className="bg-transparent outline-none text-gray-700 w-full text-sm md:text-base font-medium placeholder:font-normal"
            />
          </div>

          {/* Input Tanggal - Lebih ramping di desktop */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 md:py-2.5 rounded-xl w-full md:w-auto border border-gray-100">
            <Calendar className="text-primary shrink-0" size={18} />
            <input 
              type="date" 
              className="bg-transparent outline-none text-gray-700 text-sm md:text-base w-full"
            />
          </div>

          {/* Tombol Cari - Padding dikurangi di desktop */}
          <button className="bg-primary hover:bg-primary-dark active:scale-95 text-white px-8 py-3 md:py-2.5 rounded-xl font-bold transition w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
            <Search size={18} />
            <span>Cari</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Hero;