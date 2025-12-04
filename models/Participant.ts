import mongoose, { Schema, Document, models } from "mongoose";

export interface IParticipant extends Document {
  registrationId: mongoose.Types.ObjectId;
  name: string;
  gender: "Male" | "Female" | "Other";
  rollNumber: string;
  contactNumber: string;
  email: string;
  isLeader: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      uppercase: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Contact number must be exactly 10 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    isLeader: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate participant emails per registration
ParticipantSchema.index({ registrationId: 1, email: 1 }, { unique: true });

// Index for faster queries
ParticipantSchema.index({ rollNumber: 1 });

const Participant =
  models.Participant ||
  mongoose.model<IParticipant>("Participant", ParticipantSchema);

export default Participant;
