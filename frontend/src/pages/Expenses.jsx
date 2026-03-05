import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Expenses = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    // New Category State
    const [newCategory, setNewCategory] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expensesRes, categoriesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/categories')
            ]);
            setExpenses(expensesRes.data);
            setCategories(categoriesRes.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            const res = await api.post('/categories', { name: newCategory, type: 'expense' });
            setCategories([...categories, res.data]);
            setFormData({ ...formData, category_id: res.data.id });
            setNewCategory('');
            setShowCategoryInput(false);
        } catch (err) {
            alert('Failed to add category');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/expenses', formData);
            setExpenses([res.data, ...expenses]);
            setFormData({ ...formData, amount: '', description: '' });
        } catch (err) {
            alert('Failed to add expense');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (err) {
            alert('Failed to delete expense');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="card md:col-span-1 h-fit">
                <h3 className="text-xl font-bold mb-4">Add Expense</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            className="input-field"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="input-field"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            className="input-field"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <div className="flex gap-2">
                            <select
                                name="category_id"
                                className="input-field"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => setShowCategoryInput(!showCategoryInput)} className="btn-primary w-auto px-3">+</button>
                        </div>
                        {showCategoryInput && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="New Category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button type="button" onClick={handleAddCategory} className="btn-primary w-auto">Add</button>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn-primary">Add Expense</button>
                </form>
            </div>

            <div className="card md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Expenses</h3>
                    <input
                        type="date"
                        className="input-field w-auto"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-2">Date</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Description</th>
                                <th className="p-2 text-right">Amount</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.filter(e => !filterDate || e.date.startsWith(filterDate)).map(expense => (
                                <tr key={expense.id} className="border-b border-gray-800 hover:bg-gray-800">
                                    <td className="p-2">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="p-2">{expense.category_name || '-'}</td>
                                    <td className="p-2">{expense.description}</td>
                                    <td className="p-2 text-right font-mono">₹{Number(expense.amount).toFixed(2)}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No expenses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
