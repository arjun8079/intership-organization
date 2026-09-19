import React, { useState } from 'react';
import { 
  Code2, 
  Menu, 
  X, 
  ShieldCheck, 
  Send, 
  BookOpen, 
  UserCheck, 
  Lock, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CodeNovaLogo } from './CodeNovaLogo';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdmin,
  onToggleAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isNight, setTheme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'internships', label: 'Internships' },
    { id: 'offers', label: 'Offer Letter' },
    { id: 'submit', label: 'Submit Project' },
    { id: 'verify', label: 'Verify Certificate' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer py-1"
            id="brand-logo-button"
          >
            <CodeNovaLogo size="md" showStudentBadge={true} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Light / Night Mode segmented switcher */}
            <div 
              id="theme-mode-toggle-group"
              className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              role="group"
              aria-label="Theme switcher"
            >
              <button
                id="theme-btn-light"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  !isNight 
                    ? 'bg-white text-amber-600 shadow-xs font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Light mode"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                id="theme-btn-night"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isNight 
                    ? 'bg-slate-900 text-indigo-400 shadow-xs font-semibold border border-slate-700' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Night mode"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>

            {/* Quick Admin Access Toggle */}
            <button
              id="admin-portal-toggle"
              onClick={onToggleAdmin}
              title="Toggle Organization Admin Portal"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Mode (Active)' : 'Admin'}</span>
            </button>

            <button
              id="header-apply-btn"
              onClick={() => handleNavClick('apply')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button & quick theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Mobile Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              title={isNight ? 'Switch to Light' : 'Switch to Night'}
              aria-label="Toggle Light/Night mode"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-md border text-xs ${
                isAdmin 
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 transition-colors">
          {/* Mobile Theme Switcher */}
          <div className="flex items-center justify-between p-2 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Display Theme</span>
            <div className="flex items-center p-0.5 rounded bg-slate-200 dark:bg-slate-900 text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  !isNight ? 'bg-white text-amber-600 font-bold shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  isNight ? 'bg-slate-800 text-indigo-400 font-bold shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Night</span>
              </button>
            </div>
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'verify' && <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('apply')}
              className="w-full text-center px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            >
              Apply for Internship
            </button>
            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2 rounded-md text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isAdmin ? 'Exit Admin Dashboard' : 'Open Admin Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

