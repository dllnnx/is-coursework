import { useEffect, useState } from 'react';
import { Users as UsersIcon, Check, X, Shield, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { UsersService, BuildingsService } from '../api';
import type { UserDto, BuildingDto, UserRoleDto } from '../api';

export function Users() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserDto[]>([]);
  const [buildings, setBuildings] = useState<BuildingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [roleData, setRoleData] = useState({ roleId: 1, buildingId: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [usersData, pendingData, buildingsData] = await Promise.all([
        UsersService.getAll2(),
        UsersService.getPendingRequests(),
        BuildingsService.getAll1(),
      ]);
      setUsers(usersData);
      setPendingUsers(pendingData);
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    try {
      await UsersService.approveRegistration(id);
      fetchData();
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  }

  async function handleReject(id: number) {
    if (!confirm('Are you sure you want to reject this user?')) return;
    try {
      await UsersService.rejectRegistration(id);
      fetchData();
    } catch (error) {
      console.error('Failed to reject user:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await UsersService.delete6(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }

  function openRoleModal(user: UserDto) {
    setSelectedUser(user);
    setRoleData({ roleId: 1, buildingId: buildings[0]?.id || 0 });
    setIsRoleModalOpen(true);
  }

  async function handleAssignRole(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser?.id) return;
    try {
      await UsersService.assignRole(selectedUser.id, roleData);
      setIsRoleModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  }

  async function handleRemoveRole(userId: number, role: UserRoleDto) {
    if (!confirm('Are you sure you want to remove this role?')) return;
    try {
      await UsersService.removeRole(userId, role.roleId || 0, role.buildingId || 0);
      fetchData();
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  }

  function getStatusBadge(status: string | undefined) {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Approved</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Pending</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Rejected</span>;
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  const displayUsers = activeTab === 'pending' ? pendingUsers : users;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'pending' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending ({pendingUsers.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              {getStatusBadge(user.registrationStatus)}
            </div>

            {user.roles && user.roles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Roles:</p>
                <div className="space-y-1">
                  {user.roles.map((role, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 rounded px-2 py-1">
                      <span>
                        <span className="font-medium">{role.roleName}</span>
                        {role.buildingName && (
                          <span className="text-slate-500"> @ {role.buildingName}</span>
                        )}
                      </span>
                      <button
                        onClick={() => user.id && handleRemoveRole(user.id, role)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {user.registrationStatus === 'PENDING' ? (
                <>
                  <button
                    onClick={() => user.id && handleApprove(user.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => user.id && handleReject(user.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openRoleModal(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Add Role
                  </button>
                  <button
                    onClick={() => user.id && handleDelete(user.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {displayUsers.length === 0 && (
        <Card className="text-center py-12">
          <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            {activeTab === 'pending' ? 'No pending registrations' : 'No users found'}
          </p>
        </Card>
      )}

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Assign Role"
      >
        <form onSubmit={handleAssignRole}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={roleData.roleId}
                onChange={(e) => setRoleData({ ...roleData, roleId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value={1}>System Admin</option>
                <option value={2}>Building Admin</option>
                <option value={3}>User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Building</label>
              <select
                value={roleData.buildingId}
                onChange={(e) => setRoleData({ ...roleData, buildingId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
            <Button type="button" variant="secondary" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Assign Role</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
