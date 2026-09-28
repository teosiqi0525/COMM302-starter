/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MarketCategory, MarketAsset, TrendingStock, CryptoAsset } from './types/market';
import {
  MAJOR_US_INDICES,
  WORLD_INDICES,
  TRENDING_STOCKS,
  CRYPTO_ASSETS,
  OTHER_CATEGORIES_DATA,
} from './data/marketData';
import { TopNavigation } from './components/TopNavigation';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { MajorIndicesCards } from './components/MajorIndicesCards';
import { WorldIndicesSection } from './components/WorldIndicesSection';
import { TrendingStocksWidget } from './components/TrendingStocksWidget';
import { CryptoHighlights } from './components/CryptoHighlights';
import { Footer } from './components/Footer';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { ScreenerModal } from './components/ScreenerModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('US stocks');
  const [activeNav, setActiveNav] = useState('Markets');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | TrendingStock | CryptoAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Watchlist stored in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['SPX', 'NVDA', 'BTC'];
    } catch {
      return ['SPX', 'NVDA', 'BTC'];
    }
  });

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // State for live market ticks
  const [majorIndices, setMajorIndices] = useState<MarketAsset[]>(MAJOR_US_INDICES);
  const [worldIndices, setWorldIndices] = useState<MarketAsset[]>(WORLD_INDICES);
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>(TRENDING_STOCKS);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(CRYPTO_ASSETS);

  // Gently simulate subtle live market ticks to feel authentic
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random stock or index to tick
      const dice = Math.random();
      if (dice < 0.4) {
        setTrendingStocks((prev) =>
          prev.map((stock) => {
            if (Math.random() < 0.3) {
              const delta = (Math.random() - 0.48) * (stock.price * 0.001);
              const newPrice = Math.max(1, Number((stock.price + delta).toFixed(2)));
              return { ...stock, price: newPrice };
            }
            return stock;
          })
        );
      } else if (dice < 0.7) {
        setCryptoAssets((prev) =>
          prev.map((crypto) => {
            if (Math.random() < 0.3) {
              const delta = (Math.random() - 0.48) * (crypto.price * 0.0015);
              const newPrice = Math.max(1, Number((crypto.price + delta).toFixed(2)));
              return { ...crypto, price: newPrice };
            }
            return crypto;
          })
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Determine which 3 hero cards to display based on selected category
  const activeHeroCards = useMemo(() => {
    if (currentCategory === 'US stocks') {
      return majorIndices;
    }
    if (OTHER_CATEGORIES_DATA[currentCategory]) {
      return OTHER_CATEGORIES_DATA[currentCategory];
    }
    if (currentCategory === 'World stocks') {
      return worldIndices.slice(0, 3);
    }
    if (currentCategory === 'Crypto') {
      return cryptoAssets.slice(0, 3).map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        category: 'Crypto' as MarketCategory,
        exchange: 'Binance / Coinbase',
        price: c.price,
        currency: 'USD',
        change: (c.price * c.changePercent) / 100,
        changePercent: c.changePercent,
        low: c.price * 0.97,
        high: c.price * 1.03,
        open: c.price * 0.98,
        prevClose: c.price * 0.98,
        volume: c.vol24h,
        marketCap: c.marketCap,
        technical: 'Strong Buy' as const,
        badgeText: c.iconText,
        badgeBg: c.iconBg,
        badgeColor: c.iconColor,
        sparkline: c.sparkline,
      }));
    }
    return majorIndices;
  }, [currentCategory, majorIndices, worldIndices, cryptoAssets]);

  // Consolidated list for search palette
  const allSearchableItems = useMemo(() => {
    return [
      ...majorIndices,
      ...worldIndices,
      ...trendingStocks,
      ...cryptoAssets,
      ...Object.values(OTHER_CATEGORIES_DATA).flat(),
    ];
  }, [majorIndices, worldIndices, trendingStocks, cryptoAssets]);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors ${
        isDarkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
      }`}
    >
      {/* Top Navigation */}
      <TopNavigation
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Viewport Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Hero Section */}
        <HeroSection
          currentCategory={currentCategory}
          onSelectCategory={(cat) => setCurrentCategory(cat)}
          isDarkMode={isDarkMode}
        />

        {/* Market Category Pills Navigation */}
        <CategoryNav
          currentCategory={currentCategory}
          onSelectCategory={(cat) => setCurrentCategory(cat)}
          isDarkMode={isDarkMode}
        />

        {/* Major Cards Row (S&P 500, Nasdaq 100, Dow 30 or category highlights) */}
        <MajorIndicesCards
          assets={activeHeroCards}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Grid: World Indices (7 cols) + Trending Stocks (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <WorldIndicesSection
              indices={worldIndices}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="lg:col-span-5">
            <TrendingStocksWidget
              stocks={trendingStocks}
              onSelectStock={(stock) => setSelectedAsset(stock)}
              onOpenScreener={() => setIsScreenerOpen(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Quick Crypto Strip */}
        <CryptoHighlights
          cryptoAssets={cryptoAssets}
          onSelectCrypto={(crypto) => setSelectedAsset(crypto)}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Minimal Footer */}
      <Footer
        onOpenScreener={() => setIsScreenerOpen(true)}
        onSelectNav={(nav) => setActiveNav(nav)}
        isDarkMode={isDarkMode}
      />

      {/* Interactive Asset Detail Drawer / Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isDarkMode={isDarkMode}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Ctrl+K Search Command Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(item) => setSelectedAsset(item)}
        allItems={allSearchableItems}
        isDarkMode={isDarkMode}
      />

      {/* Comprehensive US Stock Screener Modal */}
      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        stocks={trendingStocks}
        onSelectStock={(stock) => setSelectedAsset(stock)}
        isDarkMode={isDarkMode}
      />

      {/* Auth / "Get Started" Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
