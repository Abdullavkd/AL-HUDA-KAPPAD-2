import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/auth/me').then(r => setUser(r.data.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const login = async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); localStorage.setItem('alhuda_token', data.data.token); setUser(data.data.user); };
  const logout = () => { localStorage.removeItem('alhuda_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

