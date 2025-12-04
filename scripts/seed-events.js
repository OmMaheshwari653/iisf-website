// Run this file to seed initial events
// node --loader ts-node/esm seed-events.js

import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb://127.0.0.1:27017/iisf-database?retryWrites=true&w=majority";

const events = [
  {
    name: "Hackathon 2025",
    slug: "hackathon-2025",
    description: "Code, Build, and Win! 48-hour coding marathon",
    date: "January 15-17, 2025",
    maxTeamSize: 4,
    minTeamSize: 1,
    isActive: true,
  },
  {
    name: "Startup Pitch Competition",
    slug: "startup-pitch-2025",
    description: "Present your innovative startup idea to investors",
    date: "February 5, 2025",
    maxTeamSize: 5,
    minTeamSize: 1,
    isActive: true,
  },
  {
    name: "Innovation Workshop",
    slug: "innovation-workshop",
    description: "Learn about latest tech trends and innovations",
    date: "March 10, 2025",
    maxTeamSize: 1,
    minTeamSize: 1,
    isActive: true,
  },
];

const EventSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    date: String,
    maxTeamSize: Number,
    minTeamSize: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);

async function seedEvents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Event = mongoose.model("Event", EventSchema);

    // Clear existing events (optional)
    // await Event.deleteMany({});
    // console.log('Cleared existing events');

    // Insert new events
    await Event.insertMany(events);
    console.log(`Successfully seeded ${events.length} events!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
}

seedEvents();
