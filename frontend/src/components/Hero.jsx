import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from "lucide-react";

const Hero = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    console.log({ location, checkIn, checkOut, guests });
    // navigate(`/hotels?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="relative h-[106vh] flex items-center overflow-hidden">
      
      {/* VIDEO BACKGROUND */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Video.mp4" type="video/mp4" />
      </video>
      
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
                
                {/* Location */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <MapPin className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Where</div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your Destinations"
                      className="w-full bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Check In */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Check in</div>
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

                {/* Check Out */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Calendar className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Check out</div>
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

                {/* Guests */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <Users className="text-primary flex-shrink-0" size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Guests</div>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent border-0 outline-none text-gray-900 font-medium cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
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
                  <Search size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Search</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Fade - Lebih pendek agar dashboard terlihat */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white to-transparent pointer-events-none" />

    </div>
  );
};

export default Hero;