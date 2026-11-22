const API_BASE = 'http://127.0.0.1:8000';

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMessage = errorData.detail;
      } catch {
        // ignore fallback to generic message
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to CommitWise Backend server. Ensure FastAPI is running on port 8000.');
    }
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/'),

  // GitHub user endpoints
  getProfile: (username) => request(`/github/${encodeURIComponent(username)}`),
  getRepositories: (username) => request(`/github/${encodeURIComponent(username)}/repositories`),
  getCommits: (username, repository) =>
    request(`/github/${encodeURIComponent(username)}/${encodeURIComponent(repository)}/commits`),
  getStatistics: (username) => request(`/github/${encodeURIComponent(username)}/statistics`),
  getActivity: (username) => request(`/github/${encodeURIComponent(username)}/activity`),
  getLanguages: (username) => request(`/github/${encodeURIComponent(username)}/languages`),
  getInsights: (username) => request(`/github/${encodeURIComponent(username)}/insights`),

  // Comparison
  compareProfiles: (user1, user2) =>
    request(`/compare/${encodeURIComponent(user1)}/${encodeURIComponent(user2)}`),

  // Database bookmarks
  getSavedProfiles: () => request('/api/saved-profiles'),
  saveProfile: (username) =>
    request(`/api/saved-profiles/${encodeURIComponent(username)}`, { method: 'POST' }),
  deleteSavedProfile: (username) =>
    request(`/api/saved-profiles/${encodeURIComponent(username)}`, { method: 'DELETE' }),

  // CSV export URL
  getExportCsvUrl: (username) => `${API_BASE}/github/${encodeURIComponent(username)}/export/csv`,
};

