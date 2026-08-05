import mongoose, { Schema, Document, models } from "mongoose";

export interface IEvent extends Document {
  name: string;
  slug: string;
  description: string;
  date: string;
  image?: string;
  rulebook?: string;
  whatsappLink?: string;
  maxTeamSize: number;
  minTeamSize: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Event slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
      trim: true,
      validate: {
        validator: function (value: string) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) return false;
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        message: "Invalid date format. Use YYYY-MM-DD (e.g., 2025-01-15)",
      },
    },
    image: {
      type: String,
      trim: true,
    },
    rulebook: {
      type: String,
      trim: true,
    },
    whatsappLink: {
      type: String,
      trim: true,
    },
    maxTeamSize: {
      type: Number,
      default: 6,
      min: 1,
    },
    minTeamSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

EventSchema.index({ isActive: 1 });

const Event = models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
