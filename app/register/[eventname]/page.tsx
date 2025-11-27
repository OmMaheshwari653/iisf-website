import Tussle3Form from "@/components/Tussle3Form";

interface EventRegistrationProps {
  params: Promise<{
    eventname: string;
  }>;
}

export default async function EventRegistrationPage({
  params,
}: EventRegistrationProps) {
  const { eventname } = await params;
  const decodedEventName = decodeURIComponent(eventname);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {/* Using the new Tussle 3 styled form; eventName currently unused but preserved for future wiring */}
      <Tussle3Form />
    </main>
  );
}
