import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion } from "motion/react";
import { Briefcase, FileText, CheckCircle, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function SeekerOverview({ user }: { user: User }) {
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, matchRes] = await Promise.all([
          fetch(`/api/profile/${user?.id}`),
          fetch(`/api/matches/${user?.id}`)
        ]);
        setProfile(await profRes.json());
        setMatches(await matchRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-white rounded-3xl"></div>
    <div className="grid grid-cols-3 gap-6">
        <div className="h-24 bg-white rounded-2xl"></div>
        <div className="h-24 bg-white rounded-2xl"></div>
        <div className="h-24 bg-white rounded-2xl"></div>
    </div>
  </div>;

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back,</h1>
        <p className="text-[#141414]/60">{user?.email}</p>
      </header>

      {/* Profile Health */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] text-[#F5F5F0] p-8 rounded-3xl relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
                <div className="text-[#F27D26] text-xs font-bold uppercase tracking-widest mb-4">Profile Strength</div>
                <div className="text-5xl font-bold mb-4">84%</div>
                <p className="text-[#F5F5F0]/60 max-w-sm mb-6">Complete your technical projects section to boost your match accuracy by 15%.</p>
                <Link to="/dashboard/resume" className="inline-flex items-center gap-2 bg-[#F5F5F0] text-[#141414] px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                    Optimize Now <ArrowRight size={16} />
                </Link>
            </div>
            <div className="flex gap-4">
                <StatBox label="Jobs Matched" value={matches.length.toString()} icon={<Star className="text-yellow-400" size={16} />} />
                <StatBox label="Applications" value="3" icon={<FileText className="text-blue-400" size={16} />} />
                <StatBox label="Interviews" value="1" icon={<CheckCircle className="text-green-400" size={16} />} />
            </div>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-[#F27D26]/10 rounded-full blur-3xl group-hover:bg-[#F27D26]/20 transition-colors"></div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Matches */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Top Job Matches</h2>
            <Link to="/dashboard/jobs" className="text-xs font-bold uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors">View All</Link>
          </div>
          <div className="space-y-4">
            {matches.length > 0 ? matches.slice(0, 3).map((match: any) => (
              <JobMatchCard key={match.id} match={match} />
            )) : (
              <div className="bg-white p-8 rounded-2xl text-center border border-[#141414]/5">
                <p className="text-[#141414]/40 text-sm font-medium">No matches found. Upload your resume to begin.</p>
              </div>
            )}
          </div>
        </section>

        {/* Career Insights */}
        <section>
            <h2 className="text-xl font-bold tracking-tight mb-6">Career Insights</h2>
            <div className="bg-white rounded-3xl p-6 border border-[#141414]/5">
                <div className="space-y-6">
                    <InsightItem 
                        title="Skill Trends" 
                        description="React and TypeScript are in high demand for your matched roles."
                        trend={true}
                    />
                    <InsightItem 
                        title="Experience Gap" 
                        description="Adding Cloud certification could increase your visibility."
                        trend={false}
                    />
                    <div className="pt-4 mt-4 border-t border-[#141414]/5 text-center">
                        <Link to="/dashboard/roadmap" className="text-sm font-bold text-[#F27D26] hover:underline">View your growth roadmap</Link>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl w-32">
            <div className="flex items-center gap-2 mb-2 opacity-60">
                {icon}
                <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

function JobMatchCard({ match }: { match: any }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-[#141414]/5 hover:shadow-lg hover:shadow-[#141414]/5 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F5F5F0] rounded-xl flex items-center justify-center font-bold text-xl text-[#141414]/20">
                    {match.job.company[0]}
                </div>
                <div>
                    <h3 className="font-bold text-sm">{match.job.title}</h3>
                    <p className="text-xs text-[#141414]/60">{match.job.company}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-lg font-black text-[#F27D26] leading-none">{match.score}%</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#141414]/40 mt-1">Match</div>
                </div>
                <ArrowRight size={16} className="text-[#141414]/20" />
            </div>
        </div>
    );
}

function InsightItem({ title, description, trend }: { title: string, description: string, trend: boolean }) {
    return (
        <div className="flex gap-4">
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${trend ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {trend ? <TrendingUp size={20} /> : <Star size={20} />}
            </div>
            <div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-xs text-[#141414]/60 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
