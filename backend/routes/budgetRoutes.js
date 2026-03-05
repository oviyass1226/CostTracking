const express = require('express');
const router = express.Router();
const { createBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBudget).get(protect, getBudgets);
router.route('/:id').delete(protect, deleteBudget);

module.exports = router;
