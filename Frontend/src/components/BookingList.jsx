import { useEffect, useState } from "react";
import api from "../api/api";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [filterBy, setFilterBy] = useState("all"); // all, user, room
  const [filterValue, setFilterValue] = useState("");
  const [newBooking, setNewBooking] = useState({
    userID: "",
    roomID: "",
    startDateTime: "",
    endDateTime: ""
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    userID: "",
    roomID: "",
    startDateTime: "",
    endDateTime: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchUsers(),
      fetchRooms()
    ]);
  };

  const fetchBookings = async () => {
    try {
 setLoading(true);
      const res = await api.get("/booking");
      setBookings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get("/room");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const fetchBookingsByUser = async (userId) => {
    try {
      const res = await api.get(`/booking/user/${userId}`);
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch user bookings");
      console.error("Error:", err);
    }
  };

  const fetchBookingsByRoom = async (roomId) => {
    try {
      const res = await api.get(`/booking/room/${roomId}`);
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch room bookings");
      console.error("Error:", err);
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const res = await api.get("/booking/active");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch active bookings");
      console.error("Error:", err);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-GB');
  };

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const isBookingActive = (booking) => {
    return new Date(booking.endDateTime) > new Date();
  };

  const validateBookingForm = (booking) => {
    setError("");
    
    if (!booking.userID) {
      setError("User is required");
      return false;
    }
    if (!booking.roomID) {
      setError("Room is required");
      return false;
    }
    if (!booking.startDateTime) {
      setError("Start date and time is required");
      return false;
    }
    if (!booking.endDateTime) {
      setError("End date and time is required");
      return false;
    }
    const start = new Date(booking.startDateTime);
    const end = new Date(booking.endDateTime);
    if (end <= start) {
      setError("End time must be after start time");
      return false;
    }
    // Check if booking duration is more than 8 hours
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours > 8) {
      setError("Booking duration cannot exceed 8 hours");
      return false;
    }
    return true;
  };

  const createBooking = async (e) => {
    e.preventDefault();
    if (!validateBookingForm(newBooking)) return;
    
    try {
      const bookingData = {
        user: { userID: parseInt(newBooking.userID) },
        room: { roomID: parseInt(newBooking.roomID) },
        startDateTime: newBooking.startDateTime,
        endDateTime: newBooking.endDateTime
      };
      
      await api.post("/booking", bookingData);
      setNewBooking({
        userID: "",
        roomID: "",
        startDateTime: "",
        endDateTime: ""
      });
      setShowCreateForm(false);
      setError("");
      fetchAllData();
    } catch (err) {
      console.error("Error creating booking:", err);
      if (err.response?.data) {
        setError(`Failed to create booking: Room is already booked for the selected time period`);
      } else {
        setError("Failed to create booking");
      }
    }
  };

  const startEdit = (booking) => {
    setEditingBooking(booking.bookingID);
    setEditForm({
      userID: booking.user?.userID || "",
      roomID: booking.room?.roomID || "",
      startDateTime: formatDateTimeForInput(booking.startDateTime),
      endDateTime: formatDateTimeForInput(booking.endDateTime)
    });
    setSelectedBooking(null);
  };

  const cancelEdit = () => {
    setEditingBooking(null);
    setEditForm({
      userID: "",
      roomID: "",
      startDateTime: "",
      endDateTime: ""
    });
  };

  const updateBooking = async (id) => {
    if (!validateBookingForm(editForm)) return;

    try {
      const bookingData = {
        user: { userID: parseInt(editForm.userID) },
        room: { roomID: parseInt(editForm.roomID) },
        startDateTime: editForm.startDateTime,
        endDateTime: editForm.endDateTime
      };
      
      await api.put(`/booking/${id}`, bookingData);
      setEditingBooking(null);
      setEditForm({
        userID: "",
        roomID: "",
        startDateTime: "",
        endDateTime: ""
      });
      setError("");
      fetchAllData();
    } catch (err) {
      setError("Failed to update booking. Room may be booked for the selected time.");
      console.error("Error updating booking:", err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      await api.delete(`/booking/${id}`);
      setError("");
      fetchAllData();
      if (selectedBooking && selectedBooking.bookingID === id) {
        setSelectedBooking(null);
      }
    } catch (err) {
      setError("Failed to delete booking");
      console.error("Error deleting booking:", err);
    }
  };

  const applyFilter = () => {
    if (filterBy === "all") {
      fetchBookings();
    } else if (filterBy === "user" && filterValue) {
      fetchBookingsByUser(filterValue);
    } else if (filterBy === "room" && filterValue) {
      fetchBookingsByRoom(filterValue);
    } else if (filterBy === "active") {
      fetchActiveBookings();
    }
  };

  const clearFilter = () => {
    setFilterBy("all");
    setFilterValue("");
    fetchBookings();
  };

  const getDisplayedBookings = () => {
    if (showActiveOnly) {
      return bookings.filter(booking => isBookingActive(booking));
    }
    return bookings;
  };

  return (
    <>
      <div className="page-header">
        <h2>Bookings Management</h2>
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

        {/* Filters and Actions */}
        <div className="mb-4 d-flex gap-2 align-items-end flex-wrap">
          <div>
            <label className="form-label small">Filter By</label>
            <select 
              className="form-select"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Bookings</option>
              <option value="user">By User</option>
              <option value="room">By Room</option>
              <option value="active">Active Only</option>
            </select>
          </div>

          {(filterBy === "user" || filterBy === "room") && (
            <div>
              <label className="form-label small">
                {filterBy === "user" ? "Select User" : "Select Room"}
              </label>
              <select 
                className="form-select"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">Choose...</option>
                {filterBy === "user" ? (
                  users.map(user => (
                    <option key={user.userID} value={user.userID}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))
                ) : (
                  rooms.map(room => (
                    <option key={room.roomID} value={room.roomID}>
                      {room.roomName}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <button onClick={applyFilter} className="btn btn-custom btn-custom-primary">
            Apply Filter
          </button>
          <button onClick={clearFilter} className="btn btn-custom btn-custom-secondary">
            Clear
          </button>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="btn btn-custom btn-custom-success ms-auto"
          >
            {showCreateForm ? "Cancel" : "New Booking"}
          </button>
        </div>

        {/* Create Booking Form */}
        {showCreateForm && (
          <div className="form-custom mb-4">
            <h3>Create New Booking</h3>
            <form onSubmit={createBooking} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">User *</label>
                <select
                  className="form-select"
                  value={newBooking.userID}
                  onChange={(e) => setNewBooking({ ...newBooking, userID: e.target.value })}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.userID} value={user.userID}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Room *</label>
                <select
                  className="form-select"
                  value={newBooking.roomID}
                  onChange={(e) => setNewBooking({ ...newBooking, roomID: e.target.value })}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.roomID} value={room.roomID}>
                      {room.roomName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newBooking.startDateTime}
                  onChange={(e) => setNewBooking({ ...newBooking, startDateTime: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newBooking.endDateTime}
                  onChange={(e) => setNewBooking({ ...newBooking, endDateTime: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-custom btn-custom-primary">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bookings Table */}
        <div className="form-check mb-3" style={{padding: '0.75rem', background: '#f8f9fa', borderRadius: '10px', border: '2px solid #e0e0e0'}}>
          <input
            className="form-check-input"
            type="checkbox"
            id="showActiveOnly"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          <label className="form-check-label fw-bold" htmlFor="showActiveOnly" style={{marginLeft: '0.5rem'}}>
            Show active bookings only
          </label>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Loading...
                  </td>
                </tr>
              ) : getDisplayedBookings().length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No bookings found
                  </td>
                </tr>
              ) : (
                getDisplayedBookings().map((booking) => (
                  <tr key={booking.bookingID}>
                    <td>
                      {editingBooking === booking.bookingID ? (
                        <select
                          className="form-select form-select-sm"
                          value={editForm.userID}
                          onChange={(e) => setEditForm({ ...editForm, userID: e.target.value })}
                          required
                        >
                          <option value="">Select User</option>
                          {users.map(user => (
                            <option key={user.userID} value={user.userID}>
                              {user.firstName} {user.lastName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "Unknown"
                      )}
                    </td>
                    <td>
                      {editingBooking === booking.bookingID ? (
                        <select
                          className="form-select form-select-sm"
                          value={editForm.roomID}
                          onChange={(e) => setEditForm({ ...editForm, roomID: e.target.value })}
                          required
                        >
                          <option value="">Select Room</option>
                          {rooms.map(room => (
                            <option key={room.roomID} value={room.roomID}>
                              {room.roomName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        booking.room ? booking.room.roomName : "Unknown"
                      )}
                    </td>
                    <td>
                      {editingBooking === booking.bookingID ? (
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm"
                          value={editForm.startDateTime}
                          onChange={(e) => setEditForm({ ...editForm, startDateTime: e.target.value })}
                          required
                        />
                      ) : (
                        formatDateTime(booking.startDateTime)
                      )}
                    </td>
                    <td>
                      {editingBooking === booking.bookingID ? (
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm"
                          value={editForm.endDateTime}
                          onChange={(e) => setEditForm({ ...editForm, endDateTime: e.target.value })}
                          required
                        />
                      ) : (
                        formatDateTime(booking.endDateTime)
                      )}
                    </td>
                    <td>
                      {isBookingActive(booking) ? (
                        <span className="badge badge-custom bg-success">Active</span>
                      ) : (
                        <span className="badge badge-custom bg-secondary">Completed</span>
                      )}
                    </td>
                    <td>
                      {editingBooking === booking.bookingID ? (
                        <>
                          <button
                            onClick={() => updateBooking(booking.bookingID)}
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
                            onClick={() => startEdit(booking)}
                            className="btn btn-sm btn-custom btn-custom-primary me-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBooking(booking.bookingID)}
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
      </div>
    </>
  );
}

export default BookingList;
