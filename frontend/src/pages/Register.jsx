import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Wallet } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Provisioning failed. Review entry data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-saas flex items-center justify-center shadow-lg shadow-primary/25">
                            <Wallet size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-text">Cost<span className="text-primary italic">Track</span></span>
                    </div>
                    <h1 className="text-xl font-black text-text mb-2 uppercase tracking-wide">Account Provisioning</h1>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest opacity-60 italic">Initiate New Instance</p>
                </div>

                <div className="card shadow-2xl border-border bg-white p-10">
                    {error && (
                        <div className="mb-6 p-4 bg-error/5 border border-error/10 text-error rounded-saas text-[11px] font-black uppercase tracking-widest animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="label">Full Legal Name / Operator ID</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                    <User size={16} />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Operator Name"
                                    className="input-field pl-11 bg-background border-border hover:border-primary/30 transition-all font-bold"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="label">Registered Intelligence (Email)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="operator@system.com"
                                    className="input-field pl-11 bg-background border-border hover:border-primary/30 transition-all font-bold"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="label">Security Credentials (Password)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="input-field pl-11 bg-background border-border hover:border-primary/30 transition-all font-bold"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-2 font-black uppercase tracking-widest text-[11px] h-12 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                                    Initialize <UserPlus size={18} />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest">
                            Existing Partner?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-hover font-black ml-1 transition-colors">
                                Authenticate
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="text-center mt-10 text-[10px] text-text-muted font-black uppercase tracking-[0.2em] opacity-40">
                    Secure Onboarding &bull; CostTrack Cloud
                </p>
            </div>
        </div>
    );
};

export default Register;