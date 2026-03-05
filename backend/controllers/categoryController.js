const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    const { name, type } = req.body;
    try {
        const categoryId = await Category.create(req.user.id, name, type);
        res.status(201).json({ id: categoryId, name, type });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.getAll(req.user.id);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result = await Category.delete(req.params.id, req.user.id);
        if (result > 0) {
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
