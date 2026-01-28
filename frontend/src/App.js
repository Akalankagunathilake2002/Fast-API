import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", description: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(t);
  }, [error]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
      setError("");
    } catch (e) {
      setError("Failed to fetch vehicles (check backend is running + CORS).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredVehicles = useMemo(() => {
    const q = filter.trim().toLowerCase();

    let list = [...vehicles];

    if (q) {
      list = list.filter((v) =>
        String(v.id).includes(q) ||
        (v.name || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (["id", "price", "quantity"].includes(sortField)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [vehicles, filter, sortField, sortDirection]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      id: Number(form.id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editId !== null) {
        await api.put(`/vehicles/${editId}`, payload);
        setMessage("Vehicle updated successfully ✅");
      } else {
        await api.post("/vehicles", payload);
        setMessage("Vehicle created successfully ✅");
      }
      resetForm();
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v) => {
    setForm({
      id: v.id,
      name: v.name,
      description: v.description,
      price: v.price,
      quantity: v.quantity,
    });
    setEditId(v.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this vehicle?");
    if (!ok) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.delete(`/vehicles/${id}`);
      setMessage("Vehicle deleted ✅");
      await fetchVehicles();
    } catch (e) {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg">
      <header className="header">
        <div className="brand">
          <div className="logo">AK</div>
          <div>
            <h1>AK Fast Track Vehicles</h1>
            <p>FastAPI + PostgreSQL CRUD Dashboard</p>
          </div>
        </div>

        <button className="btn btn-ghost" onClick={fetchVehicles} disabled={loading}>
          Refresh
        </button>
      </header>

      <main className="wrap">
        <section className="panel">
          <div className="panel-head">
            <h2>{editId !== null ? "Edit Vehicle" : "Add Vehicle"}</h2>
            <div className="pill">Total: {vehicles.length}</div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="grid">
              <div className="field">
                <label>ID</label>
                <input
                  type="number"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  required
                  disabled={editId !== null}
                  placeholder="e.g. 10"
                />
              </div>

              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tesla Model 3"
                />
              </div>

              <div className="field full">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Short description..."
                />
              </div>

              <div className="field">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 25000"
                />
              </div>

              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {editId !== null ? "Update" : "Add"}
              </button>

              {editId !== null && (
                <button className="btn btn-soft" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>

            {message && <div className="toast ok">{message}</div>}
            {error && <div className="toast err">{error}</div>}
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Vehicles</h2>

            <input
              className="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by id, name, description..."
            />
          </div>

          <div className="tableWrap">
            {loading ? (
              <div className="loading">Loading…</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")} className="sortable">ID</th>
                    <th onClick={() => handleSort("name")} className="sortable">Name</th>
                    <th>Description</th>
                    <th onClick={() => handleSort("price")} className="sortable">Price</th>
                    <th onClick={() => handleSort("quantity")} className="sortable">Qty</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVehicles.map((v) => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td className="strong">{v.name}</td>
                      <td className="muted">{v.description}</td>
                      <td>LKR {Number(v.price).toLocaleString()}</td>
                      <td><span className="badge">{v.quantity}</span></td>
                      <td className="rowBtns">
                        <button className="btn btn-soft" onClick={() => handleEdit(v)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(v.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}

                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty">No vehicles found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
