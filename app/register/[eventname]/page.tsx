import Tussle3Form from "@/components/Tussle3Form";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";

interface EventRegistrationProps {
  params: Promise<{
    eventname: string;
  }>;
}

export default async function EventRegistrationPage({
  params,
}: EventRegistrationProps) {
  const { eventname } = await params;
  const decodedSlug = decodeURIComponent(eventname);

  // Fetch the actual event from database to get correct name
  await dbConnect();
  const event = await Event.findOne({
    slug: decodedSlug,
    isActive: true,
  }).lean();

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Tussle3Form eventName={event.name} />
    </main>
  );
}
