import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Plus, Trash2, Edit, Image as ImageIcon, MapPin } from "lucide-react";

const ManageSuites = () => {
  const [suites, setSuites] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      const { data } = await axios.get("/api/suites");
      setSuites(data);
    } catch (error) {
      alert("Gagal mengambil data properti");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus properti ini?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        await axios.delete(`/api/suites/${id}`, config);
        fetchSuites();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  return (
    // BUG FIX: Tambah 'pt-24'
    <div className="container mx-auto px-6 pt-24 pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Kelola Properti</h1>
          <p className="text-gray-500 text-sm">Atur daftar akomodasi yang tersedia.</p>
        </div>
        <Link 
          to="/admin/suites/add" 
          className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-dark transition font-bold shadow-lg shadow-primary/30"
        >
          <Plus size={20} /> Tambah Properti
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider leading-normal">
              <th className="py-4 px-6">Foto</th>
              <th className="py-4 px-6">Properti</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Harga/Malam</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {suites.map((suite) => (
              <tr key={suite._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6">
                  {suite.images[0] ? (
                    <img 
                      src={`http://localhost:5000${suite.images[0]}`} 
                      alt="Kamar" 
                      className="w-20 h-14 object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="text-gray-800 font-bold text-base">{suite.name}</div>
                  {/* Tampilkan Lokasi */}
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <MapPin size={12} /> {suite.location || "Lokasi belum diatur"}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${suite.type === 'Villa' ? 'bg-purple-100 text-purple-600' : 
                      suite.type === 'Hotel' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                    {suite.type}
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-secondary">
                  Rp {suite.price.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex item-center justify-center gap-2">
                    <button className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(suite._id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {suites.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Plus size={32} className="text-gray-400"/>
            </div>
            <p className="font-medium">Belum ada properti terdaftar.</p>
            <p className="text-sm">Silakan tambah properti baru untuk memulai.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSuites;