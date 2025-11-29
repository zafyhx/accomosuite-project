import axios from "axios";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- IMAGE FIXER HELPER ---
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x400?text=Accomosuite+Blog";
    // Jika path sudah ada http (link online), pakai itu.
    // Jika tidak, gabungkan dengan URL Railway/Localhost.
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };
  // --------------------------

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        // Cek ID di console untuk debugging
        console.log("Fetching Blog ID:", id);
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError("Artikel tidak ditemukan atau terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlogDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center py-20 text-red-500">{error}</div>
      </div>
    );
  if (!blog) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 md:h-96 w-full">
          <img
            src={getImageUrl(blog.imageUrl)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-medium text-gray-800 hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
              <Tag className="w-4 h-4 mr-2" /> {blog.category}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(blog.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {blog.author || "Admin"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {blog.title}
          </h1>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            // Menggunakan dangerouslySetInnerHTML untuk merender konten HTML yang mungkin ada
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>

          <hr className="my-12 border-gray-200" />

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-600 italic">
              "Terima kasih telah membaca artikel ini. Jelajahi akomodasi
              terbaik kami untuk pengalaman liburan tak terlupakan."
            </p>
            <Link
              to="/"
              className="inline-block mt-4 text-primary font-semibold hover:underline"
            >
              Cari Akomodasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;