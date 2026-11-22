import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GitCommit, Search, Sun, Moon, Menu, X, Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function Navbar({ onToggleSidebar }) {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/dashboard/${trimmed}`);
      setSearchInput('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md border-b border-mutedGrey/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-charcoal dark:text-ivory hover:bg-ivory dark:hover:bg-charcoal-light lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <GitCommit className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-charcoal dark:text-ivory">
                Commit<span className="text-terracotta">Wise</span>
              </span>
            </Link>
          </div>

          {/* Middle: Global Search Input */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mutedGrey">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter GitHub username (e.g., torvalds)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-24 py-1.5 text-sm bg-ivory/60 dark:bg-charcoal-light/60 text-charcoal dark:text-ivory placeholder-mutedGrey rounded-lg border border-mutedGrey/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors"
              />
              <button
                type="submit"
                className="absolute inset-y-1 right-1 px-3 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-medium rounded-md transition-colors"
              >
                Analyze
              </button>
            </div>
          </form>

          {/* Right: Quick actions & Theme Switcher */}
          <div className="flex items-center gap-2">
            <Link
              to="/saved"
              className="p-2 text-charcoal dark:text-ivory hover:bg-ivory dark:hover:bg-charcoal-light rounded-lg transition-colors"
              title="Saved Profiles"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 text-charcoal dark:text-ivory hover:bg-ivory dark:hover:bg-charcoal-light rounded-lg transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-sand" />
              ) : (
                <Moon className="w-5 h-5 text-charcoal" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

