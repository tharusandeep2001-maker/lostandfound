import { createContext, useContext, useState, useEffect } from 'react';

// TODO Week 11: Replace MOCK_USER with real JWT decode logic
const MOCK_USER = {
  _id: '6601abc123def456789abcde',
  name: 'Ranasinghe AGTS',
  email: 'agts@university.lk',
  role: 'student',
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);

  useEffect(() => {
    // Week 11: Implement token readiness check here
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    // TODO Week 11: Decode actual JWT
    setUser(MOCK_USER);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockRole');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
