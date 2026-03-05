const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
    const { category_id, amount, month, year } = req.body;
    try {
        const budgetId = await Budget.create(req.user.id, category_id, amount, month, year);
        res.status(201).json({ id: budgetId, category_id, amount, month, year });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getBudgets = async (req, res) => {
    const { month, year } = req.query;
    try {
        const budgets = await Budget.get(req.user.id, month, year);
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const result = await Budget.delete(req.params.id, req.user.id);
        if (result > 0) {
            res.json({ message: 'Budget removed' });
        } else {
            res.status(404).json({ message: 'Budget not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
