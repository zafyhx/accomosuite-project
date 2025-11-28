import axios from "axios";
import { Clock, Loader2, ShieldAlert, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchLogs = async () => {
    try {
      const token =
        user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get("/api/logs", config);
      setLogs(data);
    } catch (error) {
      console.error("Gagal ambil log", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Helper Warna Badge Aksi
  const getActionColor = (action) => {
    if (action.includes("DELETE"))
      return "bg-red-100 text-red-700 border-red-200";
    if (action.includes("CREATE"))
      return "bg-green-100 text-green-700 border-green-200";
    if (action.includes("UPDATE"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Log Aktivitas</h1>
          <p className="text-gray-500 text-sm">
            Rekaman jejak tindakan admin dalam sistem.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 text-sm text-gray-500">
          <ShieldAlert size={16} />
          <span>Hanya Admin</span>
        </div>
      </div>

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
                  <th className="py-4 px-6">Waktu</th>
                  <th className="py-4 px-6">Admin (Aktor)</th>
                  <th className="py-4 px-6">Aksi</th>
                  <th className="py-4 px-6">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-secondary">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {log.actor ? log.actor.name : "Unknown"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {log.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500">
                      Belum ada aktivitas tercatat.
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

export default ActivityLogs;
