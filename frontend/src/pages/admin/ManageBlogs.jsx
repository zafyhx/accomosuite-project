import axios from "axios";
import {
  AlertCircle,
  Calendar,
  Edit,
  FileText,
  Image,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const ManageBlogs = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State untuk Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    content: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper Functions ---

  // 1. Get Token Helper
  const getAuthToken = () => {
    if (user && user.token) return user.token;
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return null;
      const parsed = JSON.parse(userInfo);
      return parsed.token || parsed.accessToken || parsed.authToken;
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      return null;
    }
  };

  // 2. Get Image URL Helper (FIX: Agar gambar muncul di Localhost & Live)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/600x400?text=No+Image";
    // Gunakan VITE_API_URL dari .env, fallback ke localhost jika tidak ada
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  // --- Main Logic ---

  // Fetch Data
  const fetchBlogs = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const { data } = await axios.get("/api/blogs");
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Gagal memuat artikel");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Preview lokal untuk file baru yang akan diupload
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Edit Click
  const handleEditClick = (blog) => {
    setIsEditMode(true);
    setEditId(blog._id || blog.id);
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: null, // Reset input file
    });
    // FIX: Set preview menggunakan gambar lama dari server
    // Cek apakah field di database 'imageUrl' atau 'image'
    setPreview(getImageUrl(blog.imageUrl || blog.image));
    setIsFormOpen(true);
    setError(null);
  };

  // Handle Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ title: "", category: "General", content: "", image: null });
    setPreview(null);
    setError(null);
  };

  // Handle Submit (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError("Anda harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`/api/blogs/${editId}`, data, config);
        alert("✅ Artikel berhasil diperbarui!");
      } else {
        await axios.post("/api/blogs", data, config);
        alert("✅ Artikel berhasil diterbitkan!");
      }

      handleCloseForm();
      fetchBlogs();
    } catch (error) {
      console.error("Submit error:", error.response || error);
      const msg = error.response?.data?.message || "Gagal menyimpan artikel.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;

    const token = getAuthToken();
    try {
      await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
      alert("✅ Artikel berhasil dihapus");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus artikel");
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in-down">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 text-sm underline mt-1 hover:text-red-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            Manajemen Artikel Blog
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola postingan blog dan berita terbaru.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => {
              handleCloseForm();
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition font-bold shadow-lg shadow-primary/30 active:scale-95"
          >
            <Plus size={20} /> Tulis Artikel
          </button>
        )}
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 animate-fade-in-down">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-700">
              {isEditMode ? "Edit Artikel" : "Buat Artikel Baru"}
            </h3>
            <button
              onClick={handleCloseForm}
              className="p-2 hover:bg-red-50 rounded-full transition"
            >
              <X className="text-gray-400 hover:text-red-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Judul Artikel
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="Judul artikel..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
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
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Konten
              </label>
              <textarea
                required
                name="content"
                rows="6"
                value={formData.content}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                placeholder="Isi artikel..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Gambar Cover
              </label>
              <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm flex items-center gap-2 text-gray-600 transition">
                  <Image size={18} />{" "}
                  {isEditMode ? "Ganti Gambar" : "Pilih Gambar"}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-16 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                ) : (
                  <span className="text-sm text-gray-400">
                    Belum ada gambar dipilih
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-dark disabled:opacity-70 shadow-lg shadow-primary/30 transition active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} /> Menyimpan...
                  </span>
                ) : isEditMode ? (
                  "Simpan Perubahan"
                ) : (
                  "Terbitkan Artikel"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {fetchLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6 min-w-[300px]">Artikel</th>
                  <th className="py-4 px-6 min-w-[150px]">Kategori</th>
                  <th className="py-4 px-6 min-w-[150px]">Tanggal</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id || blog._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-4">
                        {/* FIX: Preview Gambar di Tabel */}
                        {blog.imageUrl || blog.image ? (
                          <img
                            className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100"
                            // Cek kedua kemungkinan nama field: imageUrl atau image
                            src={getImageUrl(blog.imageUrl || blog.image)}
                            alt=""
                          />
                        ) : (
                          <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <Image size={20} />
                          </div>
                        )}
                        <div>
                          <div className="text-secondary font-bold text-base line-clamp-1">
                            {blog.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            Author: {blog.author || "Admin"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 align-middle">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {blog.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {new Date(blog.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(blog)}
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
                ))}

                {blogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <p className="font-medium">Belum ada artikel blog.</p>
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