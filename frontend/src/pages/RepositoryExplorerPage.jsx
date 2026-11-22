import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  GitCommit,
  Calendar,
  Filter,
  ArrowUpDown
} from 'lucide-react';

import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function RepositoryExplorerPage() {
  const { username = 'octocat' } = useParams();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL'); // ALL, SOURCE, FORK
  const [sortBy, setSortBy] = useState('STARS_DESC'); // STARS_DESC, FORKS_DESC, UPDATED_DESC, NAME_ASC

  useEffect(() => {
    async function loadRepos() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getRepositories(username);
        setRepos(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch repositories.');
      } finally {
        setLoading(false);
      }
    }
    loadRepos();
  }, [username]);

  if (loading) {
    return <LoadingSpinner text={`Fetching repositories for @${username}...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  // Extract unique languages
  const languagesList = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  ).sort();

  // Filter & Search logic
  let filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLanguage =
      selectedLanguage === 'ALL' || repo.language === selectedLanguage;

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'SOURCE' && !repo.is_fork) ||
      (filterType === 'FORK' && repo.is_fork);

    return matchesSearch && matchesLanguage && matchesType;
  });

  // Sort logic
  filteredRepos.sort((a, b) => {
    if (sortBy === 'STARS_DESC') return (b.stars || 0) - (a.stars || 0);
    if (sortBy === 'FORKS_DESC') return (b.forks || 0) - (a.forks || 0);
    if (sortBy === 'UPDATED_DESC') {
      return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
    }
    if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
            Repository Explorer
          </h1>
          <p className="text-sm text-mutedGrey mt-1">
            Analyzing {repos.length} public repositories for <strong className="text-terracotta">@{username}</strong>
          </p>
        </div>
        <Link
          to={`/reports/${username}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          Export CSV Report
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-charcoal-light p-4 rounded-2xl border border-mutedGrey/20 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-mutedGrey" />
            <input
              type="text"
              placeholder="Search repositories by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-ivory/50 dark:bg-charcoal/50 text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Language filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-ivory/50 dark:bg-charcoal/50 text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta"
            >
              <option value="ALL">All Languages</option>
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-ivory/50 dark:bg-charcoal/50 text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta"
            >
              <option value="STARS_DESC">Sort: Most Stars</option>
              <option value="FORKS_DESC">Sort: Most Forks</option>
              <option value="UPDATED_DESC">Sort: Recently Updated</option>
              <option value="NAME_ASC">Sort: Name (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Source vs Fork radio filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-mutedGrey/10 text-xs">
          <span className="text-mutedGrey font-medium mr-2">Show:</span>
          {['ALL', 'SOURCE', 'FORK'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? 'bg-terracotta text-white'
                  : 'bg-ivory dark:bg-charcoal text-charcoal dark:text-ivory hover:bg-mutedGrey/20'
              }`}
            >
              {type === 'ALL' ? 'All Repositories' : type === 'SOURCE' ? 'Sources Only' : 'Forks Only'}
            </button>
          ))}
          <span className="ml-auto text-mutedGrey">
            Showing {filteredRepos.length} of {repos.length}
          </span>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.name}
              className="bg-white dark:bg-charcoal-light rounded-2xl p-5 border border-mutedGrey/20 shadow-sm hover:border-terracotta/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-charcoal dark:text-ivory truncate hover:text-terracotta">
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  {repo.is_fork && (
                    <span className="text-[10px] bg-sand/30 text-charcoal dark:text-sand px-2 py-0.5 rounded font-mono">
                      fork
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-mutedGrey dark:text-ivory/70 line-clamp-2 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-mutedGrey/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3 text-mutedGrey">
                  {repo.language && (
                    <span className="flex items-center gap-1 font-medium text-charcoal dark:text-ivory">
                      <span className="w-2 h-2 rounded-full bg-terracotta"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sage font-medium">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-sand font-medium">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/commits/${username}?repo=${repo.name}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory dark:bg-charcoal text-charcoal dark:text-ivory hover:text-terracotta border border-mutedGrey/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    <GitCommit className="w-3.5 h-3.5 text-terracotta" />
                    Commits
                  </Link>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-mutedGrey hover:text-charcoal dark:hover:text-ivory"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-charcoal-light rounded-2xl p-12 text-center border border-mutedGrey/20">
          <FolderGit2 className="w-12 h-12 text-mutedGrey mx-auto mb-3" />
          <h3 className="font-bold text-lg text-charcoal dark:text-ivory">No repositories matched</h3>
          <p className="text-xs text-mutedGrey mt-1">
            Try adjusting your search query or language filters.
          </p>
        </div>
      )}
    </div>
  );
}

