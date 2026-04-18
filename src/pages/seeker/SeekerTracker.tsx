import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardList, Clock, CheckCircle2, XCircle, MoreVertical, Briefcase, Calendar, MessageSquare, Send, Bot, User as UserIcon } from "lucide-react";
import { aiService } from "../../services/aiService";

export default function SeekerTracker({ user }: { user: User }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [interviewApp, setInterviewApp] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${user?.id}`);
      setProfile(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`/api/applications/${user?.id}`);
      setApplications(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const startInterview = async (app: any) => {
    setInterviewApp(app);
    setChatHistory([{ role: 'model', text: `Hi there! I'm your AI interviewer for the ${app.job.title} role at ${app.job.company}. Ready to get started with a few practice interview questions?` }]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !profile) return;
    
    const userMsg = { role: 'user', text: chatInput };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp = await aiService.generateInterviewResponse(interviewApp.job, profile, newHistory);
      setChatHistory([...newHistory, { role: 'model', text: resp }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'SHORTLISTED': return 'bg-green-50 text-green-600 border-green-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Clock size={14} />;
      case 'SHORTLISTED': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">My Applications</h1>
        <p className="text-[#141414]/60">Track the status of your job submissions in real-time.</p>
      </header>

      {loading ? (
        <div className="grid gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-[#141414]/5 hover:border-[#141414]/10 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#F5F5F0] rounded-2xl flex items-center justify-center font-bold text-xl text-[#141414]/20 group-hover:scale-105 transition-transform">
                    {app.job.company[0]}
                </div>
                <div>
                   <h3 className="font-bold text-lg mb-1">{app.job.title}</h3>
                   <div className="flex items-center gap-4 text-xs font-medium text-[#141414]/40">
                        <div className="flex items-center gap-1.5"><Briefcase size={14} /> {app.job.company}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={14} /> Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest hidden sm:flex ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                </div>
                <button 
                  onClick={() => startInterview(app)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
                >
                    <MessageSquare size={14} /> Mock Interview
                </button>
                <button className="p-2 hover:bg-[#F5F5F0] rounded-lg transition-colors opacity-40 hover:opacity-100">
                    <MoreVertical size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[3rem] border border-[#141414]/5 text-center">
            <ClipboardList size={48} className="mx-auto text-[#141414]/10 mb-6" />
            <h3 className="text-xl font-bold mb-2">No applications yet</h3>
            <p className="text-[#141414]/40 max-w-sm mx-auto">Start matching and applying to jobs to see them trackable here on your dashboard.</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-6">
          <StatSummary label="Total" count={applications.length} color="bg-white" />
          <StatSummary label="Pending" count={applications.filter(a => a.status === 'PENDING').length} color="bg-orange-50/50" textColor="text-orange-600" />
          <StatSummary label="Shortlisted" count={applications.filter(a => a.status === 'SHORTLISTED').length} color="bg-green-50/50" textColor="text-green-600" />
          <StatSummary label="Rejected" count={applications.filter(a => a.status === 'REJECTED').length} color="bg-red-50/50" textColor="text-red-600" />
      </div>

      {/* AI Interview Chat Modal */}
      <AnimatePresence>
        {interviewApp && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            >
                <div className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm" onClick={() => setInterviewApp(null)}></div>
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-2xl bg-[#F5F5F0] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col h-[80vh]"
                >
                    <div className="bg-[#141414] text-[#F5F5F0] p-6 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight">AI Interview Coach</h2>
                                <p className="text-[#F5F5F0]/60 text-xs">Practicing for {interviewApp.job.title}</p>
                            </div>
                        </div>
                        <button onClick={() => setInterviewApp(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                            <XCircle size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-[#141414] text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#141414] text-white rounded-tr-none' : 'bg-white border border-[#141414]/5 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex gap-4 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                    <Bot size={14} />
                                </div>
                                <div className="p-4 rounded-2xl text-sm bg-white border border-[#141414]/5 rounded-tl-none flex gap-1 items-center text-[#141414]/40 h-12">
                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></div>
                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-[#141414]/5 shrink-0">
                        <div className="relative">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your response..."
                                className="w-full bg-[#F5F5F0] rounded-xl pl-4 pr-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#141414]/10 transition-all font-medium"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={chatLoading || !chatInput.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#141414] text-white rounded-lg flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
                            >
                                <Send size={16} className="-ml-0.5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatSummary({ label, count, color, textColor }: { label: string, count: number, color: string, textColor?: string }) {
    return (
        <div className={`p-6 rounded-2xl border border-[#141414]/5 ${color}`}>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#141414]/40 mb-2">{label}</div>
            <div className={`text-4xl font-bold ${textColor || 'text-[#141414]'}`}>{count}</div>
        </div>
    );
}
