import React from 'react';
import useAuth from '../contexts/useAuth';

// Assumes Google Identity Services script is loaded from index.html or will be loaded elsewhere
export default function GoogleSignIn({ elementId = 'google-signin-btn', size = 'large', theme = 'outline' }){
  const { signIn } = useAuth();
  const initializedRef = React.useRef(false);

  const handleCredentialResponse = React.useCallback(async (response) => {
    const idToken = response?.credential;
    if(!idToken) return;
    try{
      console.debug('VITE_GOOGLE_CLIENT_ID=', import.meta.env.VITE_GOOGLE_CLIENT_ID);
      console.debug('VITE_API_URL=', import.meta.env.VITE_API_URL);
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';
      const res = await fetch(`${apiBase}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });
      if(!res.ok) throw new Error('Auth failed');
      const body = await res.json();
      signIn(body.user, body.token);
    }catch(err){
      console.error('Google sign-in failed', err);
    }
  }, [signIn]);

  React.useEffect(()=>{
    if(!window.google) return;
    const el = document.getElementById(elementId);
    if(!el || initializedRef.current) return;

    if(!window.__gisInitialized){
      window.google.accounts.id.initialize({ client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, callback: handleCredentialResponse });
      window.__gisInitialized = true;
    }

    window.google.accounts.id.renderButton(el, { theme, size });
    initializedRef.current = true;
  },[elementId, handleCredentialResponse, size, theme]);

  return (
    <div id={elementId} />
  );
}
