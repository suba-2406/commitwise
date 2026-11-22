import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  GitCommit,
  FolderGit2,
  Calendar,
  User,
  ExternalLink,
  Clock,
  CheckCircle2,
  Code
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { api } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function CommitAnalyticsPage() {
  const { username = 'octocat' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const repoParam = searchParams.get('repo');

  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(repoParam || '');
  const [commitsData, setCommitsData] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch repositories list to populate selector
  useEffect(() => {
    async function fetchReposList() {
      setLoadingRepos(true);
      setError(null);
      try {
        const repoList = await api.getRepositories(username);
        setRepos(repoList || []);
        if (repoList && repoList.length > 0) {
          const defaultRepo = repoParam || repoList[0].name;
          setSelectedRepo(defaultRepo);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch repositories.');
      } finally {
        setLoadingRepos(false);
      }
    }
    fetchReposList();
  }, [username, repoParam]);

  // 2. Fetch commits when selectedRepo changes
  useEffect(() => {
    if (!selectedRepo) return;

    async function fetchCommits() {
      setLoadingCommits(true);
      setError(null);
      try {
        const res = await api.getCommits(username, selectedRepo);
        setCommitsData(res);
      } catch (err) {
        setError(err.message || `Failed to fetch commits for ${selectedRepo}`);
      } finally {
        setLoadingCommits(false);
      }
    }

    fetchCommits();
  }, [username, selectedRepo]);

  const handleRepoChange = (newRepo) => {
    setSelectedRepo(newRepo);
    setSearchParams({ repo: newRepo });
  };

  if (loadingRepos) {
    return <LoadingSpinner text={`Loading repositories for @${username}...`} />;
  }

  if (error && !commitsData) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const commits = commitsData?.commits || [];

  // Group commits by Day of Week
  const weekdayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const authorsSet = new Set();

  commits.forEach((c) => {
    if (c.author) authorsSet.add(c.author);
    if (c.date) {
      try {
        const dt = new Date(c.date);
        const dayStr = dt.toLocaleDateString(undefined, { weekday: 'short' });
        if (weekdayCounts[dayStr] !== undefined) {
          weekdayCounts[dayStr] += 1;
        }
      } catch {}
    }
  });

  const chartData = Object.entries(weekdayCounts).map(([day, count]) => ({
    day,
    commits: count,
  }));

  return (
    <div className="space-y-6">
      {/* Header and Repo Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
            Commit Analytics
          </h1>
          <p className="text-sm text-mutedGrey mt-1">
            Analyzing commit patterns and code velocity for <strong className="text-terracotta">@{username}</strong>
          </p>
        </div>

        {/* Repository Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold uppercase tracking-wider text-mutedGrey mb-1.5">
            Select Repository
          </label>
          <select
            value={selectedRepo}
            onChange={(e) => handleRepoChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-charcoal text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta shadow-sm"
          >
            {repos.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name} ({r.stars} ★)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingCommits ? (
        <LoadingSpinner text={`Analyzing commit history for ${selectedRepo}...`} />
      ) : (
        <>
          {/* Key Metric Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard
              title="Recent Commits Analyzed"
              value={commits.length}
              subtitle="Latest repository commits (up to 100)"
              icon={GitCommit}
              variant="terracotta"
            />
            <MetricCard
              title="Distinct Commit Authors"
              value={authorsSet.size}
              subtitle="Contributors detected"
              icon={User}
              variant="sage"
            />
            <MetricCard
              title="Repository Scope"
              value={selectedRepo}
              subtitle="Active repository analysis"
              icon={FolderGit2}
              variant="default"
            />
          </div>

          {/* Day of Week Commit Trends Chart */}
          <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
                  Commit Timing by Day of Week
                </h3>
                <p className="text-xs text-mutedGrey mt-0.5">
                  Visualizes which days code changes were authored
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-sand/30 text-charcoal dark:text-sand">
                {commits.length} commits sample
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8A8D88" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} commits`, 'Commits']}
                    contentStyle={{
                      backgroundColor: '#292D2C',
                      borderColor: '#8A8D88',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="commits" fill="#D97745" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Commit History Feed */}
          <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
                Commit Log
              </h3>
              <span className="text-xs text-mutedGrey">
                Sorted by most recent
              </span>
            </div>

            {commits.length > 0 ? (
              <div className="divide-y divide-mutedGrey/10">
                {commits.map((c) => (
                  <div key={c.commit_id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {c.author_avatar ? (
                        <img
                          src={c.author_avatar}
                          alt={c.author || 'Author'}
                          className="w-8 h-8 rounded-full border border-mutedGrey/20 object-cover mt-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-ivory dark:bg-charcoal border border-mutedGrey/30 flex items-center justify-center text-mutedGrey mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-charcoal dark:text-ivory line-clamp-2">
                          {c.message || 'No commit message'}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-mutedGrey">
                          <span>{c.author || 'Unknown author'}</span>
                          <span>•</span>
                          <span>{c.date ? new Date(c.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory dark:bg-charcoal text-charcoal dark:text-ivory font-mono text-xs rounded-lg border border-mutedGrey/20 hover:border-terracotta hover:text-terracotta transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                        {c.commit_id ? c.commit_id.substring(0, 7) : 'view'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-mutedGrey text-sm">
                No commits found in this repository.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

