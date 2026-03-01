import React, { useState } from 'react';
import { useDetectTraffic } from '../hooks/useQueries';
import { FeatureSummary, TrafficClassification } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, AlertCircle } from 'lucide-react';

interface TrafficInputFormProps {
  onResult: (result: TrafficClassification, features: FeatureSummary) => void;
}

const defaultFeatures = {
  packets: '100',
  bytes: '5000',
  duration: '30',
  sourcePortRange: '5',
  destinationPortRange: '3',
  protocolTcpRatio: '0.6',
  protocolUdpRatio: '0.3',
  protocolIcmpRatio: '0.1',
};

const presets = {
  normal: {
    label: 'Normal',
    values: {
      packets: '200',
      bytes: '8000',
      duration: '60',
      sourcePortRange: '4',
      destinationPortRange: '2',
      protocolTcpRatio: '0.6',
      protocolUdpRatio: '0.3',
      protocolIcmpRatio: '0.1',
    },
  },
  dos: {
    label: 'DoS',
    values: {
      packets: '15000',
      bytes: '500000',
      duration: '5',
      sourcePortRange: '2',
      destinationPortRange: '1',
      protocolTcpRatio: '0.1',
      protocolUdpRatio: '0.8',
      protocolIcmpRatio: '0.1',
    },
  },
  probe: {
    label: 'Port Scan',
    values: {
      packets: '300',
      bytes: '12000',
      duration: '45',
      sourcePortRange: '30',
      destinationPortRange: '60',
      protocolTcpRatio: '0.5',
      protocolUdpRatio: '0.3',
      protocolIcmpRatio: '0.2',
    },
  },
};

export default function TrafficInputForm({ onResult }: TrafficInputFormProps) {
  const [fields, setFields] = useState(defaultFeatures);
  const [error, setError] = useState<string | null>(null);
  const detectMutation = useDetectTraffic();

  const handleChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const applyPreset = (preset: keyof typeof presets) => {
    setFields(presets[preset].values);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tcp = parseFloat(fields.protocolTcpRatio);
    const udp = parseFloat(fields.protocolUdpRatio);
    const icmp = parseFloat(fields.protocolIcmpRatio);
    const sum = tcp + udp + icmp;
    if (Math.abs(sum - 1.0) > 0.01) {
      setError(`Protocol ratios must sum to 1.0 (current: ${sum.toFixed(2)})`);
      return;
    }

    const features: FeatureSummary = {
      packets: BigInt(Math.round(parseFloat(fields.packets))),
      bytes: BigInt(Math.round(parseFloat(fields.bytes))),
      duration: BigInt(Math.round(parseFloat(fields.duration))),
      sourcePortRange: BigInt(Math.round(parseFloat(fields.sourcePortRange))),
      destinationPortRange: BigInt(Math.round(parseFloat(fields.destinationPortRange))),
      protocolTcpRatio: tcp,
      protocolUdpRatio: udp,
      protocolIcmpRatio: icmp,
    };

    try {
      const result = await detectMutation.mutateAsync(features);
      onResult(result, features);
    } catch {
      setError('Detection failed. Please try again.');
    }
  };

  const inputFields = [
    { key: 'packets', label: 'Packets', placeholder: '100' },
    { key: 'bytes', label: 'Bytes', placeholder: '5000' },
    { key: 'duration', label: 'Duration (s)', placeholder: '30' },
    { key: 'sourcePortRange', label: 'Src Port Range', placeholder: '5' },
    { key: 'destinationPortRange', label: 'Dst Port Range', placeholder: '3' },
    { key: 'protocolTcpRatio', label: 'TCP Ratio', placeholder: '0.6' },
    { key: 'protocolUdpRatio', label: 'UDP Ratio', placeholder: '0.3' },
    { key: 'protocolIcmpRatio', label: 'ICMP Ratio', placeholder: '0.1' },
  ];

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-cyber-green/20 bg-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={16} className="text-cyber-green" />
        <h2 className="font-heading text-sm font-semibold text-cyber-green uppercase tracking-wider">
          Traffic Features
        </h2>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyPreset(key as keyof typeof presets)}
            className="flex-1 py-2 px-2 text-xs font-mono rounded-lg border border-cyber-green/20 text-cyber-green/70 hover:text-cyber-green hover:bg-cyber-green/10 hover:border-cyber-green/40 transition-colors min-h-[44px]"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input grid */}
      <div className="grid grid-cols-2 gap-3">
        {inputFields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs text-muted-foreground font-mono">{label}</Label>
            <Input
              type="number"
              step="any"
              value={fields[key as keyof typeof fields]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="h-11 font-mono text-sm bg-background border-cyber-green/20 focus:border-cyber-green text-foreground"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={detectMutation.isPending}
        className="w-full h-12 font-heading font-semibold tracking-wider uppercase bg-cyber-green text-cyber-navy hover:bg-cyber-green/90 rounded-xl"
      >
        {detectMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-cyber-navy/40 border-t-cyber-navy rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          'Analyze Traffic'
        )}
      </Button>
    </form>
  );
}
