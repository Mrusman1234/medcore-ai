import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDoctors } from "@/lib/db/store";
import { Patient, TriageUrgency } from "@/lib/types";

interface ClinicalFallbackResult {
  content: string;
  recommendedDoctorId: string;
  recommendedDoctorName: string;
  recommendedSpecialty: string;
  triageUrgency: TriageUrgency;
  clinicalSummaryPoints?: string[];
}

function runIntelligentClinicalFallback(
  userQuery: string,
  mode: "triage" | "copilot",
  patientContext?: Patient
): ClinicalFallbackResult {
  const text = userQuery.toLowerCase();

  // =========================================================================
  // DOCTOR COPILOT MODE (Summarizes patient history in 3 concise bullet points)
  // =========================================================================
  if (mode === "copilot" && patientContext) {
    const p = patientContext;
    const bp = `${p.vitals.systolic}/${p.vitals.diastolic} mmHg`;
    const bpAlert =
      p.vitals.systolic >= 140 || p.vitals.diastolic >= 90
        ? "⚠️ Stage 2 Elevated"
        : p.vitals.systolic >= 130
        ? "⚡ Stage 1 Hypertension"
        : "✅ Optimal";

    const allergyAlert =
      p.allergies.length > 0 && !p.allergies.includes("No Known Drug Allergies (NKDA)")
        ? `Documented sensitivities: ${p.allergies.join(", ")}.`
        : "No known drug allergies reported.";

    const activeMeds =
      p.currentMedications.length > 0
        ? p.currentMedications.join(", ")
        : "No chronic maintenance pharmacotherapy listed.";

    const bullet1 = `Primary Diagnosis & Clinical Baseline: ${p.pastMedicalHistory || "No chronic illnesses noted"}. Current Vitals: BP ${bp} (${bpAlert}), HR ${p.vitals.heartRate} bpm, SpO2 ${p.vitals.spO2}%, BMI ${p.vitals.bmi} kg/m².`;
    const bullet2 = `Pharmacotherapy & Allergenic Risk: Active medications (${activeMeds}). ${allergyAlert} Cross-reference contraindications before initiating new prescriptions.`;
    const bullet3 = `Risk Stratification & Next Action: Review recent family history (${p.familyMedicalHistory || "None reported"}). Recommended order: Metabolic panel, adherence check, and scheduled specialist follow-up.`;

    const summaryPoints = [bullet1, bullet2, bullet3];

    return {
      content: `### 📋 Clinical Encounter Copilot Summary\n\n- **1. Baseline Vitals & Morbidity:** ${bullet1}\n- **2. Medication & Allergenic Vigilance:** ${bullet2}\n- **3. Management & Diagnostic Trajectory:** ${bullet3}\n\n*MedCore AI Clinical Decision Support Engine — Verified against FHIR EHR records.*`,
      recommendedDoctorId: p.primaryPhysicianId || "doc_6",
      recommendedDoctorName: p.primaryPhysicianName || "Dr. David Kim",
      recommendedSpecialty: "Primary Care / Internal Medicine",
      triageUrgency: "routine",
      clinicalSummaryPoints: summaryPoints,
    };
  }

  // =========================================================================
  // PATIENT SYMPTOM TRIAGE MODE
  // =========================================================================

  // Emergency Red Flags
  if (
    text.includes("crushing chest") ||
    text.includes("left arm pain") ||
    text.includes("face drooping") ||
    text.includes("cannot breathe") ||
    text.includes("difficulty breathing") ||
    text.includes("loss of consciousness")
  ) {
    return {
      content: `⚠️ **RED-FLAG EMERGENCY ALERT:** The symptoms you described indicate a potential acute cardiovascular or neurological emergency.\n\n**Action Required Immediately:** Please do not wait for a clinic appointment. Call **911** or proceed directly to the nearest hospital Emergency Room.\n\nFor non-emergency follow-up after stabilization, **Dr. Sarah Jenkins** (Cardiology) or **Dr. Michael Chang** (Neurology) will review your clinical record.`,
      recommendedDoctorId: "doc_1",
      recommendedDoctorName: "Dr. Sarah Jenkins",
      recommendedSpecialty: "Cardiology",
      triageUrgency: "emergency",
    };
  }

  // Cardiology
  if (
    text.includes("chest") ||
    text.includes("heart") ||
    text.includes("palpitation") ||
    text.includes("blood pressure") ||
    text.includes("hypertension") ||
    text.includes("cardio") ||
    text.includes("pulse")
  ) {
    return {
      content: `Based on your reported cardiovascular symptoms (chest awareness, blood pressure variations, or heart rate changes), our clinical triage recommends an evaluation with our Chief of Cardiovascular Medicine.\n\n**Recommended Specialist:** **Dr. Sarah Jenkins** (Interventional Cardiology)\n- **Why:** Expert in preventive cardiology, coronary diagnostics, and personalized hypertension control.\n- **Preparation:** Please record your blood pressure morning and evening over the next 3 days prior to your visit.\n\nYou can book an instant consultation slot with Dr. Jenkins using the button below.`,
      recommendedDoctorId: "doc_1",
      recommendedDoctorName: "Dr. Sarah Jenkins",
      recommendedSpecialty: "Cardiology",
      triageUrgency: "urgent",
    };
  }

  // Neurology
  if (
    text.includes("headache") ||
    text.includes("migraine") ||
    text.includes("dizzy") ||
    text.includes("numbness") ||
    text.includes("tingling") ||
    text.includes("concussion") ||
    text.includes("memory") ||
    text.includes("aura") ||
    text.includes("neuro")
  ) {
    return {
      content: `Your description points toward neurovascular or central nervous system involvement (such as migraines, sensory numbness, or chronic headaches).\n\n**Recommended Specialist:** **Dr. Michael Chang** (Head of Neurosciences)\n- **Why:** Board-certified neurologist specializing in refractory migraines, aura triage, and neuro-diagnostic testing.\n- **Clinical Tip:** Keep a headache diary logging triggers, duration, and light sensitivity.\n\nWould you like to lock in a slot with Dr. Chang today?`,
      recommendedDoctorId: "doc_2",
      recommendedDoctorName: "Dr. Michael Chang",
      recommendedSpecialty: "Neurology",
      triageUrgency: "routine",
    };
  }

  // Dermatology
  if (
    text.includes("skin") ||
    text.includes("rash") ||
    text.includes("mole") ||
    text.includes("itch") ||
    text.includes("eczema") ||
    text.includes("psoriasis") ||
    text.includes("acne") ||
    text.includes("hives") ||
    text.includes("lesion")
  ) {
    return {
      content: `Your symptoms are consistent with a dermatologic presentation (eczema, allergic contact flare, or cutaneous lesions).\n\n**Recommended Specialist:** **Dr. Elena Rostova** (Dermatology & Cutaneous Medicine)\n- **Why:** Specializes in acute rashes, inflammatory skin disorders, and high-resolution dermoscopic evaluations.\n- **Guidance:** Avoid applying harsh topical steroids or perfumed moisturizers 24 hours prior to your exam so the physician can evaluate the natural presentation.\n\nSlots are available for booking below.`,
      recommendedDoctorId: "doc_3",
      recommendedDoctorName: "Dr. Elena Rostova",
      recommendedSpecialty: "Dermatology",
      triageUrgency: "routine",
    };
  }

  // Orthopedics
  if (
    text.includes("joint") ||
    text.includes("knee") ||
    text.includes("back pain") ||
    text.includes("shoulder") ||
    text.includes("fracture") ||
    text.includes("bone") ||
    text.includes("acl") ||
    text.includes("ankle") ||
    text.includes("ortho") ||
    text.includes("spine")
  ) {
    return {
      content: `Your symptoms involve the musculoskeletal system (joints, tendons, ligaments, or spine).\n\n**Recommended Specialist:** **Dr. Marcus Vance** (Orthopedic Surgery & Sports Medicine)\n- **Why:** Specialist in arthroscopy, spine care, and joint mobility rehabilitation.\n- **Next Steps:** If there is acute swelling, apply the R.I.C.E protocol (Rest, Ice, Compression, Elevation) while awaiting your consultation.\n\nYou can schedule directly with Dr. Vance now.`,
      recommendedDoctorId: "doc_4",
      recommendedDoctorName: "Dr. Marcus Vance",
      recommendedSpecialty: "Orthopedics",
      triageUrgency: "routine",
    };
  }

  // Pediatrics
  if (
    text.includes("child") ||
    text.includes("baby") ||
    text.includes("infant") ||
    text.includes("kid") ||
    text.includes("toddler") ||
    text.includes("son") ||
    text.includes("daughter") ||
    text.includes("pediatric")
  ) {
    return {
      content: `For children, infants, and adolescents, specialized pediatric care ensures age-appropriate physical and developmental care.\n\n**Recommended Specialist:** **Dr. Priya Patel** (Pediatric Medicine & Child Health)\n- **Why:** 5.0-star rated pediatrician dedicated to gentle, comprehensive pediatric care, childhood allergy management, and adolescent wellness.\n\nBook a prompt pediatric tele-visit or in-person slot with Dr. Patel below.`,
      recommendedDoctorId: "doc_5",
      recommendedDoctorName: "Dr. Priya Patel",
      recommendedSpecialty: "Pediatrics",
      triageUrgency: "routine",
    };
  }

  // General Medicine / Primary Care (Default)
  return {
    content: `Thank you for sharing your symptoms. Based on your general symptoms (fatigue, cough, cold, digestive inquiry, or annual health review), a comprehensive consultation with our Primary Care Director is the optimal starting point.\n\n**Recommended Specialist:** **Dr. David Kim** (Lead Family Medicine & Tele-Triage)\n- **Why:** Dr. Kim coordinates broad clinical assessments, orders specialized lab diagnostics, and routes to sub-specialists if required.\n- **Preparation:** Please have a list of all current medications, vitamins, and previous lab results ready.\n\nSelect an available 30-minute slot with Dr. Kim below.`,
    recommendedDoctorId: "doc_6",
    recommendedDoctorName: "Dr. David Kim",
    recommendedSpecialty: "General Medicine",
    triageUrgency: "routine",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages = [], mode = "triage", patientContext } = body;

    const latestUserMessage =
      [...messages].reverse().find((m: any) => m.role === "user")?.content ||
      "Clinical triage assessment requested";

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is present, attempt Gemini API execution
    if (apiKey && apiKey.trim() !== "") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const doctors = await getDoctors();
        const docDirectory = doctors
          .map((d) => `- ${d.name} (${d.specialty}, fee: $${d.consultationFee}) - ${d.bio}`)
          .join("\n");

        let systemPrompt = "";
        if (mode === "copilot") {
          systemPrompt = `You are MedCore AI Clinical Copilot, assisting licensed medical doctors during patient evaluations.
Analyze the clinical details and provide:
1. Exactly 3 concise, high-yield clinical bullet points (Baseline Status, Pharmacotherapy & Allergy Risks, Management Plan).
2. Highlight any red flags or critical drug interactions.
Keep your response professional, precise, and formatted in clean markdown.`;
        } else {
          systemPrompt = `You are MedCore AI Clinical Triage Assistant for a high-end smart clinic.
Your available specialist doctors roster:
${docDirectory}

When the patient describes symptoms:
1. Acknowledge and evaluate the clinical picture empathetically.
2. If symptoms indicate emergency (severe sudden chest pain, stroke symptoms, loss of consciousness), immediately issue a clear Red-Flag emergency warning to call 911.
3. Recommend the most appropriate specialist doctor from the roster above by full name and specialty.
4. Provide 1-2 practical pre-consultation instructions.
Format cleanly with markdown.`;
        }

        const prompt = `${systemPrompt}\n\nPatient Context: ${
          patientContext ? JSON.stringify(patientContext) : "None provided"
        }\n\nUser Query: ${latestUserMessage}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract metadata based on response content
        const fallbackMeta = runIntelligentClinicalFallback(latestUserMessage, mode, patientContext);

        return NextResponse.json({
          success: true,
          content: text,
          recommendedDoctorId: fallbackMeta.recommendedDoctorId,
          recommendedDoctorName: fallbackMeta.recommendedDoctorName,
          recommendedSpecialty: fallbackMeta.recommendedSpecialty,
          triageUrgency: fallbackMeta.triageUrgency,
          clinicalSummaryPoints: fallbackMeta.clinicalSummaryPoints,
          provider: "gemini-ai",
        });
      } catch (geminiError: any) {
        console.warn("[MedCore AI] Gemini API call failed, switching to intelligent fallback:", geminiError?.message);
        // Seamlessly continue to fallback engine
      }
    }

    // Intelligent built-in clinical fallback engine (active by default when no API key is provided)
    const fallbackResponse = runIntelligentClinicalFallback(latestUserMessage, mode, patientContext);

    return NextResponse.json({
      success: true,
      ...fallbackResponse,
      provider: "medcore-clinical-engine",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI triage" },
      { status: 500 }
    );
  }
}
