import mongoose, { Schema, models } from "mongoose";

// Team Member Schema
const TeamMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
});

// Registration Schema
const RegistrationSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    participationType: {
      type: String,
      required: true,
      enum: ["solo", "team"],
    },
    // Team Name (only for team participation)
    teamName: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.participationType === "team";
      },
    },
    // Team Leader / Solo Participant Details
    leaderName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderGender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    leaderRollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    leaderContactNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    leaderEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    // Team Members (only for team participation)
    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
      validate: {
        validator: function (this: any, members: any[]) {
          if (this.participationType === "team") {
            return members.length >= 1 && members.length <= 3;
          }
          return members.length === 0;
        },
        message: "Team must have 2-4 members ",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add compound index for event and email to prevent duplicate registrations
RegistrationSchema.index({ eventName: 1, leaderEmail: 1 }, { unique: true });

const Registration =
  models.Registration || mongoose.model("Registration", RegistrationSchema);

export default Registration;
