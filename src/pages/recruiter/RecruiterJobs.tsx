import { useState, useEffect } from "react";
import { User } from "../../App";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Briefcase, MapPin, DollarSign, X, Loader2, ListFilter, Trash2, Wand2 } from "lucide-react";
import { aiService } from "../../services/aiService";

export default function RecruiterJobs({ user }: { user: User }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    category: "Engineering",
    type: "FULL_TIME"
  });

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs`);
      const data = await res.json();
      setJobs(data.filter((j: any) => j.recruiterId === user?.recruiterId));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.company) {
        alert("Please enter a Job Title and Company Name to generate a description.");
        return;
    }
    setFormData(prev => ({ ...prev, description: "AI is crafting the perfect job description..." }));
    try {
        const desc = await aiService.generateJobDescription(formData.title, formData.company, formData.type);
        setFormData(prev => ({ ...prev, description: desc }));
    } catch (err) {
        setFormData(prev => ({ ...prev, description: "Failed to generate description. Please try again." }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recruiterId: user?.recruiterId }),
      });
      if (res.ok) {
        setShowForm(false);
        fetchJobs();
        setFormData({
            title: "",
            company: "",
            description: "",
            requirements: "",
            location: "",
            salary: "",
            category: "Engineering",
            type: "FULL_TIME"
          });
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">My Listings</h1>
            <p className="text-[#141414]/60">Manage your active job postings and see applicant numbers.</p>
        </div>
        <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#141414] text-[#F5F5F0] rounded-xl font-bold flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-[#141414]/10"
        >
            <Plus size={20} /> Create Listing
        </button>
      </header>

      {loading ? (
        <div className="space-y-4">
            {[1,2].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse"></div>)}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
            {jobs.map((job: any) => (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-[#141414]/5 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-[#F5F5F0] rounded-2xl flex items-center justify-center font-bold text-xl text-[#141414]/20">
                            {job.title[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                            <div className="flex items-center gap-4 text-xs font-medium text-[#141414]/40">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold">{job.category}</span>
                                <div className="flex items-center gap-1.5"><MapPin size={12} /> {job.location || 'Remote'}</div>
                                <div className="flex items-center gap-1.5"><DollarSign size={12} /> {job.salary}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                             <div className="text-sm font-black">12</div>
                             <div className="text-[10px] uppercase font-bold tracking-widest text-[#141414]/40">Candidates</div>
                        </div>
                        <button className="p-3 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-[#141414]/20">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[3rem] border border-[#141414]/5 text-center">
            <Briefcase size={48} className="mx-auto text-[#141414]/10 mb-6" />
            <h3 className="text-xl font-bold mb-2">No active listings</h3>
            <p className="text-[#141414]/40 max-w-sm mx-auto">Create your first job posting to start receiving AI-ranked candidate matches.</p>
        </div>
      )}

      {/* New Job Modal */}
      <AnimatePresence>
        {showForm && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            >
                <div className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm" onClick={() => !submitting && setShowForm(false)}></div>
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-3xl bg-white rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 border-b border-[#141414]/5 flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">Post New Role</h2>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField label="Job Title" placeholder="Senior Engineer" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                            <FormField label="Company Name" placeholder="ApplyIQ Inc." value={formData.company} onChange={v => setFormData({...formData, company: v})} />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField label="Location" placeholder="Remote / New York" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                            <FormField label="Salary Range" placeholder="$120k - $160k" value={formData.salary} onChange={v => setFormData({...formData, salary: v})} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs uppercase font-bold tracking-widest text-[#141414]/40 mb-2 ml-1">Category</label>
                                <select 
                                    className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl outline-none font-medium appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option>Engineering</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Management</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs uppercase font-bold tracking-widest text-[#141414]/40 mb-2 ml-1">Employment Type</label>
                                <select 
                                    className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl outline-none font-medium appearance-none"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="INTERNSHIP">Internship</option>
                                </select>
                             </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs uppercase font-bold tracking-widest text-[#141414]/40 ml-1">Job Description</label>
                                <button type="button" onClick={handleGenerateDescription} className="text-[10px] font-bold text-[#F27D26] uppercase tracking-widest hover:underline flex items-center gap-1">
                                    <Wand2 size={12} /> Auto-Write with AI
                                </button>
                            </div>
                            <textarea 
                                rows={4}
                                placeholder="Detail the responsibilities and daily tasks..."
                                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl outline-none font-medium resize-none focus:ring-2 focus:ring-[#F27D26]/50 transition-all"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button 
                                disabled={submitting}
                                className="w-full py-5 bg-[#141414] text-[#F5F5F0] rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 size={24} className="animate-spin" /> : 'Launch Listing'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormField({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-xs uppercase font-bold tracking-widest text-[#141414]/40 mb-2 ml-1">{label}</label>
            <input 
                type="text" 
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-[#F5F5F0] rounded-xl outline-none font-medium focus:ring-2 focus:ring-[#141414] transition-all"
                value={value}
                onChange={e => onChange(e.target.value)}
                required
            />
        </div>
    );
}
