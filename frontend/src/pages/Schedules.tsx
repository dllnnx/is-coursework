import { useEffect, useState } from 'react';
import { Calendar, Plus, Pencil, Trash2, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ModeBadge } from '../components/ModeBadge';
import { SchedulesService, AirConditionersService } from '../api';
import type { ScheduleDto, AirConditionerDto } from '../api';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MODES = ['COOLING', 'HEATING', 'DEHUMIDIFICATION', 'VENTILATION', 'AUTO'];
const PERIODICITIES = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'];

export function Schedules() {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [acs, setAcs] = useState<AirConditionerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleDto | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    airConditionerId: 0,
    dayOfWeek: 'MONDAY',
    startTime: "12:00",
    endTime: "18:00",
    mode: 'AUTO',
    targetTemperature: 22,
    periodicity: 'DAILY',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [schedulesData, acsData] = await Promise.all([
        SchedulesService.getAll4(),
        AirConditionersService.getAll6(),
      ]);
      setSchedules(schedulesData);
      setAcs(acsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingSchedule(null);
    setFormData({
      name: '',
      airConditionerId: acs[0]?.id || 0,
      dayOfWeek: 'MONDAY',
      startTime: "12:00",
      endTime: "18:00",
      mode: 'AUTO',
      targetTemperature: 22,
      periodicity: 'DAILY',
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(schedule: ScheduleDto) {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name || '',
      airConditionerId: schedule.airConditionerId || 0,
      dayOfWeek: schedule.dayOfWeek || 'MONDAY',
      startTime: schedule.startTime || "12:00:00",
      endTime: schedule.endTime || "18:00:00",
      mode: schedule.mode || 'AUTO',
      targetTemperature: schedule.targetTemperature || 22,
      periodicity: schedule.periodicity || 'DAILY',
      isActive: schedule.isActive ?? true,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const scheduleData = {
        ...formData,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      if (editingSchedule?.id) {
        await SchedulesService.update1(editingSchedule.id, { ...scheduleData, id: editingSchedule.id });
      } else {
        await SchedulesService.create1(formData.airConditionerId, scheduleData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await SchedulesService.delete1(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  }

  async function handleToggle(id: number) {
    try {
      await SchedulesService.toggleActive(id);
      fetchData();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  }

  function formatTime(time: string | undefined) {
    if (!time) return '--:--';
    const [hour, minute] = time.split(":").map(Number);
    return `${hour}:${minute.toString().padStart(2, '0')}`;
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
        <h1 className="text-2xl font-bold text-slate-900">Schedules</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{schedule.name}</h3>
                  <p className="text-sm text-slate-500">{schedule.airConditionerName}</p>
                </div>
              </div>
              <button
                onClick={() => schedule.id && handleToggle(schedule.id)}
                className={`p-1 rounded ${schedule.isActive ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {schedule.isActive ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{schedule.dayOfWeek}</span>
                <span className="text-slate-500">{schedule.periodicity}</span>
              </div>
              <div className="flex items-center justify-between">
                <ModeBadge mode={schedule.mode || 'AUTO'} />
                <span className="text-sm font-medium">{schedule.targetTemperature}°C</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(schedule)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => schedule.id && handleDelete(schedule.id)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {schedules.length === 0 && (
        <Card className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No schedules found. Create your first schedule!</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-96 overflow-y-auto">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Air Conditioner</label>
              <select
                value={formData.airConditionerId}
                onChange={(e) => setFormData({ ...formData, airConditionerId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              >
                {acs.map((ac) => (
                  <option key={ac.id} value={ac.id}>
                    {ac.name} ({ac.roomName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Day of Week</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime.substring(0, 5)}
                  onChange={(e) => {
                    setFormData({ ...formData, startTime: `${e.target.value}:00` });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.endTime.substring(0, 5)}
                  onChange={(e) => {
                    setFormData({ ...formData, endTime: `${e.target.value}:00` });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
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
                value={formData.targetTemperature}
                onChange={(e) => setFormData({ ...formData, targetTemperature: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                min={16}
                max={30}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Periodicity</label>
              <select
                value={formData.periodicity}
                onChange={(e) => setFormData({ ...formData, periodicity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {PERIODICITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingSchedule ? 'Save Changes' : 'Add Schedule'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
