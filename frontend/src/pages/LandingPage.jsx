import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GitCommit,
  Search,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Scale,
  Code2,
  FileSpreadsheet,
  Zap,
  Star,
  GitFork
} from 'lucide-react';

export function LandingPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = username.trim();
    if (clean) {
      navigate(`/dashboard/${clean}`);
    }
  };

  const sampleUsers = ['torvalds', 'octocat', 'gaearon', 'sindresorhus'];

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/30 dark:bg-sand/10 border border-sand text-charcoal dark:text-ivory text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5 text-terracotta" />
          Developer Analytics & Repository Intelligence
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal dark:text-ivory leading-tight">
          Understand Your GitHub Activity with{' '}
          <span className="text-terracotta">CommitWise</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-mutedGrey dark:text-ivory/70 max-w-2xl mx-auto leading-relaxed">
          Transform raw repositories, commits, and activity events into meaningful visual metrics, language breakdowns, and repository health diagnostics.
        </p>

        {/* Username Search Form */}
        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 shadow-md rounded-2xl p-2 bg-white dark:bg-charcoal border border-mutedGrey/30">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-mutedGrey">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter GitHub username (e.g. torvalds)..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-charcoal dark:text-ivory placeholder-mutedGrey text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              Analyze Profile
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick pick chips */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-mutedGrey">
            <span>Try popular profiles:</span>
            {sampleUsers.map((user) => (
              <button
                key={user}
                onClick={() => navigate(`/dashboard/${user}`)}
                className="underline hover:text-terracotta font-medium transition-colors"
              >
                @{user}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-ivory">
            Comprehensive Intelligence for Every Developer
          </h2>
          <p className="text-sm text-mutedGrey mt-2">
            Beyond a vanity profile viewer — real analytical metrics derived from live GitHub REST API data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Language & Stack Intelligence
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Explore your true language distribution across all public repositories with visual charts and percentage breakdowns.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-sage/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sage/20 text-sage flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Repository Health Diagnostics
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Automated portfolio scoring evaluating documentation coverage, open-source licensing, and update recency.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-sand/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sand/30 text-charcoal dark:text-sand flex items-center justify-center mb-4">
              <GitCommit className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Granular Commit Analytics
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Inspect commit frequencies, day-of-week patterns, commit authors, messages, and repository-wise velocity.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Head-to-Head Comparison
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Compare any two developers side-by-side: compare stars, forks, repositories, followers, and language overlap.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-sage/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sage/20 text-sage flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Repository Explorer
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Multi-criteria search, language tags, fork filtering, and instant sorting by stars, forks, or update dates.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm hover:border-sand/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sand/30 text-charcoal dark:text-sand flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Exportable Reports & Bookmarks
            </h3>
            <p className="text-sm text-mutedGrey dark:text-ivory/70 leading-relaxed">
              Generate structured CSV exports, printable report summaries, and bookmark top profiles to your database.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-ivory">
            How CommitWise Works
          </h2>
          <p className="text-sm text-mutedGrey mt-2">
            No password required. Connects directly to the official GitHub API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-charcoal text-ivory font-bold text-lg flex items-center justify-center mx-auto mb-4 border-2 border-sand">
              1
            </div>
            <h4 className="font-bold text-charcoal dark:text-ivory mb-2">Provide Any Handle</h4>
            <p className="text-sm text-mutedGrey dark:text-ivory/70">
              Type any public GitHub username to initiate real-time analytics.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-charcoal text-ivory font-bold text-lg flex items-center justify-center mx-auto mb-4 border-2 border-sage">
              2
            </div>
            <h4 className="font-bold text-charcoal dark:text-ivory mb-2">API Aggregation</h4>
            <p className="text-sm text-mutedGrey dark:text-ivory/70">
              CommitWise aggregates repositories, commits, and activity events through FastAPI.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-charcoal text-ivory font-bold text-lg flex items-center justify-center mx-auto mb-4 border-2 border-terracotta">
              3
            </div>
            <h4 className="font-bold text-charcoal dark:text-ivory mb-2">Actionable Insights</h4>
            <p className="text-sm text-mutedGrey dark:text-ivory/70">
              Explore interactive charts, health scores, and export detailed CSV reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-mutedGrey/20 text-center text-xs text-mutedGrey space-y-2">
        <p>© 2026 CommitWise – GitHub Activity & Repository Intelligence Dashboard</p>
        <p>Built with FastAPI, React, Tailwind CSS, Recharts & SQLAlchemy</p>
      </footer>
    </div>
  );
}

