import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
  User, // Import icon User untuk field nama
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CheckIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  
  // Update State: Tambahkan identityName
  const [formData, setFormData] = useState({
    identityName: "", // Field baru
    identityNumber: "",
    arrivalTime: "",
    idCardImage: null,
  });
  const [preview, setPreview] = useState(null);

  // 1. Ambil detail booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token =
          user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
        const { data } = await axios.get("/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentBooking = data.find((b) => b._id === id);
        if (currentBooking) {
          setBooking(currentBooking);
          // Opsional: Pre-fill nama dari akun user jika ingin memudahkan
          setFormData(prev => ({ ...prev, identityName: user?.name || "" }));
        } else {
          alert("Booking tidak ditemukan");
          navigate("/my-bookings");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooking();
  }, [id, user, navigate]);

  // Handle File
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, idCardImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    // Append field baru ke payload
    formPayload.append("identityName", formData.identityName);
    formPayload.append("identityNumber", formData.identityNumber);
    formPayload.append("arrivalTime", formData.arrivalTime);
    formPayload.append("idCardImage", formData.idCardImage);

    try {
      const token =
        user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
      await axios.put(`/api/bookings/${id}/check-in`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Check-in Berhasil! Selamat menikmati masa inap Anda.");
      navigate("/my-bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal Check-in");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return (
    <div className="min-h-screen pt-32 flex justify-center items-center">
      <Loader2 className="animate-spin text-primary" /> Memuat data...
    </div>
  );

  return (
    // Container utama dengan padding-top agar tidak tertutup navbar fixed
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Biru */}
        <div className="bg-primary p-6 text-white flex items-center gap-4 shadow-md relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Check-in Online</h1>
        </div>

        <div className="p-8">
          {/* Card Detail Reservasi */}
          <div className="mb-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-primary"/> Detail Reservasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-xl border border-blue-50">
                <p className="text-gray-500 text-xs mb-1">Properti</p>
                <span className="font-bold text-gray-800 line-clamp-1">
                  {booking.suite?.name}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-50">
                <p className="text-gray-500 text-xs mb-1">Total Biaya</p>
                <span className="font-bold text-primary text-lg">
                  Rp {booking.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nama Identitas (BARU) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama Sesuai Identitas
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  required
                  className="w-full pl-12 p-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Nama Lengkap (Sesuai KTP/Paspor)"
                  value={formData.identityName}
                  onChange={(e) =>
                    setFormData({ ...formData, identityName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Input NIK */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nomor Identitas (KTP/SIM/Paspor)
              </label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  required
                  className="w-full pl-12 p-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Contoh: 3201xxxxxxxxxxxx"
                  value={formData.identityNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, identityNumber: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Input Jam */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Estimasi Jam Kedatangan
              </label>
              <div className="relative group">
                <Clock
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type="time"
                  required
                  className="w-full pl-12 p-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                  value={formData.arrivalTime}
                  onChange={(e) =>
                    setFormData({ ...formData, arrivalTime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Foto Identitas
              </label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group
                  ${preview 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
                  }`}
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="KTP Preview"
                      className="h-48 mx-auto object-contain rounded-lg shadow-md bg-white p-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, idCardImage: null });
                      }}
                      className="mt-4 text-red-500 text-sm font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                      Hapus & Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block w-full h-full">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="text-primary" size={28} />
                    </div>
                    <span className="text-gray-900 font-bold text-lg block mb-1">
                      Klik untuk upload
                    </span>
                    <p className="text-sm text-gray-500">
                      Format JPG atau PNG (Max 5MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="fill-white text-primary" /> Konfirmasi Check-in
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;