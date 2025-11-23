const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Route Umum (Hanya butuh Login)
router.put('/profile', protect, updateUserProfile);

// 2. Middleware Admin (Membentengi route di bawahnya)
router.use(protect);
router.use(admin);

// 3. Route Khusus Admin
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);

module.exports = router;