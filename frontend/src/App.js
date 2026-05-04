import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import MaterialRequirement from "./pages/MaterialRequirement";
import Dashboard from "./pages/Dashboard";
import Vendor from "./pages/Vendor";
import PurchaseOrder from "./pages/PurchaseOrder";

<Route path="/dashboard" element={<Dashboard />} />


function App() {
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/material" element={<MaterialRequirement />} />
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/purchase" element={<PurchaseOrder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
