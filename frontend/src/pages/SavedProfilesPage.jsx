import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ArrowRight,
  Scale,
  FolderGit2,
  Star,
  Users,
  Code2
} from 'lucide-react';

import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function SavedProfilesPage() {
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSavedProfiles();
      setSavedProfiles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch saved profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async (username) => {
    try {
      await api.deleteSavedProfile(username);
      setSavedProfiles((prev) => prev.filter((p) => p.username !== username));
    } catch (err) {
      alert(`Failed to delete profile: ${err.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving bookmarked profiles from database..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSaved} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-ivory">
          Saved Developer Profiles
        </h1>
        <p className="text-sm text-mutedGrey mt-1">
          Your persisted bookmarks stored in the database for instant tracking and benchmarking
        </p>
      </div>

      {savedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-mutedGrey/20 shadow-sm hover:border-terracotta/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar_url || 'https://github.com/identicons/octocat.png'}
                      alt={p.username}
                      className="w-12 h-12 rounded-xl border border-mutedGrey/20 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-base text-charcoal dark:text-ivory truncate">
                        {p.name || p.username}
                      </h3>
                      <p className="text-xs text-mutedGrey font-mono">@{p.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(p.username)}
                    className="p-1.5 rounded-lg text-mutedGrey hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {p.bio && (
                  <p className="mt-3 text-xs text-charcoal/80 dark:text-ivory/80 line-clamp-2 leading-relaxed">
                    {p.bio}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-mutedGrey/10 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-mutedGrey block">Repos</span>
                    <strong className="text-charcoal dark:text-ivory font-mono">{p.public_repos}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-mutedGrey block">Stars</span>
                    <strong className="text-sage font-mono">{p.total_stars} ★</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-mutedGrey block">Followers</span>
                    <strong className="text-charcoal dark:text-ivory font-mono">{p.followers}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-mutedGrey/10 flex items-center justify-between gap-2">
                <Link
                  to={`/compare?u1=${p.username}`}
                  className="inline-flex items-center gap-1 text-xs text-mutedGrey hover:text-terracotta font-medium transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Compare
                </Link>

                <Link
                  to={`/dashboard/${p.username}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-charcoal-light rounded-2xl p-12 text-center border border-mutedGrey/20 max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4 text-charcoal dark:text-sand">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-charcoal dark:text-ivory mb-1">
            No Bookmarked Profiles Yet
          </h3>
          <p className="text-xs text-mutedGrey mb-6">
            When viewing any developer's dashboard, click "Bookmark Profile" to save them to your database for one-click access.
          </p>
          <Link
            to="/dashboard/octocat"
            className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Explore @octocat
          </Link>
        </div>
      )}
    </div>
  );
}

