import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion } from "motion/react";
import { Users, Briefcase, TrendingUp, CheckCircle, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruiterOverview({ user }: { user: User }) {
  const [stats, setStats] = useState<any>({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0
  });

  useEffect(() => {
    // Mock fetching stats for now
    setStats({
        activeJobs: 5,
        totalApplicants: 42,
        shortlisted: 8
    });
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Hiring Dashboard</h1>
        <p className="text-[#141414]/60">Manage your active listings and evaluate AI-ranked talent.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
          <StatCard label="Active Jobs" value={stats.activeJobs} icon={<Briefcase size={20} className="text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Live Applicants" value={stats.totalApplicants} icon={<Users size={20} className="text-purple-500" />} color="bg-purple-50" />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon={<CheckCircle size={20} className="text-green-500" />} color="bg-green-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                    <Link to="/dashboard/candidates" className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors">Talent Pool</Link>
                </div>
                <div className="bg-white rounded-3xl border border-[#141414]/5 divide-y divide-[#141414]/5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 flex items-center justify-between group cursor-pointer hover:bg-[#F5F5F0]/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#141414]/5 flex items-center justify-center font-bold text-xs uppercase">
                                    JD
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Jane Doe applied for Senior Engineer</h4>
                                    <p className="text-[10px] text-[#141414]/40 uppercase tracking-widest font-bold mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-green-600">94% Fit</div>
                                <div className="text-[8px] uppercase tracking-tighter opacity-40">AI Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#141414] text-[#F5F5F0] p-10 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">Elite Talent Discovery</h3>
                    <p className="text-[#F5F5F0]/60 text-sm mb-6 leading-relaxed max-w-sm">Our AI system identified 3 new candidates matching your "Head of Engineering" criteria with over 90% accuracy.</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:translate-x-1 transition-transform flex items-center gap-2">
                        Review Matches <ArrowRight size={18} />
                    </button>
                </div>
                <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] border border-[#141414]/5 h-full">
                <div className="flex items-center gap-2 mb-8">
                    <BarChart3 size={18} className="text-[#141414]/40" />
                    <h2 className="text-xs uppercase font-bold tracking-widest text-[#141414]/40">Hiring Pipeline</h2>
                </div>
                <div className="space-y-8">
                    <PipelineStage label="Applied" count={24} percentage={100} color="bg-blue-100" />
                    <PipelineStage label="Screening" count={12} percentage={50} color="bg-purple-100" />
                    <PipelineStage label="Interview" count={4} percentage={16} color="bg-yellow-100" />
                    <PipelineStage label="Offered" count={2} percentage={8} color="bg-green-100" />
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#141414]/5 flex flex-col items-center text-center shadow-sm">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                {icon}
            </div>
            <div className="text-4xl font-black mb-1">{value}</div>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#141414]/40">{label}</div>
        </div>
    );
}

function PipelineStage({ label, count, percentage, color }: { label: string, count: number, percentage: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                <span className="text-[#141414]/60">{label}</span>
                <span>{count}</span>
            </div>
            <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${color.replace('100', '500')}`}
                ></motion.div>
            </div>
        </div>
    );
}
