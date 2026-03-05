const db = require('../config/db');

exports.getMonthlyReport = async (req, res) => {
    const { month, year } = req.query;
    try {
        // Total expenses for the month
        const [totalRows] = await db.execute(
            'SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?',
            [req.user.id, month, year]
        );

        // Expenses by category with budget comparison
        const query = `
            SELECT 
                c.name, 
                SUM(e.amount) as total_spent, 
                b.amount as budget_limit,
                (b.amount - IFNULL(SUM(e.amount), 0)) as remaining_budget
            FROM categories c
            LEFT JOIN expenses e ON c.id = e.category_id AND MONTH(e.date) = ? AND YEAR(e.date) = ? AND e.user_id = ?
            LEFT JOIN budgets b ON c.id = b.category_id AND b.month = ? AND b.year = ? AND b.user_id = ?
            WHERE c.user_id = ?
            GROUP BY c.id, c.name, b.amount
        `;

        const [categoryRows] = await db.execute(query, [month, year, req.user.id, month, year, req.user.id, req.user.id]);

        // Calculate total budget and total remaining
        const totalBudget = categoryRows.reduce((acc, row) => acc + (Number(row.budget_limit) || 0), 0);
        const totalSpent = totalRows[0].total || 0;
        const totalRemaining = totalBudget - totalSpent;

        res.json({
            total_spent: totalSpent,
            total_budget: totalBudget,
            total_remaining: totalRemaining,
            byCategory: categoryRows
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
