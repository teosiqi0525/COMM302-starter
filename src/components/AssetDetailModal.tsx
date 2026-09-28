import React, { useState } from 'react';
import { MarketAsset, TrendingStock, CryptoAsset } from '../types/market';
import { X, Star, ExternalLink, TrendingUp, TrendingDown, Clock, ShieldCheck, BarChart2 } from 'lucide-react';

interface AssetDetailModalProps {
  asset: MarketAsset | TrendingStock | CryptoAsset | null;
  onClose: () => void;
  isDarkMode: boolean;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isDarkMode,
  watchlist,
  onToggleWatchlist,
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candles'>('line');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ x: number; y: number; price: number; time: string } | null>(null);

  const symbol = asset.symbol;
  const name = asset.name;
  const price = asset.price;
  const changePercent = asset.changePercent;
  const isPositive = changePercent >= 0;
  const isWatched = watchlist.includes(symbol);

  // Generate synthetic points for the selected timeframe
  const generateChartPoints = () => {
    let base = price * 0.98;
    const count = 30;
    const points: { time: string; price: number }[] = [];
    const step = (price - base) / (count * 0.4);

    for (let i = 0; i < count; i++) {
      const noise = (Math.sin(i * 0.6) * 0.5 + Math.cos(i * 0.9) * 0.3) * (price * 0.012);
      const trend = (i / count) * (price - base);
      const val = i === count - 1 ? price : base + trend + noise;
      const hour = 9 + Math.floor((i / count) * 7);
      const min = Math.floor(((i * 13) % 60));
      const timeStr = `${hour}:${min < 10 ? '0' : ''}${min}`;
      points.push({ time: timeStr, price: Number(val.toFixed(2)) });
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const minPrice = Math.min(...chartPoints.map((p) => p.price));
  const maxPrice = Math.max(...chartPoints.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 600;
  const svgHeight = 220;

  const coords = chartPoints.map((p, idx) => {
    const x = (idx / (chartPoints.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 30 - ((p.price - minPrice) / priceRange) * (svgHeight - 60);
    return { x, y, price: p.price, time: p.time };
  });

  const pathString = coords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + curr.x) / 2;
    return `${acc} Q ${cx} ${prev.y}, ${curr.x} ${curr.y}`;
  }, '');

  const strokeColor = isPositive ? '#089981' : '#f23645';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col transition-colors ${
          isDarkMode
            ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
            : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-5 border-b sticky top-0 z-10 ${
            isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#2962ff]/10 text-[#2962ff] font-bold text-base flex items-center justify-center">
              {symbol.slice(0, 3)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#131722]'
                  }`}
                >
                  {name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-black/5 dark:bg-white/10 text-[#787b86]">
                  {symbol}
                </span>
              </div>
              <p className="text-xs text-[#787b86]">
                {'exchange' in asset ? (asset as MarketAsset).exchange : 'Global Asset Tracker'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Toggle */}
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isWatched
                  ? 'border-amber-400 bg-amber-500/10 text-amber-500'
                  : isDarkMode
                  ? 'border-[#2a2e39] hover:bg-[#2a2e39] text-[#787b86]'
                  : 'border-[#e0e3eb] hover:bg-[#f0f3fa] text-[#787b86]'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isWatched ? 'fill-amber-500 text-amber-500' : ''}`}
              />
              <span className="hidden sm:inline">
                {isWatched ? 'In Watchlist' : 'Add to Watchlist'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                isDarkMode ? 'text-[#787b86] hover:text-white' : 'text-[#787b86] hover:text-[#131722]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Price & Summary Banner */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs text-[#787b86] font-medium mb-1">Current Trading Price</div>
              <div
                className={`text-3xl sm:text-4xl font-bold num-tabular tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-[#131722]'
                }`}
              >
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`inline-flex items-center gap-1.5 text-sm font-semibold mt-1.5 num-tabular ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {changePercent.toFixed(2)}%
                </span>
                <span className="text-[#787b86] font-normal text-xs ml-1">Today</span>
              </div>
            </div>

            {/* Timeframe & Chart Style Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex p-1 rounded-lg border text-xs font-semibold ${
                  isDarkMode ? 'border-[#2a2e39] bg-[#131722]' : 'border-[#e0e3eb] bg-[#f8f9fd]'
                }`}
              >
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      timeframe === tf
                        ? isDarkMode
                          ? 'bg-[#2a2e39] text-white'
                          : 'bg-white text-[#131722] shadow-xs'
                        : 'text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div
                className={`inline-flex p-1 rounded-lg border text-xs font-semibold ${
                  isDarkMode ? 'border-[#2a2e39] bg-[#131722]' : 'border-[#e0e3eb] bg-[#f8f9fd]'
                }`}
              >
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    chartType === 'line'
                      ? isDarkMode
                        ? 'bg-[#2a2e39] text-white'
                        : 'bg-white text-[#131722] shadow-xs'
                      : 'text-[#787b86]'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    chartType === 'candles'
                      ? isDarkMode
                        ? 'bg-[#2a2e39] text-white'
                        : 'bg-white text-[#131722] shadow-xs'
                      : 'text-[#787b86]'
                  }`}
                >
                  Candles
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div
            className={`rounded-2xl border p-4 relative overflow-hidden transition-colors ${
              isDarkMode ? 'bg-[#151922] border-[#2a2e39]' : 'bg-[#fbfcfe] border-[#e0e3eb]'
            }`}
          >
            {/* Hover Tooltip Overlay */}
            {hoveredChartPoint && (
              <div
                className={`absolute top-3 left-4 text-xs font-semibold px-2.5 py-1 rounded-md shadow-md border ${
                  isDarkMode
                    ? 'bg-[#1e222d] border-[#2a2e39] text-white'
                    : 'bg-white border-[#e0e3eb] text-[#131722]'
                }`}
              >
                <span>{hoveredChartPoint.time}</span> •{' '}
                <span className="font-bold num-tabular text-[#2962ff]">
                  ${hoveredChartPoint.price.toFixed(2)}
                </span>
              </div>
            )}

            <svg
              className="w-full h-52 overflow-visible select-none cursor-crosshair"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
                let closest = coords[0];
                let minDist = Infinity;
                coords.forEach((c) => {
                  const dist = Math.abs(c.x - mouseX);
                  if (dist < minDist) {
                    minDist = dist;
                    closest = c;
                  }
                });
                setHoveredChartPoint(closest);
              }}
              onMouseLeave={() => setHoveredChartPoint(null)}
            >
              <defs>
                <linearGradient id="modal-chart-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line
                x1="0"
                y1={svgHeight * 0.25}
                x2={svgWidth}
                y2={svgHeight * 0.25}
                stroke={isDarkMode ? '#2a2e39' : '#e0e3eb'}
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <line
                x1="0"
                y1={svgHeight * 0.5}
                x2={svgWidth}
                y2={svgHeight * 0.5}
                stroke={isDarkMode ? '#2a2e39' : '#e0e3eb'}
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <line
                x1="0"
                y1={svgHeight * 0.75}
                x2={svgWidth}
                y2={svgHeight * 0.75}
                stroke={isDarkMode ? '#2a2e39' : '#e0e3eb'}
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />

              {chartType === 'line' ? (
                <>
                  <path
                    d={`${pathString} L ${coords[coords.length - 1].x} ${svgHeight - 10} L ${coords[0].x} ${svgHeight - 10} Z`}
                    fill="url(#modal-chart-grad)"
                  />
                  <path
                    d={pathString}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                /* Candlestick simulated bars */
                coords.map((c, i) => {
                  const isCandleGreen = i % 2 === 0;
                  const candleHeight = Math.max(6, Math.sin(i * 1.5) * 14 + 10);
                  const wickHeight = candleHeight + 8;
                  const candleColor = isCandleGreen ? '#089981' : '#f23645';
                  return (
                    <g key={i}>
                      <line
                        x1={c.x}
                        y1={c.y - wickHeight / 2}
                        x2={c.x}
                        y2={c.y + wickHeight / 2}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />
                      <rect
                        x={c.x - 4}
                        y={c.y - candleHeight / 2}
                        width="8"
                        height={candleHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* Crosshair indicator */}
              {hoveredChartPoint && (
                <>
                  <line
                    x1={hoveredChartPoint.x}
                    y1={10}
                    x2={hoveredChartPoint.x}
                    y2={svgHeight - 20}
                    stroke="#2962ff"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={hoveredChartPoint.x}
                    cy={hoveredChartPoint.y}
                    r="4.5"
                    fill="#2962ff"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>

            {/* Bottom time scale */}
            <div className="flex justify-between items-center text-[10px] text-[#787b86] font-mono px-2 pt-2 border-t border-[#2a2e39]/20">
              <span>09:30</span>
              <span>11:30</span>
              <span>13:30</span>
              <span>15:30</span>
              <span>16:00 Close</span>
            </div>
          </div>

          {/* Technical Analysis Gauge & Moving Averages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Gauge Box */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-[#151922] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">Technical Analysis</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#089981]/20 text-[#089981]">
                  Strong Buy
                </span>
              </div>

              {/* Gauge Meter Representation */}
              <div className="flex items-center justify-between text-xs text-[#787b86] mb-1 font-semibold">
                <span>Strong Sell</span>
                <span>Neutral</span>
                <span className="text-[#089981]">Strong Buy</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#131722] shadow-md transition-all"
                  style={{ left: '80%' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div
                  className={`p-2 rounded-lg border ${
                    isDarkMode ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
                  }`}
                >
                  <span className="text-[#787b86] block text-[10px]">RSI (14)</span>
                  <span className="font-bold num-tabular">64.2</span>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    isDarkMode ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
                  }`}
                >
                  <span className="text-[#787b86] block text-[10px]">MACD</span>
                  <span className="font-bold text-[#089981]">Buy</span>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    isDarkMode ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
                  }`}
                >
                  <span className="text-[#787b86] block text-[10px]">Stochastic</span>
                  <span className="font-bold">Neutral</span>
                </div>
              </div>
            </div>

            {/* Key Fundamentals / Statistics */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-[#151922] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
              }`}
            >
              <span className="font-bold text-sm block mb-3">Key Statistics</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">Volume</span>
                  <span className="font-semibold num-tabular">
                    {'volume' in asset ? (asset as any).volume : '42.1M'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">Market Cap</span>
                  <span className="font-semibold num-tabular">
                    {'marketCap' in asset && (asset as any).marketCap ? (asset as any).marketCap : '$1.2T'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">P/E Ratio</span>
                  <span className="font-semibold num-tabular">
                    {'peRatio' in asset && (asset as any).peRatio ? (asset as any).peRatio : '34.8'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">Beta</span>
                  <span className="font-semibold num-tabular">1.18</span>
                </div>
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">52W Low</span>
                  <span className="font-semibold num-tabular">
                    ${(price * 0.72).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#2a2e39]/20 pb-1.5">
                  <span className="text-[#787b86]">52W High</span>
                  <span className="font-semibold num-tabular">
                    ${(price * 1.15).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => alert(`Order simulated for ${symbol} at $${price.toFixed(2)}`)}
                  className="flex-1 py-2 rounded-lg bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Trade {symbol}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
