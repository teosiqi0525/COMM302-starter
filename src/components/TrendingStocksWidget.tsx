import React, { useState } from 'react';
import { TrendingStock } from '../types/market';

interface TrendingStocksWidgetProps {
  stocks: TrendingStock[];
  onSelectStock: (stock: TrendingStock) => void;
  onOpenScreener: () => void;
  isDarkMode: boolean;
}

export const TrendingStocksWidget: React.FC<TrendingStocksWidgetProps> = ({
  stocks,
  onSelectStock,
  onOpenScreener,
  isDarkMode,
}) => {
  const [filterType, setFilterType] = useState<'volume' | 'gainers'>('volume');

  const filteredStocks = stocks.filter((s) => s.type === filterType);

  return (
    <section
      className={`rounded-2xl border p-6 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
        isDarkMode
          ? 'bg-[#1e222d] border-[#2a2e39]'
          : 'bg-white border-[#e0e3eb]'
      }`}
      data-purpose="trending-stocks-widget"
    >
      {/* Widget Header with Toggle */}
      <div
        className={`flex items-center justify-between pb-3 border-b ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
        }`}
      >
        <div>
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Trending Stocks
          </h2>
          <p className="text-xs text-[#787b86]">
            {filterType === 'volume'
              ? 'Most active in US regular trading'
              : 'Top percentage gainers today'}
          </p>
        </div>

        {/* Filter Toggle Buttons */}
        <div
          className={`flex p-0.5 rounded-lg border text-[11px] font-semibold ${
            isDarkMode
              ? 'bg-[#131722] border-[#2a2e39]'
              : 'bg-[#f8f9fd] border-[#e0e3eb]'
          }`}
        >
          <button
            onClick={() => setFilterType('volume')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'volume'
                ? isDarkMode
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'bg-white text-[#131722] shadow-xs'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setFilterType('gainers')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'gainers'
                ? isDarkMode
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'bg-white text-[#131722] shadow-xs'
                : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
            }`}
          >
            Gainers
          </button>
        </div>
      </div>

      {/* Stock Items List */}
      <div
        className={`divide-y ${
          isDarkMode ? 'divide-[#2a2e39]' : 'divide-[#f0f3fa]'
        }`}
      >
        {filteredStocks.map((stock) => {
          const isPositive = stock.changePercent >= 0;
          const sign = isPositive ? '+' : '';

          return (
            <div
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className={`py-3 flex items-center justify-between px-2 rounded-lg transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-[#f0f3fa]'
              }`}
            >
              {/* Left: Badge, Symbol, Name, Stats */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: stock.badgeBg,
                    color: stock.badgeColor,
                  }}
                >
                  {stock.badge}
                </div>
                <div>
                  <div
                    className={`font-bold text-sm flex items-center gap-1.5 ${
                      isDarkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    <span>{stock.symbol}</span>
                    <span className="text-[11px] font-normal text-[#787b86] truncate max-w-[130px] sm:max-w-[180px]">
                      {stock.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#787b86] block">{stock.volume}</span>
                </div>
              </div>

              {/* Right: Price & Percent Change */}
              <div className="text-right shrink-0">
                <div
                  className={`font-semibold text-sm num-tabular ${
                    isDarkMode ? 'text-white' : 'text-[#131722]'
                  }`}
                >
                  {stock.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-semibold num-tabular ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {sign}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Screener Link */}
      <div
        className={`mt-4 pt-3 border-t text-center ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
        }`}
      >
        <button
          onClick={onOpenScreener}
          className="text-xs font-semibold text-[#2962ff] hover:underline inline-flex items-center gap-1 focus:outline-none"
        >
          View comprehensive US stock screener →
        </button>
      </div>
    </section>
  );
};
