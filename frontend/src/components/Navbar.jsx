import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { LogOut, LayoutDashboard, Wallet, PieChart, ReceiptText } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-14 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-primary flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-saas flex items-center justify-center text-white shadow-sm shadow-primary/20">
            <Wallet size={16} />
          </div>
          <span className="text-text font-black">CostTrack</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8 h-full">
          {user ? (
            <>
              {[
                { name: 'Dashboard', path: '/', icon: LayoutDashboard },
                { name: 'Expenses', path: '/expenses', icon: ReceiptText },
                { name: 'Budgets', path: '/budgets', icon: Wallet },
                { name: 'Reports', path: '/reports', icon: PieChart },
              ].map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className="flex items-center gap-2 text-text-muted hover:text-primary font-black transition-all text-[11px] uppercase tracking-widest h-full px-1 border-b-2 border-transparent hover:border-primary pt-1"
                >
                  <link.icon size={14} />
                  {link.name}
                </Link>
              ))}

              <div className="h-4 w-px bg-border mx-2"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="text-right">
                    <p className="text-[10px] font-black text-text leading-none uppercase">{user.username}</p>
                    <p className="text-[9px] text-primary font-bold uppercase tracking-tighter leading-none mt-1">Verified</p>
                </div>
                <div className="w-8 h-8 bg-background border border-border rounded-saas flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-saas transition-all"
                title="System Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-text-muted hover:text-primary font-black transition-colors text-[11px] uppercase tracking-widest">
                Port Access
              </Link>

              <Link
                to="/register"
                className="btn-primary text-[10px] font-black uppercase tracking-widest px-5 py-2"
              >
                Onboard Instance
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text p-2 hover:bg-background rounded-saas transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="17" y2="12"></line><line x1="3" y1="6" x2="17" y2="6"></line><line x1="3" y1="18" x2="17" y2="18"></line></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;