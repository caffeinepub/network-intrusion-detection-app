import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AlertProvider } from './contexts/AlertContext';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrafficAnalysis from './pages/TrafficAnalysis';
import DetectionHistory from './pages/DetectionHistory';
import Alerts from './pages/Alerts';
import ProfileSetupModal from './components/ProfileSetupModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background circuit-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/generated/netguard-logo.dim_256x256.png"
            alt="NetGuard"
            className="w-16 h-16 animate-pulse"
          />
          <p className="font-heading text-cyber-green tracking-widest uppercase text-sm">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Dashboard,
});

const trafficRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/traffic',
  component: TrafficAnalysis,
});

const historyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/history',
  component: DetectionHistory,
});

const alertsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/alerts',
  component: Alerts,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    dashboardRoute,
    trafficRoute,
    historyRoute,
    alertsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
