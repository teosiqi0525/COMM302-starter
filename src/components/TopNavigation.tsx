import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, ChevronDown, Check } from 'lucide-react';

interface TopNavigationProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenSearch,
  onOpenAuth,
  activeNav,
  setActiveNav,
  isDarkMode,
  setIsDarkMode,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  const navLinks = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors border-b ${
        isDarkMode
          ? 'bg-[#131722]/95 backdrop-blur-md border-[#2a2e39] text-[#d1d4dc]'
          : 'bg-white/95 backdrop-blur-md border-[#f0f3fa] text-[#131722]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left side: TradingView Logo & Search Bar */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveNav('Markets')}
            aria-label="TradingView Home"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity focus:outline-none"
          >
            <svg
              className={`w-9 h-7 ${isDarkMode ? 'text-white' : 'text-[#131722]'}`}
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M4 4h7v20H4z" fill="currentColor" />
              <path d="M14 11h7v13h-7z" fill="currentColor" />
              <path d="M24 18h7v6h-7z" fill="currentColor" />
              <path d="M4 4h27v3H4z" fill="currentColor" />
            </svg>
          </button>

          {/* Global Search Input triggering Modal */}
          <div
            onClick={onOpenSearch}
            className="relative w-64 md:w-80 group cursor-pointer"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787b86]">
              <Search className="w-4 h-4 group-hover:text-[#2962ff] transition-colors" />
            </div>
            <div
              className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-transparent transition-all flex items-center justify-between select-none ${
                isDarkMode
                  ? 'bg-[#1e222d] text-[#787b86] group-hover:bg-[#2a2e39]'
                  : 'bg-[#f0f3fa] text-[#787b86] group-hover:bg-[#e7eaf3]'
              }`}
            >
              <span className="text-xs sm:text-sm">Search (Ctrl+K)</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/5 dark:bg-white/10 rounded text-[#787b86]">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center space-x-7 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const isActive = activeNav === link;
            return (
              <button
                key={link}
                onClick={() => setActiveNav(link)}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? 'text-[#2962ff] font-semibold after:content-[""] after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-[#2962ff]'
                    : isDarkMode
                    ? 'text-[#d1d4dc] hover:text-[#2962ff]'
                    : 'text-[#131722] hover:text-[#2962ff]'
                }`}
              >
                {link}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode
                ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Select Language"
              className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-md transition-colors ${
                isDarkMode
                  ? 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                  : 'text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#787b86]" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-[#787b86]" />
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl py-1.5 border z-50 text-xs ${
                  isDarkMode
                    ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
                    : 'bg-white border-[#e0e3eb] text-[#131722]'
                }`}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#2962ff]/10 hover:text-[#2962ff] transition-colors ${
                      selectedLang === l.code ? 'font-bold text-[#2962ff]' : ''
                    }`}
                  >
                    <span>{l.name}</span>
                    {selectedLang === l.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="Account Menu"
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode
                  ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                  : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              <User className="w-5 h-5" />
            </button>

            {profileMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl p-2 border z-50 text-xs ${
                  isDarkMode
                    ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
                    : 'bg-white border-[#e0e3eb] text-[#131722]'
                }`}
              >
                <div className="px-3 py-2 border-b border-[#2a2e39]/20 pb-2 mb-1">
                  <p className="font-semibold text-sm">Guest Trader</p>
                  <p className="text-[11px] text-[#787b86]">Standard free plan</p>
                </div>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2962ff]/10 hover:text-[#2962ff] transition-colors"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setActiveNav('Products');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2962ff]/10 hover:text-[#2962ff] transition-colors"
                >
                  Explore Charts & Screeners
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setActiveNav('Brokers');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2962ff]/10 hover:text-[#2962ff] transition-colors"
                >
                  Supported Brokers
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: "Get started" with Vibrant Gradient */}
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 shadow-sm hover:shadow transition-all duration-150 whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
