import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitCommit,
  Lightbulb,
  Scale,
  FileSpreadsheet,
  Bookmark,
  X,
  UserCheck
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { username } = useParams();
  const currentUsername = username || 'octocat';

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: `/dashboard/${currentUsername}`,
    },
    {
      label: 'Repository Explorer',
      icon: FolderGit2,
      to: `/repositories/${currentUsername}`,
    },
    {
      label: 'Commit Analytics',
      icon: GitCommit,
      to: `/commits/${currentUsername}`,
    },
    {
      label: 'Developer Insights',
      icon: Lightbulb,
      to: `/insights/${currentUsername}`,
    },
    {
      label: 'Compare Profiles',
      icon: Scale,
      to: `/compare`,
    },
    {
      label: 'Activity Reports',
      icon: FileSpreadsheet,
      to: `/reports/${currentUsername}`,
    },
    {
      label: 'Saved Profiles',
      icon: Bookmark,
      to: `/saved`,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Charcoal Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-charcoal text-ivory flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold">
              <GitCommit className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              Commit<span className="text-terracotta">Wise</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-mutedGrey hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Target User Indicator */}
        <div className="px-6 py-4 border-b border-white/10 bg-charcoal-dark/50">
          <div className="flex items-center gap-2 text-xs text-mutedGrey uppercase tracking-wider font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-sage" />
            Active Target
          </div>
          <div className="mt-1 text-sm font-medium text-white truncate">
            @{currentUsername}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-ivory/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info badge */}
        <div className="p-4 border-t border-white/10 text-xs text-mutedGrey text-center">
          CommitWise Intelligence v1.0
        </div>
      </aside>
    </>
  );
}

