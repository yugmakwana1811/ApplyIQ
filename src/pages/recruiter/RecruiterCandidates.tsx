import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion } from "motion/react";
import { Users, Search, Filter, Star, CheckCircle, XCircle, ArrowRight, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruiterCandidates({ user }: { user: User }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock candidates for demo
    setCandidates([
        { id: "1", name: "Alex Rivera", headline: "Full Stack Engineer", email: "alex@example.com", score: 98, skills: ["React", "TypeScript", "Node.js"] },
        { id: "2", name: "Sarah Chen", headline: "Product Manager", email: "sarah@example.com", score: 85, skills: ["Agile", "Strategy", "SQL"] },
        { id: "3", name: "Marcus Stone", headline: "UX Designer", email: "marcus@example.com", score: 72, skills: ["Figma", "UI", "Research"] }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Talent Pool</h1>
            <p className="text-[#141414]/60">AI-ranked candidates based on your active listings.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[#141414]/5 shadow-sm min-w-[320px]">
            <div className="flex-1 flex items-center gap-2 pl-2">
                <Search size={18} className="text-[#141414]/40" />
                <input 
                    type="text" 
                    placeholder="Search by skill or name" 
                    className="w-full bg-transparent border-none outline-none text-sm py-2"
                />
            </div>
            <button className="bg-[#141414] text-[#F5F5F0] px-4 py-2 rounded-xl text-xs font-bold font-mono">
                /Filter
            </button>
        </div>
      </header>

      <div className="grid gap-4">
        {candidates.map((can) => (
            <motion.div 
                key={can.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-[#141414]/5 hover:border-blue-500/20 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold">{can.name}</h3>
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-md">Verified</span>
                        </div>
                        <p className="font-medium text-[#141414]/60 text-sm mb-3">{can.headline}</p>
                        <div className="flex flex-wrap gap-2">
                            {can.skills.map((skill: string, i: number) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 bg-[#F5F5F0] px-2 py-1 rounded-md">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-8 pl-8 border-l border-[#141414]/5">
                    <div className="text-center">
                        <div className="text-5xl font-black text-blue-600 leading-none">{can.score}%</div>
                        <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mt-2">Overall Fit</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-4 bg-[#F5F5F0] text-[#141414] rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <Star size={20} />
                        </button>
                        <Link 
                            to={`/profile/${can.id}`}
                            className="px-6 py-4 bg-[#141414] text-[#F5F5F0] rounded-2xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            View Details <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
}
