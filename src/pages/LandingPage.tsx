import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Rocket, Shield, Target, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 overflow-hidden bg-[#141414] text-[#F5F5F0]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl lg:text-9xl font-sans font-bold leading-[0.85] tracking-tighter mb-8 uppercase">
              The smartest <br />
              <span className="text-[#F27D26]">way to get hired</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#F5F5F0]/70 max-w-lg mb-12">
              ApplyIQ uses advanced AI to analyze resumes, match you with perfect jobs, and generate winning career roadmaps.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/auth"
                className="px-8 py-4 bg-[#F27D26] text-[#141414] rounded-full text-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Start for free <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 border border-[#F5F5F0]/30 rounded-full text-lg font-bold hover:bg-[#F5F5F0]/10 transition-colors">
                How it works
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="w-full aspect-square bg-[#F27D26]/10 rounded-3xl border border-[#F27D26]/20 flex items-center justify-center relative overflow-hidden">
               {/* Abstract decorative elements */}
               <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#F27D26] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
               <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse delay-700"></div>
               
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10 max-w-md">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F27D26] to-orange-300"></div>
                    <div>
                        <div className="w-24 h-3 bg-white/20 rounded-full mb-2"></div>
                        <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest opacity-60">Match Score</span>
                        <span className="text-2xl font-bold text-[#F27D26]">98%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-[#F27D26]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-2 bg-white/5 rounded-full"></div>
                        ))}
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-widest text-[#141414]/40 font-bold mb-4">Powerful Features</h2>
            <h3 className="text-4xl lg:text-6xl font-bold tracking-tight">Everything you need to level up</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
                icon={<Rocket size={24} />}
                title="Resume Analysis"
                description="Get instant feedback on your resume with ATS scoring and optimization tips."
            />
            <FeatureCard 
                icon={<Target size={24} />}
                title="Smart Matching"
                description="Our AI engine ranks jobs based on your skills and career aspirations."
            />
            <FeatureCard 
                icon={<Shield size={24} />}
                title="Privacy First"
                description="Your data is secure and you control who sees your professional profile."
            />
            <FeatureCard 
                icon={<CheckCircle size={24} />}
                title="Roadmap Builder"
                description="Step-by-step career path generation to help you reach your dream role."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl lg:text-7xl font-bold mb-2">10k+</div>
            <div className="text-[#141414]/60 uppercase tracking-widest text-xs font-bold">Resumes Analyzed</div>
          </div>
          <div>
            <div className="text-5xl lg:text-7xl font-bold mb-2">85%</div>
            <div className="text-[#141414]/60 uppercase tracking-widest text-xs font-bold">Interview rate increase</div>
          </div>
          <div>
            <div className="text-5xl lg:text-7xl font-bold mb-2">500+</div>
            <div className="text-[#141414]/60 uppercase tracking-widest text-xs font-bold">Partner Companies</div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                   <span className="text-[#F27D26] font-bold text-sm tracking-widest uppercase mb-4 block">For Job Seekers</span>
                   <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">Land your dream job with AI assistance.</h2>
                   <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-[#F27D26] mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Personalized resume improvements that get past ATS filters.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-[#F27D26] mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Automated job matching from thousands of listings.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-[#F27D26] mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Skill gap analysis and roadmap generation for students.</p>
                        </li>
                   </ul>
                   <Link to="/auth" className="inline-flex items-center gap-2 font-bold text-lg hover:gap-4 transition-all">
                        Create Seeker Account <ArrowRight size={20} />
                   </Link>
                </div>
                <div className="relative">
                    <div className="aspect-video bg-[#F5F5F0] rounded-2xl overflow-hidden border border-[#141414]/5 shadow-sm">
                        <img 
                            src="https://picsum.photos/seed/seeker/1200/800" 
                            alt="Job Seeker" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                <div className="lg:order-2">
                   <span className="text-blue-500 font-bold text-sm tracking-widest uppercase mb-4 block">For Recruiters</span>
                   <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">Find top talent instantly with AI ranking.</h2>
                   <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-blue-500 mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Advanced candidate scoring based on skills and context.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-blue-500 mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Streamlined application management and collaboration.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-blue-500 mt-1 shrink-0" />
                            <p className="text-lg opacity-80">Automated outreach and interview scheduling assistance.</p>
                        </li>
                   </ul>
                   <Link to="/auth" className="inline-flex items-center gap-2 font-bold text-lg hover:gap-4 transition-all">
                        Post a Job Now <ArrowRight size={20} />
                   </Link>
                </div>
                <div className="lg:order-1">
                    <div className="aspect-video bg-[#F5F5F0] rounded-2xl overflow-hidden border border-[#141414]/5 shadow-sm">
                        <img 
                            src="https://picsum.photos/seed/recruiter/1200/800" 
                            alt="Recruiter" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 bg-[#141414] text-[#F5F5F0] text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tighter">Ready to accelerate your career?</h2>
            <Link
                to="/auth"
                className="inline-flex px-12 py-6 bg-[#F27D26] text-[#141414] rounded-full text-xl font-bold hover:scale-105 transition-transform"
            >
                Join ApplyIQ Today
            </Link>
            <p className="mt-8 text-[#F5F5F0]/40 text-sm mono uppercase tracking-widest">Free tier available • No credit card required</p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 border-t border-[#141414]/10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <Zap size={20} />
                <span className="font-bold text-lg font-sans">ApplyIQ</span>
            </div>
            <div className="text-sm text-[#141414]/50">
                &copy; 2026 ApplyIQ Inc. All rights reserved.
            </div>
            <div className="flex gap-8 text-sm font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">Privacy</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Terms</a>
                <a href="#" className="hover:opacity-60 transition-opacity">Support</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-[#141414]/5 hover:border-[#141414]/20 bg-[#F5F5F0]/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-[#141414] text-[#F5F5F0] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-[#141414]/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
