import { Snowflake, Sun, Droplets, Wind, Zap } from 'lucide-react';

type Mode = 'COOLING' | 'HEATING' | 'DEHUMIDIFICATION' | 'VENTILATION' | 'AUTO';

interface ModeBadgeProps {
  mode: Mode | string;
}

const modeConfig: Record<Mode, { color: string; icon: typeof Snowflake; label: string }> = {
  COOLING: { color: 'bg-blue-100 text-blue-700', icon: Snowflake, label: 'Cooling' },
  HEATING: { color: 'bg-orange-100 text-orange-700', icon: Sun, label: 'Heating' },
  DEHUMIDIFICATION: { color: 'bg-cyan-100 text-cyan-700', icon: Droplets, label: 'Dehumidification' },
  VENTILATION: { color: 'bg-teal-100 text-teal-700', icon: Wind, label: 'Ventilation' },
  AUTO: { color: 'bg-purple-100 text-purple-700', icon: Zap, label: 'Auto' },
};

export function ModeBadge({ mode }: ModeBadgeProps) {
  const config = modeConfig[mode as Mode] || modeConfig.AUTO;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
