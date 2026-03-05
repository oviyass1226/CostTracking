import { useState, useEffect } from 'react';
import api from '../api/axios';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category_id: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [formData.month, formData.year]); // Refetch when month/year changes

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchData = async () => {
        try {
            const res = await api.get(`/budgets?month=${formData.month}&year=${formData.year}`);
            setBudgets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/budgets', formData);
            fetchData();
            setFormData({ ...formData, amount: '' });
        } catch (err) {
            alert('Failed to set budget');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/budgets/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete budget');
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="card md:col-span-1 h-fit">
                <h3 className="text-xl font-bold mb-4">Set Budget</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <input
                                type="number"
                                name="month"
                                min="1" max="12"
                                className="input-field"
                                value={formData.month}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                className="input-field"
                                value={formData.year}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
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
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount Limit</label>
                        <input
                            type="number"
                            name="amount"
                            className="input-field"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Set Budget</button>
                </form>
            </div>

            <div className="card md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Budgets for {formData.month}/{formData.year}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-2">Category</th>
                                <th className="p-2 text-right">Limit</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map(budget => (
                                <tr key={budget.id} className="border-b border-gray-800">
                                    <td className="p-2">{budget.category_name}</td>
                                    <td className="p-2 text-right font-mono">₹{Number(budget.amount).toFixed(2)}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete(budget.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {budgets.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500">No budgets set for this month.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Budgets;
