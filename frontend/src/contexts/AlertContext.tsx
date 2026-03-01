import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AttackType, RiskLevel } from '../backend';

export interface Alert {
  id: string;
  attackType: AttackType;
  riskLevel: RiskLevel;
  timestamp: number;
  dismissed: boolean;
}

interface AlertContextValue {
  alerts: Alert[];
  activeAlerts: Alert[];
  addAlert: (attackType: AttackType, riskLevel: RiskLevel) => void;
  dismissAlert: (id: string) => void;
  dismissAll: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((attackType: AttackType, riskLevel: RiskLevel) => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      attackType,
      riskLevel,
      timestamp: Date.now(),
      dismissed: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  }, []);

  const dismissAll = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
  }, []);

  const activeAlerts = alerts.filter(a => !a.dismissed);

  return (
    <AlertContext.Provider value={{ alerts, activeAlerts, addAlert, dismissAlert, dismissAll }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlertContext must be used within AlertProvider');
  return ctx;
}
