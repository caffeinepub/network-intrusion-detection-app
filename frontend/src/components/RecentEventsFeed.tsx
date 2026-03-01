import React from 'react';
import { DetectionEvent, AttackType } from '../backend';
import AttackTypeBadge from './AttackTypeBadge';
import RiskBadge from './RiskBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Radio } from 'lucide-react';

interface RecentEventsFeedProps {
  history: DetectionEvent[];
  isLoading?: boolean;
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export default function RecentEventsFeed({ history, isLoading }: RecentEventsFeedProps) {
  const recent = [...history].reverse().slice(0, 20);

  return (
    <div className="rounded-xl border border-cyber-green/20 bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-green/10">
        <Radio size={14} className="text-cyber-green animate-pulse" />
        <h3 className="font-heading text-sm font-semibold text-cyber-green uppercase tracking-wider">
          Live Feed
        </h3>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{recent.length} events</span>
      </div>

      {isLoading ? (
        <div className="p-3 space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No events yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Analyze traffic to see events here</p>
        </div>
      ) : (
        <div className="divide-y divide-cyber-green/10 max-h-72 overflow-y-auto">
          {recent.map((event, idx) => {
            const isThreat = event.classification.attackType !== AttackType.normal;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 min-h-[44px] ${isThreat ? 'bg-destructive/5' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <AttackTypeBadge attackType={event.classification.attackType} />
                    <RiskBadge riskLevel={event.classification.riskLevel} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {event.featureSummary.packets.toString()}p · {event.featureSummary.bytes.toString()}B · {event.featureSummary.duration.toString()}s
                  </p>
                </div>
                <span className="text-xs text-muted-foreground/60 font-mono shrink-0">
                  {timeAgo(event.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
