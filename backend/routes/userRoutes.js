const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Semua route di bawah ini dilindungi (Harus Login & Harus Admin)
router.use(protect);
router.use(admin);

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);

module.exports = router;