import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, Wifi, Coffee, ArrowRight, Search, SlidersHorizontal, Filter } from 'lucide-react';

export default function HotelsPage() {
    const location = useLocation();
    
    // --- STATE MANAGEMENT ---
    const [suites, setSuites] = useState([]); // Data mentah dari API
    const [filteredSuites, setFilteredSuites] = useState([]); // Data setelah difilter
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(10000000); // Default max 10jt
    const [sortBy, setSortBy] = useState('recommended'); // recommended, priceLow, priceHigh

    // 1. Initial Fetch & URL Params
    useEffect(() => {
        const fetchSuites = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/suites');
                setSuites(data);
                
                // Set initial search term from URL if exists
                const params = new URLSearchParams(location.search);
                const locationParam = params.get('location');
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

    // 2. Logic Filter & Sorting (Real-time)
    useEffect(() => {
        let result = [...suites];

        // A. Filter by Search Term (Name or Location)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(suite => 
                suite.name.toLowerCase().includes(term) || 
                suite.location.toLowerCase().includes(term)
            );
        }

        // B. Filter by Price Range
        result = result.filter(suite => suite.price <= priceRange);

        // C. Sorting
        if (sortBy === 'priceLow') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceHigh') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredSuites(result);
    }, [suites, searchTerm, priceRange, sortBy]);

    // Ambil 3 Hotel untuk Rekomendasi (Misal: 3 termahal dianggap 'Top Tier')
    const topRecommendations = [...suites]
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            
            {/* SECTION 1: TOP RECOMMENDATIONS */}
            {/* Hanya tampil jika tidak sedang searching spesifik (opsional) */}
            {!loading && topRecommendations.length > 0 && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-4">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Rekomendasi Editor</h2>
                            <p className="text-gray-500 text-sm">Pilihan akomodasi terbaik minggu ini</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topRecommendations.map((suite) => (
                            <Link to={`/suites/${suite._id}`} key={suite._id} className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gray-900/30 group-hover:bg-gray-900/10 transition-colors z-10" />
                                <img 
                                    src={suite.images?.[0]} 
                                    alt={suite.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 to-transparent text-white">
                                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">TOP RATED</span>
                                    <h3 className="text-xl font-bold mb-1">{suite.name}</h3>
                                    <p className="text-sm opacity-90 flex items-center gap-1"><MapPin size={14}/> {suite.location}</p>
                                    <p className="mt-2 font-bold text-lg">Rp {suite.price?.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 2: SEARCH & FILTER BAR (Sticky) */}
            <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-y border-gray-200 shadow-sm py-4 mb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Cari nama hotel atau lokasi..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-primary rounded-xl outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters & Sort */}
                        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            
                            {/* Price Slider */}
                            <div className="flex flex-col min-w-[200px]">
                                <label className="text-xs text-gray-500 font-semibold mb-1 flex justify-between">
                                    <span>Max Harga</span>
                                    <span>Rp {(priceRange/1000000).toFixed(1)} Jt</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="15000000" 
                                    step="500000"
                                    value={priceRange} 
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[160px]">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <select 
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="recommended">Rekomendasi</option>
                                    <option value="priceLow">Harga Terendah</option>
                                    <option value="priceHigh">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: MAIN LISTING */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Semua Penginapan ({filteredSuites.length})
                </h3>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredSuites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <Search size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-600">Tidak ada hasil ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kata kunci atau atur ulang filter harga.</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setPriceRange(15000000);}}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredSuites.map((suite) => (
                            <Link to={`/suites/${suite._id}`} key={suite._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
                                {/* Image Wrapper */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={suite.images?.[0] || "https://placehold.co/600x400"} 
                                        alt={suite.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" /> 4.9
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-primary transition">
                                        {suite.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                                        <MapPin size={12} /> {suite.location}
                                    </p>

                                    {/* Fasilitas Mini */}
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">Wifi</span>
                                        <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">Pool</span>
                                        <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">AC</span>
                                    </div>

                                    <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-3">
                                        <div>
                                            <p className="text-xs text-gray-400">Harga per malam</p>
                                            <p className="text-lg font-bold text-primary">
                                                Rp {suite.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-primary group-hover:text-white transition">
                                            <ArrowRight size={18} />
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