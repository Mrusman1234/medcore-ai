"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Doctor, Patient, TriageMessage } from "@/lib/types";
import { AppointmentBookingModal } from "@/components/booking/AppointmentBookingModal";
import {
  Sparkles,
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Stethoscope,
  Activity,
  AlertTriangle,
  RotateCcw,
  Calendar,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

interface FloatingAITriageProps {
  doctors: Doctor[];
  patients?: Patient[];
}

export function FloatingAITriage({ doctors, patients = [] }: FloatingAITriageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"triage" | "copilot">("triage");
  const [selectedPatientForCopilot, setSelectedPatientForCopilot] = useState<string>(
    patients[0]?.id || "pat_1"
  );

  const [messages, setMessages] = useState<TriageMessage[]>([
    {
      id: "msg_init",
      role: "assistant",
      content:
        "Hello! I am **MedCore AI**, your clinical triage assistant. Tell me what symptoms you're experiencing, and I will evaluate your clinical urgency and match you with the right specialist.",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickChips = [
    "Severe migraine with visual aura",
    "Sharp chest tightness during brisk walking",
    "Red itchy rash on inner arms",
    "Toddler has 101°F fever and dry cough",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: TriageMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const activePatientContext =
        mode === "copilot"
          ? patients.find((p) => p.id === selectedPatientForCopilot)
          : undefined;

      const res = await fetch("/api/ai-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode,
          patientContext: activePatientContext,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Triage processing failed");
      }

      const assistantMessage: TriageMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
        recommendedDoctorId: data.recommendedDoctorId,
        recommendedDoctorName: data.recommendedDoctorName,
        recommendedSpecialty: data.recommendedSpecialty,
        triageUrgency: data.triageUrgency,
        clinicalSummaryPoints: data.clinicalSummaryPoints,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content:
            "Clinical triage server is temporarily busy. Based on routine evaluation, we recommend consulting Dr. David Kim (General Medicine) for initial assessment.",
          timestamp: new Date().toISOString(),
          recommendedDoctorId: "doc_6",
          recommendedDoctorName: "Dr. David Kim",
          recommendedSpecialty: "General Medicine",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: "assistant",
        content:
          mode === "triage"
            ? "Triage session reset. Please describe any symptoms or health concerns."
            : "Doctor Copilot reset. Select a patient above to generate a 3-bullet clinical summary.",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSwitchMode = (newMode: "triage" | "copilot") => {
    setMode(newMode);
    if (newMode === "copilot") {
      setMessages([
        {
          id: `copilot_${Date.now()}`,
          role: "assistant",
          content:
            "**Doctor Copilot Mode Active:** I synthesize patient EHR vitals, medication histories, and allergy cross-checks into 3 concise clinical points.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([
        {
          id: `triage_${Date.now()}`,
          role: "assistant",
          content:
            "**Patient Symptom Triage Active:** Describe your symptoms to find the appropriate clinic specialist.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <>
      {/* 1. Floating Launcher Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 text-white font-bold shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105"
          >
            {/* Glowing Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-40 blur-sm animate-pulse group-hover:opacity-75" />

            <div className="relative w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>

            <div className="relative text-left">
              <span className="block text-xs font-black tracking-tight leading-none">
                MedCore AI
              </span>
              <span className="block text-[9px] font-mono text-cyan-100 opacity-90 leading-tight">
                Clinical Copilot &bull; 24/7
              </span>
            </div>
          </button>
        ) : (
          /* 2. Expanded Chat Drawer Box */
          <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-300 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                    MedCore Clinical Triage
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    Gemini AI Clinical Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close widget"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border-b border-slate-800 gap-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => handleSwitchMode("triage")}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === "triage"
                    ? "bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Stethoscope className="w-3 h-3 text-teal-400" />
                Patient Triage
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode("copilot")}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === "copilot"
                    ? "bg-slate-800 text-teal-300 shadow-sm border border-teal-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Activity className="w-3 h-3 text-cyan-400" />
                Doctor Copilot
              </button>
            </div>

            {/* Patient Context Selector for Doctor Copilot Mode */}
            {mode === "copilot" && patients.length > 0 && (
              <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Patient EHR Context:
                </span>
                <select
                  value={selectedPatientForCopilot}
                  onChange={(e) => setSelectedPatientForCopilot(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2 py-1 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.vitals.systolic}/{p.vitals.diastolic})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-md bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-xl p-3 space-y-2 ${
                        isUser
                          ? "bg-teal-600 text-white rounded-tr-none shadow-sm"
                          : "bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md"
                      }`}
                    >
                      {/* Urgency Badge */}
                      {msg.triageUrgency && (
                        <div className="pb-1">
                          <Badge variant={msg.triageUrgency} className="text-[9px]">
                            {msg.triageUrgency.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                      )}

                      {/* Content formatted with line breaks and markdown styling */}
                      <div className="leading-relaxed whitespace-pre-line text-xs font-sans">
                        {msg.content}
                      </div>

                      {/* Doctor Recommendation Booking Card */}
                      {msg.recommendedDoctorId && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 bg-slate-900/80 rounded-lg p-2.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-teal-400 uppercase">
                              Matched Specialist
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Cal.com Slot
                            </span>
                          </div>
                          <p className="font-bold text-white text-xs">
                            {msg.recommendedDoctorName}
                          </p>
                          <p className="text-[11px] text-cyan-300">
                            {msg.recommendedSpecialty}
                          </p>
                          <Button
                            size="sm"
                            variant="glow"
                            onClick={() => setBookingDoctorId(msg.recommendedDoctorId!)}
                            className="w-full text-xs h-7 mt-1"
                          >
                            <Calendar className="w-3 h-3 mr-1.5" />
                            Book Slot with {msg.recommendedDoctorName?.split(" ")[1] || "Doctor"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pl-8 font-mono">
                  <div className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  Clinical reasoning in progress...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips Suggestion Bar (in Triage mode) */}
            {mode === "triage" && messages.length <= 2 && (
              <div className="px-3 pb-2 pt-1 border-t border-slate-800/60 overflow-x-auto flex gap-1.5 scrollbar-none">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Doctor Copilot 1-Click Action */}
            {mode === "copilot" && (
              <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  Ready to summarize selected patient:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleSend("Please generate the 3-bullet clinical copilot summary for this patient.")
                  }
                  className="px-2.5 py-1 rounded bg-teal-950 border border-teal-700 text-teal-300 text-[10px] font-bold hover:bg-teal-900 transition-colors"
                >
                  ⚡ Generate 3-Point Summary
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  mode === "triage"
                    ? "Describe symptoms (e.g. sharp headache, chest ache)..."
                    : "Ask clinical questions or medication interaction checks..."
                }
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!inputValue.trim() || isLoading}
                className="h-8 px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Appointment Booking Modal if user triggers from inside the chat */}
      <AppointmentBookingModal
        isOpen={bookingDoctorId !== null}
        onClose={() => setBookingDoctorId(null)}
        initialDoctorId={bookingDoctorId || undefined}
        doctors={doctors}
      />
    </>
  );
}
