import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PurchaseOrder = () => {

  const [form, setForm] = useState({
    material_id: "",
    vendor_id: "",
    quantity: "",
    rate: "",
    total: "",
    delivery_date: "",
    payment_terms: ""
  });
  const [errors, setErrors] = useState({});
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
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
  (item.vendor_name || "").toLowerCase().includes(search.toLowerCase()) ||
  (item.status || "").toLowerCase().includes(search.toLowerCase())
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

  


  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };  
  // const handleEditChange = (e) => {
  //   setEditData({ ...editData, [e.target.name]: e.target.value });
  // };
  

  useEffect(() => {
    fetchMaterials();
    fetchVendors();
    fetchPO();
  }, []);

  const fetchMaterials = async () => {
    const res = await axios.get("http://localhost:5000/api/material");
    setMaterials(res.data);
  };

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:5000/api/vendor");
    setVendors(res.data);
  };

  const fetchPO = async () => {
    const res = await axios.get("http://localhost:5000/api/purchase");
    setList(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    // ✅ AUTO CALCULATE TOTAL
    if (name === "quantity" || name === "rate") {
      updated.total = (updated.quantity || 0) * (updated.rate || 0);
    }

    setForm(updated);
  };

  const handleEditChange = (e) => {
  const { name, value } = e.target;

  let updated = { ...editData, [name]: value };

  // ✅ Auto total
  if (name === "quantity" || name === "rate") {
    updated.total = (updated.quantity || 0) * (updated.rate || 0);
  }

  setEditData(updated);
};




const validate = () => {
  let err = {};

  // ✅ Material
  if (!form.material_id) {
    err.material_id = "Material is required";
  }

  // ✅ Vendor
  if (!form.vendor_id) {
    err.vendor_id = "Vendor is required";
  }

  // ✅ Quantity
  if (!form.quantity) {
    err.quantity = "Quantity is required";
  } else if (form.quantity <= 0) {
    err.quantity = "Quantity must be greater than 0";
  }

  // ✅ Rate
  if (!form.rate) {
    err.rate = "Rate is required";
  } else if (form.rate <= 0) {
    err.rate = "Rate must be greater than 0";
  }

  // ✅ Total (auto calculated but still check)
  if (!form.total || form.total <= 0) {
    err.total = "Total must be valid";
  }

  // ✅ Delivery Date
  if (!form.delivery_date) {
    err.delivery_date = "Delivery date required";
  }

  // ✅ Payment Terms
  if (!form.payment_terms.trim()) {
    err.payment_terms = "Payment terms required";
  }

  setErrors(err);

  return Object.keys(err).length === 0;
};

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return
    await axios.post("http://localhost:5000/api/purchase", form);

    fetchPO();
    window.dispatchEvent(new Event("purchaseUpdated"));
    setForm({
      material_id: "",
      vendor_id: "",
      quantity: "",
      rate: "",
      total: "",
      delivery_date: "",
      payment_terms: ""
    });
  };
  
const updateItem = async () => {
  try {
    console.log("Updating:", editData); // ✅ debug

    const res = await axios.put(
      `http://localhost:5000/api/purchase/${editData.id}`,
      editData
    );

    console.log("Response:", res.data);

    setShowModal(false);     // ✅ close modal
    fetchPO();               // ✅ refresh list

    // ✅ update sidebar / dashboard if needed
    window.dispatchEvent(new Event("purchaseUpdated"));

  } catch (err) {
    console.error("UPDATE ERROR:", err.response?.data || err.message);
    alert("Update failed");
  }
};
const deleteItem = async (id) => {
  if (!window.confirm("Are you sure you want to delete this PO?")) return;

  await axios.delete(`http://localhost:5000/api/purchase/${id}`);
  

  fetchPO(); // refresh list
  window.dispatchEvent(new Event("purchaseUpdated"));
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(list);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Purchase_order.xlsx");
  };

  return (
    <div className="container mt-4">

      {/* FORM */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          Purchase Order
        </div>

        <div className="card-body">
          <form onSubmit={submitForm}>

            {/* MATERIAL DROPDOWN */}
            <select name="material_id" className="form-control mb-2" value={form.material_id} onChange={handleChange}>
              <option value="">Select Material</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.material_name}
                </option>
              ))}
            </select>
            {errors.material_id && <small className="text-danger">{errors.material_id}</small>}
            {/* VENDOR DROPDOWN */}
            <select name="vendor_id" className="form-control mb-2" value={form.vendor_id} onChange={handleChange}>
              <option value="">Select Vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            {errors.vendor_id && <small className="text-danger">{errors.vendor_id}</small>}
            <input name="quantity" type="number" placeholder="Quantity" className="form-control mb-2" value={form.quantity} onChange={handleChange} />{errors.quantity && <small className="text-danger">{errors.quantity}</small>}

            <input name="rate" type="number" placeholder="Rate" className="form-control mb-2" value={form.rate} onChange={handleChange} />{errors.number && <small className="text-danger">{errors.number}</small>}

            <input name="total" type="number" placeholder="Total" className="form-control mb-2" value={form.total} readOnly />

            <input name="delivery_date" type="date" className="form-control mb-2" value={form.delivery_date} onChange={handleChange} />
            {errors.delivery_date && <small className="text-danger">{errors.delivery_date}</small>}
            <input name="payment_terms" placeholder="Payment Terms" className="form-control mb-2" value={form.payment_terms} onChange={handleChange} />
            {errors.payment_terms && <small className="text-danger">{errors.payment_terms}</small>}

            <button className="btn btn-success">Create PO</button>
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
            <th>Material</th>
            <th>Vendor</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Delivery</th>
             <th>Action</th>
          </tr>
        </thead>

        <tbody>
         {currentData.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{item.material_name}</td>
              <td>{item.vendor_name}</td>
              <td>{item.quantity}</td>
              <td>{item.rate}</td>
              <td>{item.total}</td>
              <td>{item.delivery_date}</td>
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
          <h5>Edit Purchase Order</h5>
          <button className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>

        <div className="modal-body">

          {/* MATERIAL */}
          <select
            name="material_id"
            className="form-control mb-2"
            value={editData?.material_id || ""}
            onChange={handleEditChange}
          >
            <option value="">Select Material</option>
            {materials.map(m => (
              <option key={m.id} value={m.id}>
                {m.material_name}
              </option>
            ))}
          </select>

          {/* VENDOR */}
          <select
            name="vendor_id"
            className="form-control mb-2"
            value={editData?.vendor_id || ""}
            onChange={handleEditChange}
          >
            <option value="">Select Vendor</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <input
            name="quantity"
            type="number"
            className="form-control mb-2"
            value={editData?.quantity || ""}
            onChange={handleEditChange}
          />

          <input
            name="rate"
            type="number"
            className="form-control mb-2"
            value={editData?.rate || ""}
            onChange={handleEditChange}
          />

          <input
            name="total"
            type="number"
            className="form-control mb-2"
            value={editData?.total || ""}
            readOnly
          />

          <input
            type="date"
            name="delivery_date"
            className="form-control mb-2"
            value={editData?.delivery_date?.split("T")[0] || ""}
            onChange={handleEditChange}
          />

          <input
            name="payment_terms"
            className="form-control mb-2"
            value={editData?.payment_terms || ""}
            onChange={handleEditChange}
          />

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
          <button className="btn btn-success" onClick={updateItem}>
            Update
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PurchaseOrder;