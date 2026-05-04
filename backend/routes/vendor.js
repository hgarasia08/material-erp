const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { name, phone, email, address } = req.body;

  const sql = `
    INSERT INTO vendors (name, phone, email, address)
    VALUES (?, ?, ?, ?)
 `;

  db.query(sql, [name, phone, email, address], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Vendor Added" });
  });
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM vendors WHERE status='Y' ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


router.put("/:id", (req, res) => {
  const { name, phone, email, address } = req.body;

  db.query(
    "UPDATE vendors SET name=?, phone=?, email=?, address=? WHERE id=?",
    [name, phone, email, address, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

router.put("/delete/:id", (req, res) => {
  db.query(
    "UPDATE vendors SET status='N' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});


module.exports = router;