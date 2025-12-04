import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";

export async function GET() {
  try {
    await dbConnect();

    // Get all events
    const events = await Event.find({ isActive: true });

    // Get stats for each event
    const statsPromises = events.map(async (event) => {
      const registrations = await Registration.find({ eventName: event.name });

      const individualCount = registrations.filter((r) => !r.isTeam).length;
      const teamCount = registrations.filter((r) => r.isTeam).length;
      const totalParticipants = registrations.reduce(
        (sum, r) => sum + r.totalParticipants,
        0
      );

      return {
        eventName: event.name,
        totalRegistrations: registrations.length,
        individualCount,
        teamCount,
        totalParticipants,
      };
    });

    const stats = await Promise.all(statsPromises);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
