const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Task not found');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, priority, completed, createdAt) VALUES (?, ?, ?, ?, ?)',
      [title, description, priority || 'low', false, new Date()]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, completed } = req.body;
    await pool.query(
      'UPDATE tasks SET title=?, description=?, priority=?, completed=? WHERE id=?',
      [title, description, priority, completed, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id=?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Task not found');
    await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
router.get("/db-test", async (req, res) => {
try {
  // This simple query checks if the database is responding
  const [rows] = await pool.query("SELECT 1 + 1 AS result");
  res.json({
    status: "success",
    message: "Render is talking to Clever Cloud!",
    data: rows,
  });
} catch (err) {
  res.status(500).json({
    status: "error",
    message: "Connection failed",
    error: err.message,
  });
}
});
module.exports = router;