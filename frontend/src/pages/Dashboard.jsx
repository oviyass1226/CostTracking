import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { TrendingDown, Wallet, Calendar, ArrowRight, History, Plus, IndianRupee, PieChart } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [monthlySpent, setMonthlySpent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const [totalRes, expensesRes, reportRes] = await Promise.all([
                api.get('/expenses/total'),
                api.get('/expenses'),
                api.get(`/reports/monthly?month=${month}&year=${year}`)
            ]);

            setTotalExpenses(totalRes.data.total);
            setRecentExpenses(expensesRes.data.slice(0, 5));
            setRemainingBudget(reportRes.data.total_remaining);
            setMonthlyBudget(reportRes.data.total_budget);
            setMonthlySpent(reportRes.data.total_spent);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const velocity = monthlyBudget > 0 ? Math.min(Math.round((monthlySpent / monthlyBudget) * 100), 100) : 0;
    const isOverLimit = monthlySpent > monthlyBudget && monthlyBudget > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text tracking-tight">Financial Overview</h1>
                    <p className="text-text-muted text-sm font-medium mt-1">Real-time monitoring of expenditures and budget limits.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/reports" className="btn-secondary flex items-center gap-2">
                        <PieChart size={16} className="text-primary" /> Reports
                    </Link>
                    <Link to="/expenses" className="btn-primary">
                        <Plus size={16} /> New Record
                    </Link>
                </div>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Expenses Card */}
                <div className="card group hover:border-primary/30 transition-all cursor-default">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Spent</p>
                            <h3 className="text-2xl font-bold text-text flex items-baseline gap-1">
                                <span className="text-base font-semibold text-text-muted">₹</span>
                                {Number(totalExpenses).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="p-2.5 bg-background rounded-saas text-text-muted border border-border group-hover:text-primary transition-colors">
                            <TrendingDown size={18} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-[10px] font-bold py-0.5 px-2 bg-error/5 text-error rounded-full border border-error/10 uppercase tracking-tighter">Gross Flow</span>
                        <span className="text-[10px] text-text-muted font-bold">Lifetime Record</span>
                    </div>
                </div>

                {/* Remaining Budget Card */}
                <div className="card group hover:border-primary/30 transition-all cursor-default">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Budget Reserve</p>
                            <h3 className={`text-2xl font-bold flex items-baseline gap-1 ${remainingBudget < 0 ? 'text-error' : 'text-text'}`}>
                                <span className="text-base font-semibold opacity-40">₹</span>
                                {Number(remainingBudget).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="p-2.5 bg-background rounded-saas text-text-muted border border-border group-hover:text-primary transition-colors">
                            <Wallet size={18} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className={`flex items-center gap-1.5`}>
                            <div className={`w-2 h-2 rounded-full ${remainingBudget < 0 ? 'bg-error' : 'bg-success'}`}></div>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
                                {remainingBudget < 0 ? 'Deficit' : 'Optimal'}
                            </span>
                        </div>
                        <span className="text-[10px] text-text-muted font-bold">{new Date().toLocaleString('default', { month: 'short' })} Guidelines</span>
                    </div>
                </div>

                {/* Quick Action Card */}
                <Link to="/budgets" className="card hover:border-primary group transition-all bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-4 h-full">
                        <div className="p-3 bg-white shadow-sm border border-primary/20 rounded-saas text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-text group-hover:text-primary mb-0.5 transition-colors">Strategy Planner</h4>
                            <p className="text-xs text-text-muted font-bold">Set monthly limits &rarr;</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 card p-0! overflow-hidden shadow-sm">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-background/50">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-primary" />
                            <h3 className="text-[11px] font-black text-text uppercase tracking-widest">Transaction Audit</h3>
                        </div>
                        <Link to="/expenses" className="text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-widest">Full Ledger</Link>
                    </div>
                    
                    <div className="divide-y divide-border">
                        {recentExpenses.map(expense => (
                            <div key={expense.id} className="flex justify-between items-center px-6 py-4 hover:bg-background/80 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-background border border-border rounded-saas flex items-center justify-center font-black text-primary text-xs uppercase shadow-sm">
                                        {expense.category_name?.[0] || 'E'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text">{expense.description || expense.category_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                                                {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] text-primary/60 font-black px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 uppercase italic">
                                                {expense.category_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-error">-₹{Number(expense.amount).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                        {recentExpenses.length === 0 && (
                            <div className="py-20 text-center text-text-muted opacity-40">
                                <IndianRupee size={32} className="mx-auto mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">No activity found.</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="space-y-6">
                    <div className="card bg-primary text-white border-primary shadow-lg shadow-primary/20">
                        <div className="flex items-center gap-2 mb-4 opacity-80">
                            <Target size={16} className="text-white" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Optimization Tip</h4>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic opacity-95">
                            "Systematic tracking of daily micro-costs typically reveals 15% in potential monthly savings. Keep logging!"
                        </p>
                    </div>

                    <div className="card shadow-sm">
                        <h4 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-6">Financial Progress</h4>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-[10px] font-black mb-2 uppercase">
                                    <span className="text-text-muted">Utilization Velocity</span>
                                    <span className={isOverLimit ? "text-error" : "text-primary"}>{velocity}%</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden border border-border group">
                                    <div className={`h-full transition-all duration-1000 ${isOverLimit ? 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-primary shadow-[0_0_8px_rgba(37,99,235,0.3)]'}`} style={{ width: `${velocity}%` }}></div>
                                </div>
                            </div>
                            <div className="p-3 bg-background rounded-saas border border-border">
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight leading-relaxed">
                                    Current flow is <span className={isOverLimit ? "text-error inline-flex px-1 bg-error/5 rounded" : "text-success inline-flex px-1 bg-success/5 rounded"}>{isOverLimit ? 'exceeding limits' : 'within limits'}</span> for {new Date().toLocaleString('default', { month: 'long' })}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tool icon since Target was used
const Target = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
);

export default Dashboard;
