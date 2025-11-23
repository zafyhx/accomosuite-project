const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Ambil semua user tapi jangan kirim passwordnya
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus user' });
  }
};

// @desc    Update user role (User <-> Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    // 1. Cari user dulu untuk tahu role sekarang
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // 2. Tentukan role baru (Toggle)
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    // 3. Update langsung di Database (Bypass validasi password/middleware)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true } // Opsi ini agar yang dikembalikan adalah data setelah update
    ).select('-password'); // Jangan kirim balik password

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });

  } catch (error) {
    console.error("Backend Error:", error.message); // Cek terminal backend untuk detail
    res.status(500).json({ message: 'Gagal update role user: ' + error.message });
  }
};

module.exports = { getAllUsers, deleteUser, updateUserRole };