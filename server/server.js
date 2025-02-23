import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./mongodb.js";
import router from "./userRoutes.js";
import twilio from "twilio";
import contactrouter from "./contactRoutes.js";
const app = express();

// Connect to MongoDB
await connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", router);
app.use("/api/contact", contactrouter);


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sosMessages = [
  "Dad is feeling very weak. Please call as soon as possible! 💔",
  "Mom is having chest pain! Urgent help needed! 🚑",
  "I'm feeling dizzy and unable to move properly. Please check on me! 😞",
  "There is a medical emergency. Please come home quickly! 🏠",
  "I'm having trouble breathing. Call the doctor immediately! 😨",
  "Blood pressure is too high. Need help right now! 📞",
  "I fell down and need assistance. Please respond fast! 🚨",
  "I can't find my medicines. Can you call me? 💊",
  "Severe pain in joints, can't stand properly. Urgent help needed! 😥",
  "I'm scared and feeling uneasy. Please check on me soon. 😓"
];


app.post('/send-sos', async (req, res) => {
  try {
    const randomMessage = sosMessages[Math.floor(Math.random() * sosMessages.length)];
      const message = await client.messages.create({
          body: randomMessage,
          from: "+15732675589",
          to: req.body.to, // Frontend should send the recipient's number
      });

      res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
