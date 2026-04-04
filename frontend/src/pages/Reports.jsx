import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, PieChart, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, RefreshCw, BarChart3, Target } from 'lucide-react';

const Reports = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [report, setReport] = useState({ total_spent: 0, total_budget: 0, total_remaining: 0, byCategory: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
            setReport(res.data);
        } catch (err) {
            console.error(err);
            setError("Communication failure: Unable to fetch data. Check your connection or database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-text tracking-tight">Intelligence Audit</h1>
                    <p className="text-text-muted text-sm font-medium mt-1">Variance analysis and performance metrics for fiscal timelines.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded-saas border border-border shadow-sm">
                    <div className="flex items-center px-2 gap-2 text-primary">
                        <Calendar size={15} />
                        <select 
                            className="bg-transparent text-text text-[11px] font-black outline-none cursor-pointer uppercase tracking-widest"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                <option key={m} value={m} className="bg-white">{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-px h-5 bg-border"></div>
                    <input
                        type="number"
                        className="bg-transparent text-text text-[11px] font-black outline-none w-20 px-3 tracking-widest"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    />
                    <button 
                        onClick={fetchData} 
                        className="p-1.5 text-text-muted hover:text-primary transition-colors ml-2"
                        title="Reload Metrics"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="card shadow-md group hover:border-error/20 transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted opacity-60">Outflow Intensity</p>
                        <div className="p-2 bg-error/5 rounded-saas text-error border border-error/10">
                            <TrendingDown size={15} />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-text tracking-tighter">₹{Number(report.total_spent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></div> Gross Utilization
                    </div>
                </div>

                <div className="card shadow-md group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted opacity-60">Ceiling Allocation</p>
                        <div className="p-2 bg-primary/5 rounded-saas text-primary border border-primary/10">
                            <Target size={15} />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-text tracking-tighter">₹{Number(report.total_budget).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div> Strategy Target
                    </div>
                </div>

                <div className="card shadow-md group hover:border-success/20 transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted opacity-60">Variance Surplus</p>
                        <div className={`p-2 rounded-saas border ${report.total_remaining < 0 ? 'bg-error/5 text-error border-error/10' : 'bg-success/5 text-success border-success/10'}`}>
                            <TrendingUp size={15} />
                        </div>
                    </div>
                    <p className={`text-2xl font-black tracking-tighter ${report.total_remaining < 0 ? 'text-error' : 'text-success'}`}>
                        ₹{Number(report.total_remaining).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest">
                        <div className={`w-1.5 h-1.5 rounded-full ${report.total_remaining < 0 ? 'bg-error' : 'bg-success animate-pulse'}`}></div> Status Outcome
                    </div>
                </div>
            </div>

            <section className="card p-0! overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-text uppercase tracking-widest flex items-center gap-2.5">
                        <BarChart3 className="text-primary" size={18} />
                        Performance Matrix
                    </h3>
                    <div className="px-2 py-1 bg-white border border-border rounded text-[9px] font-black text-text-muted uppercase tracking-tighter">
                        Category Wise Audit
                    </div>
                </div>

                {error ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-4">
                        <AlertCircle size={48} className="text-error opacity-80 animate-pulse" />
                        <div className="text-center">
                            <p className="text-[12px] font-black text-error uppercase tracking-widest">{error}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">Data retrieval halted.</p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Recalibrating Matrix...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-background border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Target Portfolio</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actual Outflow</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Guidelines</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Net Gap</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-40">Status Index</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {report.byCategory.map((cat, index) => {
                                    const budgetAmount = Number(cat.budget_limit) || 0;
                                    const spent = Number(cat.total_spent) || 0;
                                    const remaining = Number(cat.remaining_budget) || 0;
                                    const isOverBudget = budgetAmount > 0 && spent > budgetAmount;
                                    const percentage = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;

                                    return (
                                        <tr key={index} className="hover:bg-background transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-saas bg-background border border-border flex items-center justify-center text-primary font-black text-xs uppercase shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                        {cat.name[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right font-black text-error text-sm">₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-6 text-right font-bold text-text-muted text-sm opacity-60">
                                                {budgetAmount > 0 ? `₹${budgetAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className={`px-6 py-6 text-right font-black text-sm ${budgetAmount > 0 ? (remaining < 0 ? 'text-error' : 'text-success') : 'text-text-muted opacity-40'}`}>
                                                {budgetAmount > 0 ? `₹${remaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    {budgetAmount > 0 ? (
                                                        <>
                                                            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border p-px">
                                                                <div 
                                                                    className={`h-full transition-all duration-1000 rounded-full ${isOverBudget ? 'bg-error' : 'bg-primary shadow-[0_0_8px_rgba(37,99,235,0.2)]'}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            {isOverBudget ? (
                                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-error uppercase tracking-tighter">
                                                                    <AlertCircle size={10} /> CRITICAL DEFICIT
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-success uppercase tracking-tighter">
                                                                    <CheckCircle2 size={10} /> OPTIMAL
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div 
                                                            className="inline-flex items-center justify-center px-3 py-1.5 border rounded shadow-sm text-[9px] font-black uppercase tracking-widest bg-white"
                                                            style={{ color: 'var(--color-unbudgeted)', borderColor: 'var(--color-unbudgeted)' }}
                                                        >
                                                            Unbudgeted
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {report.byCategory.length === 0 && !loading && !error && (
                    <div className="py-28 text-center opacity-30">
                        <PieChart size={48} className="mx-auto mb-5 text-primary" />
                        <p className="text-[11px] font-black uppercase tracking-widest">Zero analytical data for audit.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Reports;
