
import React, { useState, useEffect } from 'react';
import { UniversalValidator } from './components/UniversalValidator';
import { BulkValidator } from './components/BulkValidator';
import { PaymentWall } from './components/PaymentWall';

const App: React.FC = () => {
  const [view, setView] = useState<'single' | 'bulk'>('single');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem('api_sentinel_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowPayment(false);
    localStorage.setItem('api_sentinel_unlocked', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {showPayment && <PaymentWall onUnlock={handleUnlock} onCancel={() => setShowPayment(false)} />}
      
      <div className="transition-all duration-1000 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-white/5 glass-panel sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10 group cursor-pointer overflow-hidden relative">
                <span className="text-2xl relative z-10 group-hover:scale-125 transition-transform">📡</span>
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white leading-none uppercase italic">API SENTINEL</h1>
                <p className="text-[9px] uppercase tracking-[0.3em] text-blue-400 font-black mt-1.5">Enterprise Infrastructure Diagnosis</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-2">
              <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex backdrop-blur-3xl">
                <button 
                  onClick={() => setView('single')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'single' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
                >
                  Universal
                </button>
                <button 
                  onClick={() => setView('bulk')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'bulk' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
                >
                  Bulk List
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
          <div className="absolute top-40 left-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full -z-10"></div>

          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
              {view === 'single' ? (
                <>DECODE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">CREDENTIALS</span></>
              ) : (
                <>MASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">KEY ANALYSIS</span></>
              )}
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              {view === 'single' 
                ? "Paste any Google, OpenAI, or Anthropic key. Our system instantly identifies the provider and runs a deep-packet diagnostic on its health."
                : "Import a list of raw keys. Sentinel will auto-route each token to its correct provider, validate latency, and generate a batch status report."}
            </p>
          </div>

          <UniversalValidator isUnlocked={isUnlocked} onTriggerPayment={() => setShowPayment(true)} />

          {/* Security Banner */}
          <section className="mt-32 p-1 relative group overflow-hidden rounded-[40px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-gradient-x opacity-50"></div>
            <div className="relative glass-panel rounded-[40px] p-10 md:p-14 border border-white/10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
              <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-5xl shadow-2xl border border-white/10 shrink-0 transform group-hover:rotate-12 transition-transform duration-500">
                🛡️
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Non-Custodial Validation</h3>
                  <p className="text-slate-400 text-lg font-medium max-w-xl">Sentinel uses local-only execution. Your keys never leave your browser session and are never logged or stored.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-auto border-t border-white/5 py-16 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white uppercase tracking-tighter italic">API SENTINEL</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} INFRASTRUCTURE DIAGNOSIS UNIT.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
