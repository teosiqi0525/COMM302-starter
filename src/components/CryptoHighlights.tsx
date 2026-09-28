import React from 'react';
import { CryptoAsset } from '../types/market';

interface CryptoHighlightsProps {
  cryptoAssets: CryptoAsset[];
  onSelectCrypto: (asset: CryptoAsset) => void;
  isDarkMode: boolean;
}

export const CryptoHighlights: React.FC<CryptoHighlightsProps> = ({
  cryptoAssets,
  onSelectCrypto,
  isDarkMode,
}) => {
  return (
    <section
      className={`border rounded-2xl p-6 mb-12 transition-colors ${
        isDarkMode
          ? 'border-[#2a2e39] bg-gradient-to-br from-[#1e222d] to-[#151922]'
          : 'border-[#e0e3eb] bg-gradient-to-br from-white to-[#fbfcfe]'
      }`}
      data-purpose="crypto-overview"
    >
      {/* Header with Title and Total Cap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-[#131722]'
            }`}
          >
            Crypto Highlights
          </h2>
          <p className="text-xs text-[#787b86]">
            Top digital assets ranked by live market capitalization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#787b86]">
            Total Cap:{' '}
            <span
              className={`font-semibold num-tabular ${
                isDarkMode ? 'text-white' : 'text-[#131722]'
              }`}
            >
              $2.38T (+1.8%)
            </span>
          </span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cryptoAssets.map((crypto) => {
          const isPositive = crypto.changePercent >= 0;
          const sign = isPositive ? '+' : '';

          return (
            <div
              key={crypto.id}
              onClick={() => onSelectCrypto(crypto)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                isDarkMode
                  ? 'border-[#2a2e39] bg-[#1a1e28] hover:border-[#3b4254] hover:bg-[#202534] hover:shadow-md'
                  : 'border-[#f0f3fa] bg-white hover:border-[#e0e3eb] hover:shadow-sm'
              }`}
            >
              {/* Top Row: Icon, Names, and Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: crypto.iconBg,
                      color: crypto.iconColor,
                    }}
                  >
                    {crypto.iconText}
                  </span>
                  <div>
                    <span
                      className={`font-bold text-sm block group-hover:text-[#2962ff] transition-colors leading-tight ${
                        isDarkMode ? 'text-white' : 'text-[#131722]'
                      }`}
                    >
                      {crypto.name}
                    </span>
                    <span className="text-[11px] text-[#787b86] block font-medium">
                      {crypto.symbol}
                    </span>
                  </div>
                </div>

                {/* Change Badge */}
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded num-tabular ${
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
                  {crypto.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Price & 24h Volume */}
              <div
                className={`text-lg font-bold num-tabular tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-[#131722]'
                }`}
              >
                $
                {crypto.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-[11px] text-[#787b86] num-tabular mt-1 font-medium">
                24h Vol: {crypto.vol24h}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
