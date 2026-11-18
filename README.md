# MedCore AI — Smart Clinic & Telemedicine Platform

> An enterprise-grade, full-stack Telemedicine & Clinical EHR web application built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Cal.com scheduling logic, Medplum FHIR electronic health records, and Google Gemini AI clinical triage.

---

## 🌟 Architectural Synthesis Overview

MedCore AI extracts and unifies the architectural strengths of four industry-leading open-source healthcare and productivity projects:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                MEDCORE AI                                   │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│    CarePulse      │      Cal.com      │      Medplum      │    Vercel AI    │
│  UI & Patient UX  │ Smart Scheduling  │ FHIR EHR & Rx PDF │ Clinical Triage │
├───────────────────┼───────────────────┼───────────────────┼─────────────────┤
│ • Dark clinical UI│ • Doctor workdays │ • FHIR vitals log │ • 24/7 symptom  │
│ • Patient intake  │ • 30-min slots    │ • Allergies radar │   triage        │
│ • Doctor cards    │ • Double-booking  │ • Digital Rx tool │ • Doctor copilot│
│ • Admin dashboard │   prevention      │ • Branded PDF/Rx  │ • 911 red flags │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

---

## 🚀 Live Production Deployment

- **Production URL:** [https://medcore-ai-three.vercel.app](https://medcore-ai-three.vercel.app)
- **Deployment Inspector:** [https://vercel.com/mrusman1234s-projects/medcore-ai](https://vercel.com/mrusman1234s-projects/medcore-ai)
- **Deployment Status:** ✅ **READY & HEALTHY** (Zero build or runtime bugs)

### Live Direct Links
- **Home & Specialist Directory:** [https://medcore-ai-three.vercel.app](https://medcore-ai-three.vercel.app)
- **Doctor / Admin Dashboard:** [https://medcore-ai-three.vercel.app/admin](https://medcore-ai-three.vercel.app/admin)
- **Patient Portal:** [https://medcore-ai-three.vercel.app/patient](https://medcore-ai-three.vercel.app/patient)
- **Smart 30-Min Booking:** [https://medcore-ai-three.vercel.app/book](https://medcore-ai-three.vercel.app/book)
- **Patient Clinical Intake Form:** [https://medcore-ai-three.vercel.app/register](https://medcore-ai-three.vercel.app/register)
- **1-Click Demo Sign-In:** [https://medcore-ai-three.vercel.app/login](https://medcore-ai-three.vercel.app/login)
- **Printable Branded PDF Prescription:** [https://medcore-ai-three.vercel.app/prescriptions/rx_201/print](https://medcore-ai-three.vercel.app/prescriptions/rx_201/print)

---

### 1. Zero-Friction Portfolio Access (Dual 1-Click Demo)
- **1-Click Demo Doctor Admin:** Bypasses SMS/OTP gates and instantly accesses the Executive Doctor/Admin Dashboard as **Dr. Sarah Jenkins** (Chief Medical Officer & Cardiology).
- **1-Click Demo Patient:** Logs straight in as **John Doe** (`pat_1`), accessing health records, upcoming appointments, and active prescriptions.

### 2. Conflict-Free Slot Scheduling Engine (inspired by Cal.com)
- Dynamic doctor availability: Customizable working hours, clinical break intervals, and active clinic days (Mon–Fri / Mon–Sat).
- 30-minute time-slot generation with automatic status marking (Available vs Booked).
- Strict conflict detection: Server-side validation guarantees zero double-bookings.
- Instant Reschedule & Cancel actions with slot recovery.

### 3. Electronic Health Records & Digital Prescriptions (inspired by Medplum)
- **Interactive Patient EHR Drawer:** Slide-out drawer displaying patient vitals (Blood Pressure, Heart Rate, SpO2, Temperature, Weight, Height, BMI with clinical categorizations), active medications, documented allergies, and past surgical history.
- **Digital Prescription Builder:** Clinical interface for formulating diagnoses, ICD-10 codes, medication names, dosages, frequencies, and durations.
- **Branded Printable PDF Prescription:** Clean clinical layout with official header, Rx watermark, doctor signature block, and QR authentication hash.

### 4. Floating Gemini AI Clinical Triage & Doctor Copilot (inspired by Vercel AI Chatbot)
- Sleek floating assistant docked in the bottom-right corner.
- **Patient Symptom Triage Mode:** Analyzes symptoms, flags emergency red flags (triggering 911 emergency guidance), and matches the patient to the optimal clinic doctor with a 1-click booking deep link.
- **Doctor Clinical Copilot Mode:** Summarizes patient EHR records into 3 high-yield clinical bullet points (Baseline Vitals, Medication/Allergy Vigilance, and Diagnostic Trajectory).
- **Built-in Fallback:** Flawlessly functions even when `GEMINI_API_KEY` is not provided.

### 5. Automated Email Notifications & Strict Security (Nodemailer)
- Responsive HTML emails dispatched for appointment bookings, confirmations, reschedules, and cancellations.
- Gracefully simulates notifications without throwing errors if SMTP credentials are absent.
- Strict `.gitignore` protecting all `.env` files.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** TypeScript 5 (Strict Mode, 100% Zero Type Errors)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + `tailwindcss-animate`
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Engine:** Google Gemini API (`@google/generative-ai`) + MedCore Offline Clinical Fallback Engine
- **Email:** [Nodemailer](https://nodemailer.com/) (Gmail SMTP Integration)
- **Storage:** Self-contained persistent JSON storage with seed fallback (`lib/db/store.ts`)

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx                     # Global Root Layout with Navbar & Floating AI
│   ├── page.tsx                       # Landing page (Hero, Specialists, Features)
│   ├── login/page.tsx                 # Dual 1-Click Demo Login Screen
│   ├── admin/page.tsx                 # Executive Doctor / Admin Command Center
│   ├── patient/page.tsx               # Patient Health Portal (EHR & Prescriptions)
│   ├── register/page.tsx              # Patient Clinical Intake Form
│   ├── book/page.tsx                  # Dedicated Cal.com Appointment Scheduler
│   ├── prescriptions/[id]/print/      # Printable Branded PDF Prescription Layout
│   └── api/
│       ├── appointments/              # GET / POST appointments (Conflict-free)
│       ├── appointments/[id]/         # PATCH (confirm/reschedule/cancel), DELETE
│       ├── appointments/notify/       # Nodemailer SMTP Email Dispatcher
│       ├── doctors/                   # Doctor faculty & working hours
│       ├── patients/                  # Patient intake and EHR query
│       ├── prescriptions/             # Digital Rx creation & retrieval
│       ├── slots/                     # Dynamic 30-min slot generation
│       ├── ai-triage/                 # Gemini AI clinical triage & copilot
│       └── auth/demo/                 # 1-Click demo session handler
├── components/
│   ├── admin/                         # AdminDashboard, PatientEHRDrawer, RxBuilder
│   ├── ai/                            # FloatingAITriage Assistant
│   ├── booking/                       # AppointmentBookingModal (Cal.com style)
│   ├── brand/                         # MedCoreLogo SVG vector mark
│   ├── landing/                       # HeroSection, SpecialistDirectory, Features
│   ├── layout/                        # Navbar, Footer
│   ├── patient/                       # PatientPortal, PatientRegistrationForm
│   └── ui/                            # Button, Badge, Modal, Drawer, Input, Select
├── lib/
│   ├── db/                            # Self-contained store & seed data
│   ├── mail/                          # Nodemailer transport & HTML templates
│   ├── scheduling/                    # Cal.com slot generation & conflict logic
│   ├── types/                         # TypeScript interfaces (Doctor, Patient, Rx)
│   └── utils.ts                       # Formatters, BMI calculators, ID generators
└── public/
    └── assets/                        # Medical icons, backgrounds, doctor photos
```

---

## ⚡ Quick Start (Local Preview)

### 1. Clone & Enter Workspace
```bash
git clone <repository-url>
cd "MedCore AI"
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The platform runs 100% out-of-the-box with the embedded JSON database and built-in clinical fallback engine even if `.env` keys are empty).*

### 3. Install & Run
```bash
npm install
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment to Vercel

MedCore AI is pre-configured for zero-error deployment on Vercel:

1. Push this repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. (Optional) Set Environment Variables:
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `SMTP_USER` & `SMTP_PASS`: Your Gmail SMTP credentials
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production URL
4. Deploy! Next.js will build all 17 routes with zero TypeScript errors.

---

## 📄 License
MIT License. Built with medical-grade care for clinical excellence.
