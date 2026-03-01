import React from 'react';
import { DetectionEvent } from '../backend';
import AttackTypeBadge from './AttackTypeBadge';
import RiskBadge from './RiskBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Package, HardDrive } from 'lucide-react';

interface DetectionHistoryTableProps {
  events: DetectionEvent[];
  isLoading?: boolean;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetectionHistoryTable({ events, isLoading }: DetectionHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-cyber-green/20 bg-card p-8 text-center">
        <Clock size={32} className="text-cyber-green/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No detection records found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Run a traffic analysis to see results here</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card layout */}
      <div className="space-y-2 sm:hidden">
        {[...events].reverse().map((event, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-cyber-green/10 bg-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                <AttackTypeBadge attackType={event.classification.attackType} />
                <RiskBadge riskLevel={event.classification.riskLevel} />
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package size={11} className="text-cyber-green/60" />
                <span className="font-mono">{event.featureSummary.packets.toString()}p</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <HardDrive size={11} className="text-cyber-green/60" />
                <span className="font-mono">{event.featureSummary.bytes.toString()}B</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={11} className="text-cyber-green/60" />
                <span className="font-mono">{event.featureSummary.duration.toString()}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden sm:block rounded-xl border border-cyber-green/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyber-green/20 bg-cyber-green/5">
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Packets</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Bytes</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Attack Type</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-cyber-green/70 uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody>
              {[...events].reverse().map((event, idx) => (
                <tr key={idx} className="border-b border-cyber-green/10 hover:bg-cyber-green/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.featureSummary.packets.toString()}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.featureSummary.bytes.toString()}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.featureSummary.duration.toString()}s</td>
                  <td className="px-4 py-3"><AttackTypeBadge attackType={event.classification.attackType} /></td>
                  <td className="px-4 py-3"><RiskBadge riskLevel={event.classification.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
