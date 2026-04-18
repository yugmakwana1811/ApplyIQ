import { useState, useEffect } from "react";
import { User } from "../../App";
import { Bell, Mail, Smartphone, Save, Loader2, Sparkles } from "lucide-react";

export default function SeekerPreferences({ user }: { user: User }) {
  const [pref, setPref] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    keywords: [] as string[],
    categories: [] as string[],
    workModes: [] as string[],
    experienceLevels: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    fetchPrefs();
  }, [user]);

  const fetchPrefs = async () => {
    try {
      const res = await fetch(`/api/preferences/${user?.id}`);
      const data = await res.json();
      setPref({
        emailAlerts: data.emailAlerts ?? true,
        inAppAlerts: data.inAppAlerts ?? true,
        keywords: data.keywords ? JSON.parse(data.keywords) : [],
        categories: data.categories ? JSON.parse(data.categories) : [],
        workModes: data.workModes ? JSON.parse(data.workModes) : [],
        experienceLevels: data.experienceLevels ? JSON.parse(data.experienceLevels) : []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePrefs = async () => {
    setSaving(true);
    try {
      await fetch(`/api/preferences/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref)
      });
      alert("Preferences saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (field: keyof typeof pref, value: string) => {
    setPref(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter(v => v !== value) };
      return { ...prev, [field]: [...arr, value] };
    });
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Job Preferences</h1>
          <p className="text-[#141414]/60">Customize how and when you get notified about new opportunities.</p>
        </div>
        <button 
          onClick={savePrefs}
          disabled={saving}
          className="bg-[#F27D26] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Bell size={20} className="text-[#F27D26]" /> Notifications</h3>
            
            <label className="flex items-center justify-between p-4 border border-[#141414]/10 rounded-2xl cursor-pointer hover:bg-[#F5F5F0] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#141414] text-white rounded-xl flex items-center justify-center"><Mail size={18} /></div>
                <div>
                  <div className="font-bold">Email Alerts</div>
                  <div className="text-xs text-[#141414]/60">Get highly-relevant job matches delivered to your inbox.</div>
                </div>
              </div>
              <input type="checkbox" checked={pref.emailAlerts} onChange={e => setPref({...pref, emailAlerts: e.target.checked})} className="w-5 h-5 accent-[#F27D26]" />
            </label>

            <label className="flex items-center justify-between p-4 border border-[#141414]/10 rounded-2xl cursor-pointer hover:bg-[#F5F5F0] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#141414] text-white rounded-xl flex items-center justify-center"><Smartphone size={18} /></div>
                <div>
                  <div className="font-bold">In-App Notifications</div>
                  <div className="text-xs text-[#141414]/60">Get instant pings on your dashboard when recruiters post.</div>
                </div>
              </div>
              <input type="checkbox" checked={pref.inAppAlerts} onChange={e => setPref({...pref, inAppAlerts: e.target.checked})} className="w-5 h-5 accent-[#F27D26]" />
            </label>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">Target Keywords</h3>
            <p className="text-xs text-[#141414]/60 -mt-4 mb-4">Add skills, job titles, or specific technologies.</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newKeyword) {
                    toggleArrayItem('keywords', newKeyword.trim());
                    setNewKeyword("");
                  }
                }}
                className="flex-1 px-4 py-2 border border-[#141414]/10 rounded-xl outline-none focus:border-[#F27D26]"
                placeholder="e.g. Next.js"
              />
              <button 
                onClick={() => {
                  if (newKeyword) {
                    toggleArrayItem('keywords', newKeyword.trim());
                    setNewKeyword("");
                  }
                }}
                className="bg-[#141414] text-white px-4 py-2 rounded-xl font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {pref.keywords.map(kw => (
                <span key={kw} className="bg-[#F5F5F0] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                  {kw} 
                  <button onClick={() => toggleArrayItem('keywords', kw)} className="text-[#141414]/40 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#141414]/5">
            <h3 className="text-lg font-bold mb-6">Work Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Remote", "Hybrid", "Onsite"].map(mode => (
                <button 
                  key={mode}
                  onClick={() => toggleArrayItem('workModes', mode)}
                  className={`p-3 rounded-xl border font-bold text-sm transition-all ${pref.workModes.includes(mode) ? 'bg-[#141414] text-white border-[#141414]' : 'bg-transparent border-[#141414]/10 text-[#141414]/60 hover:bg-[#F5F5F0]'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#141414]/5">
            <h3 className="text-lg font-bold mb-6">Experience Level</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Entry Level", "Mid Level", "Senior", "Director", "Executive"].map(level => (
                <button 
                  key={level}
                  onClick={() => toggleArrayItem('experienceLevels', level)}
                  className={`p-3 rounded-xl border font-bold text-sm transition-all ${pref.experienceLevels.includes(level) ? 'bg-[#141414] text-white border-[#141414]' : 'bg-transparent border-[#141414]/10 text-[#141414]/60 hover:bg-[#F5F5F0]'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] text-[#F5F5F0] p-8 rounded-3xl">
             <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase opacity-50 mb-3"><Sparkles size={16}/> AI Auto-Matching</div>
             <p className="text-sm opacity-90 leading-relaxed">
               With your preferences saved, our matching engine will continuously background-scan the marketplace and alert you within minutes if a "unicorn" role opens up that perfectly matches your criteria.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
