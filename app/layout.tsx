import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingAITriage } from "@/components/ai/FloatingAITriage";
import { getDoctors, getPatients } from "@/lib/db/store";

export const metadata: Metadata = {
  title: "MedCore AI — Smart Clinic & Telemedicine Platform",
  description:
    "Enterprise-grade healthcare platform featuring Cal.com conflict-free scheduling, Medplum FHIR electronic health records, digital prescriptions, and Gemini AI clinical triage.",
  keywords: [
    "MedCore AI",
    "Telemedicine",
    "Healthcare SaaS",
    "Cal.com Scheduling",
    "Medplum FHIR EHR",
    "Gemini Clinical Triage",
    "Digital Prescriptions",
  ],
  authors: [{ name: "MedCore AI Clinical Team" }],
  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctors = await getDoctors();
  const patients = await getPatients();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Global Floating Gemini AI Clinical Triage & Doctor Copilot */}
        <FloatingAITriage doctors={doctors} patients={patients} />
      </body>
    </html>
  );
}
