import React from 'react';
import { AttackType } from '../backend';

interface AttackTypeBadgeProps {
  attackType: AttackType;
  size?: 'sm' | 'md';
}

const attackConfig: Record<AttackType, { label: string; className: string }> = {
  [AttackType.normal]: {
    label: 'NORMAL',
    className: 'text-cyber-green bg-cyber-green/10 border border-cyber-green/30',
  },
  [AttackType.dos]: {
    label: 'DoS',
    className: 'text-risk-critical bg-risk-critical/10 border border-risk-critical/30',
  },
  [AttackType.probe]: {
    label: 'PROBE',
    className: 'text-risk-high bg-risk-high/10 border border-risk-high/30',
  },
  [AttackType.r2l]: {
    label: 'R2L',
    className: 'text-risk-medium bg-risk-medium/10 border border-risk-medium/30',
  },
  [AttackType.u2r]: {
    label: 'U2R',
    className: 'text-risk-high bg-risk-high/10 border border-risk-high/30',
  },
};

export default function AttackTypeBadge({ attackType, size = 'md' }: AttackTypeBadgeProps) {
  const config = attackConfig[attackType] ?? attackConfig[AttackType.normal];
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center font-mono font-bold rounded-sm ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}
