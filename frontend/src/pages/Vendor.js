import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";




const Vendor = () => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
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
    (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.phone || "").toLowerCase().includes(search.toLowerCase()) || 
    (item.email || "").toLowerCase().includes(search.toLowerCase())
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
  
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:5000/api/vendor");
    setList(res.data);
  };


   const updateStatus = async (id, status) => {
  await axios.put(
    `http://localhost:5000/api/vendor/status/${id}`, // ✅ CHANGE HERE
    { status }
  );
  fetchVendors();
};



  const validate = () => {
  let err = {};

  if (!form.name) err.name = "Vendor name required";
  if (!form.phone) err.phone = "Phone required";
  if (!form.email) err.email = "Email required";
  // if (!form.address) err.address = "Address required";
  else if (!/^\d{10}$/.test(form.phone)) err.phone = "Invalid phone";

  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
    err.email = "Invalid email";

  setErrors(err);
  return Object.keys(err).length === 0;
};

  const submitForm = async (e) => {
    e.preventDefault();


    if (!validate()) return;

    await axios.post("http://localhost:5000/api/vendor", form);
    fetchVendors();
    window.dispatchEvent(new Event("vendorUpdated"));
    setForm({ name: "", phone: "", email: "", address: "" });
  };


    const deleteItem = async (id) => {
    await axios.put(`http://localhost:5000/api/vendor/delete/${id}`);

    fetchVendors();
    window.dispatchEvent(new Event("vendorUpdated"));
    // await axios.delete(`http://localhost:5000/api/material/${id}`);
    // fetchData();
  };
 const updateItem = async () => {
  console.log("Sending:", editData);

  const res = await axios.put(
    `http://localhost:5000/api/vendor/${editData.id}`,
    editData
  );

  console.log("Response:", res.data);

  setShowModal(false);
  fetchVendors();
};

  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(list);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Material_Requirement.xlsx");
};
  return (
    <div className="container mt-4">

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Vendor Master
        </div>

        <div className="card-body">
          <form onSubmit={submitForm}>
            <input name="name" placeholder="Vendor Name" className="form-control mb-2" value={form.name} onChange={handleChange} />
            {errors.name && <small className="text-danger">{errors.name}</small>}
            <input name="phone" placeholder="Phone" className="form-control mb-2" value={form.phone} onChange={handleChange} />
            {errors.phone && <small className="text-danger">{errors.phone}</small>}
            <input name="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} />
            {errors.email && <small className="text-danger">{errors.email}</small>}
            <textarea name="address" placeholder="Address" className="form-control mb-2" value={form.address} onChange={handleChange}></textarea>
            {errors.address && <small className="text-danger">{errors.address}</small>}

            <button className="btn btn-dark">Add Vendor</button>
          </form>
        </div>
      </div>
 {/* TABLE */}
<input type="text" className="form-control mb-3" placeholder="Search Name / Phone / Email" value={search} onChange={(e) => setSearch(e.target.value)}
/>
<button className="btn btn-success mb-2" onClick={exportToExcel}>
  Export Excel
</button>
      <table className="table table-bordered">
        <thead>
          <tr> 
             <th>Sr No.</th>
            <th onClick={() => handleSort("name")}>Name ⬍</th>
            <th onClick={() => handleSort("phone")}>Phone ⬍</th>
            <th onClick={() => handleSort("email")}>Email ⬍</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item, index) => (
              <tr  key={item.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>
                    <button  className="btn btn-primary btn-sm me-1" onClick={() => { setEditData(item); setShowModal(true); }}> Edit
                    </button>
                    {/* <button className="btn btn-success btn-sm me-1" onClick={() => updateStatus(item.id, "Approved")}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm me-1" onClick={() => updateStatus(item.id, "Rejected")}>
                      Reject
                    </button> */}
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
             name="name"
             className="form-control mb-2"
            value={editData?.name || ""}
             onChange={handleEditChange}
           />
 
           <input
             name="phone"
             className="form-control mb-2"
             value={editData?.phone || ""}
             onChange={handleEditChange}
           />
 
           <input
             name="email"
             
             className="form-control mb-2"
             value={editData?.email || ""}
             onChange={handleEditChange}
           />          
 
           <textarea
             name="address"
             className="form-control"
             value={editData?.address || ""}
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

export default Vendor;