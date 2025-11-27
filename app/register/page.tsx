import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <RegistrationForm eventName="Hackathon 2025" />
    </main>
  );
}
