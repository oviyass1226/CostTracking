import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Wallet, Calendar, Tag, IndianRupee, Trash2, Plus, ArrowUpRight } from 'lucide-react';

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
    }, [formData.month, formData.year]);

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
            setFormData({ ...formData, amount: '', category_id: '' });
        } catch (err) {
            alert('Failed to set budget');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this budget guideline?')) return;
        try {
            await api.delete(`/budgets/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete budget');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-bold text-text tracking-tight">Strategy Planner</h1>
                <p className="text-text-muted text-sm font-medium mt-1">Allocation management for monthly operational boundaries.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                    <div className="card shadow-md">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <Plus size={16} className="text-primary" />
                            <h3 className="text-[11px] font-black text-text uppercase tracking-widest">Target Boundary</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="label">Timeline (Month)</label>
                                    <select
                                        name="month"
                                        className="input-field appearance-none bg-white py-2.5 text-[11px] font-black uppercase tracking-widest text-primary"
                                        value={formData.month}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="label">Fiscal Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        className="input-field py-2.5 text-[11px] font-black"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">Expense Portfolio</label>
                                <select
                                    name="category_id"
                                    className="input-field appearance-none bg-white py-2.5 text-[11px] font-bold uppercase tracking-wider"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choose Category...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="label">Ceiling Amount (INR)</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary pointer-events-none">
                                        <IndianRupee size={14} />
                                    </span>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        className="input-field pl-10 font-black text-base"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full py-3 mt-2 font-black uppercase tracking-widest text-[11px]">
                                Deploy Strategy
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="card p-0! overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-text uppercase tracking-widest">Active Benchmarks</h3>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-saas text-primary text-[10px] font-black uppercase shadow-sm">
                                <Calendar size={12} />
                                {new Date(formData.year, formData.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Target Area</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Max Limit</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-24">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {budgets.map(budget => (
                                        <tr key={budget.id} className="hover:bg-background transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-background border border-border rounded-saas flex items-center justify-center text-primary text-xs font-black uppercase shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                        {budget.category_name?.[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">{budget.category_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-text tracking-tight group-hover:text-primary transition-colors">₹{Number(budget.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-tighter mt-1 opacity-60">Provisioned Limit</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center text-management">
                                                <button 
                                                    onClick={() => handleDelete(budget.id)} 
                                                    className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-saas transition-all"
                                                    title="Release Guideline"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {budgets.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-24 text-center">
                                                <Wallet size={40} className="mx-auto mb-4 opacity-10 text-primary" />
                                                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Zero boundaries established.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-5 border border-primary/10 rounded-saas bg-primary/5 flex items-start gap-4">
                        <ArrowUpRight size={18} className="text-primary shrink-0 opacity-80" />
                        <p className="text-[12px] text-text-muted font-medium leading-relaxed italic pr-4">
                            Operational boundaries are restricted to the selected timeline. Re-provisioning an existing portfolio will recalibrate the active benchmark automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budgets;
