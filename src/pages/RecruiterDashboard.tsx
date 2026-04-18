import { Routes, Route, Link, useLocation } from "react-router-dom";
import { User } from "../App";
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Settings,
  Plus
} from "lucide-react";
import RecruiterOverview from "./recruiter/RecruiterOverview";
import RecruiterJobs from "./recruiter/RecruiterJobs";
import RecruiterCandidates from "./recruiter/RecruiterCandidates";

interface RecruiterDashboardProps {
  user: User;
}

export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-68px)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414]/10 bg-white flex flex-col">
        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-8">
            <div className="text-xs uppercase tracking-widest font-bold text-blue-400 mb-1">Recruiter Account</div>
            <div className="text-sm font-bold truncate text-blue-900">{user.email}</div>
          </div>

          <nav className="space-y-1">
            <SidebarLink 
              to="/dashboard" 
              active={location.pathname === "/dashboard" || location.pathname === "/dashboard/overview"}
              icon={<Building2 size={20} />} 
              label="Overview" 
            />
            <SidebarLink 
              to="/dashboard/jobs" 
              active={location.pathname === "/dashboard/jobs"}
              icon={<Briefcase size={20} />} 
              label="My Listings" 
            />
            <SidebarLink 
              to="/dashboard/candidates" 
              active={location.pathname === "/dashboard/candidates"}
              icon={<Users size={20} />} 
              label="Talent Pool" 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#141414]/5 space-y-4">
            <Link 
                to="/dashboard/jobs" 
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
                <Plus size={18} /> Post a Job
            </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F0]/30 p-8">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<RecruiterOverview user={user} />} />
            <Route path="/overview" element={<RecruiterOverview user={user} />} />
            <Route path="/jobs" element={<RecruiterJobs user={user} />} />
            <Route path="/candidates" element={<RecruiterCandidates user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active 
          ? "bg-[#141414] text-[#F5F5F0] shadow-lg shadow-[#141414]/10" 
          : "text-[#141414]/60 hover:bg-[#141414]/5 hover:text-[#141414]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
