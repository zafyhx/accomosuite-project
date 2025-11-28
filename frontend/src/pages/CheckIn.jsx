import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
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
  const [formData, setFormData] = useState({
    identityNumber: "",
    arrivalTime: "",
    idCardImage: null,
  });
  const [preview, setPreview] = useState(null);

  // 1. Ambil detail booking dulu untuk memastikan valid
  useEffect(() => {
    // Kita bisa pakai endpoint getMyBookings lalu filter, atau buat endpoint detail khusus.
    // Untuk simpelnya, kita asumsikan user datang dari halaman MyBookings yang membawa state,
    // Tapi best practice-nya fetch ulang. Kita fetch ulang list user dan cari ID-nya.
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

  if (!booking) return <div className="p-20 text-center">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-white flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Check-in Online</h1>
        </div>

        <div className="p-8">
          <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-secondary mb-2">Detail Reservasi</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                Properti:{" "}
                <span className="font-bold text-gray-800">
                  {booking.suite?.name}
                </span>
              </p>
              <p>
                Total:{" "}
                <span className="font-bold text-primary">
                  Rp {booking.totalPrice?.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nomor Identitas (KTP/SIM/Paspor)
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Masukkan nomor NIK atau Paspor"
                  value={formData.identityNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, identityNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Estimasi Jam Kedatangan
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="time"
                  required
                  className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  value={formData.arrivalTime}
                  onChange={(e) =>
                    setFormData({ ...formData, arrivalTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Foto Identitas
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="KTP Preview"
                      className="h-40 mx-auto object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, idCardImage: null });
                      }}
                      className="text-red-500 text-sm mt-2 font-bold"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <span className="text-primary font-bold">
                      Klik untuk upload
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG (Max 5MB)
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
              Konfirmasi Check-in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
