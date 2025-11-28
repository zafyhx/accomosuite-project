import axios from "axios";
import { Loader2, Lock, Mail } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Kirim data ke Backend
      const res = await axios.post("/api/auth/login", { email, password });

      // Jika sukses, simpan data user & token
      login(res.data);

      // Arahkan ke Dashboard
      alert("Login Berhasil!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Gagal. Coba cek koneksi server."
      );
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 pb-10 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">
            Masuk Accomosuite
          </h2>
          <p className="text-gray-500 mt-2">
            Login untuk mengelola reservasi Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 transition"
                placeholder="email@contoh.com"
                required
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Masuk...
              </>
            ) : (
              "Login Sekarang"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Belum punya akun?
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold ml-1"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
