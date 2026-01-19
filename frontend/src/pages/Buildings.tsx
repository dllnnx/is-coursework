import { useEffect, useState } from 'react';
import { Building2, Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { BuildingsService } from '../api';
import type { BuildingDto } from '../api';

export function Buildings() {
  const [buildings, setBuildings] = useState<BuildingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingDto | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '' });

  useEffect(() => {
    fetchBuildings();
  }, []);

  async function fetchBuildings() {
    try {
      const data = await BuildingsService.getAll1();
      setBuildings(data);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingBuilding(null);
    setFormData({ name: '', address: '' });
    setIsModalOpen(true);
  }

  function openEditModal(building: BuildingDto) {
    setEditingBuilding(building);
    setFormData({ name: building.name || '', address: building.address || '' });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingBuilding?.id) {
        await BuildingsService.update4(editingBuilding.id, formData);
      } else {
        await BuildingsService.create4(formData);
      }
      setIsModalOpen(false);
      fetchBuildings();
    } catch (error) {
      console.error('Failed to save building:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this building?')) return;
    try {
      await BuildingsService.delete4(id);
      fetchBuildings();
    } catch (error) {
      console.error('Failed to delete building:', error);
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
        <h1 className="text-2xl font-bold text-slate-900">Buildings</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Building
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building) => (
          <Card key={building.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{building.name}</h3>
                </div>
              </div>
            </div>
            {building.address && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                {building.address}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(building)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => building.id && handleDelete(building.id)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {buildings.length === 0 && (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No buildings found. Add your first building!</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBuilding ? 'Edit Building' : 'Add Building'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBuilding ? 'Save Changes' : 'Add Building'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
