"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MedCoreLogo } from "@/components/brand/MedCoreLogo";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  UserCheck,
  Calendar,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  Activity,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handle1ClickLogin = async (role: "admin" | "patient") => {
    try {
      setLoadingRole(role);
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.redirectTo) {
        router.push(data.redirectTo);
      }
    } catch (err) {
      console.error("Demo login failed:", err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <MedCoreLogo size="md" />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/#doctors"
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                Specialists
              </Link>
              <Link
                href="/book"
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                Smart Booking
              </Link>
              <Link
                href="/admin"
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                Doctor Admin
              </Link>
              <Link
                href="/patient"
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                Patient Portal
              </Link>
            </div>
          </div>

          {/* Right Action Bar: System Status + 1-Click Demo Logins */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-medium">AI Triage Active</span>
            </div>

            {/* 1-Click Demo Doctor Admin */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handle1ClickLogin("admin")}
              disabled={loadingRole !== null}
              className="border-teal-500/40 text-teal-300 hover:bg-teal-950/50 hover:text-teal-200 hover:border-teal-400 text-xs font-semibold"
            >
              <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
              {loadingRole === "admin" ? "Logging In..." : "1-Click Demo Doctor"}
            </Button>

            {/* 1-Click Demo Patient */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handle1ClickLogin("patient")}
              disabled={loadingRole !== null}
              className="text-xs font-semibold"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5 text-cyan-200" />
              {loadingRole === "patient" ? "Logging In..." : "1-Click Demo Patient"}
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              href="/#doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Specialist Doctors
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Schedule Appointment
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Doctor / Admin Dashboard
            </Link>
            <Link
              href="/patient"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Patient Health Portal
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Patient Onboarding
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                handle1ClickLogin("admin");
              }}
              className="w-full justify-center text-teal-300 border-teal-500/40"
            >
              <Stethoscope className="w-4 h-4 mr-2 text-teal-400" />
              1-Click Demo Doctor Admin
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                handle1ClickLogin("patient");
              }}
              className="w-full justify-center"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              1-Click Demo Patient
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
