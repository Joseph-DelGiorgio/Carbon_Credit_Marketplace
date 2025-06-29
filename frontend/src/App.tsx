import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

// Components
import Layout from './components/Layout/Layout';
import ErrorFallback from './components/ErrorFallback/ErrorFallback';

// Pages
import HomePage from './pages/HomePage/HomePage';
import MarketplacePage from './pages/MarketplacePage/MarketplacePage';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import AuthPage from './pages/AuthPage/AuthPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';

// Styles
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WalletProvider>
              <MarketplaceProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/marketplace" element={
                        <Layout>
                          <MarketplacePage />
                        </Layout>
                      } />
                      <Route path="/projects/:id" element={<ProjectDetailPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      
                      {/* Protected routes */}
                      <Route path="/dashboard" element={
                        <Layout>
                          <DashboardPage />
                        </Layout>
                      } />
                      <Route path="/create-project" element={
                        <Layout>
                          <CreateProjectPage />
                        </Layout>
                      } />
                      <Route path="/profile" element={
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      } />
                      
                      {/* 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    
                    {/* Global toast notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#363636',
                          color: '#fff',
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          duration: 5000,
                          iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                          },
                        },
                      }}
                    />
                  </div>
                </Router>
              </MarketplaceProvider>
            </WalletProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App; 