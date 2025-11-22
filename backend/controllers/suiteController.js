const Suite = require('../models/Suite');

// @desc    Ambil Semua Data Suite (Untuk Halaman Depan User)
// @route   GET /api/suites
// @access  Public
const getSuites = async (req, res) => {
  try {
    const suites = await Suite.find({});
    res.json(suites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil 1 Suite Detail
// @route   GET /api/suites/:id
// @access  Public
const getSuiteById = async (req, res) => {
  try {
    const suite = await Suite.findById(req.params.id);
    if (suite) {
      res.json(suite);
    } else {
      res.status(404).json({ message: 'Suite tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tambah Suite Baru (Khusus Admin)
// @route   POST /api/suites
// @access  Private/Admin
const createSuite = async (req, res) => {
  try {
    //Ambil 'location' dari input user
    const { name, location, type, price, description, facilities } = req.body;
    
    const image = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : ''; 

    const suite = new Suite({
      name,
      location, // BARU: Simpan lokasi ke database
      type,
      price,
      description,
      facilities: facilities ? facilities.split(',') : [],
      images: [image],
      status: 'available'
    });

    const createdSuite = await suite.save();
    res.status(201).json(createdSuite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hapus Suite (Khusus Admin)
// @route   DELETE /api/suites/:id
// @access  Private/Admin
const deleteSuite = async (req, res) => {
  try {
    const suite = await Suite.findById(req.params.id);

    if (suite) {
      await suite.deleteOne();
      res.json({ message: 'Suite berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Suite tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Suite (Khusus Admin)
// @route   PUT /api/suites/:id
// @access  Private/Admin
const updateSuite = async (req, res) => {
  try {
    const suite = await Suite.findById(req.params.id);

    if (suite) {
      // 1. Ambil data dari body
      const { name, location, type, price, description, facilities, capacity } = req.body;
      
      // 2. Cek jika ada file gambar baru yang diupload
      if (req.file) {
        // Jika ada, ganti gambar lama dengan yang baru
        suite.images = [`/${req.file.path.replace(/\\/g, "/")}`];
      }
      
      // 3. Update field-field
      suite.name = name || suite.name;
      suite.location = location || suite.location;
      suite.type = type || suite.type;
      suite.price = price || suite.price;
      suite.description = description || suite.description;
      suite.capacity = capacity || suite.capacity;

      // Fasilitas: Perlu parsing karena dikirim sebagai string array
      if (facilities) {
          // Asumsi fasilitas dikirim sebagai array string (dari FormData di frontend)
          suite.facilities = Array.isArray(facilities) ? facilities.map(f => f.trim()) : facilities.split(',').map(f => f.trim());
      } else {
          // Jika fasilitas dikosongkan
          suite.facilities = [];
      }

      const updatedSuite = await suite.save();
      res.json(updatedSuite);

    } else {
      res.status(404).json({ message: 'Suite tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSuites, getSuiteById, createSuite, deleteSuite, updateSuite };