import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';

// Layout
import { AppLayout } from '@/components/layout/AppLayout';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { SignupPage } from '@/pages/public/SignupPage';
import { TermsPage } from '@/pages/public/TermsPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';

// Authenticated Pages
import { DashboardPage } from '@/pages/app/DashboardPage';
import { ReviewWorkspacePage } from '@/pages/app/ReviewWorkspacePage';
import { GuidelinesPage } from '@/pages/app/GuidelinesPage';
import { HistoryPage } from '@/pages/app/HistoryPage';
import { UserManagementPage } from '@/pages/app/UserManagementPage';
import { AnalyticsPage } from '@/pages/app/AnalyticsPage';
import { SettingsPage } from '@/pages/app/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Authenticated Workspace Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="review" element={<ReviewWorkspacePage />} />
              <Route path="guidelines" element={<GuidelinesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
