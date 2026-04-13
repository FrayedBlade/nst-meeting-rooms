import { useEffect, useState } from "react";
import api from "../api/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "", 
    lastName: "", 
    personalID: "", 
    email: "", 
    phone: ""
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "", 
    lastName: "", 
    personalID: "", 
    email: "", 
    phone: ""
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user");
      setUsers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await api.get(`/user/${id}`);
      setSelectedUser(res.data);
      fetchUserBookings(id);
      fetchActiveBookings(id);
      setError("");
    } catch (err) {
      setError("Failed to fetch user details");
      console.error("Error fetching user:", err);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const res = await api.get(`/user/${userId}/bookings`);
      setUserBookings(res.data);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setUserBookings([]);
    }
  };

  const fetchActiveBookings = async (userId) => {
    try {
      const res = await api.get(`/user/${userId}/bookings/active`);
      setActiveBookings(res.data);
    } catch (err) {
      console.error("Error fetching active bookings:", err);
      setActiveBookings([]);
    }
  };

  const checkActiveBookings = async (userId) => {
    try {
      const res = await api.get(`/user/${userId}/bookings/active/exists`);
      return res.data;
    } catch (err) {
      console.error("Error checking active bookings:", err);
      return false;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-GB');
  };

  const validateUserForm = (user) => {
    setError("");
    
    if (!user.firstName || !user.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (user.firstName.trim().length > 50) {
      setError("First name must be up to 50 characters");
      return false;
    }
    if (!user.lastName || !user.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (user.lastName.trim().length > 50) {
      setError("Last name must be up to 50 characters");
      return false;
    }
    if (!user.personalID || !user.personalID.trim()) {
      setError("Personal ID is required");
      return false;
    }
    if (user.personalID.trim().length !== 13) {
      setError("Personal ID must be exactly 13 characters");
      return false;
    }
    if (!/^\d{13}$/.test(user.personalID.trim())) {
      setError("Personal ID must contain only digits");
      return false;
    }
    if (user.email && user.email.trim()) {
      if (user.email.length > 100) {
        setError("Email must be up to 100 characters");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email.trim())) {
        setError("Email must be valid");
        return false;
      }
    }
    if (user.phone && user.phone.trim()) {
      if (user.phone.length > 10) {
        setError("Phone number can be up to 10 digits");
        return false;
      }
      if (!/^\d+$/.test(user.phone.trim())) {
        setError("Phone number must contain digits only");
        return false;
      }
    }
    return true;
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm(newUser)) return;
    
    try {
      const userData = {
        firstName: newUser.firstName.trim(),
        lastName: newUser.lastName.trim(),
        personalID: newUser.personalID.trim(),
        email: newUser.email.trim() || null,
        phone: newUser.phone.trim() || null
      };
      
      await api.post("/user", userData);
      setNewUser({ 
        firstName: "", 
        lastName: "", 
        personalID: "", 
        email: "", 
        phone: "" 
      });
      setError("");
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      if (err.response?.data) {
        setError(`Failed to create user: ${err.response.data.message || 'Check if Personal ID or email is unique'}`);
      } else {
        setError("Failed to create user. Check if Personal ID or email is unique.");
      }
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.userID);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      personalID: user.personalID,
      email: user.email || "",
      phone: user.phone || ""
    });
    setSelectedUser(null);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: "", 
      lastName: "", 
      personalID: "", 
      email: "", 
      phone: ""
    });
  };

  const updateUser = async (id) => {
    if (!validateUserForm(editForm)) return;

    try {
      const userData = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        personalID: editForm.personalID.trim(),
        email: editForm.email.trim() || null,
        phone: editForm.phone.trim() || null
      };
      
      await api.put(`/user/${id}`, userData);
      setEditingUser(null);
      setEditForm({
        firstName: "", 
        lastName: "", 
        personalID: "", 
        email: "", 
        phone: ""
      });
      setError("");
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      if (err.response?.data) {
        setError(`Failed to update user: ${err.response.data.message || 'Check if Personal ID or email is unique'}`);
      } else {
        setError("Failed to update user. Check if Personal ID or email is unique.");
      }
    }
  };

  const deleteUser = async (id) => {
    try {
      // Check if user has active bookings
      const hasActive = await checkActiveBookings(id);
      
      if (hasActive) {
        setError("Cannot delete user with active bookings. Please complete or cancel all active bookings first.");
        return;
      }

      if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
      }

      await api.delete(`/user/${id}`);
      setError("");
      fetchUsers();
      if (selectedUser && selectedUser.userID === id) {
        closeDetails();
      }
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const closeDetails = () => {
    setSelectedUser(null);
    setUserBookings([]);
    setActiveBookings([]);
    setShowBookingHistory(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>Team Members Management</h2>
      </div>
      
      <div className="custom-card">
        {error && (
          <div className="alert alert-danger alert-custom alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Add New User Form */}
        <div className="form-custom mb-4">
          <h3>Add New Team Member</h3>
          <form onSubmit={createUser} className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label small">First Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="John"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                maxLength="50"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Last Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Doe"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                maxLength="50"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Personal ID *</label>
              <input
                type="text"
                className="form-control"
                placeholder="13 digits"
                value={newUser.personalID}
                onChange={(e) => setNewUser({ ...newUser, personalID: e.target.value })}
                maxLength="13"
                minLength="13"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="user@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                maxLength="100"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="1234567890"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                maxLength="10"
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-custom btn-custom-primary w-100">
                Add User
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: "140px" }}>Personal ID</th>
                <th>Email</th>
                <th style={{ width: "120px" }}>Phone</th>
                <th style={{ width: "300px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userID}>
                    <td>
                      {editingUser === user.userID ? (
                        <div className="d-flex gap-1">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="First Name"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            maxLength="50"
                            required
                          />
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Last Name"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            maxLength="50"
                            required
                          />
                        </div>
                      ) : (
                        <span className="fw-medium">{user.firstName} {user.lastName}</span>
                      )}
                    </td>
                    <td>
                      {editingUser === user.userID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.personalID}
                          onChange={(e) => setEditForm({ ...editForm, personalID: e.target.value })}
                          maxLength="13"
                          minLength="13"
                          required
                        />
                      ) : (
                        <span className="badge badge-custom bg-secondary">{user.personalID}</span>
                      )}
                    </td>
                    <td>
                      {editingUser === user.userID ? (
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          maxLength="100"
                        />
                      ) : (
                        user.email || <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {editingUser === user.userID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          maxLength="10"
                        />
                      ) : (
                        user.phone || <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {editingUser === user.userID ? (
                        <>
                          <button
                            onClick={() => updateUser(user.userID)}
                            className="btn btn-sm btn-custom btn-custom-success me-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="btn btn-sm btn-custom btn-custom-secondary"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="btn btn-sm btn-custom btn-custom-primary me-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => fetchUserById(user.userID)}
                            className="btn btn-sm btn-custom btn-custom-success me-1"
                          >
                            Bookings
                          </button>
                          <button
                            onClick={() => deleteUser(user.userID)}
                            className="btn btn-sm btn-custom btn-custom-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* User Booking History Modal */}
        {selectedUser && (
          <div className="custom-card mt-4 bg-light" style={{border: '3px solid #666'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>
                Bookings: {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              <button onClick={closeDetails} className="btn btn-custom btn-custom-secondary">
                Close
              </button>
            </div>

            {activeBookings.length > 0 && (
              <div className="alert alert-info alert-custom">
                <strong>Active Bookings:</strong> {activeBookings.length}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-sm table-striped custom-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No booking history
                      </td>
                    </tr>
                  ) : (
                    userBookings.map((booking) => {
                      const isActive = new Date(booking.endDateTime) > new Date();
                      return (
                        <tr key={booking.bookingID}>
                          <td>{booking.room?.roomName || "Unknown Room"}</td>
                          <td>{formatDateTime(booking.startDateTime)}</td>
                          <td>{formatDateTime(booking.endDateTime)}</td>
                          <td>
                            {isActive ? (
                              <span className="badge badge-custom bg-success">Active</span>
                            ) : (
                              <span className="badge badge-custom bg-secondary">Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserList;
