import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// Pastikan path import ini benar sesuai struktur folder Anda
import { AuthContext } from "../../context/AuthContext.jsx"; 
import { Save, ArrowLeft, Upload, X, Loader2 } from "lucide-react";

const SuiteForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    type: "Hotel", 
    price: "",
    description: "",
    facilities: "", 
    location: "",
    capacity: 2, 
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(isEditMode); 
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // LOGIC FETCH DATA UNTUK EDIT
  useEffect(() => {
    if (isEditMode) {
      const fetchSuite = async () => {
        try {
          const { data } = await axios.get(`/api/suites/${id}`);
          
          setFormData({
            name: data.name || "",
            type: data.type || "Hotel",
            price: data.price || "",
            description: data.description || "",
            // Ubah array fasilitas dari DB menjadi string untuk ditampilkan di input
            facilities: Array.isArray(data.facilities) 
              ? data.facilities.join(", ") 
              : (data.facilities || ""), 
            location: data.location || "",
            capacity: data.capacity || 2,
          });
          
          if (data.images && data.images.length > 0) {
            setPreview(`http://localhost:5000${data.images[0]}`);
          }
        } catch (error) {
          setError("Gagal mengambil data suite: " + (error.response?.data?.message || ""));
        } finally {
          setLoading(false);
        }
      };
      fetchSuite();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validasi gambar wajib jika tambah baru
    if (!isEditMode && !imageFile) {
        setError("Harap unggah gambar utama properti.");
        setIsSaving(false);
        return;
    }

    const data = new FormData();
    
    // 1. Masukkan data text biasa
    Object.keys(formData).forEach((key) => {
      if (key !== 'facilities') {
        data.append(key, formData[key]);
      }
    });

    // 2. FIX: PERBAIKAN LOGIKA FASILITAS
    // Backend mengharapkan String agar bisa di-split.
    // Jadi kita kirim string mentah saja, jangan dipecah jadi array di sini.
    const facilitiesString = String(formData.facilities || "").trim();
    data.append('facilities', facilitiesString);

    // 3. Masukkan File Gambar
    if (imageFile) {
      data.append("image", imageFile);
    }
    
    // Ambil token
    const token = localStorage.getItem("userInfo") 
        ? JSON.parse(localStorage.getItem("userInfo")).token 
        : (user?.token || null);

    if (!token) {
        setError("Sesi admin berakhir. Silakan login ulang.");
        setIsSaving(false);
        return;
    }

    try {
      const config = { 
          headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
          } 
      };

      if (isEditMode) {
        await axios.put(`/api/suites/${id}`, data, config);
        alert(`Suite '${formData.name}' berhasil diupdate!`);
      } else {
        await axios.post("/api/suites", data, config);
        alert(`Suite '${formData.name}' berhasil ditambahkan!`);
      }
      
      navigate("/admin/suites");
    } catch (err) {
      console.error("Gagal menyimpan data:", err.response || err);
      // Menampilkan pesan error detail dari backend
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Gagal menyimpan data. Server merespon: ${serverMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin text-primary w-8 h-8 mx-auto" /> <p className="text-gray-600 mt-3">Memuat data suite...</p></div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition active:scale-95">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <h2 className="text-2xl font-bold text-secondary">
          {isEditMode ? "Edit Properti: " + formData.name : "Tambah Properti Baru"}
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload Gambar */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center relative hover:bg-gray-50 transition">
          {preview ? (
            <div className="relative h-64 w-full">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              <button 
                type="button"
                onClick={() => { setPreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
              >
                <X size={16}/>
              </button>
              {isEditMode && <p className="text-xs text-gray-500 mt-2">Ganti gambar (Opsional)</p>}
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <div className="bg-primary/20 p-4 rounded-full text-primary">
                <Upload size={24} />
              </div>
              <span className="text-gray-500 font-medium">Klik untuk upload foto utama *</span>
              <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
          )}
        </div>

        {/* Input Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Suite *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tipe *</label>
            <select name="type" value={formData.type} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white transition">
              <option value="Hotel">Hotel Room</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Harga (per malam) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kapasitas (Orang) *</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required
              min="1" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi *</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Fasilitas (Pisahkan dengan koma) *</label>
          <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Contoh: WiFi, AC, Pool, Breakfast" required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi *</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" />
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <><Loader2 size={20} className="animate-spin"/> Menyimpan...</> : <><Save size={20}/> {isEditMode ? 'Update Properti' : 'Tambah Properti'}</>}
        </button>
      </form>
    </div>
  );
};

export default SuiteForm;