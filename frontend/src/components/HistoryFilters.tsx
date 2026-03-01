import React from 'react';
import { AttackType, RiskLevel } from '../backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface HistoryFiltersProps {
  attackFilter: AttackType | 'all';
  riskFilter: RiskLevel | 'all';
  onAttackFilterChange: (value: AttackType | 'all') => void;
  onRiskFilterChange: (value: RiskLevel | 'all') => void;
  totalCount: number;
}

export default function HistoryFilters({
  attackFilter,
  riskFilter,
  onAttackFilterChange,
  onRiskFilterChange,
  totalCount,
}: HistoryFiltersProps) {
  return (
    <div className="rounded-xl border border-cyber-green/20 bg-card p-3">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={14} className="text-cyber-green" />
        <span className="text-xs font-heading font-semibold text-cyber-green uppercase tracking-wider">Filters</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={attackFilter} onValueChange={(v) => onAttackFilterChange(v as AttackType | 'all')}>
          <SelectTrigger className="h-11 text-xs font-mono border-cyber-green/20 bg-background min-h-[44px]">
            <SelectValue placeholder="Attack Type" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-navy border-cyber-green/30">
            <SelectItem value="all" className="text-xs font-mono">All Types</SelectItem>
            <SelectItem value={AttackType.normal} className="text-xs font-mono">Normal</SelectItem>
            <SelectItem value={AttackType.dos} className="text-xs font-mono">DoS</SelectItem>
            <SelectItem value={AttackType.probe} className="text-xs font-mono">Probe</SelectItem>
            <SelectItem value={AttackType.r2l} className="text-xs font-mono">R2L</SelectItem>
            <SelectItem value={AttackType.u2r} className="text-xs font-mono">U2R</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={(v) => onRiskFilterChange(v as RiskLevel | 'all')}>
          <SelectTrigger className="h-11 text-xs font-mono border-cyber-green/20 bg-background min-h-[44px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-navy border-cyber-green/30">
            <SelectItem value="all" className="text-xs font-mono">All Risks</SelectItem>
            <SelectItem value={RiskLevel.low} className="text-xs font-mono">Low</SelectItem>
            <SelectItem value={RiskLevel.medium} className="text-xs font-mono">Medium</SelectItem>
            <SelectItem value={RiskLevel.high} className="text-xs font-mono">High</SelectItem>
            <SelectItem value={RiskLevel.critical} className="text-xs font-mono">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
