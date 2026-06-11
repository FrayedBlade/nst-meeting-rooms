import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function BuildingList() {
  const { role } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";
  const [buildings, setBuildings] = useState([]);
  const [newBuilding, setNewBuilding] = useState({
    name: "",
    address: "",
    numberOfFloors: 1
  });
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    numberOfFloors: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/building");
      setBuildings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch buildings");
      console.error("Error fetching buildings:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (building) => {
    if (!building.name.trim()) {
      setError("Building name is required");
      return false;
    }
    if (building.name.length > 100) {
      setError("Building name must be up to 100 characters");
      return false;
    }
    if (building.address && building.address.length > 150) {
      setError("Address must be up to 150 characters");
      return false;
    }
    const floors = parseInt(building.numberOfFloors);
    if (isNaN(floors) || floors < 1) {
      setError("Number of floors must be at least 1");
      return false;
    }
    return true;
  };

  const createBuilding = async (e) => {
    e.preventDefault();
    if (!validateForm(newBuilding)) return;
    try {
      await api.post("/building", {
        ...newBuilding,
        numberOfFloors: parseInt(newBuilding.numberOfFloors)
      });
      setNewBuilding({ name: "", address: "", numberOfFloors: 1 });
      setError("");
      fetchBuildings();
    } catch (err) {
      console.error("Error creating building:", err);
      setError(`Failed to create building: ${err.response?.data?.message || err.response?.statusText || err.message}`);
    }
  };

  const startEdit = (building) => {
    setEditingBuilding(building.buildingID);
    setEditForm({
      name: building.name,
      address: building.address || "",
      numberOfFloors: building.numberOfFloors || 1
    });
  };

  const cancelEdit = () => {
    setEditingBuilding(null);
    setEditForm({ name: "", address: "", numberOfFloors: 1 });
  };

  const updateBuilding = async (id) => {
    if (!validateForm(editForm)) return;
    try {
      await api.put(`/building/${id}`, {
        ...editForm,
        numberOfFloors: parseInt(editForm.numberOfFloors)
      });
      setEditingBuilding(null);
      setEditForm({ name: "", address: "", numberOfFloors: 1 });
      setError("");
      fetchBuildings();
    } catch (err) {
      console.error("Error updating building:", err);
      setError(`Failed to update building: ${err.response?.data?.message || err.response?.statusText || err.message}`);
    }
  };

  const deleteBuilding = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building?")) return;
    try {
      await api.delete(`/building/${id}`);
      setError("");
      fetchBuildings();
    } catch (err) {
      console.error("Error deleting building:", err);
      setError(`Failed to delete building: ${err.response?.data?.message || err.response?.statusText || err.message}`);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Buildings Management</h2>
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

        {/* Add New Building Form */}
        {isAdmin && <div className="form-custom mb-4">
          <h3>Add New Building</h3>
          <form onSubmit={createBuilding} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small">Building Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Main Campus"
                value={newBuilding.name}
                onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                maxLength="100"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="123 Main Street"
                value={newBuilding.address}
                onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                maxLength="150"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Floors *</label>
              <input
                type="number"
                className="form-control"
                placeholder="1"
                value={newBuilding.numberOfFloors}
                onChange={(e) => setNewBuilding({ ...newBuilding, numberOfFloors: e.target.value })}
                min="1"
                required
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-custom btn-custom-primary w-100">
                Add Building
              </button>
            </div>
          </form>
        </div>}

        {/* Buildings Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle custom-table">
            <thead>
              <tr>
                <th>Building Name</th>
                <th>Address</th>
                <th style={{ width: "100px" }}>Floors</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Loading...
                  </td>
                </tr>
              ) : buildings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No buildings found
                  </td>
                </tr>
              ) : (
                buildings.map((building) => (
                  <tr key={building.buildingID}>
                    <td>
                      {editingBuilding === building.buildingID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          maxLength="100"
                          required
                        />
                      ) : (
                        <span className="fw-medium">{building.name}</span>
                      )}
                    </td>
                    <td>
                      {editingBuilding === building.buildingID ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          maxLength="150"
                        />
                      ) : (
                        building.address || <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {editingBuilding === building.buildingID ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editForm.numberOfFloors}
                          onChange={(e) => setEditForm({ ...editForm, numberOfFloors: e.target.value })}
                          min="1"
                          required
                        />
                      ) : (
                        <span className="badge badge-custom bg-info text-dark">{building.numberOfFloors}</span>
                      )}
                    </td>
                    <td>
                      {editingBuilding === building.buildingID ? (
                        <>
                          <button
                            onClick={() => updateBuilding(building.buildingID)}
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
                          {isAdmin && <button
                            onClick={() => startEdit(building)}
                            className="btn btn-sm btn-custom btn-custom-primary me-1"
                          >
                            Edit
                          </button>}
                          {isAdmin && <button
                            onClick={() => deleteBuilding(building.buildingID)}
                            className="btn btn-sm btn-custom btn-custom-danger"
                          >
                            Delete
                          </button>}
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

export default BuildingList;
