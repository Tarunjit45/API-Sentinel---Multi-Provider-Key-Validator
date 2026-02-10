
import React, { useState, useEffect } from 'react';
import { Provider, ValidationStatus, ValidationResult } from '../types';
import { detectProvider, validateUniversalKey } from '../services/apiService';
import { StatusBadge } from './StatusBadge';

interface UniversalValidatorProps {
  isUnlocked: boolean;
  onTriggerPayment: () => void;
}

export const UniversalValidator: React.FC<UniversalValidatorProps> = ({ isUnlocked, onTriggerPayment }) => {
  const [apiKey, setApiKey] = useState('');
  const [detectedProvider, setDetectedProvider] = useState<Provider>(Provider.CUSTOM);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (apiKey.trim()) {
      setDetectedProvider(detectProvider(apiKey));
    } else {
      setDetectedProvider(Provider.CUSTOM);
      setResult(null);
      setShowAnalysis(false);
    }
  }, [apiKey]);

  const handleVerify = async () => {
    if (!apiKey.trim()) return;

    if (!isUnlocked) {
      onTriggerPayment();
      return;
    }

    setIsVerifying(true);
    setShowAnalysis(false);
    
    const res = await validateUniversalKey(apiKey.trim());
    setResult(res);
    setIsVerifying(false);
    
    if (res.status === ValidationStatus.INVALID) {
      setShowAnalysis(true);
    }
  };

  const getProviderIcon = (p: Provider) => {
    switch (p) {
      case Provider.GEMINI: return '✨';
      case Provider.OPENAI: return '🤖';
      case Provider.ANTHROPIC: return '🦅';
      default: return '🔑';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-panel p-8 rounded-[32px] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Universal API Key Validator</h3>
              <p className="text-sm text-slate-400">Paste any key to auto-detect and verify status.</p>
            </div>
            {apiKey && (
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-lg">{getProviderIcon(detectedProvider)}</span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{detectedProvider} DETECTED</span>
              </div>
            )}
          </div>

          <div className="relative group">
            <textarea
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key here (sk-..., sk-ant-..., or Google Key)..."
              className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-6 text-lg font-mono focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-32 text-slate-200 placeholder:text-slate-700 shadow-inner"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleVerify}
              disabled={!apiKey.trim() || isVerifying}
              className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${
                !apiKey.trim() || isVerifying
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40 border-t border-white/20'
              }`}
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ANALYZING...
                </>
              ) : (isUnlocked ? 'VALIDATE INFRASTRUCTURE' : 'UNLOCK & VALIDATE')}
            </button>
            
            {result && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2">
                <StatusBadge status={result.status} />
                {result.latency && (
                  <span className="text-xs font-mono text-slate-500 border border-white/5 px-3 py-1.5 rounded-lg bg-white/5">
                    {result.latency}ms RT
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className={`glass-panel rounded-[32px] border-l-8 ${
            result.status === ValidationStatus.VALID ? 'border-l-green-500' : 
            result.status === ValidationStatus.INVALID ? 'border-l-red-500' : 'border-l-yellow-500'
          } p-8 space-y-8`}>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                  {getProviderIcon(result.provider)}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{result.provider} Diagnosis</h4>
                  <p className={`text-sm font-bold mt-1 ${result.status === ValidationStatus.VALID ? 'text-green-400' : 'text-red-400'}`}>
                    {result.message}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="px-6 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                {showAnalysis ? 'HIDE DETAILS' : 'VIEW FULL REPORT'}
              </button>
            </div>

            {showAnalysis && result.errorAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
                <div className="space-y-2 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Primary Use Case
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {result.errorAnalysis.whereToUse}
                  </p>
                </div>

                <div className="space-y-2 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                  <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Root Cause Analysis
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {result.errorAnalysis.reason}
                  </p>
                </div>

                <div className="space-y-2 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                  <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Potential Integration Errors
                  </h5>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {result.errorAnalysis.expectedErrors}
                  </p>
                </div>

                <div className="space-y-2 group p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Actionable Roadmap
                  </h5>
                  <p className="text-sm text-slate-100 leading-relaxed font-bold italic">
                    {result.errorAnalysis.nextSteps}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
