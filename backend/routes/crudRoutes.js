import express from "express";

const createCrudRoutes = (pool, tableName) => {
  const router = express.Router();

  // GET all records (with optional filtering)
  router.get("/", async (req, res) => {
    try {
      const filters = req.query;
      let query = `SELECT * FROM ${tableName}`;
      let values = [];

      if (Object.keys(filters).length > 0) {
        const conditions = Object.keys(filters)
          .map((key) => `${key} = ?`)
          .join(" AND ");
        query += ` WHERE ${conditions}`;
        values = Object.values(filters);
      }

      const [rows] = await pool.query(query, values);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });

  // GET a record by ID
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Error fetching record", error });
    }
  });

  // POST - Create new record
  router.post("/", async (req, res) => {
    try {
      const newRecord = req.body;
      const columns = Object.keys(newRecord).join(", ");
      const placeholders = Object.keys(newRecord).map(() => "?").join(", ");
      const values = Object.values(newRecord);

      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      const [result] = await pool.query(query, values);

      res.status(201).json({ id: result.insertId, ...newRecord });
    } catch (error) {
      res.status(500).json({ message: "Error adding record", error });
    }
  });

  // PUT - Replace a record by ID
  router.put("/:id", async (req, res) => {
    try {
      const updatedRecord = req.body;
      const columns = Object.keys(updatedRecord).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(updatedRecord), req.params.id];

      const query = `UPDATE ${tableName} SET ${columns} WHERE id = ?`;
      const [result] = await pool.query(query, values);

      res.json({ affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: "Error updating record", error });
    }
  });

  // PATCH - Update part of a record by ID
  router.patch("/:id", async (req, res) => {
    try {
      const updates = req.body;
      const columns = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(updates), req.params.id];

      const query = `UPDATE ${tableName} SET ${columns} WHERE id = ?`;
      const [result] = await pool.query(query, values);

      res.json({ affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: "Error updating record", error });
    }
  });

  // DELETE - Remove a record by ID
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: "Error deleting record", error });
    }
  });

  return router;
};

export default createCrudRoutes;
