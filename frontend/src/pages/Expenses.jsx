import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { IndianRupee, Tag, Info, Calendar as CalendarIcon, Plus, Trash2, Filter, Search } from 'lucide-react';

const Expenses = () => {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [newCategory, setNewCategory] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBudgets = async () => {
            if (!formData.date) return;
            const parts = formData.date.split('-');
            if(parts.length < 2) return;
            try {
                const res = await api.get(`/reports/monthly?month=${parseInt(parts[1], 10)}&year=${parseInt(parts[0], 10)}`);
                setCategoryBudgets(res.data.byCategory || []);
            } catch (err) {}
        };
        fetchBudgets();
    }, [formData.date]);

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
            setFormError('Failed to add category');
            setTimeout(() => setFormError(null), 3500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/expenses', formData);
            const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
            const newExpense = { ...res.data, category_name: selectedCategory?.name || '' };
            setExpenses([newExpense, ...expenses]);
            setFormData({ ...formData, amount: '', description: '' });
            setFormError(null);
            
            // refresh budgets after submit to recalculate the remaining
            const parts = formData.date.split('-');
            if(parts.length >= 2) {
                api.get(`/reports/monthly?month=${parseInt(parts[1], 10)}&year=${parseInt(parts[0], 10)}`)
                    .then(r => setCategoryBudgets(r.data.byCategory || []));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add expense';
            setFormError(errorMessage);
            setFormData({ ...formData, amount: '', description: '' });
            setTimeout(() => setFormError(null), 3500);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense record?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
            
            // refresh budgets after delete
            const parts = formData.date.split('-');
            if(parts.length >= 2) {
                api.get(`/reports/monthly?month=${parseInt(parts[1], 10)}&year=${parseInt(parts[0], 10)}`)
                    .then(r => setCategoryBudgets(r.data.byCategory || []));
            }
        } catch (err) {
            alert('Failed to delete record');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const filteredExpenses = expenses
        .filter(e => !filterDate || e.date.startsWith(filterDate))
        .filter(e => !searchQuery || 
            e.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            e.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Compute live warning
    const selCat = categories.find(c => String(c.id) === String(formData.category_id));
    const activeBudget = selCat ? categoryBudgets.find(b => b.name === selCat.name) : null;
    const remaining = activeBudget && activeBudget.budget_limit !== null ? Number(activeBudget.remaining_budget) : null;
    const isExceeding = remaining !== null && (remaining - Number(formData.amount || 0) < 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-bold text-text tracking-tight">Expense Ledger</h1>
                <p className="text-text-muted text-sm font-medium mt-1">Audit-ready record of all organizational expenditures.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                    <div className="card shadow-md">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <Plus size={16} className="text-primary" />
                            <h3 className="text-[11px] font-black text-text uppercase tracking-widest">Post Entry</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="label">Amount (INR)</label>
                                    {remaining !== null && (
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${remaining < 0 ? 'text-error' : 'text-success'}`}>
                                            Remaining: ₹{remaining.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary pointer-events-none">
                                        <IndianRupee size={14} />
                                    </span>
                                    <input
                                        type="number"
                                        name="amount"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`input-field pl-9 font-bold text-base transition-colors ${isExceeding ? 'border-error focus:border-error focus:ring-error/20 bg-error/5 text-error' : ''}`}
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                {isExceeding && (
                                    <p className="text-[10px] text-error font-bold mt-1 uppercase tracking-widest animate-pulse flex items-center gap-1">
                                        ⚠️ Exceeds Limits by ₹{Math.abs(remaining - Number(formData.amount)).toFixed(2)}!
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">Reference / Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="e.g. Server Maintenance"
                                    className="input-field"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="label">Posting Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="input-field font-bold uppercase text-[11px]"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label">Category</label>
                                    <select
                                        name="category_id"
                                        className="input-field appearance-none bg-white pr-8 font-bold text-[11px] uppercase tracking-wider"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Choose Area...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button type="button" onClick={() => setShowCategoryInput(!showCategoryInput)} className="text-[10px] font-black text-primary hover:text-primary-hover flex items-center gap-1.5 uppercase tracking-widest cursor-pointer">
                                    {showCategoryInput ? '[-] Minimize Editor' : '[+] Define New Category'}
                                </button>
                                {showCategoryInput && (
                                    <div className="flex gap-2 mt-3 animate-in slide-in-from-top-2 duration-300">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Area name..."
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                        <button type="button" onClick={handleAddCategory} className="btn-secondary px-4 py-2 font-bold text-[10px] uppercase">Add</button>
                                    </div>
                                )}
                            </div>

                            {formError && (
                                <div className="p-3 mb-2 rounded-saas bg-error/10 border border-error/20 text-error text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                                    {formError}
                                </div>
                            )}

                            <button type="submit" className="btn-primary w-full py-2.5 mt-2 font-black uppercase tracking-widest text-xs">
                                Confirm Record
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                <Search size={14} />
                            </span>
                            <input
                                type="text"
                                placeholder="Filter by keyword or category..."
                                className="input-field pl-9 bg-surface/50 focus:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative sm:w-48 group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-focus-within:text-primary">
                                <Filter size={14} />
                            </span>
                            <input
                                type="date"
                                className="input-field pl-9 w-full font-bold uppercase text-[10px]"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card p-0! overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Transaction Flow</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Portfolio</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Value</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-24">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredExpenses.map(expense => (
                                        <tr key={expense.id} className="hover:bg-background transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors mb-0.5">{expense.description || 'General Provision'}</span>
                                                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                                                        {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-2.5 py-1 bg-background border border-border text-[9px] font-black rounded-saas text-text-muted uppercase tracking-tighter group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                                                    {expense.category_name || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="text-sm font-black text-error">
                                                    -₹{Number(expense.amount).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button 
                                                    onClick={() => handleDelete(expense.id)} 
                                                    className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-saas transition-all"
                                                    title="Purge Record"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredExpenses.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-24 text-center">
                                                <Search size={40} className="mx-auto mb-4 opacity-10 text-primary" />
                                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Zero matches found in audit.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
