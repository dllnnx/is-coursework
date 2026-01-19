import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  AirVent,
  Layers,
  Calendar,
  Users,
  LogOut,
  LogIn,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/buildings', icon: Building2, label: 'Buildings' },
  { to: '/rooms', icon: DoorOpen, label: 'Rooms' },
  { to: '/air-conditioners', icon: AirVent, label: 'Air Conditioners' },
  { to: '/groups', icon: Layers, label: 'Groups' },
  { to: '/schedules', icon: Calendar, label: 'Schedules' },
  { to: '/users', icon: Users, label: 'Users' },
];

export function Sidebar() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sky-600 text-white shadow-lg flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <AirVent className="w-6 h-6" />
          AC Control
        </h1>
      </div>

      <nav className="mt-6 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-sky-700 border-r-4 border-white'
                  : 'hover:bg-sky-500'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sky-500">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        ) : isAuthenticated && user ? (
          <div className="space-y-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-sky-700 text-white'
                    : 'text-sky-100 hover:text-white hover:bg-sky-500'
                }`
              }
            >
              <User className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium truncate">{user.name}</div>
                {user.email && (
                  <div className="text-xs text-sky-200 truncate">{user.email}</div>
                )}
              </div>
            </NavLink>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sky-100 hover:text-white hover:bg-sky-500 rounded transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-sky-600 hover:bg-sky-50 rounded-lg font-medium transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Yandex
          </button>
        )}
      </div>
    </aside>
  );
}
