import express from "express";
import Contact from "./contactModel.js";

const router = express.Router();

// Create a Contact (POST)
router.post("/", async (req, res) => {
  const { name, relation, contactNumber } = req.body;

  try {
    const newContact = new Contact({ name, relation, contactNumber });
    await newContact.save();
    res.status(201).json({ message: "Contact created successfully", contact: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All Contacts (GET)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a Single Contact by ID (GET)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Contact by ID (PUT)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, relation, contactNumber } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, relation, contactNumber },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact updated successfully", contact: updatedContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Contact by ID (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
