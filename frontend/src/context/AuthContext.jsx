import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            id: decoded.userId,
            username: decoded.username,
            email: decoded.email
          });
          setIsLoggedIn(true);
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        Cookies.remove('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    Cookies.set('token', token, { expires: 1 });
    setToken(token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    token,
    isLoggedIn,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
