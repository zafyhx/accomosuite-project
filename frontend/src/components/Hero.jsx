import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react"; // Tambah useEffect & useRef
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Pastikan install axios: npm install axios

const Hero = () => {
  const navigate = useNavigate();

  // --- STATE LAMA ---
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  // --- STATE BARU (UNTUK SEARCH & DB) ---
  const [dbLocations, setDbLocations] = useState([]); // Data dari database
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null); // Ref untuk deteksi klik luar

  // 1. Ambil data dari Database saat load (Logika dari kode referensi)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await axios.get("/api/suites");
        // Ambil field 'location', hilangkan duplikat
        const uniqueLocations = [...new Set(data.map((item) => item.location))];
        setDbLocations(uniqueLocations);
      } catch (error) {
        console.error("Gagal memuat lokasi", error);
        // Fallback data jika API belum siap (opsional)
        // setDbLocations(["Jakarta", "Bali", "Yogyakarta", "Bandung"]);
      }
    };
    fetchLocations();
  }, []);

  // 2. Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Filter lokasi berdasarkan ketikan
  const filteredLocations = dbLocations.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  const handleSearch = () => {
    // Navigasi dengan membawa parameter location
    navigate(`/hotel?location=${encodeURIComponent(location)}`);
  };

  const handleSelectLocation = (selectedCity) => {
    setLocation(selectedCity);
    setShowDropdown(false);
  };

  return (
    <div className="relative h-[106vh] flex items-center overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/background.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Heritage Suites Of
              <span className="block text-primary">Indonesia</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
              A blend of modern comfort and cultural warmth.
            </p>
          </div>

          {/* MODERN INLINE SEARCH BAR */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary rounded-2xl blur opacity-40" />

            {/* Search container */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col lg:flex-row gap-2">
                
                {/* --- MODIFIKASI BAGIAN LOCATION --- */}
                <div 
                  ref={searchContainerRef} // Pasang Ref disini
                  className="relative flex-1 lg:flex-[1.5]"
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group h-full">
                    <MapPin className="text-primary flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 mb-0.5">
                        Where
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Your Destinations"
                        className="w-full bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* --- DROPDOWN REKOMENDASI (Style Traveloka) --- */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 w-full lg:w-[320px] bg-white rounded-xl shadow-xl mt-2 border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredLocations.length > 0 ? (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Popular Destinations
                          </div>
                          {filteredLocations.map((loc, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectLocation(loc)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <MapPin size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-700 text-sm">{loc}</p>
                                <p className="text-xs text-gray-400">Indonesia</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400">
                           Location not found
                        </div>
                      )}
                    </div>
                  )}
                  {/* --- END DROPDOWN --- */}
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Check In (TIDAK BERUBAH) */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">
                      Check in
                    </div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Check Out (TIDAK BERUBAH) */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">
                      Check out
                    </div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Guests (TIDAK BERUBAH) */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Users className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">
                      Guests
                    </div>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent border-0 outline-none text-gray-900 font-medium cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary text-white rounded-xl px-8 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 group"
                >
                  <Search
                    size={20}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;