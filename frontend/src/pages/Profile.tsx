import { User, Mail, Shield, Building2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center py-12 px-8">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Please log in to view your profile</p>
        </Card>
      </div>
    );
  }

  function getStatusIcon(status: string | undefined) {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  }

  function getStatusText(status: string | undefined) {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'PENDING':
        return 'Pending Approval';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  function getStatusColor(status: string | undefined) {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-sky-100 rounded-full">
              <User className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(user.registrationStatus)}`}>
                {getStatusIcon(user.registrationStatus)}
                {getStatusText(user.registrationStatus)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-5 h-5 text-slate-400" />
              <span>{user.email}</span>
            </div>
            {user.yandexId && (
              <div className="flex items-center gap-3 text-slate-600">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span>Yandex ID: {user.yandexId}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-500" />
            My Roles
          </h3>

          {user.roles && user.roles.length > 0 ? (
            <div className="space-y-3">
              {user.roles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Building2 className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{role.roleName}</p>
                    {role.buildingName && (
                      <p className="text-sm text-slate-500">{role.buildingName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No roles assigned yet</p>
              {user.registrationStatus === 'PENDING' && (
                <p className="text-sm text-amber-600 mt-2">
                  Your account is pending approval. Roles will be assigned by an administrator.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {user.registrationStatus === 'PENDING' && (
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Account Pending Approval</h3>
              <p className="text-sm text-amber-700 mt-1">
                Your registration request is being reviewed by an administrator. 
                You will receive full access once your account is approved.
              </p>
            </div>
          </div>
        </Card>
      )}

      {user.registrationStatus === 'REJECTED' && (
        <Card className="mt-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Account Rejected</h3>
              <p className="text-sm text-red-700 mt-1">
                Your registration request was rejected. Please contact an administrator for more information.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
