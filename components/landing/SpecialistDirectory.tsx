"use client";

import React from "react";
import Image from "next/image";
import { Doctor } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Star, Clock, Calendar, CheckCircle, ShieldCheck } from "lucide-react";

interface SpecialistDirectoryProps {
  doctors: Doctor[];
  onSelectDoctor: (doctorId: string) => void;
}

export function SpecialistDirectory({
  doctors,
  onSelectDoctor,
}: SpecialistDirectoryProps) {
  return (
    <section id="doctors" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-teal-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Board-Certified Medical Faculty
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Meet Our Specialist Physicians
          </h2>
          <p className="text-sm text-slate-400">
            Choose from top medical directors across major disciplines. Lock in a guaranteed conflict-free consultation slot in under 60 seconds.
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            return (
              <div
                key={doctor.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-teal-500/50 transition-all duration-300 p-6 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-2xl hover:shadow-teal-950/40 group"
              >
                <div className="space-y-4">
                  {/* Photo & Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-teal-500/30 group-hover:border-cyan-400 transition-colors shrink-0">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-950 text-teal-300 border border-teal-800/80 mb-1">
                        {doctor.specialty}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {doctor.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Fee Pill Bar */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doctor.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({doctor.reviewCount})
                      </span>
                    </div>
                    <div className="text-slate-300 font-semibold">
                      ${doctor.consultationFee}{" "}
                      <span className="text-[10px] text-slate-500 font-normal">
                        / 30 min
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {doctor.bio}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>30-Min Open Slots</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectDoctor(doctor.id)}
                    className="text-xs font-semibold"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Book Slot
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
