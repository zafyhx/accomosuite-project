import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Routes>
      {/* Halaman Utama Sementara */}
      <Route path="/" element={<h1 className="text-center mt-10 text-2xl">Selamat Datang di Accomosuite</h1>} />
      
      {/* Halaman Login */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;