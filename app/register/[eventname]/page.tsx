import RegistrationForm from "@/components/RegistrationForm";

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
      <RegistrationForm eventName={decodedEventName} />
    </main>
  );
}
