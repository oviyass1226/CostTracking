const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense, getTotalExpenses, getMonthlyExpenses, getCategorySummary } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createExpense).get(protect, getExpenses);
router.route('/monthly').get(protect, getMonthlyExpenses);
router.route('/category-summary').get(protect, getCategorySummary);
router.route('/total').get(protect, getTotalExpenses);
router.route('/:id').delete(protect, deleteExpense);

module.exports = router;
