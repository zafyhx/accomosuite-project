import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer"; // <--- 1. IMPORT FOOTER
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// --- HALAMAN UTAMA ---
import Home from "./pages/Home";

// --- AUTH ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- ADMIN LAYOUT & PAGES ---
import AdminLayout from "./layouts/AdminLayout";
import ActivityLogs from "./pages/admin/ActivityLogs";
import AdminBookings from "./pages/admin/AdminBookings";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageBlogs from "./pages/admin/ManageBlogs";
import ManageSuites from "./pages/admin/ManageSuite";
import ManageUsers from "./pages/admin/ManageUsers";
import SuiteForm from "./pages/admin/SuiteForm";

// --- USER PAGES ---
import BookingSuccess from "./pages/BookingSuccess";
import CheckIn from "./pages/CheckIn";
import MyBookings from "./pages/MyBookings";
import SuiteDetail from "./pages/SuiteDetail";
import UserProfile from "./pages/UserProfile";

// --- BLOG & OTHERS ---
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Hotel from "./pages/Hotel";

function App() {
  const location = useLocation();
  // Cek apakah user sedang di rute admin (untuk menyembunyikan Navbar & Footer User)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    // 2. UPDATE LAYOUT: tambahkan 'flex flex-col' agar footer sticky di bawah
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar muncul di semua halaman KECUALI Admin Panel */}
      {!isAdminRoute && <Navbar />}

      {/* 3. UPDATE WRAPPER: tambahkan 'flex-grow' agar konten mengisi ruang kosong */}
      <div className="flex-grow">
        <Routes>
          {/* === PUBLIC ROUTES === */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === USER PROTECTED ROUTES === */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-in/:id"
            element={
              <ProtectedRoute>
                <CheckIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

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
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
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

      {/* 4. PASANG FOOTER (Hanya jika bukan admin) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
