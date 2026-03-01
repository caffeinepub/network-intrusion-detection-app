import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert } from '../contexts/AlertContext';
import RiskBadge from './RiskBadge';
import AttackTypeBadge from './AttackTypeBadge';
import { formatDistanceToNow } from 'date-fns';

interface AlertBannerProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

export default function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(alert.id), 300);
    }, 8000);
    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  if (!visible) return null;

  return (
    <div className="animate-fade-in flex items-center gap-3 px-4 py-3 bg-risk-critical/10 border border-risk-critical/40 rounded shadow-neon-red">
      <AlertTriangle size={18} className="text-risk-critical flex-shrink-0 pulse-neon" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-risk-critical tracking-wider">THREAT DETECTED</span>
          <AttackTypeBadge attackType={alert.attackType} size="sm" />
          <RiskBadge riskLevel={alert.riskLevel} size="sm" />
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
        </p>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
