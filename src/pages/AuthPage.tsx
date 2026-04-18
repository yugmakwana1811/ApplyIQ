import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../App";
import { motion } from "motion/react";
import { Loader2, ArrowRight, Briefcase, User as UserIcon } from "lucide-react";

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"SEEKER" | "RECRUITER">("SEEKER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      onLogin(data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-[#141414]/5"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-[#141414]/60 text-sm">
            {isLogin ? "Enter your credentials to access your dashboard" : "Join thousands of professionals on ApplyIQ"}
          </p>
        </div>

        {!isLogin && (
          <div className="flex gap-2 mb-8 p-1 bg-[#F5F5F0] rounded-xl">
            <button
              onClick={() => setRole("SEEKER")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                role === "SEEKER" ? "bg-white shadow-sm text-[#141414]" : "text-[#141414]/40 hover:text-[#141414]/60"
              }`}
            >
              <UserIcon size={16} /> Job Seeker
            </button>
            <button
              onClick={() => setRole("RECRUITER")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                role === "RECRUITER" ? "bg-white shadow-sm text-[#141414]" : "text-[#141414]/40 hover:text-[#141414]/60"
              }`}
            >
              <Briefcase size={16} /> Recruiter
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#141414]/40 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F0] border-none rounded-xl focus:ring-2 focus:ring-[#141414] transition-all outline-none"
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#141414]/40 mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F0] border-none rounded-xl focus:ring-2 focus:ring-[#141414] transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-4 bg-[#141414] text-[#F5F5F0] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Login" : "Create Account")}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#141414]/40 font-medium hover:text-[#141414] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
