import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [user, token]);

  function signIn(userObj, jwt){
    setUser(userObj);
    setToken(jwt);
  }

  function signOut(){
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Remove useAuth and default export from this file.
// Move them to a new file: useAuth.js

export default AuthContext;
