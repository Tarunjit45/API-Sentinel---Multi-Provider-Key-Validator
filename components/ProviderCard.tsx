
import React, { useState } from 'react';
import { Provider, ProviderConfig, ValidationResult, ValidationStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { validateGeminiKey, validateOpenAIKey, validateAnthropicKey } from '../services/apiService';

interface ProviderCardProps {
  config: ProviderConfig;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ config }) => {
  const [apiKey, setApiKey] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [result, setResult] = useState<ValidationResult>({
    provider: config.id,
    status: ValidationStatus.IDLE,
    message: ''
  });

  const handleTest = async () => {
    if (config.id !== Provider.GEMINI && !apiKey.trim()) {
      setResult({ ...result, status: ValidationStatus.INVALID, message: 'Please enter a key.' });
      return;
    }

    setResult({ ...result, status: ValidationStatus.PENDING, message: 'Verifying with servers...' });
    setShowDetails(false);

    let validationResult: ValidationResult;

    switch (config.id) {
      case Provider.GEMINI:
        validationResult = await validateGeminiKey();
        break;
      case Provider.OPENAI:
        validationResult = await validateOpenAIKey(apiKey);
        break;
      case Provider.ANTHROPIC:
        validationResult = await validateAnthropicKey(apiKey);
        break;
      default:
        validationResult = { provider: config.id, status: ValidationStatus.ERROR, message: 'Unsupported' };
    }

    setResult(validationResult);
  };

  const isGemini = config.id === Provider.GEMINI;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full transition-all hover:border-blue-500/30 border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner">
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-none">{config.name}</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Infrastructure</p>
          </div>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <div className="flex-grow space-y-4">
        {!isGemini ? (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Authentication Token</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={config.placeholder}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 font-mono"
            />
          </div>
        ) : (
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <p className="text-xs text-blue-400 leading-relaxed font-medium">
              Targeting pre-configured environment key. Running a cold-start latency test.
            </p>
          </div>
        )}

        {result.status !== ValidationStatus.IDLE && result.errorAnalysis && (
          <div className={`rounded-xl overflow-hidden border ${
            result.status === ValidationStatus.VALID ? 'bg-green-500/[0.03] border-green-500/20' : 
            result.status === ValidationStatus.PENDING ? 'bg-blue-500/[0.03] border-blue-500/20' : 'bg-red-500/[0.03] border-red-500/20'
          }`}>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <p className={`text-sm font-bold ${result.status === ValidationStatus.VALID ? 'text-green-400' : 'text-red-400'}`}>
                  {result.message}
                </p>
                {result.latency && <span className="text-[10px] font-mono text-slate-500">{result.latency}ms</span>}
              </div>

              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                {showDetails ? 'Hide Deep Analysis' : 'Show Deep Analysis'}
                <span>{showDetails ? '↑' : '↓'}</span>
              </button>

              {showDetails && (
                <div className="space-y-4 pt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Use Case</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.errorAnalysis.whereToUse}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Root Cause Analysis</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.errorAnalysis.reason}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Integration Risks</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.errorAnalysis.expectedErrors}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Action</h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic">{result.errorAnalysis.nextSteps}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleTest}
        disabled={result.status === ValidationStatus.PENDING}
        className={`mt-6 w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
          result.status === ValidationStatus.PENDING 
            ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
        }`}
      >
        {result.status === ValidationStatus.PENDING ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Analyzing...
          </>
        ) : isGemini ? 'Run Global System Test' : 'Validate Infrastructure'}
      </button>
    </div>
  );
};
