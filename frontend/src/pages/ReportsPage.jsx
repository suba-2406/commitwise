import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Bookmark,
  GitCommit,
  Star,
  GitFork,
  FolderGit2
} from 'lucide-react';

import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function ReportsPage() {
  const { username = 'octocat' } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      setError(null);
      try {
        const [prof, st, ins, rp] = await Promise.all([
          api.getProfile(username),
          api.getStatistics(username),
          api.getInsights(username),
          api.getRepositories(username),
        ]);
        setProfile(prof);
        setStats(st);
        setInsights(ins);
        setRepos(rp || []);
      } catch (err) {
        setError(err.message || 'Failed to generate developer report.');
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [username]);

  const handlePrint = () => {
    window.print();
  };

  const csvExportUrl = api.getExportCsvUrl(username);

  if (loading) {
    return <LoadingSpinner text={`Compiling executive report for @${username}...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const generatedDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mutedGrey/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
            Developer Intelligence Report
          </h1>
          <p className="text-sm text-mutedGrey mt-1">
            Generated analysis for <strong className="text-terracotta">@{username}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={csvExportUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-sage hover:bg-sage-hover text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-charcoal-light rounded-2xl p-8 border border-mutedGrey/20 shadow-md space-y-8">
        {/* Report Header */}
        <div className="flex items-start justify-between border-b border-mutedGrey/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta flex items-center justify-center text-white font-bold">
              <GitCommit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-charcoal dark:text-ivory">
                CommitWise Intelligence Audit
              </h2>
              <p className="text-xs text-mutedGrey">
                Confidential Developer Activity & Portfolio Diagnostic
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-mutedGrey">
            <div>Report Date: {generatedDate}</div>
            <div className="font-mono text-terracotta font-semibold">CW-AUDIT-{username.toUpperCase()}</div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-xl bg-ivory/60 dark:bg-charcoal/60 border border-mutedGrey/20">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || 'https://github.com/identicons/octocat.png'}
              alt={profile?.username}
              className="w-16 h-16 rounded-xl border object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-charcoal dark:text-ivory">
                {profile?.name || profile?.username}
              </h3>
              <p className="text-xs text-mutedGrey font-mono">@{profile?.username}</p>
              {profile?.bio && (
                <p className="text-xs text-charcoal/80 dark:text-ivory/80 mt-1 max-w-xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold text-mutedGrey uppercase">Portfolio Health</div>
            <div className="text-2xl font-black text-sage">
              {insights?.health_score}/100
            </div>
            <div className="text-[11px] text-mutedGrey">
              Persona: <strong className="text-charcoal dark:text-ivory">{insights?.developer_persona}</strong>
            </div>
          </div>
        </div>

        {/* Key Metrics Table */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-mutedGrey mb-3">
            Core Performance Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-mutedGrey/20 bg-white dark:bg-charcoal">
              <span className="text-xs text-mutedGrey">Public Repos</span>
              <div className="text-xl font-bold text-charcoal dark:text-ivory mt-1">
                {profile?.public_repositories || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-mutedGrey/20 bg-white dark:bg-charcoal">
              <span className="text-xs text-mutedGrey">Total Stars</span>
              <div className="text-xl font-bold text-sage mt-1">
                {stats?.total_stars || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-mutedGrey/20 bg-white dark:bg-charcoal">
              <span className="text-xs text-mutedGrey">Total Forks</span>
              <div className="text-xl font-bold text-sand mt-1">
                {stats?.total_forks || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-mutedGrey/20 bg-white dark:bg-charcoal">
              <span className="text-xs text-mutedGrey">Primary Stack</span>
              <div className="text-xl font-bold text-terracotta mt-1 truncate">
                {stats?.most_used_language || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Top Repositories Inventory Table */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-mutedGrey mb-3">
            Repository Inventory (Top 10)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-mutedGrey/20 rounded-xl overflow-hidden">
              <thead className="bg-ivory dark:bg-charcoal border-b border-mutedGrey/20 text-mutedGrey uppercase">
                <tr>
                  <th className="py-2.5 px-3">Repository Name</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Stars</th>
                  <th className="py-2.5 px-3">Forks</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mutedGrey/10">
                {repos.slice(0, 10).map((r) => (
                  <tr key={r.name}>
                    <td className="py-2.5 px-3 font-semibold text-charcoal dark:text-ivory">
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 text-mutedGrey">
                      {r.language || 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-sage">
                      {r.stars}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-sand">
                      {r.forks}
                    </td>
                    <td className="py-2.5 px-3 text-mutedGrey">
                      {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostic Notes */}
        <div className="p-4 rounded-xl bg-ivory/50 dark:bg-charcoal/50 border border-mutedGrey/20 text-xs space-y-2">
          <div className="font-bold text-charcoal dark:text-ivory">Audit Conclusion & Notes:</div>
          <p className="text-mutedGrey dark:text-ivory/70 leading-relaxed">
            {insights?.summary} Metrics calculated directly from the live GitHub REST API. Documentation coverage was assessed at {insights?.metrics?.description_coverage_percent || 0}%, and license adherence stands at {insights?.metrics?.license_coverage_percent || 0}%.
          </p>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-mutedGrey/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-mutedGrey gap-2">
          <span>Generated by CommitWise Analytics Engine</span>
          <span>Verified against GitHub REST API v3</span>
        </div>
      </div>
    </div>
  );
}

