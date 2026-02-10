
import React, { useState } from 'react';
import { Provider, ValidationResult, ValidationStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { detectProvider, validateGeminiKey, validateOpenAIKey, validateAnthropicKey } from '../services/apiService';

export const BulkValidator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startValidation = async () => {
    const keys = inputText
      .split(/[\n,]/)
      .map(k => k.trim())
      .filter(k => k.length > 5);

    if (keys.length === 0) return;

    setIsProcessing(true);
    setResults([]);
    setProgress(0);

    const newResults: ValidationResult[] = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const provider = detectProvider(key);
      let res: ValidationResult;

      try {
        switch (provider) {
          case Provider.GEMINI: res = await validateGeminiKey(key); break;
          case Provider.OPENAI: res = await validateOpenAIKey(key); break;
          case Provider.ANTHROPIC: res = await validateAnthropicKey(key); break;
          default: res = { provider: Provider.CUSTOM, status: ValidationStatus.ERROR, message: 'Unknown provider', key };
        }
      } catch (e) {
        res = { provider, status: ValidationStatus.ERROR, message: 'Execution failed', key };
      }

      newResults.push(res);
      setResults([...newResults]);
      setProgress(((i + 1) / keys.length) * 100);
      
      // Small delay to prevent rate limit spikes during bulk check
      await new Promise(r => setTimeout(r, 100));
    }

    setIsProcessing(false);
  };

  const validCount = results.filter(r => r.status === ValidationStatus.VALID).length;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border-blue-500/20">
        <label className="block text-sm font-semibold text-slate-300 mb-2">Paste Keys (New line or comma separated)</label>
        <textarea
          className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-300"
          placeholder="sk-abc...&#10;sk-ant-..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isProcessing}
        />
        
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={startValidation}
              disabled={isProcessing || !inputText.trim()}
              className={`px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto ${
                isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
              }`}
            >
              {isProcessing ? 'Validating...' : 'Start Bulk Check'}
            </button>
            {isProcessing && (
              <div className="flex-grow sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total</p>
                <p className="text-xl font-bold text-white">{results.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase text-green-500 font-bold tracking-wider">Valid</p>
                <p className="text-xl font-bold text-green-400">{validCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase text-red-500 font-bold tracking-wider">Invalid</p>
                <p className="text-xl font-bold text-red-400">{results.length - validCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Key (Masked)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Latency</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((res, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs text-slate-300 font-mono">
                        {res.key ? `${res.key.slice(0, 8)}...${res.key.slice(-4)}` : 'N/A'}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-400">{res.provider}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-mono">{res.latency ? `${res.latency}ms` : '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400 truncate max-w-xs">{res.message}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
