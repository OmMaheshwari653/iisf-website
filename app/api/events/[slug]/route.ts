import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";
import { deleteImage } from "@/lib/cloudinary";
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const event = await Event.findOne({ slug: decodedSlug }).lean();
    if (!event) {
      return notFoundResponse("Event not found");
    }

    const registrations = await Registration.find({ eventName: event.name }).lean();
    const registrationIds = registrations.map((r) => r._id);

    const participants = await Participant.find({
      registrationId: { $in: registrationIds },
    }).lean();

    const detailedRegistrations = registrations.map((reg) => ({
      _id: reg._id.toString(),
      eventName: reg.eventName,
      isTeam: reg.isTeam,
      teamName: reg.teamName,
      totalParticipants: reg.totalParticipants,
      createdAt: reg.createdAt,
      participants: participants
        .filter((p) => p.registrationId.toString() === reg._id.toString())
        .map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          email: p.email,
          rollNumber: p.rollNumber,
          contactNumber: p.contactNumber,
          gender: p.gender,
          isLeader: p.isLeader,
        })),
    }));

    const stats = {
      totalRegistrations: registrations.length,
      individualCount: registrations.filter((r) => !r.isTeam).length,
      teamCount: registrations.filter((r) => r.isTeam).length,
      totalParticipants: registrations.reduce(
        (sum, r) => sum + r.totalParticipants,
        0,
      ),
    };

    return successResponse({ stats, registrations: detailedRegistrations });
  } catch (error) {
    return handleApiError(error, "fetching event details");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    await dbConnect();

    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const event = await Event.findOne({ slug: decodedSlug });
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Delete image from Cloudinary if exists
    if (event.image) {
      const urlParts = event.image.split("/");
      const publicIdWithExt = urlParts.slice(-2).join("/").split(".")[0];
      if (publicIdWithExt) {
        await deleteImage(publicIdWithExt);
      }
    }

    const registrations = await Registration.find({ eventName: event.name }).lean();
    const registrationIds = registrations.map((r) => r._id);

    await Participant.deleteMany({ registrationId: { $in: registrationIds } });
    await Registration.deleteMany({ eventName: event.name });
    await Event.deleteOne({ _id: event._id });

    return successResponse(
      {
        deletedEvent: event.name,
        deletedRegistrations: registrations.length,
      },
      "Event and all registrations deleted successfully",
    );
  } catch (error) {
    return handleApiError(error, "deleting event");
  }
}
