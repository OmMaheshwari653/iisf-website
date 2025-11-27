import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventname: string }> }
) {
  try {
    console.log("📝 Registration API called");
    
    // Connect to database
    await dbConnect();
    console.log("✅ Database connected");

    // Get event name from URL
    const { eventname } = await params;
    const eventName = decodeURIComponent(eventname);
    console.log("📌 Event name:", eventName);

    // Parse request body
    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));

    // Validate required fields
    const {
      participationType,
      teamName,
      leaderName,
      leaderGender,
      leaderRollNumber,
      leaderContactNumber,
      leaderEmail,
      teamMembers = [],
    } = body;

    // Basic validation
    if (!participationType || !["solo", "team"].includes(participationType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid participation type. Must be "solo" or "team".',
        },
        { status: 400 }
      );
    }

    if (
      !leaderName ||
      !leaderGender ||
      !leaderRollNumber ||
      !leaderContactNumber ||
      !leaderEmail
    ) {
      return NextResponse.json(
        { success: false, error: "All leader fields are required." },
        { status: 400 }
      );
    }

    // Validate team members for team participation
    if (participationType === "team") {
      // Validate team name is provided
      if (!teamName || teamName.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            error: "Team name is required for team participation.",
          },
          { status: 400 }
        );
      }

      if (
        !Array.isArray(teamMembers) ||
        teamMembers.length < 1 ||
        teamMembers.length > 3
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Team participation requires 1 to 3 additional members (2-4 total including leader).",
          },
          { status: 400 }
        );
      }

      // Validate each team member has required fields
      for (const member of teamMembers) {
        if (
          !member.name ||
          !member.gender ||
          !member.rollNumber ||
          !member.contactNumber ||
          !member.email
        ) {
          return NextResponse.json(
            {
              success: false,
              error: "All fields are required for each team member.",
            },
            { status: 400 }
          );
        }
      }
    } else {
      // Solo participation should not have team members
      if (teamMembers.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Solo participation cannot have team members.",
          },
          { status: 400 }
        );
      }
    }

    // Create registration
    console.log("💾 Creating registration...");
    const registration = await Registration.create({
      eventName,
      participationType,
      teamName: participationType === "team" ? teamName : undefined,
      leaderName,
      leaderGender,
      leaderRollNumber,
      leaderContactNumber,
      leaderEmail,
      teamMembers: participationType === "team" ? teamMembers : [],
    });
    console.log("✅ Registration created:", registration._id);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: {
          id: registration._id,
          eventName: registration.eventName,
          participationType: registration.participationType,
          teamName: registration.teamName,
          leaderName: registration.leaderName,
          teamSize: participationType === "team" ? teamMembers.length + 1 : 1,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle duplicate registration
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already registered for this event.",
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: messages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during registration. Please try again.",
        details: error.message,
        hint: "Make sure MongoDB is running on localhost:27017",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch registrations for an event (optional - for admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventname: string }> }
) {
  try {
    await dbConnect();

    const { eventname } = await params;
    const eventName = decodeURIComponent(eventname);

    const registrations = await Registration.find({ eventName }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        count: registrations.length,
        data: registrations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch registrations.",
      },
      { status: 500 }
    );
  }
}
