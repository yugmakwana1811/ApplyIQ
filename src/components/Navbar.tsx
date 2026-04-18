import { Link, useNavigate } from "react-router-dom";
import { User } from "../App";
import { LogOut, User as UserIcon, Briefcase, Zap } from "lucide-react";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="border-bottom border-[#141414]/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#141414] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Zap size={18} className="text-[#F5F5F0]" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight">ApplyIQ</span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:opacity-60 transition-opacity">Home</Link>
          {user && (
            <Link to="/dashboard" className="hover:opacity-60 transition-opacity">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#141414]/60 mono">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-[#141414]/5 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-4 py-2 bg-[#141414] text-[#F5F5F0] rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
