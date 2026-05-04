const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE
router.post("/", (req, res) => {
  const { raised_by, material_name, quantity, urgency, purpose } = req.body;

  const sql = `
    INSERT INTO material_requirements 
    (raised_by, material_name, quantity, urgency, purpose) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [raised_by, material_name, quantity, urgency, purpose], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Saved successfully" });
  });
});

// READ
router.get("/", (req, res) => {
  db.query("SELECT * FROM material_requirements WHERE main_status='Y' ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});



// DELETE

router.put("/delete/:id", (req, res) => {
  db.query(
    "UPDATE material_requirements SET main_status='N' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Marked as deleted" });
    }
  );
});
// router.delete("/:id", (req, res) => {
//   db.query("DELETE FROM material_requirements WHERE id=?", [req.params.id], (err) => {
//     if (err) return res.status(500).json(err);

//     res.json({ message: "Deleted" });
//   });
// });


// UPDATE STATUS (Approve/Reject)
router.put("/status/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE material_requirements SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Status Updated" });
    }
  );
});
// UPDATE All
router.put("/:id", (req, res) => {
  const { raised_by, material_name, quantity, urgency, purpose, status } = req.body;

  const sql = `
    UPDATE material_requirements 
    SET raised_by=?, material_name=?, quantity=?, urgency=?, purpose=?, status=? 
    WHERE id=?
  `;

  db.query(
    sql,
    [raised_by, material_name, quantity, urgency, purpose, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated Successfully" });
    }
  );
});
module.exports = router;