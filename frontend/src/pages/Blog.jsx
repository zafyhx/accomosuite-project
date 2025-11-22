import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'; // Pastikan install lucide-react

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Kategori statis untuk filter (bisa disesuaikan)
  const categories = ["All", "Travel Tips", "Destinations", "Hotel Reviews", "News"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Mengambil data dari backend yang baru kita buat
        // Sesuaikan URL jika backend Anda running di port berbeda
        // Nanti bisa diganti dengan instance axios yang sudah dikonfigurasi
        const { data } = await axios.get('/api/blogs'); 
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter logika
  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* 1. HERO SECTION - Mengadopsi gaya 'Travel Stories' */}
      <div className="relative bg-secondary text-white py-20 px-6 text-center mb-10">
        <div className="absolute inset-0 overflow-hidden">
           {/* Background pattern atau image gelap */}
           <div className="absolute inset-0 bg-black opacity-50"></div>
           <img 
             src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
             alt="Blog Hero" 
             className="w-full h-full object-cover"
           />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans">Travel Stories & Insights</h1>
          <p className="text-lg text-gray-200">
            Temukan inspirasi perjalanan, tips akomodasi, dan berita terbaru dari Accomosuite.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 
                ${activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. BLOG GRID */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col h-full">
                
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-primary rounded-full uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {blog.author || 'Admin'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {/* Menghilangkan tag HTML sederhana untuk preview */}
                    {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </p>

                  <Link 
                    to={`/blog/${blog.id}`} 
                    className="inline-flex items-center text-primary font-semibold text-sm hover:underline mt-auto"
                  >
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
               <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada artikel</h3>
            <p className="text-gray-500">Coba pilih kategori lain atau kembali lagi nanti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;