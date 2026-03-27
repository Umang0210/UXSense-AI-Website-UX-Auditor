import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UXSense AI – Website UX Auditor",
  description: "Analyze any given website URL and generate a structured, actionable UX audit report.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col items-center">
        <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                UX
              </div>
              <span className="font-bold text-xl tracking-tight">Sense AI</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Login</a>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>
        
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} UXSense AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
