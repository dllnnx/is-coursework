import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { OpenAPI } from '../api/core/OpenAPI';

const YANDEX_CLIENT_ID = 'd642d4b85f90411a9256e9b32f3b28dd';
const TOKEN_STORAGE_KEY = 'ac_control_token';
const REDIRECT_URI = `https://se.ifmo.ru/~s408536/`;

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
  isProcessingOAuth: boolean;
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
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code: string) => {
    setIsProcessingOAuth(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const authData = await response.json();
      localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
      setToken(authData.token);
      OpenAPI.TOKEN = authData.token;
      
      await fetchUserInfo(authData.token);
      
      window.history.replaceState({}, '', window.location.pathname);
    } catch (error) {
      console.error('OAuth callback error:', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsProcessingOAuth(false);
    }
  }, [fetchUserInfo]);

  const fetchAuth = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      console.error('OAuth error:', urlParams.get('error_description') || errorParam);
      window.history.replaceState({}, '', window.location.pathname);
      setIsLoading(false);
      return;
    }

    if (code) {
      await handleOAuthCallback(code);
      setIsLoading(false);
      return;
    }

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
  }, [fetchUserInfo, handleOAuthCallback]);

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
        isProcessingOAuth,
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
