import { createContext, useContext, useEffect, useState } from 'react';
import { api, TOKEN_KEY } from '../api.js';

const AuthContext = createContext(null);
const USER_KEY = 'portfolio_user';

// Holds the signed-in user. The JWT is kept in localStorage so a page refresh keeps the session;
// signing out deletes it (see README, "Token storage and sign-out").
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });

  const saveSession = ({ token, user: u }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // On load, confirm the stored token is still valid; drop it if it expired.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api('/auth/me').then((d) => setUser(d.user)).catch(clearSession);
  }, []);

  const value = {
    user,
    isAdmin: user?.role === 'admin',
    signin: async (email, password) => saveSession(await api('/auth/signin', { method: 'POST', body: { email, password } })),
    signup: async (name, email, password) => saveSession(await api('/auth/signup', { method: 'POST', body: { name, email, password } })),
    signout: async () => { try { await api('/auth/signout'); } finally { clearSession(); } },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
