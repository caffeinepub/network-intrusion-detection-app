import React from 'react';
import { Shield, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface MobilePageHeaderProps {
  title: string;
}

export default function MobilePageHeader({ title }: MobilePageHeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="sticky top-0 z-40 bg-cyber-navy/95 backdrop-blur-sm border-b border-cyber-green/20 px-4 safe-area-top">
      <div className="flex items-center justify-between h-14 min-h-[44px]">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-cyber-green" />
          <h1 className="font-heading text-base font-semibold text-cyber-green tracking-wider uppercase">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {userProfile && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User size={14} className="text-cyber-green/70" />
              <span className="font-mono max-w-[100px] truncate">{userProfile.name}</span>
            </div>
          )}
          {identity && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 min-h-[44px] min-w-[44px] rounded-lg text-muted-foreground hover:text-cyber-green hover:bg-cyber-green/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
