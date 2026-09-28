import React, { useState } from 'react';
import { TrendingStock } from '../types/market';
import { X, Search, ArrowUpDown, Filter, ChevronRight } from 'lucide-react';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: TrendingStock[];
  onSelectStock: (stock: TrendingStock) => void;
  isDarkMode: boolean;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
  isDarkMode,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'marketCap' | 'peRatio'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  const sectors = ['All', 'Semiconductors', 'Software & Cloud', 'Automotive & Clean Energy', 'Crypto Financials', 'AI Server Infrastructure'];

  const filtered = stocks.filter((s) => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  filtered.sort((a, b) => {
    let valA = a[sortField] || 0;
    let valB = b[sortField] || 0;
    if (sortField === 'marketCap') {
      const parseCap = (c: string) => {
        if (c.includes('T')) return parseFloat(c.replace(/[^0-9.]/g, '')) * 1000;
        if (c.includes('B')) return parseFloat(c.replace(/[^0-9.]/g, ''));
        return 0;
      };
      valA = parseCap(a.marketCap);
      valB = parseCap(b.marketCap);
    }
    return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
            : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isDarkMode ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
          }`}
        >
          <div>
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-[#131722]'
              }`}
            >
              US Stock Screener
            </h2>
            <p className="text-xs text-[#787b86]">
              Real-time multi-metric scanner for United States equities
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#787b86]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Sector Filters */}
        <div
          className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDarkMode ? 'border-[#2a2e39] bg-[#151922]' : 'border-[#f0f3fa] bg-[#f8f9fd]'
          }`}
        >
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by symbol or company..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                isDarkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] text-white'
                  : 'bg-white border-[#e0e3eb] text-[#131722]'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-medium">
            <span className="text-[#787b86] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Sector:
            </span>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedSector === sec
                    ? isDarkMode
                      ? 'bg-white text-[#131722] font-bold'
                      : 'bg-[#131722] text-white font-bold'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Screener Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead
              className={`sticky top-0 z-10 text-[11px] uppercase tracking-wider font-semibold border-b ${
                isDarkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86]'
                  : 'bg-white border-[#e0e3eb] text-[#787b86]'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Symbol & Company</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#2962ff]"
                >
                  <span className="inline-flex items-center gap-1">
                    Price <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#2962ff]"
                >
                  <span className="inline-flex items-center gap-1">
                    Change % <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#2962ff] hidden sm:table-cell"
                >
                  <span className="inline-flex items-center gap-1">
                    Market Cap <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('peRatio')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#2962ff] hidden md:table-cell"
                >
                  <span className="inline-flex items-center gap-1">
                    P/E Ratio <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-3 px-3 hidden lg:table-cell">Sector</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y font-medium ${
                isDarkMode ? 'divide-[#2a2e39]' : 'divide-[#f0f3fa]'
              }`}
            >
              {filtered.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.id}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className={`transition-colors cursor-pointer ${
                      isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-[#f0f3fa]'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: stock.badgeBg,
                          color: stock.badgeColor,
                        }}
                      >
                        {stock.badge}
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{stock.symbol}</span>
                        <span className="text-xs text-[#787b86] font-normal truncate max-w-[180px] block">
                          {stock.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right num-tabular font-semibold">
                      ${stock.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right num-tabular">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          isPositive
                            ? isDarkMode
                              ? 'bg-[#089981]/20 text-[#089981]'
                              : 'bg-[#e6f7f3] text-[#089981]'
                            : isDarkMode
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-[#feecee] text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right num-tabular text-xs font-medium text-[#787b86] hidden sm:table-cell">
                      {stock.marketCap}
                    </td>

                    <td className="py-3 px-3 text-right num-tabular text-xs font-medium text-[#787b86] hidden md:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                    </td>

                    <td className="py-3 px-3 text-xs text-[#787b86] hidden lg:table-cell">
                      {stock.sector || 'Equities'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-[#2962ff] font-semibold inline-flex items-center gap-0.5 hover:underline">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t text-xs text-[#787b86] flex justify-between items-center ${
            isDarkMode ? 'border-[#2a2e39] bg-[#151922]' : 'border-[#e0e3eb] bg-[#fbfcfe]'
          }`}
        >
          <span>Showing {filtered.length} equities</span>
          <span>Click any row for complete technical indicators and chart</span>
        </div>
      </div>
    </div>
  );
};
