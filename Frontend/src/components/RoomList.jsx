import { useEffect, useState } from "react";
import api from "../api/api";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomName: "",
    roomNumber: "",
    location: "",
    capacity: 10
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    roomName: "",
    roomNumber: "",
    location: "",
    capacity: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/room");
      setRooms(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateRoomForm = (room) => {
    if (!room.roomName.trim()) {
      setError("Room name is required");
      return false;
    }
    if (room.roomName.length > 100) {
      setError("Room name must be up to 100 characters");
      return false;
    }
    if (!room.roomNumber.trim() || room.roomNumber.length !== 6) {
      setError("Room number must be exactly 6 characters");
      return false;
    }
    if (room.location && room.location.length > 100) {
      setError("Location must be up to 100 characters");
      return false;
    }
    const capacity = parseInt(room.capacity);
    if (capacity < 1 || capacity > 100) {
      setError("Capacity must be between 1 and 100");
      return false;
    }
    return true;
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!validateRoomForm(newRoom)) return;
    
    try {
      await api.post("/room", {
        ...newRoom,
        capacity: parseInt(newRoom.capacity)
      });
      setNewRoom({ 
        roomName: "", 
        roomNumber: "", 
        location: "", 
        capacity: 10 
      });
      setError("");
      fetchRooms();
    } catch (err) {
      console.error("Error creating room:", err);
      if (err.response) {
        // Server responded with error
        setError(`Failed to create room: ${err.response.data.message || err.response.statusText || 'Server error'}`);
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Is the backend running on http://localhost:8080?');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room.roomID);
    setEditForm({
      roomName: room.roomName,
      roomNumber: room.roomNumber,
      location: room.location || "",
      capacity: room.capacity
    });
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setEditForm({
      roomName: "",
      roomNumber: "",
      location: "",
      capacity: 10
    });
  };

  const updateRoom = async (id) => {
    if (!validateRoomForm(editForm)) return;

    try {
      await api.put(`/room/${id}`, {
        ...editForm,
        capacity: parseInt(editForm.capacity)
      });
      setEditingRoom(null);
      setEditForm({
        roomName: "",
        roomNumber: "",
        location: "",
        capacity: 10
      });
      setError("");
      fetchRooms();
    } catch (err) {
      console.error("Error updating room:", err);
      if (err.response) {
        setError(`Failed to update room: ${err.response.data.message || err.response.statusText || 'Server error'}`);
      } else if (err.request) {
        setError('No response from server. Is the backend running?');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await api.delete(`/room/${id}`);
      setError("");
      fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      if (err.response) {
        setError(`Failed to delete room: ${err.response.data.message || err.response.statusText || 'Server error'}`);
      } else if (err.request) {
        setError('No response from server. Is the backend running?');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Conference Rooms Management</h2>
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

        {/* Add New Room Form */}
        <div className="form-custom mb-4">
          <h3>Add New Room</h3>
          <form onSubmit={createRoom} className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Room Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Conference Room A"
                value={newRoom.roomName}
                onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
                maxLength="100"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Room Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="6 chars"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                maxLength="6"
                minLength="6"
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Building A, Floor 2"
                value={newRoom.location}
                onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                maxLength="100"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Capacity *</label>
              <input
                type="number"
                className="form-control"
                placeholder="1-100"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                min="1"
                max="100"
                required
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-custom btn-custom-primary w-100">
                Add Room
              </button>
            </div>
          </form>
        </div>

        {/* Rooms Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle custom-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th style={{ width: "120px" }}>Room Number</th>
                <th>Location</th>
                <th style={{ width: "100px" }}>Capacity</th>
                <th style={{ width: "200px" }}>Actions</th>
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
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No rooms found
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.roomID}>
                    <td>
                      {editingRoom === room.roomID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.roomName}
                          onChange={(e) => setEditForm({ ...editForm, roomName: e.target.value })}
                          maxLength="100"
                          required
                        />
                      ) : (
                        <span className="fw-medium">{room.roomName}</span>
                      )}
                    </td>
                    <td>
                      {editingRoom === room.roomID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.roomNumber}
                          onChange={(e) => setEditForm({ ...editForm, roomNumber: e.target.value })}
                          maxLength="6"
                          minLength="6"
                          required
                        />
                      ) : (
                        <span className="badge badge-custom bg-secondary">{room.roomNumber}</span>
                      )}
                    </td>
                    <td>
                      {editingRoom === room.roomID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          maxLength="100"
                        />
                      ) : (
                        room.location || <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {editingRoom === room.roomID ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editForm.capacity}
                          onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                          min="1"
                          max="100"
                          required
                        />
                      ) : (
                        <span className="badge badge-custom bg-info text-dark">{room.capacity}</span>
                      )}
                    </td>
                    <td>
                      {editingRoom === room.roomID ? (
                        <>
                          <button
                            onClick={() => updateRoom(room.roomID)}
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
                            onClick={() => startEdit(room)}
                            className="btn btn-sm btn-custom btn-custom-primary me-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRoom(room.roomID)}
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

export default RoomList;
