import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Save, ArrowLeft, Upload, X, Loader2 } from "lucide-react";

// Halaman AddSuite dan EditSuite digabung menjadi satu komponen SuiteForm
const SuiteForm = () => {
  const { id } = useParams(); // Ambil ID dari URL (hanya ada di mode Edit)
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    type: "Hotel", // Default
    price: "",
    description: "",
    facilities: "", 
    location: "",
    capacity: 2, // Default
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(isEditMode); // Loading true hanya jika Edit Mode
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // LOGIC FIX BUG EDIT: Mengambil data lama jika Edit Mode
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
            // Mengubah array fasilitas menjadi string yang dipisah koma (untuk input)
            facilities: Array.isArray(data.facilities) ? data.facilities.join(", ") : data.facilities || "", 
            location: data.location || "",
            capacity: data.capacity || 2,
          });
          // Set preview gambar lama (asumsi hanya ada 1 gambar utama)
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

    // Validasi sederhana
    if (!isEditMode && !imageFile) {
        setError("Harap unggah gambar utama properti.");
        setIsSaving(false);
        return;
    }

    const data = new FormData();
    // Memecah string fasilitas menjadi array string
    const facilitiesArray = formData.facilities.split(',').map(f => f.trim()).filter(f => f.length > 0);
    
    // Menambahkan semua data ke FormData
    Object.keys(formData).forEach((key) => {
      // Kecuali facilities, kita kirim array
      if (key !== 'facilities') {
        data.append(key, formData[key]);
      }
    });
    // Menambahkan fasilitas sebagai array (atau string terpisah koma, backend yang tentukan)
    facilitiesArray.forEach(f => data.append('facilities', f));

    if (imageFile) {
      data.append("image", imageFile);
    }
    
    // Pastikan user.token tersedia
    if (!user || !user.token) {
        setError("Sesi admin berakhir. Silakan login ulang.");
        setIsSaving(false);
        return;
    }


    try {
      const config = { 
          headers: { 
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'multipart/form-data', // Penting untuk upload file
          } 
      };

      if (isEditMode) {
        // Mode EDIT (PUT)
        await axios.put(`/api/suites/${id}`, data, config);
        alert(`Suite '${formData.name}' berhasil diupdate!`);
      } else {
        // Mode TAMBAH (POST)
        await axios.post("/api/suites", data, config);
        alert(`Suite '${formData.name}' berhasil ditambahkan!`);
      }
      
      navigate("/admin/suites"); // Kembali ke daftar suite setelah sukses
    } catch (err) {
      console.error("Gagal menyimpan data:", err.response || err);
      setError("Gagal menyimpan data. Pastikan semua field terisi dan file gambar sesuai. Pesan Error: " + (err.response?.data?.message || err.message));
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
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm">
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
          <label className="block text-sm font-bold text-gray-700 mb-2">Fasilitas (Pisahkan dengan koma: WiFi, AC, Pool...) *</label>
          <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder="WiFi, AC, Pool, Breakfast" required
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