import React, { useState } from 'react';
import MobilePageHeader from '../components/MobilePageHeader';
import DetectionHistoryTable from '../components/DetectionHistoryTable';
import HistoryFilters from '../components/HistoryFilters';
import { useGetDetectionHistory, useClearDetectionHistory } from '../hooks/useQueries';
import { AttackType, RiskLevel } from '../backend';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RefreshCw, Trash2 } from 'lucide-react';

export default function DetectionHistory() {
  const [attackFilter, setAttackFilter] = useState<AttackType | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');

  const { data: history = [], isLoading, refetch, isFetching } = useGetDetectionHistory();
  const clearMutation = useClearDetectionHistory();

  const filtered = history.filter((event) => {
    const matchAttack = attackFilter === 'all' || event.classification.attackType === attackFilter;
    const matchRisk = riskFilter === 'all' || event.classification.riskLevel === riskFilter;
    return matchAttack && matchRisk;
  });

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="History" />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Action bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 min-h-[44px] border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              <span className="ml-1.5 text-xs">Refresh</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 min-h-[44px] border-destructive/40 text-destructive hover:bg-destructive/10"
                  disabled={history.length === 0}
                >
                  <Trash2 size={14} />
                  <span className="ml-1.5 text-xs">Clear</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-cyber-navy border-cyber-green/30 mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-cyber-green font-heading">Clear History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {history.length} detection records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-cyber-green/30">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearMutation.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={clearMutation.isPending}
                  >
                    {clearMutation.isPending ? 'Clearing...' : 'Clear All'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <HistoryFilters
          attackFilter={attackFilter}
          riskFilter={riskFilter}
          onAttackFilterChange={setAttackFilter}
          onRiskFilterChange={setRiskFilter}
          totalCount={filtered.length}
        />

        <DetectionHistoryTable events={filtered} isLoading={isLoading} />
      </div>
    </div>
  );
}
