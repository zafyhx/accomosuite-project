import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ["All", "Travel Tips", "Destinations", "Hotel Reviews", "News"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
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
    // PADDING TOP (pt-20) AGAR TIDAK TERTUTUP NAVBAR
    <div className="bg-gray-50 min-h-screen pb-12 pt-20"> 
      
      {/* HERO SECTION YANG LEBIH TINGGI & LUAS */}
      <div className="relative bg-secondary text-white h-[50vh] min-h-[400px] flex items-center justify-center px-6 text-center mb-12">
        
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Overlay Gelap */}
           <img 
             src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
             alt="Blog Hero" 
             className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-[20s]"
           />
        </div>
        
        {/* Content (Tengah) */}
        <div className="relative z-20 max-w-4xl mx-auto space-y-4 animate-fade-in-up">
          <span className="text-primary font-bold tracking-widest uppercase text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            Blog & Inspirasi
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-sans leading-tight drop-shadow-lg">
            Travel Stories & Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md font-light">
            Temukan inspirasi perjalanan, tips akomodasi, dan berita terbaru eksklusif dari Accomosuite.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FILTER CATEGORIES */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                ${activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100">
                
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={blog.imageUrl && !blog.imageUrl.startsWith('http') 
                        ? `http://localhost:5000${blog.imageUrl}` 
                        : blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-extrabold text-gray-900 rounded-lg uppercase tracking-wider shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs font-medium text-gray-400 mb-4 space-x-4 uppercase tracking-wide">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      {new Date(blog.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      {blog.author || 'Admin'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </p>

                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="inline-flex items-center text-primary font-bold text-sm hover:text-primary-dark group-hover:translate-x-1 transition-all mt-auto"
                  >
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="inline-flex bg-gray-50 p-6 rounded-full mb-6">
               <Tag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada artikel</h3>
            <p className="text-gray-500">Silakan cek kembali nanti untuk update terbaru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;