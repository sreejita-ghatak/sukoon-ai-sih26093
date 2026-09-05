import React, { useState, useEffect } from 'react';
import { useOperator, OperatorProvider } from './OperatorContext';
import { OperatorSidebar } from './components/OperatorSidebar';
import { OperatorTopHeader } from './components/OperatorTopHeader';
import { OperatorLoginPage } from './pages/OperatorLoginPage';
import { OperatorDashboardPage } from './pages/OperatorDashboardPage';
import { CaseQueuePage } from './pages/CaseQueuePage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { AllSessionsPage } from './pages/AllSessionsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { OperatorSettingsPage } from './pages/OperatorSettingsPage';

const OperatorMainContent: React.FC = () => {
  const { currentPath, isAuthenticated, navigate } = useOperator();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Protected route enforcement
  useEffect(() => {
    if (!isAuthenticated && currentPath !== '/operator/login') {
      navigate('/operator/login');
    }
  }, [isAuthenticated, currentPath, navigate]);

  // If on login route
  if (currentPath === '/operator/login') {
    if (isAuthenticated) {
      // If already logged in and visiting login, go to dashboard
      return <OperatorDashboardPage />;
    }
    return <OperatorLoginPage />;
  }

  // If unauthenticated trying to access any other operator route, show login
  if (!isAuthenticated) {
    return <OperatorLoginPage />;
  }

  // Route Dispatcher
  const renderCurrentView = () => {
    // Case detail matching: /operator/cases/:id
    const caseDetailMatch = currentPath.match(/^\/operator\/cases\/([^/?#]+)/);
    if (caseDetailMatch && caseDetailMatch[1]) {
      return <CaseDetailPage caseId={caseDetailMatch[1]} />;
    }

    if (currentPath === '/operator/cases') {
      return <CaseQueuePage />;
    }

    if (currentPath === '/operator/sessions') {
      return <AllSessionsPage />;
    }

    if (currentPath === '/operator/alerts') {
      return <AlertsPage />;
    }

    if (currentPath === '/operator/reports') {
      return <ReportsPage />;
    }

    if (currentPath === '/operator/settings') {
      return <OperatorSettingsPage />;
    }

    // Default to Dashboard
    return <OperatorDashboardPage />;
  };

  return (
    <div className="min-h-screen bg-[#05010b] text-white flex flex-row overflow-x-hidden font-sans select-none">
      {/* Persistent Left Sidebar for Desktop + Drawer for Mobile */}
      <OperatorSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070211] min-h-screen">
        {/* Top Header */}
        <OperatorTopHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export const OperatorApp: React.FC = () => {
  return (
    <OperatorProvider>
      <OperatorMainContent />
    </OperatorProvider>
  );
};
