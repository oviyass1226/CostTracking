import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [remainingBudget, setRemainingBudget] = useState(0);
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

            // Use calculated values from backend
            setRemainingBudget(reportRes.data.total_remaining);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Hello, {user?.username || 'User'}!</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-indigo-900 to-purple-900 border-none text-white">
                    <h3 className="text-lg font-medium opacity-80 mb-2">Total Expenses</h3>
                    <p className="text-4xl font-bold">₹{Number(totalExpenses).toFixed(2)}</p>
                    <p className="text-sm opacity-60 mt-2">All time</p>
                </div>

                <div className="card bg-gradient-to-br from-green-900 to-emerald-900 border-none text-white">
                    <h3 className="text-lg font-medium opacity-80 mb-2">Remaining Budget (Month)</h3>
                    <p className={`text-4xl font-bold ${remainingBudget < 0 ? 'text-red-300' : 'text-white'}`}>
                        ₹{Number(remainingBudget).toFixed(2)}
                    </p>
                    <p className="text-sm opacity-60 mt-2">For {new Date().toLocaleString('default', { month: 'long' })}</p>
                </div>

                <div className="card hover:border-indigo-500 transition-colors cursor-pointer">
                    <Link to="/expenses" className="block h-full">
                        <h3 className="text-xl font-bold mb-2">Quick Add</h3>
                        <p className="text-gray-400">Log a new expense instantly.</p>
                        <div className="mt-4 text-primary font-semibold">Go to Expenses &rarr;</div>
                    </Link>
                </div>

                <div className="card hover:border-pink-500 transition-colors cursor-pointer">
                    <Link to="/reports" className="block h-full">
                        <h3 className="text-xl font-bold mb-2">View Reports</h3>
                        <p className="text-gray-400">Check your monthly spending breakdown.</p>
                        <div className="mt-4 text-secondary font-semibold">Go to Reports &rarr;</div>
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Transactions</h3>
                    <Link to="/expenses" className="text-sm text-primary hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                    {recentExpenses.map(expense => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-semibold">{expense.description || expense.category_name}</p>
                                <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()} • {expense.category_name}</p>
                            </div>
                            <p className="font-mono font-bold text-red-400">-₹{Number(expense.amount).toFixed(2)}</p>
                        </div>
                    ))}
                    {recentExpenses.length === 0 && (
                        <p className="text-gray-500">No recent transactions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
