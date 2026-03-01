import React from 'react';
import { DetectionEvent, AttackType } from '../backend';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface StatisticsCardsProps {
  history: DetectionEvent[];
  isLoading?: boolean;
}

export default function StatisticsCards({ history, isLoading }: StatisticsCardsProps) {
  const totalScans = history.length;
  const threats = history.filter((e) => e.classification.attackType !== AttackType.normal);
  const threatsDetected = threats.length;
  const normalCount = totalScans - threatsDetected;
  const threatRate = totalScans > 0 ? ((threatsDetected / totalScans) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      label: 'Total Scans',
      value: isLoading ? '—' : totalScans.toString(),
      icon: Activity,
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/20',
    },
    {
      label: 'Threats Detected',
      value: isLoading ? '—' : threatsDetected.toString(),
      icon: AlertTriangle,
      color: 'text-risk-high',
      bg: 'bg-risk-high/10',
      border: 'border-risk-high/20',
    },
    {
      label: 'Normal Traffic',
      value: isLoading ? '—' : normalCount.toString(),
      icon: CheckCircle,
      color: 'text-risk-low',
      bg: 'bg-risk-low/10',
      border: 'border-risk-low/20',
    },
    {
      label: 'Threat Rate',
      value: isLoading ? '—' : `${threatRate}%`,
      icon: TrendingUp,
      color: 'text-cyber-amber',
      bg: 'bg-cyber-amber/10',
      border: 'border-cyber-amber/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className={`rounded-xl border ${border} ${bg} p-4 flex flex-col gap-2`}
        >
          <div className={`flex items-center justify-between`}>
            <span className="text-xs text-muted-foreground font-medium">{label}</span>
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={16} className={color} />
            </div>
          </div>
          <span className={`font-heading text-2xl font-bold ${color}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}
