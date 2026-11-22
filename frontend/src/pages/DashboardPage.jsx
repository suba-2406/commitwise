import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderGit2,
  Star,
  GitFork,
  Users,
  Code2,
  Calendar,
  MapPin,
  Building,
  Link as LinkIcon,
  ExternalLink,
  Bookmark,
  Check,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

import { api } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

const PALETTE_COLORS = [
  '#D97745', // Terracotta
  '#65A99B', // Sage Teal
  '#E8C99B', // Sand
  '#292D2C', // Charcoal
  '#8A8D88', // Muted Grey
  '#A06346',
  '#488579',
  '#CCA370',
];

export function DashboardPage() {
  const { username = 'octocat' } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, statsData, activityData, langData] = await Promise.all([
        api.getProfile(username),
        api.getStatistics(username),
        api.getActivity(username),
        api.getLanguages(username),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setActivity(activityData);
      setLanguages(langData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [username]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaveLoading(true);
    try {
      await api.saveProfile(username);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={`Aggregating live analytics for @${username}...`} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  // Language pie chart data
  const pieData = (languages?.languages || []).slice(0, 6).map((item) => ({
    name: item.name,
    value: item.repo_count,
    percentage: item.percentage,
  }));

  // Weekday activity bar chart data
  const weekdayData = activity?.weekday_activity || [];

  return (
    <div className="space-y-8">
      {/* Rate Limit Demo Notice */}
      {profile?.is_mock && (
        <div className="bg-sand/30 dark:bg-sand/10 border border-sand text-charcoal dark:text-ivory rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0" />
            <div>
              <strong className="font-semibold text-terracotta">Simulated Demo Mode:</strong>{' '}
              GitHub API unauthenticated hourly limit (60 req/hr) reached on your IP. Showing simulated intelligence data for <strong>@{username}</strong>.
            </div>
          </div>
          <div className="text-mutedGrey text-[11px] bg-white/60 dark:bg-charcoal/60 px-3 py-1.5 rounded-lg border border-mutedGrey/20">
            Paste a free <code className="text-terracotta font-mono font-semibold">GITHUB_TOKEN</code> in <code className="font-mono">backend/.env</code> for live data.
          </div>
        </div>
      )}

      {/* Top Banner: Profile Card */}
      <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 sm:p-8 border border-mutedGrey/20 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profile?.avatar_url || 'https://github.com/identicons/octocat.png'}
              alt={profile?.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-terracotta/40 shadow-sm object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
                  {profile?.name || profile?.username}
                </h1>
                <a
                  href={profile?.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-mutedGrey hover:text-terracotta font-mono transition-colors"
                >
                  @{profile?.username}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {profile?.bio && (
                <p className="mt-2 text-sm text-charcoal/80 dark:text-ivory/80 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Badges / Meta */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-mutedGrey dark:text-ivory/60">
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.company && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sage" />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile?.created_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sand" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action: Save Profile & Follower pill */}
          <div className="flex md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-mutedGrey/20">
            <button
              onClick={handleSaveProfile}
              disabled={saveLoading || saved}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                saved
                  ? 'bg-sage text-white border-sage'
                  : 'bg-ivory dark:bg-charcoal text-charcoal dark:text-ivory border-mutedGrey/30 hover:border-terracotta'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Profile Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-terracotta" />
                  Bookmark Profile
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-xs text-mutedGrey">
              <span><strong className="text-charcoal dark:text-ivory">{profile?.followers}</strong> followers</span>
              <span>•</span>
              <span><strong className="text-charcoal dark:text-ivory">{profile?.following}</strong> following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Public Repositories"
          value={profile?.public_repositories || 0}
          subtitle={`${stats?.source_repositories || 0} original, ${stats?.forked_repositories || 0} forked`}
          icon={FolderGit2}
          variant="default"
        />

        <MetricCard
          title="Total Stars Earned"
          value={stats?.total_stars || 0}
          subtitle="Community stargazers"
          icon={Star}
          variant="sage"
          trend="Positive repo traction"
        />

        <MetricCard
          title="Total Forks"
          value={stats?.total_forks || 0}
          subtitle="Codebase derivatives"
          icon={GitFork}
          variant="sand"
        />

        <MetricCard
          title="Primary Language"
          value={stats?.most_used_language || 'Various'}
          subtitle={`${languages?.unique_languages_count || 0} total languages used`}
          icon={Code2}
          variant="terracotta"
        />
      </div>

      {/* Charts Grid: Language Distribution & Activity Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language Distribution Donut */}
        <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
                Language Distribution
              </h3>
              <p className="text-xs text-mutedGrey mt-0.5">
                Breakdown across public repositories
              </p>
            </div>
            <Link
              to={`/repositories/${username}`}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              Explore Repos →
            </Link>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE_COLORS[index % PALETTE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => [`${value} repos (${item.payload.percentage}%)`, name]}
                    contentStyle={{
                      backgroundColor: '#292D2C',
                      borderColor: '#8A8D88',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-mutedGrey">
              No language data available for this user.
            </div>
          )}
        </div>

        {/* Weekly Activity Pattern */}
        <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
                Weekly Activity Heat
              </h3>
              <p className="text-xs text-mutedGrey mt-0.5">
                Public events distribution across days of the week
              </p>
            </div>
            <span className="text-xs text-sage font-semibold bg-sage/10 px-2 py-1 rounded-md">
              {activity?.total_events_analyzed || 0} Recent Events
            </span>
          </div>

          {weekdayData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8A8D88" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8A8D88" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} events`, 'Activity']}
                    contentStyle={{
                      backgroundColor: '#292D2C',
                      borderColor: '#8A8D88',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#65A99B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-mutedGrey">
              No public activity events found in recent history.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-terracotta" />
            <h3 className="font-bold text-lg text-charcoal dark:text-ivory">
              Recent Public Contributions
            </h3>
          </div>
          <span className="text-xs text-mutedGrey">
            Real GitHub Event Stream
          </span>
        </div>

        {activity?.recent_events && activity.recent_events.length > 0 ? (
          <div className="space-y-3">
            {activity.recent_events.slice(0, 7).map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 rounded-xl bg-ivory/50 dark:bg-charcoal/50 border border-mutedGrey/10 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-sage"></span>
                  <span className="font-semibold text-charcoal dark:text-ivory">
                    {ev.action}
                  </span>
                  <span className="text-mutedGrey font-mono truncate max-w-xs sm:max-w-md">
                    in {ev.repo}
                  </span>
                </div>
                <span className="text-mutedGrey whitespace-nowrap pl-2">
                  {ev.created_at ? new Date(ev.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-mutedGrey text-xs">
            No recent public events found. GitHub only retains public events for 90 days.
          </div>
        )}
      </div>
    </div>
  );
}

