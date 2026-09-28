import React from 'react';
import { MarketCategory } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  currentCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  isDarkMode: boolean;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  currentCategory,
  onSelectCategory,
  isDarkMode,
}) => {
  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy',
  ];

  return (
    <section className="mt-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Section Heading */}
      <button
        onClick={() => onSelectCategory('US stocks')}
        className={`inline-flex items-center gap-1.5 text-2xl font-bold transition-colors group focus:outline-none ${
          isDarkMode ? 'text-white hover:text-[#2962ff]' : 'text-[#131722] hover:text-[#2962ff]'
        }`}
      >
        <span>Indices</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
      </button>

      {/* Category Filter Pills Track */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <div
          className={`inline-flex items-center p-1 rounded-full border text-xs font-semibold whitespace-nowrap gap-1 shadow-xs transition-colors ${
            isDarkMode ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
          }`}
        >
          {categories.map((category) => {
            const isActive = currentCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`py-1.5 rounded-full transition-all duration-150 select-none ${
                  isActive
                    ? isDarkMode
                      ? 'px-4 bg-white text-[#131722] shadow-sm font-bold'
                      : 'px-4 bg-[#131722] text-white shadow-sm font-bold'
                    : isDarkMode
                    ? 'px-3.5 text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                    : 'px-3.5 text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
