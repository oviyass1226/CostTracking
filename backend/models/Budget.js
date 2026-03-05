const db = require('../config/db');

class Budget {
    static async create(userId, categoryId, amount, month, year) {
        const [result] = await db.execute(
            'INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryId, amount, month, year]
        );
        return result.insertId;
    }

    static async get(userId, month, year) {
        const [rows] = await db.execute(
            'SELECT b.*, c.name as category_name FROM budgets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.user_id = ? AND b.month = ? AND b.year = ?',
            [userId, month, year]
        );
        return rows;
    }

    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }
}

module.exports = Budget;
