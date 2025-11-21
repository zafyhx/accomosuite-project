import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Kirim data ke Backend
      const res = await axios.post("/api/auth/login", { email, password });
      
      // Jika sukses, simpan data user & token
      login(res.data);
      
      // Arahkan ke Dashboard (nanti kita buat)
      alert("Login Berhasil!");
      navigate("/"); // Kembali ke home dulu
      
    } catch (err) {
      setError(err.response?.data?.message || "Login Gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Masuk Accomosuite
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;