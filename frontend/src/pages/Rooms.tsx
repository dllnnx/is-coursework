import { useEffect, useState } from 'react';
import { DoorOpen, Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { RoomsService, BuildingsService } from '../api';
import type { RoomDto, BuildingDto } from '../api';

export function Rooms() {
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [buildings, setBuildings] = useState<BuildingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [formData, setFormData] = useState({ name: '', buildingId: 0 });
  const [filterBuildingId, setFilterBuildingId] = useState<number | ''>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [filterBuildingId]);

  async function fetchData() {
    try {
      const buildingsData = await BuildingsService.getAll1();
      setBuildings(buildingsData);
      await fetchRooms();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRooms() {
    try {
      let data: RoomDto[];
      if (filterBuildingId) {
        data = await RoomsService.getByBuildingId(filterBuildingId);
      } else {
        data = await RoomsService.getAll5();
      }
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  }

  function openCreateModal() {
    setEditingRoom(null);
    setFormData({ name: '', buildingId: buildings[0]?.id || 0 });
    setIsModalOpen(true);
  }

  function openEditModal(room: RoomDto) {
    setEditingRoom(room);
    setFormData({ name: room.name || '', buildingId: room.buildingId || 0 });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingRoom?.id) {
        await RoomsService.update2(editingRoom.id, { ...formData, id: editingRoom.id });
      } else {
        await RoomsService.create2(formData.buildingId, { name: formData.name });
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (error) {
      console.error('Failed to save room:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await RoomsService.delete2(id);
      fetchRooms();
    } catch (error) {
      console.error('Failed to delete room:', error);
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
        <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Room
        </Button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Building</label>
        <select
          value={filterBuildingId}
          onChange={(e) => setFilterBuildingId(e.target.value ? Number(e.target.value) : '')}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="">All Buildings</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <DoorOpen className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{room.name}</h3>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Building2 className="w-4 h-4" />
              {room.buildingName}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(room)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => room.id && handleDelete(room.id)}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <Card className="text-center py-12">
          <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No rooms found. Add your first room!</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? 'Edit Room' : 'Add Room'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Building</label>
              <select
                value={formData.buildingId}
                onChange={(e) => setFormData({ ...formData, buildingId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              >
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRoom ? 'Save Changes' : 'Add Room'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
