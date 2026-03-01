import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Radar, History, Bell } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';

const tabs = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/traffic', label: 'Analysis', icon: Radar },
  { path: '/history', label: 'History', icon: History },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export default function BottomTabBar() {
  const location = useLocation();
  const { alerts } = useAlerts();
  const unreadCount = alerts.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyber-navy border-t border-cyber-green/20 safe-area-bottom">
      <div className="flex items-stretch h-16">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          const isAlerts = path === '/alerts';

          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors relative
                ${isActive
                  ? 'text-cyber-green'
                  : 'text-muted-foreground hover:text-cyber-green/70'
                }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {isAlerts && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-cyber-green' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyber-green rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
