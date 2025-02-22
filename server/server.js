import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./mongodb.js";
import router from "./userRoutes.js";
import twilio from "twilio";

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Twilio message function
async function sendMessage() {
  try {
    const message = await client.messages.create({  // Use "client" instead of "twilio"
      body: "Hello from Twilio",
      from: "+15732675589",
      to: process.env.PHONE_NUMBER
    });

    console.log("📩 Message Sent! SID:", message.sid);
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
  }
}

// Call the function
sendMessage();

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
