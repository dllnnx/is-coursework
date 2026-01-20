import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Buildings } from './pages/Buildings';
import { Rooms } from './pages/Rooms';
import { AirConditioners } from './pages/AirConditioners';
import { Groups } from './pages/Groups';
import { Schedules } from './pages/Schedules';
import { Users } from './pages/Users';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Loader2, AirVent } from 'lucide-react';
import { Card } from './components/Card';

function AppRoutes() {
  const { isProcessingOAuth } = useAuth();

  if (isProcessingOAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-sky-100 rounded-full">
              <AirVent className="w-12 h-12 text-sky-600" />
            </div>
          </div>
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Authenticating...</h2>
          <p className="text-slate-500">Please wait while we complete your sign-in</p>
        </Card>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="air-conditioners" element={<AirConditioners />} />
        <Route path="groups" element={<Groups />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/~s408536">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
