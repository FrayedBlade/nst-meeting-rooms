import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import RoomList from "./components/RoomList";
import UserList from "./components/UserList";
import BookingList from "./components/BookingList";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

function AppLayout() {
  const { email, role, logout } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Meeting<br/>Scheduler</h1>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/rooms" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="nav-text">Conference Rooms</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="nav-text">Team Members</span>
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="nav-text">Bookings</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/buildings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="nav-text">Buildings</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-user">
            <small className="user-email">{email}</small>
            <small className="user-role">{isAdmin ? 'Administrator' : 'User'}</small>
          </div>
          <button className="btn btn-logout mt-2" onClick={logout}>Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/rooms" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
