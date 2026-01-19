import { useEffect, useState } from 'react';
import { Building2, DoorOpen, AirVent, Thermometer, Power, PowerOff, AlertTriangle, Wrench } from 'lucide-react';
import { Card } from '../components/Card';
import { BuildingsService, RoomsService, AirConditionersService, TemperatureSensorsService } from '../api';
import type { AirConditionerDto } from '../api';

interface Stats {
  buildings: number;
  rooms: number;
  airConditioners: number;
  sensors: number;
  acOn: number;
  acOff: number;
  acBroken: number;
  acMaintenance: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    buildings: 0,
    rooms: 0,
    airConditioners: 0,
    sensors: 0,
    acOn: 0,
    acOff: 0,
    acBroken: 0,
    acMaintenance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [buildings, rooms, acs, sensors] = await Promise.all([
          BuildingsService.getAll1(),
          RoomsService.getAll5(),
          AirConditionersService.getAll6(),
          TemperatureSensorsService.getAll3(),
        ]);

        const acStats = (acs as AirConditionerDto[]).reduce(
          (acc, ac) => {
            if (ac.status === 'active') acc.on++;
            else if (ac.status === 'inactive') acc.off++;
            else if (ac.status === 'BROKEN') acc.broken++;
            else if (ac.status === 'MAINTENANCE') acc.maintenance++;
            return acc;
          },
          { on: 0, off: 0, broken: 0, maintenance: 0 }
        );

        setStats({
          buildings: buildings.length,
          rooms: rooms.length,
          airConditioners: acs.length,
          sensors: sensors.length,
          acOn: acStats.on,
          acOff: acStats.off,
          acBroken: acStats.broken,
          acMaintenance: acStats.maintenance,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <Building2 className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Buildings</p>
              <p className="text-2xl font-bold text-slate-900">{stats.buildings}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <DoorOpen className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Rooms</p>
              <p className="text-2xl font-bold text-slate-900">{stats.rooms}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <AirVent className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Air Conditioners</p>
              <p className="text-2xl font-bold text-slate-900">{stats.airConditioners}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sensors</p>
              <p className="text-2xl font-bold text-slate-900">{stats.sensors}</p>
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-4">AC Status Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Power className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Running</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.acOn}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <PowerOff className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Off</p>
              <p className="text-2xl font-bold text-slate-600">{stats.acOff}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Broken</p>
              <p className="text-2xl font-bold text-red-600">{stats.acBroken}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Wrench className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Maintenance</p>
              <p className="text-2xl font-bold text-amber-600">{stats.acMaintenance}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
