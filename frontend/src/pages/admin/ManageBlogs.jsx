import { useState, useEffect, useContext } from "react";
import axios from "axios";
// Pastikan path import benar dan tanpa ekstensi .jsx jika bermasalah di build system tertentu
import { AuthContext } from "../../context/AuthContext";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Image as ImageIcon, 
  Loader2, 
  ArrowLeft, 
  Save, 
  Upload, 
  X,
  BookOpen,
  Calendar,
  User
} from "lucide-react";

const ManageBlogs = () => {
  // --- STATE UTAMA ---
  const [view, setView] = useState('list'); // 'list' atau 'form'
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE FORM ---
  const { user } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Data Form Default
  const initialFormState = { title: "", category: "General", content: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // --- 1. LOGIC FETCH DATA (READ) ---
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/blogs");
      setBlogs(data);
    } catch (error) {
      console.error("Gagal ambil blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // --- 2. LOGIC HAPUS (DELETE) ---
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        // Ambil token aman
        const token = user?.token || (localStorage.getItem("userInfo") 
          ? JSON.parse(localStorage.getItem("userInfo")).token 
          : null);

        if (!token) {
           alert("Sesi kadaluarsa. Silakan login ulang.");
           return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/blogs/${id}`, config);
        fetchBlogs();
      } catch (error) {
        alert("Gagal menghapus: " + (error.response?.data?.message || "Server Error"));
      }
    }
  };

  // --- 3. LOGIC FORM HANDLERS ---
  const handleAddNew = () => {
    setFormData(initialFormState);
    setPreview(null);
    setImageFile(null);
    setIsEditMode(false);
    setEditId(null);
    setError(null);
    setView('form');
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content
    });
    // Gunakan URL gambar dari backend jika ada
    setPreview(blog.imageUrl ? blog.imageUrl : null); 
    setImageFile(null);
    setIsEditMode(true);
    setEditId(blog.id || blog._id); 
    setError(null);
    setView('form');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Ambil token secara aman (Prioritas: Context -> LocalStorage)
    const token = user?.token || (localStorage.getItem("userInfo") 
        ? JSON.parse(localStorage.getItem("userInfo")).token 
        : null);

    if (!token) {
        setError("Token tidak valid atau sesi berakhir. Silakan Logout dan Login ulang.");
        setIsSaving(false);
        return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (imageFile) data.append('image', imageFile);

    try {
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Token yang sudah dipastikan ada
        }
      };

      if (isEditMode) {
        await axios.put(`/api/blogs/${editId}`, data, config);
      } else {
        await axios.post('/api/blogs', data, config);
      }

      fetchBlogs(); // Refresh list
      setView('list'); // Kembali ke tabel
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menyimpan artikel. Cek koneksi atau login ulang.");
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // TAMPILAN 1: FORM (Mirip SuiteForm)
  // ==========================================
  if (view === 'form') {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
        {/* Header Form */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView('list')} 
            className="p-2 hover:bg-gray-100 rounded-full transition active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h2 className="text-2xl font-bold text-secondary">
            {isEditMode ? "Edit Artikel" : "Tulis Artikel Baru"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Gambar (Style Dashed) */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center relative hover:bg-gray-50 transition bg-gray-50/50">
            {preview ? (
              <div className="relative h-64 w-full group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                   <button 
                      type="button"
                      onClick={() => { setPreview(null); setImageFile(null); }}
                      className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 transition flex items-center gap-2"
                   >
                      <X size={16}/> Hapus Gambar
                   </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3 py-8">
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-2">
                  <Upload size={32} />
                </div>
                <span className="text-gray-700 font-bold text-lg">Upload Cover Artikel</span>
                <span className="text-gray-400 text-sm">Format: JPG, PNG, WEBP (Max 5MB)</span>
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel *</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required
                placeholder="Contoh: 5 Tips Liburan Hemat..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori *</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white transition"
              >
                <option>General</option>
                <option>Travel Tips</option>
                <option>Destinations</option>
                <option>Hotel Reviews</option>
                <option>News</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Konten Artikel *</label>
            <textarea 
              rows="10" 
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})} 
              required
              placeholder="Mulai menulis cerita anda di sini..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition leading-relaxed" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <><Loader2 size={20} className="animate-spin"/> Menyimpan...</> : <><Save size={20}/> {isEditMode ? 'Update Artikel' : 'Terbitkan Artikel'}</>}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: LIST / TABLE (Mirip ManageSuites)
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Manajemen Blog</h1>
          <p className="text-gray-500 text-sm">Buat dan kelola artikel berita atau tips untuk user.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition font-bold shadow-lg shadow-primary/30 active:scale-95"
        >
          <Plus size={20} /> Tulis Artikel
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6 min-w-[80px]">Cover</th>
                  <th className="py-4 px-6 min-w-[250px]">Judul & Kategori</th>
                  <th className="py-4 px-6 min-w-[150px]">Info Penulis</th>
                  <th className="py-4 px-6 min-w-[100px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog.id || blog._id} className="hover:bg-gray-50 transition group">
                      <td className="py-4 px-6 align-middle">
                        {blog.imageUrl ? (
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100 group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-secondary font-bold text-base line-clamp-1 mb-1">{blog.title}</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                          ${blog.category === 'News' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            blog.category === 'Travel Tips' ? 'bg-green-50 text-green-700 border-green-100' : 
                            'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                          {blog.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                             <User size={12} /> {blog.author || 'Admin'}
                          </div>
                          <div className="flex items-center gap-1">
                             <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(blog)}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition active:scale-95"
                            title="Edit Artikel"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(blog.id || blog._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition active:scale-95"
                            title="Hapus Artikel"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <BookOpen size={32} className="text-gray-400"/>
                        </div>
                        <p className="font-medium">Belum ada artikel blog.</p>
                        <p className="text-sm mt-1">Mulai tulis artikel untuk menarik pengunjung.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;