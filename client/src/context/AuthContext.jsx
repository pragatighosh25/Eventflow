import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);
const SESSION_KEY = 'eventflow_session';

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);
  const [bootstrapping, setBootstrapping] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      setBootstrapping(false);
      return;
    }

    api.auth
      .me()
      .then(({ user: me }) => {
        setUser(me);
        saveSession(me);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        saveSession(null);
      })
      .finally(() => setBootstrapping(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: sessionUser } = await api.auth.login({ email, password });
    setToken(token);
    setUser(sessionUser);
    saveSession(sessionUser);
    return sessionUser;
  };

  const signup = async (payload) => {
    const { token, user: sessionUser } = await api.auth.register(payload);
    setToken(token);
    setUser(sessionUser);
    saveSession(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    saveSession(null);
  };

  const updateProfile = useCallback(async (profile) => {
    if (!user) return;
    const { user: updated } = await api.users.updateProfile(profile);
    setUser(updated);
    saveSession(updated);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      isAuthenticated: Boolean(user),
      isOrganizer: user?.role === 'organizer',
      isAttendee: user?.role === 'attendee',
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, bootstrapping, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
