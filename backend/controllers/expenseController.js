const Expense = require('../models/Expense');
const db = require('../config/db');

exports.createExpense = async (req, res) => {
    const { category_id, amount, description, date } = req.body;
    try {
        const parts = typeof date === 'string' ? date.split('T')[0].split('-') : [];
        const year = parts.length === 3 ? parseInt(parts[0], 10) : new Date(date).getFullYear();
        const month = parts.length === 3 ? parseInt(parts[1], 10) : new Date(date).getMonth() + 1;

        const [budgetRows] = await db.execute(
            'SELECT id FROM budgets WHERE user_id = ? AND category_id = ? AND month = ? AND year = ?',
            [req.user.id, category_id, month, year]
        );

        console.log(`[DEBUG] createExpense - userId: ${req.user.id}, category: ${category_id}, date: ${date}, parsed month: ${month}, year: ${year}, budgetFound: ${budgetRows.length > 0}`);

        if (budgetRows.length === 0) {
            return res.status(400).json({ message: 'Please set a budget for this category before adding an expense for this period' });
        }

        const expenseId = await Expense.create(req.user.id, category_id, amount, description, date);
        res.status(201).json({ id: expenseId, category_id, amount, description, date });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.getAll(req.user.id);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const result = await Expense.delete(req.params.id, req.user.id);
        if (result > 0) {
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getTotalExpenses = async (req, res) => {
    try {
        const total = await Expense.getTotal(req.user.id);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getMonthlyExpenses = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ message: 'Please provide month and year' });
    }
    try {
        const [rows] = await db.execute(
            'SELECT e.*, c.name as category_name FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? AND MONTH(e.date) = ? AND YEAR(e.date) = ? ORDER BY date DESC',
            [req.user.id, month, year]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getCategorySummary = async (req, res) => {
    const { month, year } = req.query;
    let query = 'SELECT c.name, SUM(e.amount) as total FROM expenses e JOIN categories c ON e.category_id = c.id WHERE e.user_id = ?';
    let params = [req.user.id];

    if (month && year) {
        query += ' AND MONTH(e.date) = ? AND YEAR(e.date) = ?';
        params.push(month, year);
    }

    query += ' GROUP BY c.name';

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
