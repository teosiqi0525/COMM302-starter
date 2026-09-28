import React, { useState } from 'react';
import { MarketAsset } from '../types/market';

interface WorldIndicesSectionProps {
  indices: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const WorldIndicesSection: React.FC<WorldIndicesSectionProps> = ({
  indices,
  onSelectAsset,
  isDarkMode,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Default shows top 5 matching the screenshot, showAll expands to full list
  const displayedIndices = showAll ? indices : indices.slice(0, 5);

  const getTechnicalBadge = (tech: string) => {
    switch (tech) {
      case 'Strong Buy':
        return isDarkMode
          ? 'bg-[#089981]/20 text-[#089981]'
          : 'bg-[#e6f7f3] text-[#089981]';
      case 'Buy':
        return isDarkMode
          ? 'bg-[#089981]/15 text-[#089981]'
          : 'bg-[#e6f7f3] text-[#089981]';
      case 'Sell':
      case 'Strong Sell':
        return isDarkMode
          ? 'bg-[#f23645]/20 text-[#f23645]'
          : 'bg-[#feecee] text-[#f23645]';
      case 'Neutral':
      default:
        return isDarkMode
          ? 'bg-[#2a2e39] text-[#787b86]'
          : 'bg-gray-100 text-[#787b86]';
    }
  };

  return (
    <section
      className={`rounded-2xl border p-6 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
        isDarkMode
          ? 'bg-[#1e222d] border-[#2a2e39]'
          : 'bg-white border-[#e0e3eb]'
      }`}
      data-purpose="world-indices-table"
    >
      {/* Table Header */}
      <div
        className={`flex items-center justify-between pb-4 border-b ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
        }`}
      >
        <h2
          className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-[#131722]'
          }`}
        >
          World Indices
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-[#2962ff] hover:underline flex items-center gap-1 focus:outline-none"
        >
          {showAll ? 'Show fewer indices ↑' : 'See all indices →'}
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left mt-2">
          <thead>
            <tr
              className={`text-[12px] font-semibold uppercase tracking-wider border-b text-[#787b86] ${
                isDarkMode ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
              }`}
            >
              <th className="py-3 px-2">Index</th>
              <th className="py-3 px-2 text-right">Price</th>
              <th className="py-3 px-2 text-right">Chg</th>
              <th className="py-3 px-2 text-right">Chg %</th>
              <th className="py-3 px-2 text-right hidden sm:table-cell">Technical</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm font-medium ${
              isDarkMode ? 'divide-[#2a2e39]' : 'divide-[#f0f3fa]'
            }`}
          >
            {displayedIndices.map((idx) => {
              const isPositive = idx.change >= 0;
              const sign = isPositive ? '+' : '';

              return (
                <tr
                  key={idx.id}
                  onClick={() => onSelectAsset(idx)}
                  className={`transition-colors group cursor-pointer ${
                    isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-[#f0f3fa]'
                  }`}
                >
                  {/* Flag/Badge & Name */}
                  <td className="py-3 px-2 flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                        isDarkMode
                          ? 'bg-[#2a2e39] border-[#363c4e] text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {idx.countryCode || idx.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <span
                        className={`font-bold group-hover:text-[#2962ff] transition-colors ${
                          isDarkMode ? 'text-white' : 'text-[#131722]'
                        }`}
                      >
                        {idx.name}
                      </span>
                      <span className="block text-xs text-[#787b86] font-normal">
                        {idx.exchange}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td
                    className={`py-3 px-2 text-right num-tabular font-semibold ${
                      isDarkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    {idx.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {/* Change in points */}
                  <td
                    className={`py-3 px-2 text-right num-tabular font-medium ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {sign}
                    {Math.abs(idx.change).toFixed(2)}
                  </td>

                  {/* Change % badge */}
                  <td className="py-3 px-2 text-right num-tabular">
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
                      {sign}
                      {idx.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  {/* Technical Signal */}
                  <td className="py-3 px-2 text-right hidden sm:table-cell">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${getTechnicalBadge(
                        idx.technical
                      )}`}
                    >
                      {idx.technical}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
