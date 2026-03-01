import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Shield, Bell, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useAlerts } from '../hooks/useAlerts';

export default function Navigation() {
  const location = useLocation();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { alerts } = useAlerts();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/traffic', label: 'Traffic Analysis' },
    { path: '/history', label: 'Detection History' },
    { path: '/alerts', label: 'Alerts' },
  ];

  return (
    <nav className="hidden sm:flex sticky top-0 z-50 bg-cyber-navy/95 backdrop-blur-sm border-b border-cyber-green/20 px-6 items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <img src="/assets/generated/netguard-logo.dim_256x256.png" alt="NetGuard" className="w-8 h-8" />
        <span className="font-heading text-lg font-bold text-cyber-green tracking-widest uppercase">NetGuard</span>
      </div>
      <div className="flex items-center gap-1">
        {navLinks.map(({ path, label }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          const isAlerts = path === '/alerts';
          return (
            <Link
              key={path}
              to={path}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'text-cyber-green bg-cyber-green/10'
                  : 'text-muted-foreground hover:text-cyber-green hover:bg-cyber-green/5'
              }`}
            >
              {label}
              {isAlerts && alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                  {alerts.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        {userProfile && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User size={14} className="text-cyber-green/70" />
            <span className="font-mono">{userProfile.name}</span>
          </div>
        )}
        {identity && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-cyber-green hover:bg-cyber-green/10 rounded-md transition-colors"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
