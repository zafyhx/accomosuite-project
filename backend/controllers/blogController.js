const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// 1. Ambil Semua Blog
const getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {}; // Query kosong (ambil semua)

    if (category && category !== 'All') {
      query = { category };
    }

    // .find() adalah syntax Mongoose
    const blogs = await Blog.find(query).sort({ createdAt: -1 }); // -1 artinya descending (terbaru diatas)
    
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data blog", error: error.message });
  }
};

// 2. Ambil Detail Blog
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Tambah Blog Baru
const createBlog = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    
    let imageUrl = 'https://via.placeholder.com/800x400.png?text=No+Image';
    if (req.file) {
      // Simpan path gambar (sesuaikan path separator untuk Windows/Linux aman)
      imageUrl = `/uploads/${req.file.filename}`; 
    }

    const newBlog = await Blog.create({
      title,
      content,
      category,
      author: author || 'Admin',
      imageUrl
    });

    res.status(201).json({ message: "Artikel berhasil diterbitkan", data: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat artikel", error: error.message });
  }
};

// 4. Update Blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;
    blog.author = req.body.author || blog.author;

    if (req.file) {
      // Logic hapus gambar lama bisa ditambahkan disini jika mau
      blog.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    res.status(200).json({ message: "Artikel berhasil diupdate", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Gagal update artikel", error: error.message });
  }
};

// 5. Hapus Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    // Hapus file fisik jika ada dan bukan placeholder
    if (blog.imageUrl && !blog.imageUrl.startsWith('http')) {
        // __dirname ada di controllers, naik 2 level ke root backend
        const filePath = path.join(__dirname, '../../', blog.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    // Syntax hapus di Mongoose terbaru
    await Blog.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus artikel", error: error.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };