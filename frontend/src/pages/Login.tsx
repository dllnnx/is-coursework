import { AirVent } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-sky-100 rounded-full">
            <AirVent className="w-12 h-12 text-sky-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">AC Control System</h1>
        <p className="text-slate-500 mb-8">
          Centralized air conditioner management for buildings and rooms
        </p>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <Button onClick={login} className="w-full flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10zm9.55 5.28V14h2.64l-3.71 5.65V14.6H8.17l3.42-5.25v3.18h2.28L10.37 18l1.22-.72z"/>
            </svg>
            Sign in with Yandex
          </Button>
        )}

        <p className="text-sm text-slate-400 mt-6">
          New users will need administrator approval
        </p>
      </Card>
    </div>
  );
}
