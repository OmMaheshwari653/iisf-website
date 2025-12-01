import RegistrationForm from "@/components/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tussle 3 Registration | IISF",
    description: "Register for Tussle 3 event at IISF",
};

export default function Tussle3RegistrationPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Tussle 3.0
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Join the ultimate competition. Register now to participate!
                    </p>
                </div>
                <RegistrationForm eventName="Tussle 3.0" />
            </div>
        </div>
    );
}
