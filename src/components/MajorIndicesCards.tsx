import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MajorIndicesCardsProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const MajorIndicesCards: React.FC<MajorIndicesCardsProps> = ({
  assets,
  onSelectAsset,
  isDarkMode,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ [key: string]: { x: number; y: number; val: number } | null }>({});

  const formatNumber = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Convert array of sparkline points into SVG path and polygon
  const renderSparkline = (points: number[], id: string, isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const width = 120;
    const height = 40;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      // Invert Y so higher values are higher up visually
      const y = height - ((p - min) / range) * (height - 10) - 5;
      return { x, y, val: p };
    });

    const pathData = coords.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} Q ${cx} ${prev.y}, ${curr.x} ${curr.y}`;
    }, '');

    const strokeColor = isPositive ? '#089981' : '#f23645';
    const gradId = `grad-${id}-${isPositive ? 'green' : 'red'}`;

    return (
      <div className="relative w-32 h-10 group/chart">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = Math.max(0, Math.min(width, ((e.clientX - rect.left) / rect.width) * width));
            // Find closest coordinate
            let closest = coords[0];
            let minDist = Infinity;
            coords.forEach((c) => {
              const dist = Math.abs(c.x - mouseX);
              if (dist < minDist) {
                minDist = dist;
                closest = c;
              }
            });
            setHoveredPoint((prev) => ({ ...prev, [id]: closest }));
          }}
          onMouseLeave={() => {
            setHoveredPoint((prev) => ({ ...prev, [id]: null }));
          }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path
            d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
            fill={`url(#${gradId})`}
          />

          {/* Sparkline curve */}
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active hover crosshair point */}
          {hoveredPoint[id] && (
            <circle
              cx={hoveredPoint[id]!.x}
              cy={hoveredPoint[id]!.y}
              r="3.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12" data-purpose="major-indices-cards">
      {assets.map((asset) => {
        const isPositive = asset.change >= 0;
        const changeSign = isPositive ? '+' : '';
        const rangeSpread = asset.high - asset.low;
        const currentPos = rangeSpread > 0 ? ((asset.price - asset.low) / rangeSpread) * 100 : 50;
        const clampedPos = Math.max(8, Math.min(92, currentPos));

        return (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer select-none group ${
              isDarkMode
                ? 'bg-[#1e222d] border-[#2a2e39] hover:bg-[#252a37] hover:border-[#363c4e] hover:shadow-xl'
                : 'bg-[#f8f9fd] border-[#f0f3fa] hover:bg-white hover:border-[#e0e3eb] hover:shadow-lg'
            }`}
          >
            {/* Top row: Badge, Name, Subtitle and Change % Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center tracking-tighter shadow-sm shrink-0"
                  style={{
                    backgroundColor: asset.badgeBg || '#0089ff',
                    color: asset.badgeColor || '#ffffff',
                  }}
                >
                  {asset.badgeText || asset.symbol.slice(0, 3)}
                </span>
                <div>
                  <h3
                    className={`font-bold text-base leading-tight group-hover:text-[#2962ff] transition-colors ${
                      isDarkMode ? 'text-white' : 'text-[#131722]'
                    }`}
                  >
                    {asset.name}
                  </h3>
                  <span className="text-xs text-[#787b86] font-medium block">
                    {asset.symbol} • {asset.exchange}
                  </span>
                </div>
              </div>

              {/* Pill change badge */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isPositive
                    ? isDarkMode
                      ? 'bg-[#089981]/20 text-[#089981]'
                      : 'bg-[#e6f7f3] text-[#089981]'
                    : isDarkMode
                    ? 'bg-[#f23645]/20 text-[#f23645]'
                    : 'bg-[#feecee] text-[#f23645]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                )}
                <span>
                  {changeSign}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </span>
            </div>

            {/* Price row with sparkline */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div
                  className={`text-2xl font-bold num-tabular tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-[#131722]'
                  }`}
                >
                  {formatNumber(asset.price)}
                </div>
                <div
                  className={`text-xs num-tabular font-medium mt-0.5 ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {changeSign}
                  {formatNumber(Math.abs(asset.change))} {asset.currency}
                </div>
              </div>

              {/* Sparkline chart */}
              {renderSparkline(asset.sparkline, asset.id, isPositive)}
            </div>

            {/* Day range mini bar */}
            <div
              className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-[#787b86] num-tabular ${
                isDarkMode ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
              }`}
            >
              <span>L: {formatNumber(asset.low)}</span>
              <div
                className={`w-24 h-1 rounded-full overflow-hidden mx-2 ${
                  isDarkMode ? 'bg-[#2a2e39]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'
                  }`}
                  style={{ width: `${clampedPos}%` }}
                />
              </div>
              <span>H: {formatNumber(asset.high)}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};
