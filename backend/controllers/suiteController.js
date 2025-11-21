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
    const { name, type, price, description, facilities } = req.body;
    
    // Ambil path gambar jika ada yang diupload
    const image = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : ''; 
    // (.replace itu fix bug path miring di Windows)

    const suite = new Suite({
      name,
      type,
      price,
      description,
      facilities: facilities ? facilities.split(',') : [], // Ubah "WiFi,AC" jadi ["WiFi", "AC"]
      images: [image], // Sementara 1 gambar dulu biar simpel
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

module.exports = { getSuites, getSuiteById, createSuite, deleteSuite };