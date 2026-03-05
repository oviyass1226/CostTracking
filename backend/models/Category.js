const db = require('../config/db');

class Category {
    static async create(userId, name, type) {
        const [result] = await db.execute(
            'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
            [userId, name, type]
        );
        return result.insertId;
    }

    static async getAll(userId) {
        const [rows] = await db.execute('SELECT * FROM categories WHERE user_id = ?', [userId]);
        return rows;
    }

    static async delete(id, userId) {
        const [result] = await db.execute('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows;
    }
}

module.exports = Category;
