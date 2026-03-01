import React from 'react';
import { useAlertContext } from '../contexts/AlertContext';
import AttackTypeBadge from './AttackTypeBadge';
import RiskBadge from './RiskBadge';
import { Bell, X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlertsPanel() {
  const { activeAlerts, dismissAlert, dismissAll } = useAlertContext();

  if (activeAlerts.length === 0) return null;

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-destructive/20">
        <Bell size={14} className="text-destructive animate-pulse" />
        <h3 className="font-heading text-sm font-semibold text-destructive uppercase tracking-wider">
          Active Alerts
        </h3>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{activeAlerts.length}</span>
          {activeAlerts.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissAll}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <CheckCheck size={12} className="mr-1" />
              All
            </Button>
          )}
        </span>
      </div>
      <div className="divide-y divide-destructive/10 max-h-48 overflow-y-auto">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 px-4 py-3 min-h-[44px]">
            <div className="flex-1 flex flex-wrap items-center gap-1.5">
              <AttackTypeBadge attackType={alert.attackType} />
              <RiskBadge riskLevel={alert.riskLevel} />
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="flex items-center justify-center w-8 h-8 min-w-[44px] min-h-[44px] rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
