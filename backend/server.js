const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const materialRoutes = require("./routes/material");
app.use("/api/material", materialRoutes);
app.use("/api/vendor", require("./routes/vendor"));
const purchaseRoutes = require("./routes/purchase");
app.use("/api/purchase", purchaseRoutes);




app.listen(5000, () => {
  console.log("Server running on port 5000");
});