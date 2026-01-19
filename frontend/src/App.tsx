import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
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
import { OAuthCallback } from './pages/OAuthCallback';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
