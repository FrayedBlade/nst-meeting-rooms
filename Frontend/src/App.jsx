import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import RoomList from "./components/RoomList";
import UserList from "./components/UserList";
import BookingList from "./components/BookingList";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
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
          </nav>
          
          <div className="sidebar-footer">
            <div className="footer-info">
              <small>© 2026 Booking System</small>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/" element={<RoomList />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
