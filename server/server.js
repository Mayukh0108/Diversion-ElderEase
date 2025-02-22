import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./mongodb.js";
import router from "./userRoutes.js";
const app = express();

// Connect to MongoDB
await connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", router);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));