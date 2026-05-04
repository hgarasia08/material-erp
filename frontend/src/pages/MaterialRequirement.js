import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const MaterialRequirement = () => {
  const [form, setForm] = useState({
    raised_by: "",
    material_name: "",
    quantity: "",
    urgency: "Medium",
    purpose: ""
  });


  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);


const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

const filteredData = list.filter(item =>
  (item.material_name || "").toLowerCase().includes(search.toLowerCase()) ||
  (item.raised_by || "").toLowerCase().includes(search.toLowerCase())
);
const sortedData = [...filteredData].sort((a, b) => {
  if (sortOrder === "asc") {
    return a[sortField] > b[sortField] ? 1 : -1;
  } else {
    return a[sortField] < b[sortField] ? 1 : -1;
  }
});

const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentData = sortedData.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(sortedData.length / itemsPerPage);

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
const handleEditChange = (e) => {
  setEditData({ ...editData, [e.target.name]: e.target.value });
};

  const submitForm = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/material", form);
    fetchData();
     // ✅ ADD THIS
    window.dispatchEvent(new Event("materialUpdated"));
    setForm({
    raised_by: "",
    material_name: "",
    quantity: "",
    urgency: "Medium",
    purpose: ""
  });
  };

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/material?time=${new Date().getTime()}`
    );
    setList(res.data);
  };

 const updateStatus = async (id, status) => {
  await axios.put(
    `http://localhost:5000/api/material/status/${id}`, // ✅ CHANGE HERE
    { status }
  );
  fetchData();
};

  const deleteItem = async (id) => {
    await axios.put(`http://localhost:5000/api/material/delete/${id}`);

    fetchData();
    window.dispatchEvent(new Event("materialUpdated"));
    // await axios.delete(`http://localhost:5000/api/material/${id}`);
    // fetchData();
  };

const updateItem = async () => {
  console.log("Sending:", editData);

  const res = await axios.put(
    `http://localhost:5000/api/material/${editData.id}`,
    editData
  );

  console.log("Response:", res.data);

  setShowModal(false);
  fetchData();
};

  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(list);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Materials");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Material_Requirement.xlsx");
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
              <option value="Medium">Medium</option>
              <option>Low</option>
            </select>

            <textarea name="purpose" placeholder="Purpose" className="form-control mb-2"  value={form.purpose} onChange={handleChange}></textarea>

            <button className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>

      {/* TABLE */}
<input type="text" className="form-control mb-3" placeholder="Search Material / Raised By" value={search} onChange={(e) => setSearch(e.target.value)}
/>
<button className="btn btn-success mb-2" onClick={exportToExcel}>
  Export Excel
</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th onClick={() => handleSort("raised_by")}>Raised By ⬍</th>
            <th onClick={() => handleSort("material_name")}>Material ⬍</th>
            <th onClick={() => handleSort("quantity")}>Qty ⬍</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.raised_by}</td>
                  <td>{item.material_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.urgency}</td>
                  <td>
                    <span className={`badge bg-${
                      item.status === "Approved"
                        ? "success"
                        : item.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button  className="btn btn-primary btn-sm me-1" onClick={() => { setEditData(item); setShowModal(true); }}> Edit
                    </button>
                    <button className="btn btn-success btn-sm me-1" onClick={() => updateStatus(item.id, "Approved")}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm me-1" onClick={() => updateStatus(item.id, "Rejected")}>
                      Reject
                    </button>
                    <button className="btn btn-dark btn-sm" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  
                  </td>
                </tr>
              ))}
            </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {showModal && (
   <div className="modal show fade d-block">
     <div className="modal-dialog">
       <div className="modal-content">
 
         <div className="modal-header">
           <h5>Edit Material</h5>
           <button className="btn-close" onClick={() => setShowModal(false)}></button>
         </div>
 
         <div className="modal-body">
 
           <input
             name="raised_by"
             className="form-control mb-2"
            value={editData?.raised_by || ""}
             onChange={handleEditChange}
           />
 
           <input
             name="material_name"
             className="form-control mb-2"
             value={editData?.material_name || ""}
             onChange={handleEditChange}
           />
 
           <input
             name="quantity"
             type="number"
             className="form-control mb-2"
             value={editData?.quantity || ""}
             onChange={handleEditChange}
           />
 
           <select
             name="urgency"
             className="form-control mb-2"
           value={editData?.urgency || ""}
             onChange={handleEditChange}
           >
             <option value="High">High</option>
             <option value="Medium">Medium</option>
             <option value="Low">Low</option>
           </select>
 
           <textarea
             name="purpose"
             className="form-control"
             value={editData?.purpose || ""}
             onChange={handleEditChange}
           />
 
         </div>
 
         <div className="modal-footer">
           <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
           <button className="btn btn-primary" onClick={updateItem}>Update</button>
         </div>
 
       </div>
     </div>
   </div>
       )}
    </div>
  );
 
};

export default MaterialRequirement;