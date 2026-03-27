import { type ReactNode } from "react";

export function LoadingState({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analyzing Your Website</h2>
        <p className="text-slate-500 font-medium">{url}</p>
      </div>
      
      <div className="w-full space-y-6">
        <LoadingStep title="Scraping website content" active={true} done={false} />
        <LoadingStep title="Extracting layout & structure" active={true} done={false} delay="delay-300" />
        <LoadingStep title="Evaluating copy clarity" active={true} done={false} delay="delay-700" />
        <LoadingStep title="Generating improved version with Claude AI" active={true} done={false} delay="delay-1000" />
      </div>
    </div>
  );
}

function LoadingStep({ title, active, done, delay = "" }: { title: string; active: boolean; done: boolean; delay?: string }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-100 text-green-600' : active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
        {done ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        ) : active ? (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        ) : (
          <div className="w-2 h-2 rounded-full bg-current"></div>
        )}
      </div>
      <span className={`font-medium ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{title}</span>
    </div>
  );
}
