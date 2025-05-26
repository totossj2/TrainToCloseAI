import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle hash fragment from OAuth callback
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (accessToken) {
      // Set the session with the tokens from the hash
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ data: { session } }) => {
        // Redirect to dashboard if authenticated, otherwise to home
        navigate(session ? '/dashboard' : '/', { replace: true });
      }).catch((error) => {
        console.error('Error setting session:', error);
        navigate('/', { replace: true });
      });
    } else {
      // Fallback to checking current session
      supabase.auth.getSession().then(({ data: { session } }) => {
        navigate(session ? '/dashboard' : '/', { replace: true });
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;