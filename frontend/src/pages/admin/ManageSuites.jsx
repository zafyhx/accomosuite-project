import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Plus, Trash2, Edit, Image as ImageIcon, MapPin, Loader2 } from "lucide-react";

const ManageSuites = () => {
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchSuites = async () => {
    try {
      setLoading(true);
      // Endpoint admin biasanya sama dengan endpoint publik
      const { data } = await axios.get("/api/suites"); 
      setSuites(data);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data properti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuites();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus properti ini?")) {
      try {
        const config = {
          // WAJIB: Kirim token admin untuk DELETE
          headers: { Authorization: `Bearer ${user.token}` }, 
        };
        await axios.delete(`/api/suites/${id}`, config);
        fetchSuites(); // Refresh data
      } catch (error) {
        alert("Gagal menghapus: " + (error.response?.data?.message || "Server Error"));
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Kelola Properti</h1>
          <p className="text-gray-500 text-sm">Atur daftar akomodasi dan harga sewa.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/suites/new")} // Rute ke form tambah baru
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition font-bold shadow-lg shadow-primary/30 active:scale-95"
        >
          <Plus size={20} /> Tambah Properti
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
                  <th className="py-4 px-6 min-w-[80px]">Foto</th>
                  <th className="py-4 px-6 min-w-[200px]">Detail Properti</th>
                  <th className="py-4 px-6 min-w-[100px]">Kategori</th>
                  <th className="py-4 px-6 min-w-[120px]">Harga/Malam</th>
                  <th className="py-4 px-6 min-w-[120px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-medium divide-y divide-gray-100">
                {suites.length > 0 ? (
                  suites.map((suite) => (
                    <tr key={suite._id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 align-middle">
                        {suite.images && suite.images[0] ? (
                          <img 
                            src={`http://localhost:5000${suite.images[0]}`} 
                            alt={suite.name} 
                            className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="text-secondary font-bold text-base">{suite.name}</div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <MapPin size={12} /> {suite.location || "Lokasi belum diatur"}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border
                          ${suite.type === 'Villa' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            suite.type === 'Hotel' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-green-50 text-green-700 border-green-100'
                          }`}>
                          {suite.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-primary align-middle">
                        Rp {suite.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          {/* Tombol Edit - Sekarang mengarah ke form dengan ID */}
                          <button 
                            onClick={() => navigate(`/admin/suites/edit/${suite._id}`)}
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition active:scale-95"
                            title="Edit Data"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(suite._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition active:scale-95"
                            title="Hapus Data"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <Plus size={32} className="text-gray-400"/>
                        </div>
                        <p className="font-medium">Belum ada properti terdaftar.</p>
                        <p className="text-sm mt-1">Klik tombol "Tambah Properti" di atas.</p>
                      </div>
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

export default ManageSuites;