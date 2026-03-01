import React from 'react';
import { TrafficClassification, AttackType } from '../backend';
import RiskBadge from './RiskBadge';
import AttackTypeBadge from './AttackTypeBadge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface ClassificationResultProps {
  result: TrafficClassification;
  timestamp?: Date;
}

export default function ClassificationResult({ result, timestamp }: ClassificationResultProps) {
  const isNormal = result.attackType === AttackType.normal;

  return (
    <div className={`card-cyber border p-5 animate-fade-in ${
      isNormal ? 'border-cyber-green/30' : 'border-risk-critical/40'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isNormal ? 'bg-cyber-green/10' : 'bg-risk-critical/10'
        }`}>
          {isNormal ? (
            <CheckCircle size={24} className="text-cyber-green" />
          ) : (
            <AlertTriangle size={24} className="text-risk-critical pulse-neon" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <h3 className="font-heading text-lg font-bold tracking-wider text-foreground">
              {isNormal ? 'TRAFFIC NORMAL' : 'THREAT DETECTED'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyber-navy-mid rounded p-3">
              <p className="text-xs font-mono text-muted-foreground tracking-wider mb-1.5">CLASSIFICATION</p>
              <AttackTypeBadge attackType={result.attackType} />
            </div>
            <div className="bg-cyber-navy-mid rounded p-3">
              <p className="text-xs font-mono text-muted-foreground tracking-wider mb-1.5">RISK LEVEL</p>
              <RiskBadge riskLevel={result.riskLevel} />
            </div>
          </div>

          {timestamp && (
            <p className="text-xs font-mono text-muted-foreground mt-3">
              ANALYZED: {timestamp.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
