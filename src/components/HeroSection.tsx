import React, { useState } from 'react';
import { MarketCategory } from '../types/market';
import { ChevronDown, Globe2, TrendingUp, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  currentCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentCategory,
  onSelectCategory,
  isDarkMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const marketRegions: { name: string; category: MarketCategory; desc: string }[] = [
    { name: 'US Markets', category: 'US stocks', desc: 'S&P 500, Nasdaq, Dow Jones' },
    { name: 'World Stocks', category: 'World stocks', desc: 'DAX, FTSE, Nikkei, Hang Seng' },
    { name: 'Cryptocurrency', category: 'Crypto', desc: 'Bitcoin, Ethereum, Solana, Altcoins' },
    { name: 'Commodities & Futures', category: 'Futures', desc: 'Crude Oil, Gold, Natural Gas' },
    { name: 'Currencies & Forex', category: 'Forex', desc: 'EUR/USD, USD/JPY, GBP/USD' },
    { name: 'Government Bonds', category: 'Government bonds', desc: 'US 10Y, 2Y Yield, Bunds' },
    { name: 'Exchange Traded Funds', category: 'ETFs', desc: 'SPY, QQQ, VOO, TLT' },
    { name: 'Global Economy', category: 'Economy', desc: 'CPI, Federal Funds Rate, GDP' },
  ];

  return (
    <section className="text-center pt-8 pb-10 relative">
      <div className="inline-block relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-3 group cursor-pointer focus:outline-none"
        >
          <h1
            className={`text-4xl md:text-6xl font-bold tracking-tight tv-font-heading transition-colors ${
              isDarkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Markets, everywhere
          </h1>
          <ChevronDown
            className={`w-6 h-6 md:w-8 md:h-8 stroke-[2.5] group-hover:translate-y-1 transition-transform ${
              isDarkMode ? 'text-white' : 'text-[#131722]'
            }`}
          />
        </button>

        {/* Dropdown Menu when clicking heading */}
        {dropdownOpen && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-4 w-80 md:w-96 rounded-2xl shadow-2xl p-3 border z-50 text-left transition-all ${
              isDarkMode
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
                : 'bg-white border-[#e0e3eb] text-[#131722]'
            }`}
          >
            <div className="px-3 py-2 text-xs font-semibold text-[#787b86] uppercase tracking-wider flex items-center justify-between">
              <span>Quick Navigate Markets</span>
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto pr-1">
              {marketRegions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => {
                    onSelectCategory(region.category);
                    setDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between transition-colors ${
                    currentCategory === region.category
                      ? 'bg-[#2962ff]/10 text-[#2962ff]'
                      : isDarkMode
                      ? 'hover:bg-[#2a2e39]'
                      : 'hover:bg-[#f0f3fa]'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{region.name}</div>
                    <div className="text-xs text-[#787b86] mt-0.5">{region.desc}</div>
                  </div>
                  {currentCategory === region.category && (
                    <span className="text-xs bg-[#2962ff] text-white px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Market Clock / Status Bar */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#787b86]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium">US Markets Open</span>
        <span>•</span>
        <span>Real-time quotes with live tick streaming</span>
      </div>
    </section>
  );
};
