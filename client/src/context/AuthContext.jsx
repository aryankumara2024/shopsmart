import { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();

const API_URL = `http://${window.location.hostname}:5001/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check valid session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser({ id: data.id, username: data.username, email: data.email });
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(err => {
        console.error('Auth error', err);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginContext = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logoutContext = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}



// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
