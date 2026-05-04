const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const {
    material_id,
    vendor_id,
    quantity,
    rate,
    total,
    delivery_date,
    payment_terms
  } = req.body;

  const sql = `
    INSERT INTO purchase_orders 
    (material_id, vendor_id, quantity, rate, total, delivery_date, payment_terms)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [material_id, vendor_id, quantity, rate, total, delivery_date, payment_terms],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "PO Created" });
    }
  );
});


router.get("/", (req, res) => {
  const sql = `
    SELECT 
      po.*,
      m.material_name,
      v.name AS vendor_name
    FROM purchase_orders po
    JOIN material_requirements m ON po.material_id = m.id
    JOIN vendors v ON po.vendor_id = v.id
    AND status_flag='Y'
    ORDER BY po.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});




router.put("/:id", (req, res) => {
  const {
    material_id,
    vendor_id,
    quantity,
    rate,
    total,
    delivery_date,
    payment_terms
  } = req.body;

  const sql = `
    UPDATE purchase_orders 
    SET material_id=?, vendor_id=?, quantity=?, rate=?, total=?, delivery_date=?, payment_terms=?
    WHERE id=?
  `;

  db.query(
    sql,
    [material_id, vendor_id, quantity, rate, total, delivery_date, payment_terms, req.params.id],
    (err, result) => {
      if (err) {
        console.log(sql);
        console.log("UPDATE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Updated Successfully" });
    }
  );
});


// router.delete("/:id", (req, res) => {
//   db.query(
//     "DELETE FROM purchase_orders WHERE id=?",
//     [req.params.id],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Deleted" });
//     }
//   );
// });

router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE purchase_orders SET status_flag='N' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});


module.exports = router;