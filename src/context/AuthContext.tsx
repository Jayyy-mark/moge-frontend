import { createContext, useContext, useState, useEffect } from "react";
import api from "../helpers/api";

type User = {
  id: number;
  user_id: string;
  username: string;
  email: string;
  role: string;
  staff_id:number;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ⬅️ new

  const logout = async () => {
    await api.post("auth/logout/");
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("auth/user/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false); // ⬅️ finished fetching
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) return <div>Loading...</div>; // ⬅️ prevent redirect before fetch

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
