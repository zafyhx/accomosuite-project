import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Sesuaikan path

/**
 * Komponen untuk melindungi rute dari akses yang tidak sah.
 * @param {object} props
 * @param {React.ReactNode} props.children - Komponen yang akan dirender jika terotorisasi.
 * @param {boolean} [props.adminOnly=false] - Jika true, hanya role 'admin' yang boleh masuk.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Ambil user dari Context
  const { user, loading } = useContext(AuthContext);

  // Jika loading, tampilkan indikator 
  if (loading) {
    return <div className="text-center py-20 text-gray-500">Memuat sesi...</div>;
  }
  
  // 1. Cek apakah user sudah login
  if (!user || !user.token) {
    // Jika tidak login, alihkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // 2. Cek jika rute ini HANYA untuk Admin
  if (adminOnly && user.role !== 'admin') {
    // Jika user bukan admin tapi mencoba akses rute admin
    alert("Akses ditolak. Anda tidak memiliki hak akses Admin.");
    // Alihkan ke halaman utama (Home)
    return <Navigate to="/" replace />;
  }

  // 3. Jika semua cek lolos, tampilkan komponen anak (rute yang dituju)
  return children;
};

export default ProtectedRoute;