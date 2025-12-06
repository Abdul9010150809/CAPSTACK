import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import jwt from "jsonwebtoken";
import api from '@/utils/axiosClient';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Basic decode and expiry check
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        const currentTime = Date.now() / 1000;
        if ((decoded as any).exp <= currentTime) {
          // expired
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        // Verify token with backend to ensure it's valid server-side
        try {
          const res = await api.get('/auth/verify');
          // Backend may return the decoded payload under res.data.payload or indicate valid
          const payload = res.data?.payload || (decoded as any);
          const userData = {
            id: payload.userId?.toString() || payload.id?.toString() || '1',
            email: payload.email || 'user@example.com',
            name: payload.name || 'User'
          };
          setUser(userData);
        } catch (e) {
          // Verification failed server-side
          console.warn('Token verification failed:', e);
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // Normalize token: strip leading 'Bearer ' if present to avoid double-prefixing
    const rawToken = token?.startsWith?.('Bearer ') ? token.slice(7) : token;
    localStorage.setItem("token", rawToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
