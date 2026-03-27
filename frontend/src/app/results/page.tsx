"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, AlertCircle, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
// Backend types
interface AuditIssue {
  category: string;
  problem: string;
  impact: string;
  fix: string;
}

interface ImprovedVersion {
  headline: string;
  subheadline: string;
  cta: string;
  sections: string[];
}

interface AuditReport {
  overall_score: number;
  summary: string;
  issues: AuditIssue[];
  improved_version: ImprovedVersion;
}

export default function Results() {
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  useEffect(() => {
    // Get URL from session storage on mount
    const storedUrl = sessionStorage.getItem("auditUrl");
    if (!storedUrl) {
      router.push("/");
      return;
    }
    
    setUrl(storedUrl);
    fetchReport(storedUrl);
  }, [router]);

  const fetchReport = async (targetUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error: ${res.status}`);
      }
      
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Audit failed:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze website");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    
    // Dynamically import to avoid SSR 'self is not defined' errors
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin: 10,
      filename: `UXSense_Audit_${url?.replace("https://", "").replace("/", "")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800";
  };

  if (isLoading) {
    return <LoadingState url={url || "website"} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Failed</h2>
        <p className="text-slate-600 max-w-md">{error}</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          Try Another URL
        </button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group font-medium"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
            Target: <strong>{url}</strong>
          </span>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium border border-blue-200"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Report Content to be Exported */}
      <div id="report-content" className="space-y-12">
        
        {/* Top Section: Score & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Card */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-slate-500 mb-6">Overall UX Score</h3>
            
            {/* Simple CSS Circular Progress */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - report.overall_score / 100)}`}
                  className={getScoreColor(report.overall_score)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold ${getScoreColor(report.overall_score)}`}>{report.overall_score}</span>
                <span className="text-sm font-medium text-slate-400 mt-1">out of 100</span>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full border text-sm font-bold ${getScoreBg(report.overall_score)}`}>
              {report.overall_score >= 80 ? 'Excellent' : report.overall_score >= 60 ? 'Needs Improvement' : 'Critical Issues'}
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-blue-500" size={24} />
              Executive Summary
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {report.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            Critical UX Issues ({report.issues.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.issues.map((issue, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider w-fit mb-4">
                  {issue.category}
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {issue.problem}
                </h4>
                
                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 mb-4 text-sm text-red-900 dark:text-red-200">
                  <strong>Impact:</strong> {issue.impact}
                </div>
                
                <div className="mt-auto bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-5">
                  <span className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-2">
                    <CheckCircle size={16} /> Solution
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{issue.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improved Version Section */}
        {report.improved_version && (
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[3rem] -z-10" />
            <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border-blue-100 dark:border-blue-900/30">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                    <Sparkles className="text-blue-500" size={32} />
                    AI Copywriter
                  </h3>
                  <p className="text-slate-500 mt-2 text-lg">Optimized variations to test for higher conversions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Before (Conceptual) */}
                <div className="space-y-6 opacity-60 grayscale filter">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    Current Version <ArrowRight size={16}/>
                  </h4>
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-8"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-8"></div>
                    <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded-lg w-1/3"></div>
                  </div>
                </div>

                {/* After (Improved) */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
                    <Sparkles size={16}/> Improved Version
                  </h4>
                  <div className="p-8 border-2 border-blue-500 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                    
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                      {report.improved_version.headline}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                      {report.improved_version.subheadline}
                    </p>
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto text-center">
                      {report.improved_version.cta}
                    </button>
                    
                    {report.improved_version.sections && report.improved_version.sections.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Suggested Content Sections</h5>
                        <ul className="space-y-3">
                          {report.improved_version.sections.map((sec, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                              <CheckCircle className="text-blue-500 mt-1 shrink-0" size={16} />
                              <span>{sec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
