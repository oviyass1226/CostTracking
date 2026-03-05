const db = require('../config/db');

class Expense {
    static async create(userId, categoryId, amount, description, date) {
        const [result] = await db.execute(
            'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryId, amount, description, date]
        );
        return result.insertId;
    }

    static async getAll(userId) {
        const [rows] = await db.execute(
            'SELECT e.*, c.name as category_name FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY date DESC',
            [userId]
        );
        return rows;
    }

    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }

    static async getTotal(userId) {
        const [rows] = await db.execute('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?', [userId]);
        return rows[0].total || 0;
    }
}

module.exports = Expense;
