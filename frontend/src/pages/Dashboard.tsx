import React, { useState } from 'react';
import MobilePageHeader from '../components/MobilePageHeader';
import StatisticsCards from '../components/StatisticsCards';
import StatusIndicator from '../components/StatusIndicator';
import RecentEventsFeed from '../components/RecentEventsFeed';
import AlertsPanel from '../components/AlertsPanel';
import { useGetDetectionHistory } from '../hooks/useQueries';

export default function Dashboard() {
  const [engineActive, setEngineActive] = useState(true);
  const { data: history = [], isLoading } = useGetDetectionHistory();

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Dashboard" />
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        <StatusIndicator active={engineActive} onToggle={setEngineActive} />
        <StatisticsCards history={history} isLoading={isLoading} />
        <div className="grid grid-cols-1 gap-4">
          <AlertsPanel />
          <RecentEventsFeed history={history} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
