import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        setError("Artikel tidak ditemukan atau terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header Image */}
        <div className="relative h-64 md:h-96 w-full">
          <img 
            src={blog.imageUrl} 
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
              {new Date(blog.createdAt).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {blog.author || 'Admin'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {blog.title}
          </h1>

          {/* Render Text with Line Breaks */}
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {blog.content}
          </div>

          {/* Divider */}
          <hr className="my-12 border-gray-200" />

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-600 italic">
              "Terima kasih telah membaca artikel ini. Jelajahi akomodasi terbaik kami untuk pengalaman liburan tak terlupakan."
            </p>
            <Link to="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
              Cari Akomodasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;