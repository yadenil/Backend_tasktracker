const express = require("express");
const cors = require('cors');
const tasksRouter = require("./routes/tasks");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection test endpoint
app.get("/db-test", async (_, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({
      status: "success",
      message: "✓ Successfully connected to Clever Cloud database!",
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      status: "error",
      message: "✗ Failed to connect to database",
      error: err.message,
      details: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      },
    });
  }
});

app.use("/tasks", tasksRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
