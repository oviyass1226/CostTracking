const express = require('express');
const router = express.Router();
const { createCategory, getCategories, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createCategory).get(protect, getCategories);
router.route('/:id').delete(protect, deleteCategory);

module.exports = router;
