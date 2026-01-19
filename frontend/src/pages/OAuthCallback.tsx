import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AirVent, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth, TOKEN_STORAGE_KEY } from '../hooks/useAuth';

const YANDEX_CLIENT_ID = '0c998c76f8c5456e8564501a65de828a';
const YANDEX_SECRET = 'e75b388d25e246af95dede5432772b41';
const REDIRECT_URI = `${window.location.origin}/oauth/callback`;

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setStatus('error');
      setError(errorDescription || errorParam);
      return;
    }

    if (!code) {
      setStatus('error');
      setError('No authorization code received');
      return;
    }

    exchangeCodeForToken(code);
  }, [searchParams]);

  async function exchangeCodeForToken(code: string) {
    try {
      const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: YANDEX_CLIENT_ID,
          client_secret: YANDEX_SECRET,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error_description || 'Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

      const registerResponse = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `OAuth ${accessToken}`,
        },
        body: JSON.stringify({ oauthToken: accessToken }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => ({}));
        if (registerResponse.status !== 409) {
          console.warn('Registration response:', errorData);
        }
      }

      await refetch();
      setStatus('success');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('OAuth error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-sky-100 rounded-full">
            <AirVent className="w-12 h-12 text-sky-600" />
          </div>
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Authenticating...</h2>
            <p className="text-slate-500">Please wait while we complete your sign-in</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-500">You have been signed in. Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/login')}>
              Try Again
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
