import React from "react";
import Link from "next/link";
import { MedCoreLogo } from "@/components/brand/MedCoreLogo";
import { ShieldCheck, PhoneCall, AlertTriangle, Lock, Award, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Emergency Disclaimer Banner */}
      <div className="bg-rose-950/40 border-b border-rose-900/40 px-4 py-3 text-center text-xs text-rose-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Medical Emergency Disclaimer:</strong> If you are experiencing acute chest pain, sudden numbness, severe breathing difficulty, or loss of consciousness, do not book an online slot. Call <strong>911</strong> or visit the nearest emergency facility immediately.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <MedCoreLogo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              MedCore AI integrates Cal.com conflict-free appointment scheduling, Medplum FHIR Electronic Health Records, and Gemini-powered clinical triage into a modern telehealth ecosystem.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-teal-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                HIPAA Certified
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Clinical Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Specialized Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/book?specialty=Cardiology" className="hover:text-cyan-400 transition-colors">
                  Interventional Cardiology
                </Link>
              </li>
              <li>
                <Link href="/book?specialty=Neurology" className="hover:text-cyan-400 transition-colors">
                  Neurology &amp; Stroke Care
                </Link>
              </li>
              <li>
                <Link href="/book?specialty=Dermatology" className="hover:text-cyan-400 transition-colors">
                  Dermatology &amp; Cutaneous Health
                </Link>
              </li>
              <li>
                <Link href="/book?specialty=Orthopedics" className="hover:text-cyan-400 transition-colors">
                  Orthopedic Surgery &amp; Sports
                </Link>
              </li>
              <li>
                <Link href="/book?specialty=Pediatrics" className="hover:text-cyan-400 transition-colors">
                  Pediatrics &amp; Child Health
                </Link>
              </li>
              <li>
                <Link href="/book?specialty=General+Medicine" className="hover:text-cyan-400 transition-colors">
                  Family Medicine &amp; Virtual Triage
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/book" className="hover:text-teal-400 transition-colors">
                  30-Min Conflict-Free Booking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors">
                  Doctor &amp; Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/patient" className="hover:text-teal-400 transition-colors">
                  Patient Health Records &amp; Rx
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-400 transition-colors">
                  Patient Clinical Onboarding
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  Dual 1-Click Demo Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">
              24/7 Virtual Clinic
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>+1 (800) MED-CORE (Toll-Free)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Staffed around the clock by licensed clinical triage specialists and automated Gemini AI copilots.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                  <span>Serving 50 States via Telehealth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} MedCore AI — Smart Clinic &amp; Telemedicine Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>HIPAA Compliant</span>
            <span>&bull;</span>
            <span>FHIR v4 Standard</span>
            <span>&bull;</span>
            <span>Zero-Error Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
