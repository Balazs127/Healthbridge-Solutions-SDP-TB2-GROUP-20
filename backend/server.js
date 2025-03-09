import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import createCrudRoutes from "./routes/crudRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB Connection
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to AWS RDS MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error);
  }
}

testDBConnection();

// Define tables and automatically generate routes
const tables = ["patientlogin", "egfr_calculations", "clinicianlogin"];

tables.forEach((table) => {
  app.use(`/api/${table}`, createCrudRoutes(pool, table));
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
