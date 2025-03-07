// Replace require statements with import statements
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import createCrudRoutes from "./routes/crudRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Define collections and automatically generate routes
    const collections = ["patientlogin", "egfr_calculations", "clinicianlogin"];
    const dbName = "healthbridge";

    collections.forEach((col) => {
      app.use(`/api/${col}`, createCrudRoutes(client, dbName, col));
    });

    // Server Start
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Connection error:", error);
  }
}

startServer();
