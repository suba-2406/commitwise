import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Scale,
  Search,
  Trophy,
  ArrowRight,
  ExternalLink,
  Code2,
  Users,
  Star,
  GitFork,
  FolderGit2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function CompareProfilesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const u1Param = searchParams.get('u1') || 'torvalds';
  const u2Param = searchParams.get('u2') || 'octocat';

  const [user1Input, setUser1Input] = useState(u1Param);
  const [user2Input, setUser2Input] = useState(u2Param);

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runComparison = async (u1, u2) => {
    if (!u1 || !u2) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.compareProfiles(u1, u2);
      setComparison(data);
      setSearchParams({ u1, u2 });
    } catch (err) {
      setError(err.message || 'Failed to compare profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison(u1Param, u2Param);
  }, [u1Param, u2Param]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean1 = user1Input.trim();
    const clean2 = user2Input.trim();
    if (clean1 && clean2) {
      runComparison(clean1, clean2);
    }
  };

  const chartData = (comparison?.metrics_comparison || []).map((m) => ({
    metric: m.metric,
    [comparison?.user1?.username || 'User 1']: m.user1_value,
    [comparison?.user2?.username || 'User 2']: m.user2_value,
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
          Compare Developer Profiles
        </h1>
        <p className="text-sm text-mutedGrey mt-1">
          Head-to-head metrics, repository comparisons, and language overlap analysis
        </p>
      </div>

      {/* Comparison Form */}
      <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl border border-mutedGrey/20 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-mutedGrey mb-1">
              Developer 1
            </label>
            <input
              type="text"
              placeholder="Username 1 (e.g. torvalds)"
              value={user1Input}
              onChange={(e) => setUser1Input(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-ivory/50 dark:bg-charcoal/50 text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="text-mutedGrey font-bold px-2 self-center sm:pt-6">VS</div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-mutedGrey mb-1">
              Developer 2
            </label>
            <input
              type="text"
              placeholder="Username 2 (e.g. octocat)"
              value={user2Input}
              onChange={(e) => setUser2Input(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-ivory/50 dark:bg-charcoal/50 text-charcoal dark:text-ivory rounded-xl border border-mutedGrey/30 focus:outline-none focus:border-terracotta"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto sm:self-end px-6 py-2.5 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Compare
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner text="Benchmarking developers head-to-head..." />}

      {error && <ErrorMessage message={error} onRetry={() => runComparison(user1Input, user2Input)} />}

      {comparison && !loading && (
        <>
          {/* Side by Side Developer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User 1 Card */}
            <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border-2 border-terracotta/30 shadow-sm flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={comparison.user1.avatar_url || 'https://github.com/identicons/user1.png'}
                  alt={comparison.user1.username}
                  className="w-16 h-16 rounded-2xl border border-terracotta object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-charcoal dark:text-ivory">
                      {comparison.user1.name || comparison.user1.username}
                    </h3>
                    {comparison.user1.wins > comparison.user2.wins && (
                      <span className="p-1 rounded bg-sand/30 text-charcoal dark:text-sand" title="Leader in metrics">
                        <Trophy className="w-4 h-4 text-terracotta" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-mutedGrey">@{comparison.user1.username}</p>
                  <p className="mt-2 text-xs text-charcoal/80 dark:text-ivory/80 line-clamp-2">
                    {comparison.user1.bio || 'No bio provided'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-terracotta/10 text-terracotta">
                {comparison.user1.wins} Wins
              </span>
            </div>

            {/* User 2 Card */}
            <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border-2 border-sage/30 shadow-sm flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={comparison.user2.avatar_url || 'https://github.com/identicons/user2.png'}
                  alt={comparison.user2.username}
                  className="w-16 h-16 rounded-2xl border border-sage object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-charcoal dark:text-ivory">
                      {comparison.user2.name || comparison.user2.username}
                    </h3>
                    {comparison.user2.wins > comparison.user1.wins && (
                      <span className="p-1 rounded bg-sand/30 text-charcoal dark:text-sand" title="Leader in metrics">
                        <Trophy className="w-4 h-4 text-sage" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-mutedGrey">@{comparison.user2.username}</p>
                  <p className="mt-2 text-xs text-charcoal/80 dark:text-ivory/80 line-clamp-2">
                    {comparison.user2.bio || 'No bio provided'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sage/10 text-sage">
                {comparison.user2.wins} Wins
              </span>
            </div>
          </div>

          {/* Comparative Bar Chart */}
          <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
            <h3 className="font-bold text-lg text-charcoal dark:text-ivory mb-1">
              Metric Comparison Chart
            </h3>
            <p className="text-xs text-mutedGrey mb-6">
              Direct comparison of key GitHub stats
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8A8D88" opacity={0.15} />
                  <XAxis dataKey="metric" stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#292D2C',
                      borderColor: '#8A8D88',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey={comparison.user1.username} fill="#D97745" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={comparison.user2.username} fill="#65A99B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Metric Table */}
          <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm overflow-x-auto">
            <h3 className="font-bold text-lg text-charcoal dark:text-ivory mb-4">
              Metric Breakdown
            </h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-mutedGrey/20 text-xs uppercase text-mutedGrey">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">@{comparison.user1.username}</th>
                  <th className="py-3 px-4">@{comparison.user2.username}</th>
                  <th className="py-3 px-4">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mutedGrey/10">
                {comparison.metrics_comparison.map((m) => (
                  <tr key={m.metric}>
                    <td className="py-3 px-4 font-medium text-charcoal dark:text-ivory">
                      {m.metric}
                    </td>
                    <td className={`py-3 px-4 font-mono font-bold ${m.winner === 'user1' ? 'text-terracotta' : 'text-charcoal dark:text-ivory'}`}>
                      {m.user1_value}
                    </td>
                    <td className={`py-3 px-4 font-mono font-bold ${m.winner === 'user2' ? 'text-sage' : 'text-charcoal dark:text-ivory'}`}>
                      {m.user2_value}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {m.winner === 'user1' ? (
                        <span className="font-semibold text-terracotta">@{comparison.user1.username}</span>
                      ) : m.winner === 'user2' ? (
                        <span className="font-semibold text-sage">@{comparison.user2.username}</span>
                      ) : (
                        <span className="text-mutedGrey font-medium">Tie</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Languages Overlap Analysis */}
          <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
            <h3 className="font-bold text-lg text-charcoal dark:text-ivory mb-2">
              Language Ecosystem Overlap
            </h3>
            <p className="text-xs text-mutedGrey mb-6">
              Compare shared versus unique technologies in their repositories
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Shared */}
              <div className="p-4 rounded-xl bg-sage/10 border border-sage/30">
                <h4 className="font-bold text-sage mb-2">Shared Languages ({comparison.languages.shared.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {comparison.languages.shared.length > 0 ? (
                    comparison.languages.shared.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-sage/20 text-charcoal dark:text-ivory font-medium">
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-mutedGrey">No shared languages</span>
                  )}
                </div>
              </div>

              {/* Unique User 1 */}
              <div className="p-4 rounded-xl bg-terracotta/10 border border-terracotta/30">
                <h4 className="font-bold text-terracotta mb-2">Unique to @{comparison.user1.username} ({comparison.languages.unique_user1.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {comparison.languages.unique_user1.length > 0 ? (
                    comparison.languages.unique_user1.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-terracotta/20 text-charcoal dark:text-ivory font-medium">
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-mutedGrey">None</span>
                  )}
                </div>
              </div>

              {/* Unique User 2 */}
              <div className="p-4 rounded-xl bg-sand/20 border border-sand/40">
                <h4 className="font-bold text-charcoal dark:text-sand mb-2">Unique to @{comparison.user2.username} ({comparison.languages.unique_user2.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {comparison.languages.unique_user2.length > 0 ? (
                    comparison.languages.unique_user2.map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded bg-sand/30 text-charcoal dark:text-ivory font-medium">
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-mutedGrey">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

