"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, CheckCircle, Zap, Shield } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    // Add protocol if missing for basic validation
    let validUrl = url;
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }
    
    // Store URL in sessionStorage and navigate
    sessionStorage.setItem("auditUrl", validUrl);
    router.push("/results");
  };

  const handleDemo = () => {
    setUrl("stripe.com");
  };

  return (
    <div className="w-full flex flex-col items-center pt-24 pb-16 px-6">
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
          <Sparkles size={16} />
          <span>Powered by Claude AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Instant AI UX Audit <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            For Your Website
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Find conversion leaks, fix confusing copy, and improve usability in seconds. Get actionable insights that drive real results.
        </p>
        
        <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mt-10 relative flex items-center shadow-xl shadow-blue-900/5 rounded-2xl p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="pl-4 text-slate-400">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g. yoursite.com)"
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/20 disabled:opacity-70"
          >
            {isLoading ? "Preparing..." : "Analyze Website"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>
        
        <div className="pt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Not sure?</span>
          <button 
            type="button" 
            onClick={handleDemo}
            className="text-blue-600 hover:underline font-medium"
          >
            Try a demo with Stripe.com
          </button>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Actionable Fixes</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Don't just get generic advice. We tell you exactly what's wrong and provide the specific copy to fix it.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Rewritten Copy</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Get high-converting alternatives for your headlines, subheadlines, and CTAs generated instantly.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Boost Trust</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Identify missing trust signals and social proof elements that are costing you conversions and sales.
          </p>
        </div>
      </div>
    </div>
  );
}
