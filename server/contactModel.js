import mongoose from "mongoose";

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  contactNumber: { type: String, required: true },
});

// Create the Contact model
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
