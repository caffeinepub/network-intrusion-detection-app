import React from 'react';
import { Outlet } from '@tanstack/react-router';
import BottomTabBar from './BottomTabBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden circuit-bg">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomTabBar />
      <footer className="hidden sm:block text-center text-xs text-muted-foreground py-3 pb-20 border-t border-cyber-green/10">
        <span>
          Built with{' '}
          <span className="text-cyber-green">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'netguard-ids')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-green hover:underline"
          >
            caffeine.ai
          </a>
          {' '}· © {new Date().getFullYear()} NetGuard IDS
        </span>
      </footer>
    </div>
  );
}
