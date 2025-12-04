import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventname: string }> }
) {
  try {
    await dbConnect();

    const { eventname } = await params;
    const eventName = decodeURIComponent(eventname);

    // Get all registrations for this event
    const registrations = await Registration.find({ eventName }).lean();

    // Get participants for all registrations
    const registrationIds = registrations.map((r) => r._id);
    const participants = await Participant.find({
      registrationId: { $in: registrationIds },
    }).lean();

    // Group participants by registration
    const detailedRegistrations = registrations.map((reg) => {
      const regParticipants = participants.filter(
        (p) => p.registrationId.toString() === reg._id.toString()
      );

      return {
        _id: reg._id.toString(),
        eventName: reg.eventName,
        isTeam: reg.isTeam,
        teamName: reg.teamName,
        totalParticipants: reg.totalParticipants,
        participants: regParticipants.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          email: p.email,
          rollNumber: p.rollNumber,
          contactNumber: p.contactNumber,
          gender: p.gender,
          isLeader: p.isLeader,
        })),
        createdAt: reg.createdAt,
      };
    });

    const stats = {
      totalRegistrations: registrations.length,
      individualCount: registrations.filter((r) => !r.isTeam).length,
      teamCount: registrations.filter((r) => r.isTeam).length,
      totalParticipants: registrations.reduce(
        (sum, r) => sum + r.totalParticipants,
        0
      ),
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        registrations: detailedRegistrations,
      },
    });
  } catch (error: any) {
    console.error("Error fetching event details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event details" },
      { status: 500 }
    );
  }
}
