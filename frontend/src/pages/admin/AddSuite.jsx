import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Upload, MapPin } from "lucide-react";

const AddSuite = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState(""); 
  const [type, setType] = useState("Hotel");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location); 
    formData.append("type", type);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("facilities", facilities);
    formData.append("image", image);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post("/api/suites", formData, config);
      alert("Properti berhasil ditambahkan!");
      navigate("/admin/suites");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    // BUG FIX: Tambahkan 'pt-24' agar tidak ketutupan Navbar
    <div className="container mx-auto px-6 pt-24 pb-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-secondary mb-2">Tambah Properti Baru</h1>
        <p className="text-gray-500 mb-6 text-sm">Masukkan detail akomodasi yang ingin disewakan.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Judul Properti */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Properti</label>
            <input 
              type="text" required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
              placeholder="Contoh: Villa Karma Kandara"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Lokasi & Tipe (Grid 2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lokasi */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi Kota/Daerah</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                <input 
                  type="text" required 
                  className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                  placeholder="Contoh: Ubud, Bali"
                  value={location} onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Tipe Properti */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
              <select 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                value={type} onChange={(e) => setType(e.target.value)}
              >
                <option value="Hotel">Hotel</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Resort">Resort</option>
                <option value="House">House</option>
                <option value="Glamping">Glamping</option>
              </select>
            </div>
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Harga per Malam</label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-bold">Rp</span>
                <input 
                  type="number" required 
                  className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                  placeholder="0"
                  value={price} onChange={(e) => setPrice(e.target.value)}
                />
            </div>
          </div>

          {/* Fasilitas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Fasilitas Utama</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
              placeholder="Contoh: WiFi, Private Pool, Kitchen, Netflix"
              value={facilities} onChange={(e) => setFacilities(e.target.value)}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea 
              required rows="4"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50"
              placeholder="Ceritakan keunikan tempat ini..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Foto Utama</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition relative group cursor-pointer">
              <input 
                type="file" required 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center text-gray-500 group-hover:text-primary transition">
                <Upload size={40} className="mb-2"/>
                <span className="text-sm font-medium">
                  {image ? image.name : "Klik atau Geser foto ke sini"}
                </span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 2MB)</span>
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark shadow-primary/30'}`}
          >
            {loading ? "Sedang Menyimpan..." : "Terbitkan Properti"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddSuite;