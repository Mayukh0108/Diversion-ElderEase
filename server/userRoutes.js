import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./userModel.js";
const router = express.Router();
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        console.log(newUser);

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // res.json(token);
        res.send({ token, email, password });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;