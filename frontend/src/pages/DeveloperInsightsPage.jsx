import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Lightbulb,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Star,
  GitFork,
  BookOpen
} from 'lucide-react';

import { api } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function DeveloperInsightsPage() {
  const { username = 'octocat' } = useParams();

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getInsights(username);
        setInsights(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch developer insights.');
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [username]);

  if (loading) {
    return <LoadingSpinner text={`Computing portfolio health and insights for @${username}...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  const metrics = insights?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
          Developer Insights & Health Diagnostics
        </h1>
        <p className="text-sm text-mutedGrey mt-1">
          Automated evaluation of portfolio maintenance, consistency, and repository health for{' '}
          <strong className="text-terracotta">@{username}</strong>
        </p>
      </div>

      {/* Top Banner: Developer Persona & Health Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Developer Persona Card */}
        <div className="lg:col-span-2 bg-white dark:bg-charcoal-light rounded-2xl p-6 sm:p-8 border border-mutedGrey/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-terracotta uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              Developer Persona
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
              {insights?.developer_persona}
            </h2>
            <p className="mt-3 text-sm text-charcoal/80 dark:text-ivory/80 leading-relaxed">
              {insights?.persona_description}
            </p>
            <div className="mt-4 p-3.5 rounded-xl bg-ivory dark:bg-charcoal border border-mutedGrey/20 text-xs text-mutedGrey leading-relaxed">
              {insights?.summary}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-mutedGrey/10 flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-mutedGrey">Total Stars Earned:</span>{' '}
              <strong className="text-sage">{metrics.total_stars || 0} ★</strong>
            </div>
            <div>
              <span className="text-mutedGrey">Language Breadth:</span>{' '}
              <strong className="text-charcoal dark:text-ivory">{metrics.unique_languages || 0} languages</strong>
            </div>
          </div>
        </div>

        {/* Portfolio Health Score Gauge */}
        <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-mutedGrey mb-2">
            Repository Health Score
          </span>
          <div className="relative w-36 h-36 flex items-center justify-center my-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#8A8D88"
                strokeWidth="8"
                fill="transparent"
                opacity="0.2"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#65A99B"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (insights?.health_score || 0)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-charcoal dark:text-ivory">
                {insights?.health_score}
              </span>
              <span className="text-[10px] text-mutedGrey uppercase font-semibold">
                out of 100
              </span>
            </div>
          </div>

          <div className="text-xs text-mutedGrey px-4">
            {insights?.health_score >= 80 ? (
              <span className="text-sage font-medium">★ Exceptional Repository Maintenance</span>
            ) : insights?.health_score >= 60 ? (
              <span className="text-sand font-medium">Moderate Repository Hygiene</span>
            ) : (
              <span className="text-terracotta font-medium">Needs Documentation & Fresh Updates</span>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Documentation Coverage"
          value={`${metrics.description_coverage_percent || 0}%`}
          subtitle="Repos with descriptive README/overview"
          icon={BookOpen}
          variant="default"
        />

        <MetricCard
          title="Open Source Licensing"
          value={`${metrics.license_coverage_percent || 0}%`}
          subtitle="Repos with recognized OSS license"
          icon={ShieldCheck}
          variant="sage"
        />

        <MetricCard
          title="Update Recency"
          value={`${metrics.recent_activity_percent || 0}%`}
          subtitle="Updated within the last 6 months"
          icon={TrendingUp}
          variant="sand"
        />

        <MetricCard
          title="Original Source Ratio"
          value={`${metrics.source_ratio_percent || 0}%`}
          subtitle="Original repositories vs forks"
          icon={Zap}
          variant="terracotta"
        />
      </div>

      {/* Top 5 Most Active Repositories */}
      <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
              Most Active & Impactful Repositories
            </h3>
            <p className="text-xs text-mutedGrey mt-0.5">
              Ranked by community stars, fork activity, and commit recency
            </p>
          </div>
          <Link
            to={`/repositories/${username}`}
            className="text-xs font-semibold text-terracotta hover:underline"
          >
            All Repositories →
          </Link>
        </div>

        {insights?.active_repositories && insights.active_repositories.length > 0 ? (
          <div className="divide-y divide-mutedGrey/10">
            {insights.active_repositories.map((repo, idx) => (
              <div
                key={repo.name}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-ivory dark:bg-charcoal border border-mutedGrey/30 font-bold text-xs flex items-center justify-center text-charcoal dark:text-ivory">
                    #{idx + 1}
                  </div>
                  <div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-charcoal dark:text-ivory hover:text-terracotta transition-colors flex items-center gap-1.5"
                    >
                      {repo.name}
                      <ExternalLink className="w-3 h-3 text-mutedGrey" />
                    </a>
                    <p className="text-xs text-mutedGrey line-clamp-1 mt-0.5">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {repo.language && (
                    <span className="font-medium text-charcoal dark:text-ivory">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-mutedGrey">
            No active repositories available.
          </div>
        )}
      </div>

      {/* Actionable Recommendations Card */}
      <div className="bg-sand/20 dark:bg-sand/10 border border-sand/40 rounded-2xl p-6">
        <h4 className="font-bold text-sm text-charcoal dark:text-ivory flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-terracotta" />
          Recommendations for Developer Profile Optimization
        </h4>
        <ul className="space-y-2 text-xs text-charcoal/80 dark:text-ivory/80">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 flex-shrink-0" />
            <span>Add meaningful descriptions and READMEs to all public repositories to maximize documentation coverage.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 flex-shrink-0" />
            <span>Include standard open-source licenses (MIT, Apache 2.0, GPL) to clarify usage terms for recruiters and collaborators.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 flex-shrink-0" />
            <span>Pin your top 4-6 highest quality repositories to your GitHub profile to showcase your best code first.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

