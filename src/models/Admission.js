import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    dob: Date,
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    parentPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    qualification: { type: String, trim: true },
    percentage: { type: Number, min: 0, max: 100 },
    course: { type: String, default: "B.Com", trim: true },
    year: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: "Website", trim: true },
    status: {
      type: String,
      enum: ["pending", "reviewing", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);
