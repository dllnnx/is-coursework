import { AirVent, Thermometer, Power, PowerOff } from 'lucide-react';
import type { AirConditionerDto } from '../api';
import { StatusBadge } from './StatusBadge';
import { ModeBadge } from './ModeBadge';
import { Card } from './Card';

interface AcCardProps {
  ac: AirConditionerDto;
  onTurnOn?: (id: number) => void;
  onTurnOff?: (id: number) => void;
  onEdit?: (ac: AirConditionerDto) => void;
}

export function AcCard({ ac, onTurnOn, onTurnOff, onEdit }: AcCardProps) {
  const isOn = ac.status === 'active';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <AirVent className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{ac.name}</h3>
            <p className="text-sm text-slate-500">{ac.model}</p>
          </div>
        </div>
        <StatusBadge status={ac.status || 'OFF'} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Room:</span>
          <span className="font-medium text-slate-700">{ac.roomName}</span>
        </div>
        {ac.mode && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Mode:</span>
            <ModeBadge mode={ac.mode} />
          </div>
        )}
        {ac.targetTemperature && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Target:</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Thermometer className="w-4 h-4 text-sky-500" />
              {ac.targetTemperature}°C
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {isOn ? (
          <button
            onClick={() => ac.id && onTurnOff?.(ac.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <PowerOff className="w-4 h-4" />
            Turn Off
          </button>
        ) : (
          <button
            onClick={() => ac.id && onTurnOn?.(ac.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            disabled={ac.status === 'BROKEN' || ac.status === 'MAINTENANCE'}
          >
            <Power className="w-4 h-4" />
            Turn On
          </button>
        )}
        <button
          onClick={() => onEdit?.(ac)}
          className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>
    </Card>
  );
}
