const Log = require("../models/Log");

// --- FUNGSI HELPER (Internal Use) ---
// Fungsi ini akan dipanggil oleh controller lain (User, Booking, Suite)
const addLog = async (actorId, action, description, entityId = null) => {
  try {
    await Log.create({
      actor: actorId,
      action,
      description,
      entityId,
    });
  } catch (error) {
    console.error("Gagal mencatat log:", error);
    // Jangan throw error agar tidak mengganggu proses utama
  }
};

// --- FUNGSI API (Untuk Dashboard) ---

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({})
      .populate("actor", "name email role") // Ambil nama admin
      .sort({ createdAt: -1 }) // Paling baru di atas
      .limit(100); // Batasi 100 log terakhir agar ringan

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil log aktivitas" });
  }
};

module.exports = { getLogs, addLog };
