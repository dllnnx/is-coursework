import { useEffect, useState } from 'react';
import { Layers, Plus, Pencil, Trash2, Power, PowerOff, AirVent } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { AcGroupsService, AirConditionersService } from '../api';
import type { AcGroupDto, AirConditionerDto } from '../api';

const MODES = ['COOLING', 'HEATING', 'DEHUMIDIFICATION', 'VENTILATION', 'AUTO'];

export function Groups() {
  const [groups, setGroups] = useState<AcGroupDto[]>([]);
  const [allAcs, setAllAcs] = useState<AirConditionerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AcGroupDto | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<AcGroupDto | null>(null);
  const [formData, setFormData] = useState({ name: '', airConditionerIds: [] as number[] });
  const [modeData, setModeData] = useState({ mode: 'AUTO', targetTemperature: 22 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [groupsData, acsData] = await Promise.all([
        AcGroupsService.getAll(),
        AirConditionersService.getAll6(),
      ]);
      setGroups(groupsData);
      setAllAcs(acsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingGroup(null);
    setFormData({ name: '', airConditionerIds: [] });
    setIsModalOpen(true);
  }

  function openEditModal(group: AcGroupDto) {
    setEditingGroup(group);
    setFormData({ name: group.name || '', airConditionerIds: group.airConditionerIds || [] });
    setIsModalOpen(true);
  }

  function openModeModal(group: AcGroupDto) {
    setSelectedGroup(group);
    setModeData({ mode: 'AUTO', targetTemperature: 22 });
    setIsModeModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingGroup?.id) {
        await AcGroupsService.update3(editingGroup.id, formData);
      } else {
        await AcGroupsService.create3(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  }

  async function handleModeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGroup?.id) return;
    try {
      await AcGroupsService.setGroupMode(selectedGroup.id, modeData);
      setIsModeModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to set group mode:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      await AcGroupsService.delete3(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  }

  async function handleTurnOnGroup(id: number) {
    try {
      await AcGroupsService.turnOnGroup(id);
      fetchData();
    } catch (error) {
      console.error('Failed to turn on group:', error);
    }
  }

  async function handleTurnOffGroup(id: number) {
    try {
      await AcGroupsService.turnOffGroup(id);
      fetchData();
    } catch (error) {
      console.error('Failed to turn off group:', error);
    }
  }

  function toggleAcSelection(acId: number) {
    setFormData((prev) => ({
      ...prev,
      airConditionerIds: prev.airConditionerIds.includes(acId)
        ? prev.airConditionerIds.filter((id) => id !== acId)
        : [...prev.airConditionerIds, acId],
    }));
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
        <h1 className="text-2xl font-bold text-slate-900">AC Groups</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Layers className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{group.name}</h3>
                  <p className="text-sm text-slate-500">
                    {group.airConditionerIds?.length || 0} AC(s)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {allAcs
                .filter((ac) => group.airConditionerIds?.includes(ac.id || 0))
                .slice(0, 3)
                .map((ac) => (
                  <span
                    key={ac.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600"
                  >
                    <AirVent className="w-3 h-3" />
                    {ac.name}
                  </span>
                ))}
              {(group.airConditionerIds?.length || 0) > 3 && (
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  +{(group.airConditionerIds?.length || 0) - 3} more
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => group.id && handleTurnOnGroup(group.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <Power className="w-4 h-4" />
                All On
              </button>
              <button
                onClick={() => group.id && handleTurnOffGroup(group.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <PowerOff className="w-4 h-4" />
                All Off
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openModeModal(group)}
                className="flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm"
              >
                Set Mode
              </button>
              <button
                onClick={() => openEditModal(group)}
                className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => group.id && handleDelete(group.id)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="text-center py-12">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No groups found. Create your first group!</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? 'Edit Group' : 'Add Group'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Air Conditioners
              </label>
              <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-2 space-y-1">
                {allAcs.map((ac) => (
                  <label
                    key={ac.id}
                    className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.airConditionerIds.includes(ac.id || 0)}
                      onChange={() => ac.id && toggleAcSelection(ac.id)}
                      className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm">{ac.name}</span>
                    <span className="text-xs text-slate-400">({ac.roomName})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingGroup ? 'Save Changes' : 'Add Group'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        title="Set Group Mode"
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
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Temperature (°C)
              </label>
              <input
                type="number"
                value={modeData.targetTemperature}
                onChange={(e) =>
                  setModeData({ ...modeData, targetTemperature: Number(e.target.value) })
                }
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
