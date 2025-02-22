import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./userModel.js";
import userAuth from "./authentication.js"; // Import authentication middleware

const router = express.Router();

// 🛠️ Signup Route (POST)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔐 Login Route (POST)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🆔 Get User Details (GET) - Protected
router.get("/getuser", userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🗂️ Get All Users (GET) - Admin or Debugging Purpose
router.get("/all-users", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords for security
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
