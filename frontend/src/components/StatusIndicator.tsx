import React from 'react';
import { Power } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface StatusIndicatorProps {
  active: boolean;
  onToggle: (active: boolean) => void;
}

export default function StatusIndicator({ active, onToggle }: StatusIndicatorProps) {
  return (
    <div className={`card-cyber p-4 border ${active ? 'border-cyber-green/30' : 'border-cyber-border'} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-cyber-green/10' : 'bg-cyber-navy-mid'}`}>
          <Power size={18} className={active ? 'text-cyber-green' : 'text-muted-foreground'} />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold tracking-wider text-foreground">
            DETECTION ENGINE
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {active ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyber-green pulse-neon" />
                <span className="text-xs font-mono status-active">ACTIVE — MONITORING</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-xs font-mono status-inactive">INACTIVE — STANDBY</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Switch
        checked={active}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-cyber-green"
      />
    </div>
  );
}
