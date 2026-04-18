import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building, MapPin, Globe, Briefcase, ExternalLink, ArrowLeft } from "lucide-react";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/${id}`);
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans">Loading company...</div>;
  if (!company) return <div className="h-screen flex items-center justify-center font-sans text-xl">Company not found.</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/dashboard/jobs" className="flex items-center gap-2 text-sm font-bold text-[#141414]/60 hover:text-[#141414] mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Jobs
        </Link>
        <div className="bg-white rounded-[3rem] p-10 border border-[#141414]/5 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="w-32 h-32 bg-[#F5F5F0] rounded-3xl flex items-center justify-center text-5xl font-black text-[#141414]/20 shrink-0">
               {company.companyName?.[0]}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold tracking-tight mb-2">{company.companyName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-[#141414]/60">
                {company.industry && <div className="flex items-center gap-1"><Briefcase size={16} /> {company.industry}</div>}
                {company.size && <div className="flex items-center gap-1"><Building size={16} /> {company.size} EMPLOYEES</div>}
                {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#F27D26]"><Globe size={16} /> Website</a>}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {company.description && (
              <div>
                <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414]/40 mb-3">About Us</h3>
                <p className="text-sm leading-relaxed opacity-80">{company.description}</p>
              </div>
            )}
            
            {company.culture && (
              <div className="bg-[#141414] text-[#F5F5F0] p-8 rounded-3xl">
                <h3 className="text-xs uppercase font-bold tracking-[0.2em] opacity-60 mb-3">Company Culture</h3>
                <p className="text-sm leading-relaxed opacity-90">{company.culture}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Open Roles ({company.jobs?.length || 0})</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {company.jobs?.map((job: any) => (
               <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#141414]/5 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="font-bold mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-[#141414]/60">
                          <span>{job.location || 'Remote'}</span> • <span>{job.type || 'Full Time'}</span>
                        </div>
                     </div>
                     <span className="text-[#F27D26] font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg">Apply</span>
                  </div>
               </div>
            ))}
            {(!company.jobs || company.jobs.length === 0) && (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-[#141414]/5 text-[#141414]/40">
                No active job listings found for this company.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
