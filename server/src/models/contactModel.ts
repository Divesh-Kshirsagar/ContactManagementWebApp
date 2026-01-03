import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
    },
    phone: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Work", "Family", "Friends", "Other"],
      default: "Other",
    },
    message: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Text Index for optimized search
contactSchema.index({ name: "text", email: "text", phone: "text" });
// Compound Index for sorting
contactSchema.index({ category: 1, createdAt: -1 });

export const Contact = model("Contact", contactSchema);
