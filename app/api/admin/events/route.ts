import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

// GET - Fetch all events
export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, slug, description, date, maxTeamSize, minTeamSize } = body;

    if (!name || !slug || !description || !date) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const event = await Event.create({
      name,
      slug,
      description,
      date,
      maxTeamSize: maxTeamSize || 4,
      minTeamSize: minTeamSize || 1,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        data: event,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating event:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Event with this name or slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}
