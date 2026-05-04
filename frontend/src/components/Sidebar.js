import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
// const [count, setCount] = useState(0);
const [materialCount, setMaterialCount] = useState(0);
const [vendorCount, setVendorCount] = useState(0);
const [purchaseCount, setPurchaseCount] = useState(0);

useEffect(() => {
  fetchCount();

  // 👇 listen for update event
  window.addEventListener("materialUpdated", fetchCount);
  window.addEventListener("vendorUpdated", fetchCount);
  window.addEventListener("purchaseUpdated", fetchCount);

  return () => {
    window.removeEventListener("materialUpdated", fetchCount);
    window.removeEventListener("vendorUpdated", fetchCount);
    window.removeEventListener("purchaseUpdated", fetchCount);
  };
}, []);

const fetchCount = () => {
  axios.get("http://localhost:5000/api/material")
    .then(res => setMaterialCount(res.data.length))
    .catch(err => console.log(err));
     axios.get("http://localhost:5000/api/vendor")
    .then(res => setVendorCount(res.data.length))
    .catch(err => console.log(err));
     axios.get("http://localhost:5000/api/purchase")
    .then(res => setPurchaseCount(res.data.length))
    .catch(err => console.log(err));
};
  return (
    <div className="bg-dark text-white p-3" style={{ width: "220px", height: "100vh" }}>
      
      <h5 className="text-center mb-4">ERP</h5>

      <ul className="nav flex-column">

      <li className="nav-item">
      <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
      </li>


      <li className="nav-item d-flex justify-content-between align-items-center">
      <Link className="nav-link text-white" to="/vendor">
      Vendor Master
      </Link>
      <span className="badge bg-info text-dark">
      {vendorCount}
      </span>
      </li>

      <li className="nav-item d-flex justify-content-between align-items-center">
      <Link className="nav-link text-white" to="/material">
      Material Requirement
      </Link>
      <span className="badge bg-warning text-dark">
      {materialCount}
      </span>
      </li>

      <li className="nav-item d-flex justify-content-between align-items-center">
      <Link className="nav-link text-white" to="/purchase">
      Purchase Order
      </Link>
       <span className="badge bg-warning text-dark">
      {purchaseCount}
      </span>
      </li>

      
        

      </ul>

    </div>
  );
};

export default Sidebar;