import { useEffect, useState } from 'react';
import { AirVent, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { AcCard } from '../components/AcCard';
import { AirConditionersService, RoomsService } from '../api';
import type { AirConditionerDto, RoomDto } from '../api';

const STATUSES = ['active', 'inactive', 'BROKEN', 'MAINTENANCE'];
const MODES = ['COOLING', 'HEATING', 'DEHUMIDIFICATION', 'VENTILATION', 'AUTO'];

export function AirConditioners() {
  const [acs, setAcs] = useState<AirConditionerDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [editingAc, setEditingAc] = useState<AirConditionerDto | null>(null);
  const [formData, setFormData] = useState({ name: '', model: '', roomId: 0 });
  const [modeData, setModeData] = useState({ mode: 'AUTO', targetTemperature: 22 });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterMode, setFilterMode] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAcs();
  }, [filterStatus, filterMode]);

  async function fetchData() {
    try {
      const roomsData = await RoomsService.getAll5();
      setRooms(roomsData);
      await fetchAcs();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAcs() {
    try {
      let data: AirConditionerDto[];
      if (filterStatus || filterMode) {
        data = await AirConditionersService.filter(filterStatus || undefined, filterMode || undefined);
      } else {
        data = await AirConditionersService.getAll6();
      }
      setAcs(data);
    } catch (error) {
      console.error('Failed to fetch ACs:', error);
    }
  }

  function openCreateModal() {
    setEditingAc(null);
    setFormData({ name: '', model: '', roomId: rooms[0]?.id || 0 });
    setIsModalOpen(true);
  }

  function openEditModal(ac: AirConditionerDto) {
    setEditingAc(ac);
    setModeData({ mode: ac.mode || 'AUTO', targetTemperature: ac.targetTemperature || 22 });
    setIsModeModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingAc?.id) {
        await AirConditionersService.update5(editingAc.id, { ...formData, id: editingAc.id });
      } else {
        await AirConditionersService.create5(formData.roomId, { name: formData.name, model: formData.model });
      }
      setIsModalOpen(false);
      fetchAcs();
    } catch (error) {
      console.error('Failed to save AC:', error);
    }
  }

  async function handleModeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingAc?.id) return;
    try {
      await AirConditionersService.setMode(editingAc.id, modeData);
      setIsModeModalOpen(false);
      fetchAcs();
    } catch (error) {
      console.error('Failed to set mode:', error);
    }
  }

  async function handleTurnOn(id: number) {
    try {
      await AirConditionersService.turnOn(id);
      fetchAcs();
    } catch (error) {
      console.error('Failed to turn on AC:', error);
    }
  }

  async function handleTurnOff(id: number) {
    try {
      await AirConditionersService.turnOff(id);
      fetchAcs();
    } catch (error) {
      console.error('Failed to turn off AC:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Air Conditioners</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add AC
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Mode</label>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">All Modes</option>
            {MODES.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {acs
            .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            .map((ac) => (
          <AcCard
            key={ac.id}
            ac={ac}
            onTurnOn={handleTurnOn}
            onTurnOff={handleTurnOff}
            onEdit={openEditModal}
          />
        ))}
      </div>

      {acs.length === 0 && (
        <Card className="text-center py-12">
          <AirVent className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No air conditioners found. Add your first AC!</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Air Conditioner"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.buildingName})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add AC</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        title="Set Mode"
      >
        <form onSubmit={handleModeSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
              <select
                value={modeData.mode}
                onChange={(e) => setModeData({ ...modeData, mode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {MODES.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Temperature (°C)</label>
              <input
                type="number"
                value={modeData.targetTemperature}
                onChange={(e) => setModeData({ ...modeData, targetTemperature: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                min={16}
                max={30}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Set Mode</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
