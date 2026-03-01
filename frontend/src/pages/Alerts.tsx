import React from 'react';
import MobilePageHeader from '../components/MobilePageHeader';
import { useAlertContext } from '../contexts/AlertContext';
import AttackTypeBadge from '../components/AttackTypeBadge';
import RiskBadge from '../components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, CheckCheck, X } from 'lucide-react';

export default function Alerts() {
  const { alerts, activeAlerts, dismissAlert, dismissAll } = useAlertContext();

  const dismissedAlerts = alerts.filter((a) => a.dismissed);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Alerts" />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Active Alerts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-cyber-green" />
              <h2 className="font-heading text-sm font-semibold text-cyber-green uppercase tracking-wider">
                Active Alerts
              </h2>
              {activeAlerts.length > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {activeAlerts.length}
                </span>
              )}
            </div>
            {activeAlerts.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissAll}
                className="h-8 text-xs text-muted-foreground hover:text-cyber-green"
              >
                <CheckCheck size={14} className="mr-1" />
                Dismiss All
              </Button>
            )}
          </div>

          {activeAlerts.length === 0 ? (
            <div className="rounded-xl border border-cyber-green/20 bg-card p-8 text-center">
              <Bell size={32} className="text-cyber-green/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
              <p className="text-xs text-muted-foreground/60 mt-1">System is monitoring for threats</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <AttackTypeBadge attackType={alert.attackType} />
                      <RiskBadge riskLevel={alert.riskLevel} />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{formatTime(alert.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex items-center justify-center w-8 h-8 min-w-[44px] min-h-[44px] rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    aria-label="Dismiss alert"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dismissed Alerts */}
        {dismissedAlerts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BellOff size={16} className="text-muted-foreground" />
              <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dismissed
              </h2>
              <span className="text-xs text-muted-foreground/60">({dismissedAlerts.length})</span>
            </div>
            <div className="space-y-2">
              {dismissedAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-border/30 bg-card/50 p-4 opacity-60"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <AttackTypeBadge attackType={alert.attackType} />
                    <RiskBadge riskLevel={alert.riskLevel} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{formatTime(alert.timestamp)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
