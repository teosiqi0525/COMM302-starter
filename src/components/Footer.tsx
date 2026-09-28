import React from 'react';

interface FooterProps {
  onOpenScreener: () => void;
  onSelectNav: (nav: string) => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScreener,
  onSelectNav,
  isDarkMode,
}) => {
  return (
    <footer
      className={`border-t py-10 text-xs transition-colors ${
        isDarkMode
          ? 'border-[#2a2e39] bg-[#131722] text-[#787b86]'
          : 'border-[#e0e3eb] bg-white text-[#787b86]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side Links */}
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-semibold select-none">© 2025 TradingView</span>
          <button
            onClick={() => onSelectNav('Markets')}
            className={`transition-colors focus:outline-none ${
              isDarkMode ? 'hover:text-white' : 'hover:text-[#131722]'
            }`}
          >
            Markets
          </button>
          <button
            onClick={onOpenScreener}
            className={`transition-colors focus:outline-none ${
              isDarkMode ? 'hover:text-white' : 'hover:text-[#131722]'
            }`}
          >
            Screeners
          </button>
          <button
            onClick={() => onSelectNav('Community')}
            className={`transition-colors focus:outline-none ${
              isDarkMode ? 'hover:text-white' : 'hover:text-[#131722]'
            }`}
          >
            Community
          </button>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert('Privacy Policy: All market quote preferences are stored locally.');
            }}
            className={`transition-colors ${
              isDarkMode ? 'hover:text-white' : 'hover:text-[#131722]'
            }`}
          >
            Privacy Policy
          </a>
        </div>

        {/* Right Side Disclaimer */}
        <div>
          <span>Quotes delayed by 15 mins • Powered by TradingView financial data</span>
        </div>
      </div>
    </footer>
  );
};
