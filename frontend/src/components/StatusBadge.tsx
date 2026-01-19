import { Power, PowerOff, AlertTriangle, Wrench } from 'lucide-react';

type Status = 'active' | 'inactive' | 'BROKEN' | 'MAINTENANCE';

interface StatusBadgeProps {
  status: Status | string;
}

const statusConfig: Record<Status, { color: string; icon: typeof Power; label: string }> = {
  active: { color: 'bg-emerald-100 text-emerald-700', icon: Power, label: 'On' },
  inactive: { color: 'bg-slate-100 text-slate-600', icon: PowerOff, label: 'Off' },
  BROKEN: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, label: 'Broken' },
  MAINTENANCE: { color: 'bg-amber-100 text-amber-700', icon: Wrench, label: 'Maintenance' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status as Status] || statusConfig.inactive;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
