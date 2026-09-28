import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 relative transition-colors ${
          isDarkMode
            ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
            : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#787b86]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-[#131722]'
              }`}
            >
              Welcome to TradingView!
            </h3>
            <p className="text-xs text-[#787b86]">
              Confirmation sent to {email}. You now have full access to live market feeds.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                className={`w-8 h-6 ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}
                fill="currentColor"
                viewBox="0 0 36 28"
              >
                <path d="M4 4h7v20H4z" fill="currentColor" />
                <path d="M14 11h7v13h-7z" fill="currentColor" />
                <path d="M24 18h7v6h-7z" fill="currentColor" />
                <path d="M4 4h27v3H4z" fill="currentColor" />
              </svg>
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-[#131722]'
                }`}
              >
                Get started for free
              </h2>
            </div>

            <p className="text-xs text-[#787b86] mb-6">
              Track global markets, customize watchlists, set price alerts, and access advanced technical analysis.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#787b86]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#2962ff] ${
                    isDarkMode
                      ? 'bg-[#151922] border-[#2a2e39] text-white'
                      : 'bg-[#f8f9fd] border-[#e0e3eb] text-[#131722]'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 shadow-sm transition-all"
              >
                Continue with Email
              </button>

              <div className="relative my-4 text-center">
                <span className="text-[11px] text-[#787b86] px-2 bg-inherit">or</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail('demo.user@tradingview.com');
                  setSubmitted(true);
                  setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                  }, 1200);
                }}
                className={`w-full py-2.5 px-4 text-sm font-semibold rounded-full border transition-colors ${
                  isDarkMode
                    ? 'border-[#2a2e39] hover:bg-[#2a2e39] text-white'
                    : 'border-[#e0e3eb] hover:bg-[#f0f3fa] text-[#131722]'
                }`}
              >
                Continue as Guest Trader
              </button>
            </form>

            <p className="text-[10px] text-center text-[#787b86] mt-5">
              By proceeding, you agree to TradingView Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
