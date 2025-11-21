import { createContext, useState, useEffect } from "react";

// 1. Buat Context (Wadah Global)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Cek saat website pertama kali dibuka: Ada token tersimpan gak?
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 3. Fungsi Login (Dipanggil saat tombol Login ditekan)
  const login = (userData) => {
    setUser(userData);
    // Simpan ke memori browser biar kalau di-refresh gak hilang
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  // 4. Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};