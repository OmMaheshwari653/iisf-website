import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventname: string }> }
) {
  try {
    console.log("📝 Registration API called");

    // Connect to database FIRST
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
        {
          success: false,
          error: "All leader/participant fields are required.",
        },
        { status: 400 }
      );
    }

    // Determine isTeam and total participants
    const isTeam = participationType === "team";
    const totalParticipants = isTeam ? teamMembers.length + 1 : 1;

    // Validate team-specific requirements
    if (isTeam) {
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
      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i];
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
              error: `All fields are required for team member ${i + 1}.`,
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
            error: "Individual participation cannot have team members.",
          },
          { status: 400 }
        );
      }
    }

    // Create registration document
    console.log("💾 Creating registration...");
    const registration = await Registration.create({
      eventName,
      isTeam,
      teamName: isTeam ? teamName : undefined,
      leaderEmail,
      totalParticipants,
    });
    console.log("✅ Registration created:", registration._id);

    const registrationId = registration._id;

    // Create participant documents
    const participants = [];

    // Add leader as participant
    participants.push({
      registrationId,
      name: leaderName,
      gender: leaderGender,
      rollNumber: leaderRollNumber,
      contactNumber: leaderContactNumber,
      email: leaderEmail,
      isLeader: true,
    });

    // Add team members as participants (if team)
    if (isTeam) {
      for (const member of teamMembers) {
        participants.push({
          registrationId,
          name: member.name,
          gender: member.gender,
          rollNumber: member.rollNumber,
          contactNumber: member.contactNumber,
          email: member.email,
          isLeader: false,
        });
      }
    }

    console.log("💾 Creating participants...");
    const createdParticipants = await Participant.insertMany(participants);
    console.log(`✅ ${createdParticipants.length} participants created`);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: {
          registrationId: registration._id,
          eventName: registration.eventName,
          isTeam: registration.isTeam,
          teamName: registration.teamName,
          leaderName,
          totalParticipants: registration.totalParticipants,
          participantsCreated: createdParticipants.length,
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
      const duplicateField = error.keyPattern;
      if (duplicateField?.leaderEmail && duplicateField?.eventName) {
        return NextResponse.json(
          {
            success: false,
            error: "You have already registered for this event.",
          },
          { status: 409 }
        );
      }
      if (duplicateField?.registrationId && duplicateField?.email) {
        return NextResponse.json(
          {
            success: false,
            error: "Duplicate participant email found in the registration.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry detected.",
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
        hint: "Make sure MongoDB is running and properly configured",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch registrations for an event (with populated participants)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventname: string }> }
) {
  try {
    await dbConnect();

    const { eventname } = await params;
    const eventName = decodeURIComponent(eventname);

    // Fetch registrations and populate participants
    const registrations = await Registration.find({ eventName })
      .populate("participants")
      .sort({ createdAt: -1 })
      .lean();

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
