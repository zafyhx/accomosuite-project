import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { 
  Trash2, 
  ShieldCheck, 
  User, 
  Search, 
  Loader2, 
  UserCog,
  Mail,
  Calendar
} from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useContext(AuthContext); // Info admin yang sedang login

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Ambil token dari user context atau localstorage
      const token = currentUser?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.get("/api/users", config);
      setUsers(data);
    } catch (error) {
      console.error("Gagal ambil data user:", error);
      alert("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- HANDLERS ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus pengguna "${name}"? Tindakan ini permanen.`)) {
      try {
        const token = currentUser?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
        await axios.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers(); // Refresh
      } catch (error) {
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleRoleUpdate = async (userTarget) => {
    // Mencegah admin menghapus/mengubah role dirinya sendiri
    if (userTarget._id === currentUser._id) {
        alert("Anda tidak bisa mengubah role akun Anda sendiri di sini.");
        return;
    }

    const newRole = userTarget.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = userTarget.role === 'admin' 
        ? `Turunkan "${userTarget.name}" menjadi User biasa?` 
        : `Angkat "${userTarget.name}" menjadi Admin?`;

    if (window.confirm(confirmMsg)) {
      try {
        const token = currentUser?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
        await axios.put(`/api/users/${userTarget._id}/role`, {}, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers();
      } catch (error) {
        alert("Gagal update role.");
      }
    }
  };

  // --- FILTER SEARCH ---
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Manajemen Pengguna</h1>
          <p className="text-gray-500 text-sm">Kelola akun terdaftar dan hak akses admin.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition bg-white"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6 min-w-[250px]">Pengguna</th>
                  <th className="py-4 px-6 min-w-[100px]">Role</th>
                  <th className="py-4 px-6 min-w-[150px]">Bergabung</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase shadow-sm
                          ${u.role === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gray-400'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-secondary text-sm">{u.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                        ${u.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                          : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {u.role === 'admin' ? <ShieldCheck size={12} className="mr-1"/> : <User size={12} className="mr-1"/>}
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6 align-middle text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14}/>
                        {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Ubah Role */}
                        <button 
                          onClick={() => handleRoleUpdate(u)}
                          disabled={u._id === currentUser?._id} // Disable jika user sendiri
                          className={`p-2 rounded-lg border transition active:scale-95
                            ${u.role === 'admin' 
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200' 
                              : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'}
                            ${u._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={u.role === 'admin' ? "Jadikan User Biasa" : "Jadikan Admin"}
                        >
                          <UserCog size={18} />
                        </button>

                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={u._id === currentUser?._id}
                          className={`p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition active:scale-95
                            ${u._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;