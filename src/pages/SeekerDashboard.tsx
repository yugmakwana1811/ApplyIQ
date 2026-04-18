import { Routes, Route, Link, useLocation } from "react-router-dom";
import { User } from "../App";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Map, 
  ClipboardList, 
  Bookmark,
  Settings,
  Zap
} from "lucide-react";
import SeekerOverview from "./seeker/SeekerOverview";
import SeekerResume from "./seeker/SeekerResume";
import SeekerJobs from "./seeker/SeekerJobs";
import SeekerSavedJobs from "./seeker/SeekerSavedJobs";
import SeekerRoadmap from "./seeker/SeekerRoadmap";
import SeekerTracker from "./seeker/SeekerTracker";

interface SeekerDashboardProps {
  user: User;
}

export default function SeekerDashboard({ user }: SeekerDashboardProps) {
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-68px)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414]/10 bg-white flex flex-col">
        <div className="p-6">
          <div className="bg-[#141414]/5 rounded-xl p-4 mb-8">
            <div className="text-xs uppercase tracking-widest font-bold text-[#141414]/40 mb-1">Signed in as</div>
            <div className="text-sm font-bold truncate">{user.email}</div>
          </div>

          <nav className="space-y-1">
            <SidebarLink 
              to="/dashboard" 
              active={location.pathname === "/dashboard" || location.pathname === "/dashboard/overview"}
              icon={<LayoutDashboard size={20} />} 
              label="Overview" 
            />
            <SidebarLink 
              to="/dashboard/resume" 
              active={location.pathname === "/dashboard/resume"}
              icon={<FileText size={20} />} 
              label="Resume" 
            />
            <SidebarLink 
              to="/dashboard/jobs" 
              active={location.pathname === "/dashboard/jobs"}
              icon={<Search size={20} />} 
              label="Job Matches" 
            />
            <SidebarLink 
              to="/dashboard/saved" 
              active={location.pathname === "/dashboard/saved"}
              icon={<Bookmark size={20} />} 
              label="Saved Jobs" 
            />
            <SidebarLink 
              to="/dashboard/roadmap" 
              active={location.pathname === "/dashboard/roadmap"}
              icon={<Map size={20} />} 
              label="AI Roadmap" 
            />
            <SidebarLink 
              to="/dashboard/tracker" 
              active={location.pathname === "/dashboard/tracker"}
              icon={<ClipboardList size={20} />} 
              label="Applications" 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-[#141414]/5">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-[#F27D26]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">Pro Status</span>
                </div>
                <p className="text-xs text-[#141414]/60 mb-3 leading-relaxed">Unlock advanced AI analysis and unlimited matches.</p>
                <button className="w-full py-2 bg-[#F27D26] text-[#141414] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Upgrade Now
                </button>
            </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F0]/30 p-8">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<SeekerOverview user={user} />} />
            <Route path="/overview" element={<SeekerOverview user={user} />} />
            <Route path="/resume" element={<SeekerResume user={user} />} />
            <Route path="/jobs" element={<SeekerJobs user={user} />} />
            <Route path="/saved" element={<SeekerSavedJobs user={user} />} />
            <Route path="/roadmap" element={<SeekerRoadmap user={user} />} />
            <Route path="/tracker" element={<SeekerTracker user={user} />} />
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
