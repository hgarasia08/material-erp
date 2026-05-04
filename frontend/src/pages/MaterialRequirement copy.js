import React, { useState, useEffect } from "react";
import axios from "axios";

const MaterialRequirement = () => {
  const [form, setForm] = useState({
    raised_by: "",
    material_name: "",
    quantity: "",
    urgency: "Medium",
    purpose: ""
  });



  const [list, setList] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/material", form);
    fetchData();
    setForm({
    raised_by: "",
    material_name: "",
    quantity: "",
    urgency: "Medium",
    purpose: ""
  });
  };

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/material");
    setList(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/material/${id}`, { status });
    fetchData();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/api/material/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">

      {/* FORM */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Material Requirement
        </div>
        <div className="card-body">
          <form onSubmit={submitForm}>
            <input name="raised_by" placeholder="Raised By" className="form-control mb-2" value={form.raised_by} onChange={handleChange} />
            <input name="material_name" placeholder="Material Name" className="form-control mb-2" value={form.material_name}  onChange={handleChange} />
            <input name="quantity" type="number" placeholder="Quantity" className="form-control mb-2" value={form.quantity} onChange={handleChange} />

            <select name="urgency" className="form-control mb-2" value={form.urgency}  onChange={handleChange}>
              <option>High</option>
              <option selected>Medium</option>
              <option>Low</option>
            </select>

            <textarea name="purpose" placeholder="Purpose" className="form-control mb-2"  value={form.purpose} onChange={handleChange}></textarea>

            <button className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Raised By</th>
            <th>Material</th>
            <th>Qty</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.raised_by}</td>
              <td>{item.material_name}</td>
              <td>{item.quantity}</td>
              <td>{item.urgency}</td>
              <td>
                <span className={`badge bg-${item.status === "Approved" ? "success" : item.status === "Rejected" ? "danger" : "warning"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button className="btn btn-success btn-sm me-1" onClick={() => updateStatus(item.id, "Approved")}>Approve</button>
                <button className="btn btn-danger btn-sm me-1" onClick={() => updateStatus(item.id, "Rejected")}>Reject</button>
                <button className="btn btn-dark btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default MaterialRequirement;