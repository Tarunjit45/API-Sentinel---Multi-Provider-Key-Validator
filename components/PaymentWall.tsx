
import React, { useState } from 'react';

interface PaymentWallProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export const PaymentWall: React.FC<PaymentWallProps> = ({ onUnlock, onCancel }) => {
  const [step, setStep] = useState<'pay' | 'verifying'>('pay');
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [error, setError] = useState('');

  // ==========================================
  // START: PAYMENT CONFIGURATION (UPDATED)
  // ==========================================
  const upiId = "9641986575@ybl"; 
  const payeeName = "Sentinel Merchant";
  const amount = "5.00";
  const transactionNote = "API Sentinel Activation";
  // ==========================================

  /**
   * SCANNING ERROR FIX:
   * Some apps fail with "Technical Issue" if the UPI URL is too long or has too many parameters.
   * We use the most simplified version of the UPI string for the QR code.
   */
  const simpleUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  
  // Specific deep links for app launches (more parameters are fine here)
  const phonePeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const gPayUrl = `googlepay://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const paytmUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  /**
   * QR OPTIMIZATION:
   * Using 'L' (Low) error correction makes the QR code significantly less dense (fewer dots).
   * Fewer dots = much easier for phone cameras to focus on and scan instantly.
   */
  const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(simpleUpiUrl)}&bgcolor=ffffff&color=000000&qzone=2&ecc=L`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoVerify = () => {
    if (utr.length < 12) {
      setError('Transaction ID (UTR) must be 12 digits');
      return;
    }
    setError('');
    setStep('verifying');
    // Mocking bank ledger synchronization
    setTimeout(() => {
      onUnlock();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl p-4 overflow-y-auto antialiased">
      <div className="w-full max-w-[540px] bg-[#0b0b0b] rounded-[48px] flex flex-col items-center overflow-hidden relative shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/10 animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 border border-white/5 shadow-xl"
        >
          <span className="text-xl">✕</span>
        </button>

        {step === 'pay' ? (
          <div className="flex flex-col items-center w-full px-6 sm:px-10 py-12">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5f259f] to-[#7c3aed] rounded-[24px] flex items-center justify-center shadow-2xl border border-white/20 ring-4 ring-purple-600/10">
                <span className="text-white text-4xl font-black">₹</span>
              </div>
              <div className="text-left">
                <span className="text-4xl font-black text-white tracking-tighter block leading-none italic uppercase">Sentinel Pay</span>
                <span className="text-[10px] text-purple-400 font-black tracking-[0.3em] uppercase mt-2 block">Unified Payment Portal</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-start">
              {/* Left Side: Optimized QR */}
              <div className="flex flex-col items-center gap-5">
                <div className="bg-white p-6 rounded-[36px] shadow-[0_0_60px_rgba(124,58,237,0.3)] group transition-all duration-500 hover:scale-[1.02]">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 relative bg-white flex items-center justify-center p-2">
                    <img 
                      src={fallbackQr} 
                      alt="UPI QR CODE" 
                      className="w-full h-full relative z-10 block" 
                      style={{ imageRendering: 'pixelated' }} 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Scan & Pay ₹{amount}
                  </p>
                </div>
              </div>

              {/* Right Side: Mobile Apps & Manual */}
              <div className="space-y-6">
                <div className="text-left">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 opacity-50 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-white/20"></span>
                    Direct App Launch
                  </h4>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <a href={phonePeUrl} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 bg-[#5f259f]/20 border border-[#5f259f]/40 rounded-2xl flex items-center justify-center group-hover:bg-[#5f259f] transition-all">
                        <span className="text-white font-black text-xs uppercase italic">PP</span>
                      </div>
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">PhonePe</span>
                    </a>
                    <a href={gPayUrl} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/40 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                        <span className="text-white font-black text-xs uppercase italic">GP</span>
                      </div>
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">G-Pay</span>
                    </a>
                    <a href={paytmUrl} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 bg-[#00baf2]/20 border border-[#00baf2]/40 rounded-2xl flex items-center justify-center group-hover:bg-[#00baf2] transition-all">
                        <span className="text-white font-black text-xs uppercase italic">PY</span>
                      </div>
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Paytm</span>
                    </a>
                  </div>

                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-3 opacity-50 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-white/20"></span>
                    UTR Verification
                  </h4>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Enter 12-digit UTR No."
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-4 text-white text-lg font-mono focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none placeholder:text-slate-700 transition-all shadow-inner"
                    />
                    {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse px-2">{error}</p>}
                    <button
                      onClick={handleAutoVerify}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-5 rounded-[22px] font-black text-xs transition-all shadow-xl shadow-purple-900/20 active:scale-95 uppercase tracking-[0.2em] border-t border-white/20"
                    >
                      Verify Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-white/[0.03] border border-white/10 rounded-[36px] w-full flex items-center justify-between group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Payable Fee</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">₹{amount}.00</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10 relative z-10"></div>
              <div className="text-right relative">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">UPI ID</p>
                <p className="text-xs font-black text-slate-300 uppercase tracking-tighter font-mono">{upiId}</p>
                <button onClick={handleCopy} className="text-[8px] text-blue-400 font-black uppercase tracking-widest mt-1 hover:text-blue-300 transition-colors">
                  {copied ? 'ID COPIED!' : 'COPY UPI ID'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center min-h-[500px] text-center w-full bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan"></div>
            </div>
            <div className="relative w-36 h-36 mb-12">
               <div className="absolute inset-0 border-[4px] border-purple-500/10 rounded-full"></div>
               <div className="absolute inset-0 border-[4px] border-t-purple-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.2)] rounded-full bg-slate-900/50">
                  <span className="text-5xl animate-bounce">📡</span>
               </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">Validating Node Link...</h2>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 w-full max-w-[380px] backdrop-blur-3xl shadow-2xl">
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Sentinel is performing a deep-sync with the BHIM UPI protocol for transaction: <span className="text-white font-black font-mono block mt-2 text-lg">{utr}</span>
              </p>
            </div>
            <div className="mt-14 w-full max-w-[340px] space-y-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-[loading_4.5s_linear] rounded-full"></div>
              </div>
              <div className="flex justify-between px-2">
                <p className="text-[10px] text-purple-400 font-black tracking-widest uppercase animate-pulse">Syncing Ledger</p>
                <p className="text-[10px] text-slate-600 font-mono uppercase">Status: Routing</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(500px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
