import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RepositoryExplorerPage } from './pages/RepositoryExplorerPage';
import { CommitAnalyticsPage } from './pages/CommitAnalyticsPage';
import { DeveloperInsightsPage } from './pages/DeveloperInsightsPage';
import { CompareProfilesPage } from './pages/CompareProfilesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SavedProfilesPage } from './pages/SavedProfilesPage';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone Landing Page with Navbar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard/:username" element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/dashboard/octocat" replace />} />

            <Route path="repositories/:username" element={<RepositoryExplorerPage />} />
            <Route path="repositories" element={<Navigate to="/repositories/octocat" replace />} />

            <Route path="commits/:username" element={<CommitAnalyticsPage />} />
            <Route path="commits" element={<Navigate to="/commits/octocat" replace />} />

            <Route path="insights/:username" element={<DeveloperInsightsPage />} />
            <Route path="insights" element={<Navigate to="/insights/octocat" replace />} />

            <Route path="compare" element={<CompareProfilesPage />} />
            <Route path="reports/:username" element={<ReportsPage />} />
            <Route path="reports" element={<Navigate to="/reports/octocat" replace />} />

            <Route path="saved" element={<SavedProfilesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

