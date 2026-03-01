import { useAlertContext } from '../contexts/AlertContext';
import { AttackType, RiskLevel } from '../backend';

export function useAlerts() {
  const { alerts, activeAlerts, addAlert, dismissAlert, dismissAll } = useAlertContext();

  const triggerAlert = (attackType: AttackType, riskLevel: RiskLevel) => {
    if (attackType !== AttackType.normal) {
      addAlert(attackType, riskLevel);
    }
  };

  return { alerts, activeAlerts, triggerAlert, dismissAlert, dismissAll };
}
