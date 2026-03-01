import React, { useState } from 'react';
import MobilePageHeader from '../components/MobilePageHeader';
import TrafficInputForm from '../components/TrafficInputForm';
import ClassificationResult from '../components/ClassificationResult';
import AlertBanner from '../components/AlertBanner';
import { TrafficClassification, FeatureSummary } from '../backend';
import { useAlerts } from '../hooks/useAlerts';
import { useAlertContext } from '../contexts/AlertContext';

export default function TrafficAnalysis() {
  const [result, setResult] = useState<TrafficClassification | null>(null);
  const [resultTime, setResultTime] = useState<Date | null>(null);
  const { triggerAlert } = useAlerts();
  const { activeAlerts, dismissAlert } = useAlertContext();

  const handleResult = (classification: TrafficClassification, _features: FeatureSummary) => {
    setResult(classification);
    setResultTime(new Date());
    triggerAlert(classification.attackType, classification.riskLevel);
  };

  const latestAlert = activeAlerts[0] ?? null;

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Traffic Analysis" />
      {latestAlert && (
        <AlertBanner alert={latestAlert} onDismiss={dismissAlert} />
      )}
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        <TrafficInputForm onResult={handleResult} />
        {result && <ClassificationResult result={result} timestamp={resultTime ?? undefined} />}

        {/* Attack Category Reference */}
        <div className="rounded-xl border border-cyber-green/20 bg-card p-4">
          <h3 className="font-heading text-sm font-semibold text-cyber-green uppercase tracking-wider mb-3">
            Attack Categories
          </h3>
          <div className="space-y-2">
            {[
              { type: 'Normal', desc: 'Legitimate network traffic', color: 'text-risk-low' },
              { type: 'DoS', desc: 'Denial of Service — floods network resources', color: 'text-risk-high' },
              { type: 'Probe', desc: 'Reconnaissance — scanning for vulnerabilities', color: 'text-risk-medium' },
              { type: 'R2L', desc: 'Remote to Local — unauthorized remote access', color: 'text-risk-high' },
              { type: 'U2R', desc: 'User to Root — privilege escalation attempts', color: 'text-risk-critical' },
            ].map(({ type, desc, color }) => (
              <div key={type} className="flex items-start gap-3">
                <span className={`font-mono text-xs font-bold w-14 shrink-0 mt-0.5 ${color}`}>{type}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
