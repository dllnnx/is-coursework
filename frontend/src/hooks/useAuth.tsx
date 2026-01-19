import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { OpenAPI } from '../api/core/OpenAPI';

const YANDEX_CLIENT_ID = '0c998c76f8c5456e8564501a65de828a';
const TOKEN_STORAGE_KEY = 'ac_control_token';
const REDIRECT_URI = `${window.location.origin}/oauth/callback`;

interface User {
  id?: number;
  name?: string;
  email?: string;
  yandexId?: string;
  registrationStatus?: string;
  roles?: Array<{
    roleId?: number;
    roleName?: string;
    buildingId?: number;
    buildingName?: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch('https://login.yandex.ru/info?format=json', {
        headers: {
          'Authorization': `OAuth ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUser({
        yandexId: data.id,
        name: data.real_name || data.display_name || data.login,
        email: data.default_email,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (storedToken) {
      setToken(storedToken);
      OpenAPI.TOKEN = storedToken;
      await fetchUserInfo(storedToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    
    setIsLoading(false);
  }, [fetchUserInfo]);

  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  function login() {
    const authUrl = new URL('https://oauth.yandex.ru/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', YANDEX_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    
    window.location.href = authUrl.toString();
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    OpenAPI.TOKEN = undefined;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        refetch: fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { TOKEN_STORAGE_KEY };
