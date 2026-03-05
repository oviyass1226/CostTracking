import { useState, useEffect } from 'react';
import api from '../api/axios';

const Reports = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [report, setReport] = useState({ total_spent: 0, total_budget: 0, total_remaining: 0, byCategory: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
            setReport(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Monthly Report</h2>
                <div className="flex gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Month</label>
                        <input
                            type="number"
                            min="1" max="12"
                            className="input-field w-20"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <input
                            type="number"
                            className="input-field w-24"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchData} className="btn-primary w-auto self-end">Refresh</button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-gray-400">Total Spending</h3>
                        <p className="text-4xl font-bold text-white">₹{Number(report.total_spent).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-gray-400">Total Budget</h3>
                        <p className="text-4xl font-bold text-blue-400">
                            ${Number(report.total_budget).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl font-bold mb-4">Category Breakdown & Budget Comparison</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400">
                                    <th className="p-3">Category</th>
                                    <th className="p-3 text-right">Spent</th>
                                    <th className="p-3 text-right">Budget</th>
                                    <th className="p-3 text-right">Remaining</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.byCategory.map((cat, index) => {
                                    const budgetAmount = Number(cat.budget_limit) || 0;
                                    const spent = Number(cat.total_spent) || 0;
                                    const remaining = Number(cat.remaining_budget) || 0;
                                    const isOverBudget = budgetAmount > 0 && spent > budgetAmount;

                                    return (
                                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                                            <td className="p-3 font-medium">{cat.name}</td>
                                            <td className="p-3 text-right text-red-400 font-mono">₹{spent.toFixed(2)}</td>
                                            <td className="p-3 text-right text-blue-400 font-mono">{budgetAmount > 0 ? `₹${budgetAmount.toFixed(2)}` : '-'}</td>
                                            <td className={`p-3 text-right font-mono ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {budgetAmount > 0 ? `₹${remaining.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="p-3">
                                                {budgetAmount > 0 ? (
                                                    isOverBudget ?
                                                        <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded">Over Budget</span> :
                                                        <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded">Within Budget</span>
                                                ) : <span className="text-gray-500 text-xs">No Budget</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {report.byCategory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-500">No data available for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
