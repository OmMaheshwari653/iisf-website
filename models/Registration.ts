import mongoose, { Schema, Document, models } from "mongoose";

export interface IRegistration extends Document {
  eventName: string;
  isTeam: boolean;
  teamName?: string;
  leaderEmail: string;
  totalParticipants: number;
  createdAt: Date;
  updatedAt: Date;
}

// Registration Schema - Main document for each registration
const RegistrationSchema = new Schema<IRegistration>(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      index: true,
    },
    isTeam: {
      type: Boolean,
      required: true,
      default: false,
    },
    teamName: {
      type: String,
      trim: true,
      minlength: [3, "Team name must be at least 3 characters long"],
      maxlength: [100, "Team name must not exceed 100 characters"],
      required: function (this: any) {
        return this.isTeam === true;
      },
      validate: {
        validator: function (this: any, value: string) {
          // If isTeam is true, teamName must be provided
          if (this.isTeam && (!value || value.trim() === "")) {
            return false;
          }
          // If isTeam is false, teamName should be empty
          if (!this.isTeam && value && value.trim() !== "") {
            return false;
          }
          return true;
        },
        message:
          "Team name is required for team registrations and should be empty for individual registrations",
      },
    },
    leaderEmail: {
      type: String,
      required: [true, "Leader email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    totalParticipants: {
      type: Number,
      required: true,
      min: [1, "At least one participant is required"],
      max: [4, "Maximum 4 participants allowed"],
      validate: {
        validator: function (this: any, value: number) {
          if (this.isTeam) {
            return value >= 2 && value <= 4;
          } else {
            return value === 1;
          }
        },
        message:
          "Individual registration must have 1 participant, team registration must have 2-4 participants",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations for same event by same leader
RegistrationSchema.index({ eventName: 1, leaderEmail: 1 }, { unique: true });

// Virtual populate for participants
RegistrationSchema.virtual("participants", {
  ref: "Participant",
  localField: "_id",
  foreignField: "registrationId",
});

// Ensure virtuals are included when converting to JSON
RegistrationSchema.set("toJSON", { virtuals: true });
RegistrationSchema.set("toObject", { virtuals: true });

const Registration =
  models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
