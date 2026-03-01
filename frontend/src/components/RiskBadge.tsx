import React from 'react';
import { RiskLevel } from '../backend';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  size?: 'sm' | 'md';
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  [RiskLevel.low]: { label: 'LOW', className: 'risk-low' },
  [RiskLevel.medium]: { label: 'MEDIUM', className: 'risk-medium' },
  [RiskLevel.high]: { label: 'HIGH', className: 'risk-high' },
  [RiskLevel.critical]: { label: 'CRITICAL', className: 'risk-critical' },
};

export default function RiskBadge({ riskLevel, size = 'md' }: RiskBadgeProps) {
  const config = riskConfig[riskLevel] ?? riskConfig[RiskLevel.low];
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center font-mono font-bold rounded-sm ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}
