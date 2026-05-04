import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  // const [count, setCount] = useState(0);

  const [vendorCount, setVendorCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/vendor")
      .then(res => setVendorCount(res.data.length));
      axios.get("http://localhost:5000/api/material")
      .then(res => setMaterialCount(res.data.length));
       axios.get("http://localhost:5000/api/purchase")
      .then(res => setPurchaseCount(res.data.length));
   
  }, []);

  return (
    <div className="container mt-4">

      <div className="row">


         {/* Material Requirement Card */}
        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">

              <h5>Vendor</h5>

              <h2 className="text-primary">{vendorCount}</h2>

              <p className="text-muted">Total Vendor</p>

            </div>
          </div>
        </div>

        {/* Material Requirement Card */}
        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">

              <h5>Material Requirement</h5>

              <h2 className="text-primary">{materialCount}</h2>

              <p className="text-muted">Total Requests</p>

            </div>
          </div>
        </div>

         {/* Purchase order card */}
        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">

              <h5>Purchase Order</h5>

              <h2 className="text-primary">{purchaseCount}</h2>

              <p className="text-muted">Total Requests</p>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;