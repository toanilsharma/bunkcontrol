import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider, useNav } from './contexts/NavigationContext';
import Loading from './components/Loading';

// Lazy load pages to improve initial load time
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { currentPage } = useNav();

    // Use Suspense to show a loading spinner while the page code is being fetched
    return (
        <Suspense fallback={<Loading />}>
            {(() => {
                // Public Pages (Always accessible)
                if (currentPage === 'about') return <AboutPage />;
                if (currentPage === 'contact') return <ContactPage />;
                if (currentPage === 'privacy') return <PrivacyPage />;
                if (currentPage === 'terms') return <TermsPage />;
                if (currentPage === 'help') return <HelpPage />;
                if (currentPage === 'resources') return <ResourcesPage />;
                if (currentPage === 'article') return <ArticlePage />;

                // Unauthenticated State -> Show Landing/Login Page
                if (!isAuthenticated) {
                    return <LoginPage />;
                }

                // Authenticated State Logic
                return <Dashboard />;
            })()}
        </Suspense>
    );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
};

export default App;