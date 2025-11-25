import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// --- HALAMAN UTAMA ---
import Home from "./pages/Home"; // <--- Import dari file baru

// --- AUTH ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- ADMIN LAYOUT & PAGES ---
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageSuites from "./pages/admin/ManageSuite";
import SuiteForm from "./pages/admin/SuiteForm";
import AdminBookings from "./pages/admin/AdminBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import ActivityLogs from './pages/admin/ActivityLogs';
import ManageBlogs from './pages/admin/ManageBlogs';

// --- USER PAGES ---
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import SuiteDetail from "./pages/SuiteDetail";
import CheckIn from './pages/CheckIn';
import UserProfile from './pages/UserProfile';

// --- BLOG & OTHERS ---
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact'; 
import Hotel from './pages/Hotel';     

function App() {
  const location = useLocation();
  // Cek apakah user sedang di rute admin (untuk menyembunyikan Navbar User)
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Navbar muncul di semua halaman KECUALI Admin Panel */}
      {!isAdminRoute && <Navbar />} 
      
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        
        {/* === USER PROTECTED ROUTES === */}
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/check-in/:id" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* === PUBLIC DETAILS === */}
        <Route path="/suites/:id" element={<SuiteDetail />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        
        {/* === BLOG === */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* === PLACEHOLDER PAGES === */}
        <Route path="/hotel" element={<Hotel />} />   
        <Route path="/contact" element={<Contact />} />   

        {/* === ADMIN PANEL ROUTES (Role: Admin Only) === */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="suites" element={<ManageSuites />} />
          <Route path="suites/new" element={<SuiteForm />} />
          <Route path="suites/edit/:id" element={<SuiteForm />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;