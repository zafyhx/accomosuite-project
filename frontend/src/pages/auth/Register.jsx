import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, Loader2 } from 'lucide-react'; // Gunakan Lucide React

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '' // Tambahkan field phone sesuai backend
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Panggil API register yang Anda buat di backend (asumsi: /api/auth/register)
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // Logika Sukses: Arahkan ke halaman login
            alert("Registrasi berhasil! Silakan login.");
            navigate('/login'); 

        } catch (err) {
            // Logika Gagal: Tampilkan pesan error dari backend (misal: Email sudah terdaftar)
            const errorMessage = err.response?.data?.message || 'Registrasi gagal. Coba cek koneksi server (Port 5000).';
            setError(errorMessage);
            console.error("Register failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 pb-10 font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-secondary">Buat Akun Baru</h2>
                    <p className="text-gray-500 mt-2">Daftar untuk mulai reservasi akomodasi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Field 1: Nama Lengkap */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                                placeholder="Nama Anda"
                                required
                            />
                        </div>
                    </div>

                    {/* Field 2: Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                                placeholder="email@contoh.com"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Field 3: Nomor Telepon */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon (Opsional)</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                                placeholder="0812..."
                            />
                        </div>
                    </div>

                    {/* Field 4: Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Pesan Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl
                            font-bold transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-primary/30"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={20}/> Mendaftar...</> : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Sudah punya akun? 
                        <Link to="/login" className="text-primary hover:underline font-semibold ml-1">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;