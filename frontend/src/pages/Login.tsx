import React from 'react';
import { Shield, Wifi, Lock, Eye } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background circuit-bg flex flex-col overflow-hidden">
      {/* Top decorative area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-cyber-green/20 blur-2xl scale-150" />
          <img
            src="/assets/generated/netguard-logo.dim_256x256.png"
            alt="NetGuard IDS"
            className="relative w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]"
          />
        </div>

        {/* App name */}
        <h1 className="font-heading text-4xl font-bold text-cyber-green tracking-widest uppercase mb-2">
          NetGuard
        </h1>
        <p className="font-heading text-sm text-cyber-green/60 tracking-[0.3em] uppercase mb-4">
          Intrusion Detection System
        </p>

        {/* Tagline */}
        <p className="text-center text-muted-foreground text-sm max-w-xs leading-relaxed mb-8">
          Real-time network traffic analysis and threat classification powered by ML-based detection.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: Wifi, label: 'Traffic Analysis' },
            { icon: Eye, label: 'Threat Detection' },
            { icon: Lock, label: 'Secure Access' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-xs font-medium"
            >
              <Icon size={12} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA area */}
      <div className="px-6 pb-12 flex flex-col items-center gap-4">
        <div className="w-full max-w-xs">
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-14 text-base font-heading font-semibold tracking-wider uppercase bg-cyber-green text-cyber-navy hover:bg-cyber-green/90 rounded-xl shadow-neon-green transition-all"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-cyber-navy/40 border-t-cyber-navy rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield size={18} />
                Sign In Securely
              </span>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Secured by Internet Identity — no passwords required
        </p>
        <p className="text-xs text-muted-foreground/50 text-center">
          Built with <span className="text-cyber-green">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'netguard-ids')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-green/70 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
