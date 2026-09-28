import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset, TrendingStock, CryptoAsset } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (item: any) => void;
  allItems: any[];
  isDarkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  allItems,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Stocks' | 'Indices' | 'Crypto' | 'Futures'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = allItems.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(query.toLowerCase()));

    if (!matchesQuery) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Stocks') {
      return item.category === 'US stocks' || item.type === 'volume' || item.type === 'gainers';
    }
    if (selectedFilter === 'Indices') {
      return item.category === 'World stocks' || item.symbol === 'SPX' || item.symbol === 'NDX' || item.symbol === 'DJI';
    }
    if (selectedFilter === 'Crypto') {
      return item.category === 'Crypto' || item.iconText !== undefined;
    }
    if (selectedFilter === 'Futures') {
      return item.category === 'Futures';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-colors flex flex-col ${
          isDarkMode
            ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
            : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center px-4 py-3.5 border-b gap-3 ${
            isDarkMode ? 'border-[#2a2e39]' : 'border-[#e0e3eb]'
          }`}
        >
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, indices, stocks, crypto (e.g. NVDA, SPX, BTC)..."
            className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-[#787b86]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#787b86] hover:text-[#131722] dark:hover:text-white p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#787b86]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div
          className={`flex items-center gap-1.5 px-4 py-2 border-b overflow-x-auto no-scrollbar text-xs font-semibold ${
            isDarkMode ? 'border-[#2a2e39] bg-[#151922]' : 'border-[#f0f3fa] bg-[#f8f9fd]'
          }`}
        >
          {(['All', 'Stocks', 'Indices', 'Crypto', 'Futures'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full transition-colors ${
                selectedFilter === filter
                  ? isDarkMode
                    ? 'bg-white text-[#131722] font-bold'
                    : 'bg-[#131722] text-white font-bold'
                  : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/10 dark:divide-[#2a2e39]/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#787b86]">
              <p className="text-sm">No instruments matching &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try searching for AAPL, SPX, Bitcoin, or DAX</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isPositive = (item.changePercent || 0) >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-[#f0f3fa]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#2962ff]/10 text-[#2962ff] font-bold text-xs flex items-center justify-center">
                      {item.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{item.symbol}</span>
                        <span className="text-xs text-[#787b86] truncate max-w-[200px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#787b86]">
                        {item.exchange || item.category || 'Trading Instrument'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-sm num-tabular">
                      ${item.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    {item.changePercent !== undefined && (
                      <div
                        className={`text-xs font-semibold num-tabular flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          className={`px-4 py-2 text-[11px] text-[#787b86] border-t flex justify-between items-center ${
            isDarkMode ? 'border-[#2a2e39] bg-[#151922]' : 'border-[#e0e3eb] bg-[#fbfcfe]'
          }`}
        >
          <span>Use ⌘K or Ctrl+K to open anytime</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
