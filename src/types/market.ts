export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type TechnicalSignal = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface SparklinePoint {
  time: string;
  price: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  exchange: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: string;
  marketCap?: string;
  technical: TechnicalSignal;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: string;
  sparkline: number[];
  countryCode?: string;
  sector?: string;
  peRatio?: number;
  divYield?: string;
  week52High?: number;
  week52Low?: number;
  oscillators?: {
    rsi: number;
    macd: 'Buy' | 'Sell' | 'Neutral';
    stochastic: 'Overbought' | 'Oversold' | 'Neutral';
  };
  movingAverages?: {
    sma20: number;
    sma50: number;
    sma200: number;
    summary: 'Buy' | 'Sell' | 'Neutral';
  };
}

export interface TrendingStock {
  id: string;
  symbol: string;
  name: string;
  volume: string;
  marketCap: string;
  price: number;
  changePercent: number;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  type: 'volume' | 'gainers' | 'losers';
  peRatio?: number;
  sector?: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  iconText: string;
  iconBg: string;
  iconColor: string;
  price: number;
  changePercent: number;
  vol24h: string;
  marketCap: string;
  sparkline: number[];
}
