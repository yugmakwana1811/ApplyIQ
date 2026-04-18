import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ArrowRight, Briefcase, MapPin, DollarSign, Star, Zap, Loader2, Sparkles, X, FileText, ScrollText } from "lucide-react";
import { aiService } from "../../services/aiService";

export default function SeekerJobs({ user }: { user: User }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?query=${query}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${user?.id}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) { console.error(err); }
  };

  const handleMatch = async (job: any) => {
    if (!profile) return;
    setSelectedJob(job);
    setMatching(true);
    setMatchResult(null);
    setShowCoverLetter(false);
    setCoverLetterText("");
    try {
      const result = await aiService.matchJob(profile, job.description);
      setMatchResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob || !user) return;
    try {
        const res = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, jobId: selectedJob.id })
        });
        if (res.ok) {
            alert("Application submitted successfully!");
            setSelectedJob(null);
        }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Opportunities</h1>
            <p className="text-[#141414]/60">Discover roles tailored to your unique professional profile.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[#141414]/5 shadow-sm min-w-[320px]">
            <div className="flex-1 flex items-center gap-2 pl-2">
                <Search size={18} className="text-[#141414]/40" />
                <input 
                    type="text" 
                    placeholder="Search roles or companies" 
                    className="w-full bg-transparent border-none outline-none text-sm py-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                />
            </div>
            <button 
                onClick={fetchJobs}
                className="bg-[#141414] text-[#F5F5F0] px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
                Search
            </button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        {["All Roles", "Engineering", "Design", "Marketing", "Management", "Sales"].map(cat => (
            <button key={cat} className="px-5 py-2 whitespace-nowrap bg-white border border-[#141414]/5 rounded-xl text-xs font-bold hover:bg-[#141414] hover:text-[#F5F5F0] transition-all">
                {cat}
            </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {loading ? (
            [1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse"></div>)
        ) : jobs.length > 0 ? (
            jobs.map((job: any) => (
                <div 
                    key={job.id} 
                    className="bg-white p-8 rounded-[2rem] border border-[#141414]/5 hover:shadow-xl hover:shadow-[#141414]/5 transition-all group flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-[#F5F5F0] rounded-2xl flex items-center justify-center font-bold text-2xl text-[#141414]/20">
                                {job.company[0]}
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold tracking-widest rounded-full">{job.type || 'Full Time'}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#F27D26] transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-[#141414]/40 mb-6 font-medium">
                            <div className="flex items-center gap-1.5"><Briefcase size={14} /> {job.company}</div>
                            <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.location || 'Remote'}</div>
                        </div>
                        <p className="text-sm text-[#141414]/60 line-clamp-2 mb-8 leading-relaxed">{job.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[#141414]/5">
                        <div className="flex items-center gap-1.5 text-sm font-bold">
                            <DollarSign size={14} className="text-green-600" /> {job.salary || '$80k - $120k'}
                        </div>
                        <button 
                            onClick={() => handleMatch(job)}
                            className="flex items-center gap-2 text-sm font-bold bg-[#F5F5F0] text-[#141414] px-5 py-2.5 rounded-xl hover:bg-[#141414] hover:text-[#F5F5F0] transition-all"
                        >
                            AI Match <Zap size={14} className="text-[#F27D26]" />
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="lg:col-span-2 py-20 bg-white rounded-[2rem] border border-[#141414]/5 text-center">
                <Search size={48} className="mx-auto text-[#141414]/10 mb-4" />
                <h3 className="text-xl font-bold mb-2">No jobs found</h3>
                <p className="text-[#141414]/40">Try adjusting your search filters or check back later.</p>
            </div>
        )}
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {selectedJob && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            >
                <div className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-2xl bg-[#F5F5F0] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
                >
                    <div className="bg-[#141414] text-[#F5F5F0] p-10 flex justify-between items-center">
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mb-2">Job Interaction</div>
                            <h2 className="text-3xl font-bold tracking-tight">{selectedJob.title}</h2>
                            <p className="text-[#F5F5F0]/60 text-sm mt-1">{selectedJob.company}</p>
                        </div>
                        <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-10 overflow-y-auto space-y-8">
                        <div>
                            <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414]/40 mb-4">Job Description</h3>
                            <p className="text-sm leading-relaxed opacity-70">{selectedJob.description}</p>
                        </div>

                        {matching ? (
                            <div className="py-12 bg-white rounded-[2rem] border border-[#141414]/5 text-center">
                                <Loader2 size={32} className="animate-spin mx-auto text-[#F27D26] mb-4" />
                                <h4 className="font-bold">AI is calculating your fit...</h4>
                                <p className="text-xs text-[#141414]/40 mt-1">Comparing technical skills and cultural alignment</p>
                            </div>
                        ) : matchResult ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-[#141414]/5 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest text-[#141414]/40 mb-2">Computed Fit</div>
                                        <div className="text-6xl font-black text-[#F27D26] leading-none">{matchResult.score}%</div>
                                    </div>
                                    <div className="max-w-xs text-xs leading-relaxed opacity-60 italic">
                                        "{matchResult.reasoning}"
                                    </div>
                                </div>

                                {matchResult.missingKeywords?.length > 0 && (
                                    <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-orange-700 mb-3">Optimization Tips (Add to resume)</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {matchResult.missingKeywords.map((tag: any, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-white border border-orange-200 text-orange-700 text-[10px] font-bold rounded-lg uppercase">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414]/40 mb-4">Fit Analysis</h3>
                                    <div className="p-6 bg-white rounded-2xl border border-[#141414]/5 text-sm leading-relaxed opacity-80">
                                        {matchResult.fitAnalysis}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <button 
                                onClick={() => handleMatch(selectedJob)}
                                className="w-full py-6 bg-[#F27D26] text-[#141414] rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                            >
                                Calculate AI Match Score <Sparkles size={20} />
                            </button>
                        )}
                    </div>

                    <div className="p-10 pt-0">
                        {showCoverLetter ? (
                            <div className="space-y-4">
                                <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414]/40 flex items-center gap-2"><ScrollText size={16} /> Cover Letter (Review & Edit)</h3>
                                <textarea 
                                    className="w-full h-48 p-4 bg-white rounded-2xl border border-[#141414]/10 text-sm resize-none outline-none focus:border-[#F27D26] transition-colors"
                                    value={coverLetterText}
                                    onChange={(e) => setCoverLetterText(e.target.value)}
                                ></textarea>
                                <button 
                                   onClick={handleApply}
                                   className="w-full py-5 bg-[#141414] text-[#F5F5F0] rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    Submit Application <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                   onClick={async () => {
                                       setGeneratingLetter(true);
                                       const res = await aiService.generateCoverLetter(profile, selectedJob);
                                       setCoverLetterText(res.coverLetter);
                                       setShowCoverLetter(true);
                                       setGeneratingLetter(false);
                                   }}
                                   disabled={generatingLetter}
                                   className="flex-1 py-5 bg-[#F5F5F0] text-[#141414] border border-[#141414]/10 rounded-2xl font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 hover:border-[#F27D26]"
                                >
                                    {generatingLetter ? <Loader2 className="animate-spin text-[#F27D26]" size={20} /> : <><FileText size={20} className="text-[#F27D26]" /> AI Cover Letter</>}
                                </button>
                                <button 
                                   onClick={handleApply}
                                   className="flex-1 py-5 bg-[#141414] text-[#F5F5F0] rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    Quick Apply <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
