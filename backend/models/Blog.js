const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul artikel tidak boleh kosong'],
  },
  content: {
    type: String,
    required: [true, 'Konten artikel tidak boleh kosong'],
  },
  author: {
    type: String,
    default: 'Admin',
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/800x400.png?text=No+Image',
  },
  category: {
    type: String,
    required: true,
    default: 'General',
  }
}, {
  timestamps: true // Ini otomatis membuat field createdAt dan updatedAt
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;