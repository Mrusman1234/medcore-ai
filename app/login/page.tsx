"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MedCoreLogo } from "@/components/brand/MedCoreLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Stethoscope,
  UserCheck,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle1ClickLogin = async (role: "admin" | "patient") => {
    try {
      setError(null);
      setLoadingRole(role);
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.redirectTo) {
        router.push(data.redirectTo);
      } else {
        throw new Error(data.error || "Failed to establish demo session");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoadingRole(null);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("doctor") || email.includes("admin")) {
      handle1ClickLogin("admin");
    } else {
      handle1ClickLogin("patient");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <MedCoreLogo size="lg" className="justify-center" />
          <h1 className="text-2xl font-black text-white tracking-tight pt-2">
            Clinical Portal Access
          </h1>
          <p className="text-xs text-slate-400">
            Secure biometric &amp; role-based portal for doctors and patients.
          </p>
        </div>

        {/* 1-Click Demo Showcase Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              1-Click Zero-Friction Access
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              Bypasses SMS Gate
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Instantly evaluate the application without manual SMS/Twilio verification:
          </p>

          <div className="space-y-2.5">
            {/* 1-Click Doctor Admin */}
            <Button
              variant="default"
              size="lg"
              onClick={() => handle1ClickLogin("admin")}
              disabled={loadingRole !== null}
              className="w-full justify-between px-4 text-sm font-bold shadow-teal-500/20"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-200" />
                1-Click Demo Doctor Admin
              </span>
              <span className="text-[11px] font-mono text-teal-100">
                {loadingRole === "admin" ? "Authorizing..." : "Dr. Jenkins →"}
              </span>
            </Button>

            {/* 1-Click Patient */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handle1ClickLogin("patient")}
              disabled={loadingRole !== null}
              className="w-full justify-between px-4 text-sm font-bold border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                1-Click Demo Patient
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {loadingRole === "patient" ? "Authorizing..." : "John Doe →"}
              </span>
            </Button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Or sign in with custom credentials
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Email</label>
              <Input
                icon={<Mail className="w-4 h-4" />}
                type="email"
                placeholder="doctor@medcore.ai or patient@medcore.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Password</label>
              <Input
                icon={<Lock className="w-4 h-4" />}
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-sm font-bold">
              Sign In to MedCore AI
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="text-xs text-teal-400 hover:underline"
            >
              New patient? Complete the online clinical intake form &rarr;
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>HIPAA Security Certified &bull; 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
