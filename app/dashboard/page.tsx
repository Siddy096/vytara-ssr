"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  Stethoscope,
  Pill,
  Activity,
  AlertCircle,
  Sparkles,
  X,
  Phone,
  ChevronRight,
  FileText,
  Trash2,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { AppointmentsModal } from "../../components/AppointmentsModal";

/* -------------------- TYPES -------------------- */

type Appointment = {
  id: string;
  date: string;
  time: string;
  title: string;
};

type UserData = {
  personalInfo: {
    emergencyContacts: { name: string; phone: string; relation: string }[];
  };
  currentMedical: {
    doctors: { name: string; phone: string; speciality: string }[];
    medications: { name: string; dosage: string; frequency: string }[];
    conditions: string[];
  };
};

type Props = {
  userData?: UserData;
  appointments?: Appointment[];
  onAddAppointment: (a: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateEmergencyContacts: (c: any[]) => void;
};

/* -------------------- HELPERS -------------------- */

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

/* -------------------- PAGE -------------------- */

export default function HomePage({
  userData,
  appointments = [],
  onAddAppointment,
  onDeleteAppointment,
  onUpdateEmergencyContacts,
}: Props) {
  const router = useRouter();

  /* ---------- SAFE DATA (CRITICAL FIX) ---------- */
  const safeUserData: UserData = userData ?? {
    personalInfo: { emergencyContacts: [] },
    currentMedical: {
      doctors: [],
      medications: [],
      conditions: [],
    },
  };

  const { emergencyContacts } = safeUserData.personalInfo;
  const { doctors, medications, conditions } = safeUserData.currentMedical;

  /* ---------------- STATE ---------------- */
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSOSAlert, setShowSOSAlert] = useState(false);

  /* ---------------- LOGIC ---------------- */

  const handleGetSummary = () => {
    // Simulated recently uploaded documents
    const uploadedDocs = [
      { id: "1", name: "Blood Test Report.pdf", date: "2024-01-15" },
      { id: "2", name: "Chest X-Ray.pdf", date: "2024-01-14" },
      { id: "3", name: "Lab Results.pdf", date: "2024-01-13" },
    ];
    
    setRecentDocs(uploadedDocs);

    // Simulated comparison with previous summary
    const currentSummary = `📋 AI MEDICAL SUMMARY - LATEST\n\n📊 Recent Documents Analyzed:\n• Blood Test Report (Jan 15) - Complete blood count normal\n• Chest X-Ray (Jan 14) - No abnormalities detected\n• Lab Results (Jan 13) - All values within normal range\n\n✅ Current Status:\n• Hemoglobin: 14.2 g/dL (Normal)\n• White Blood Cells: 7.2 K/uL (Normal)\n• Blood Pressure: 120/80 mmHg (Optimal)\n• No critical allergies\n• Medications stable and effective\n\n📈 Changes from Previous Summary:\n• Improved cholesterol levels (+5%)\n• Blood pressure more stable\n• No new symptoms reported`;

    setSummaryText(currentSummary);
    setShowSummaryModal(true);
  };

  const handleSOS = () => {
    setShowSOSAlert(true);
    // Call emergency services or alert here
    setTimeout(() => setShowSOSAlert(false), 3000);
  };

  const cards = [
    { id: "appointments", title: "Appointments", icon: Calendar },
    { id: "emergency", title: "Emergency Contacts", icon: Users },
    { id: "doctors", title: "Medical Team", icon: Stethoscope },
    { id: "medications", title: "Medications", icon: Pill },
  ];

  const renderModal = () => {
    switch (activeModal) {
      case "appointments":
        return (
          <CalendarView
            appointments={appointments}
            onAddAppointment={onAddAppointment}
            onDeleteAppointment={onDeleteAppointment}
            onClose={() => setActiveModal(null)}
          />
        );
      case "emergency":
        return (
          <EmergencyView
            data={emergencyContacts}
            onDelete={(i: number) =>
              onUpdateEmergencyContacts(
                emergencyContacts.filter((_, idx) => idx !== i)
              )
            }
          />
        );
      case "doctors":
        return <DoctorsView data={doctors} />;
      case "medications":
        return <MedsView data={medications} />;
      default:
        return null;
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <h1 className="font-bold text-2xl text-slate-900">vytara</h1>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleGetSummary}
              className="hidden sm:flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              <Sparkles size={16} /> Get Summary
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-600"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-6 top-16 bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 z-50">
                <button
                  onClick={() => {
                    router.push("/vault");
                    setIsMenuOpen(false);
                  }}
                  className="block px-6 py-3 hover:bg-slate-50 w-full text-left border-b border-slate-200"
                >
                  Vault
                </button>
                <button
                  onClick={() => {
                    router.push("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="block px-6 py-3 hover:bg-slate-50 w-full text-left"
                >
                  Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Side */}
          <div>
            <div className="inline-block bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
              AI-Powered Intelligence
            </div>
            <h2
              className="text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              style={{
                background: `linear-gradient(90deg, #4FD1A6, #FFBF69)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              A Guiding Star for Health and Recovery
            </h2>
            <p className="text-slate-600 text-lg max-w-md">
              A compass for well-being — driven by science, designed with empathy, and built so every person can feel seen, supported, and cared for.
            </p>
          </div>

          {/* Right Side - SOS Button */}
          <div className="relative hidden lg:flex items-center justify-center">
            <button
              onClick={handleSOS}
              className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl flex flex-col items-center justify-center text-white transition transform hover:scale-110"
              title="Emergency SOS"
            >
              <AlertCircle size={64} />
              <span className="text-4xl font-bold mt-4">SOS</span>
            </button>
          </div>
        </div>

        {/* Core Four Section */}
        <div className="mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Core Four</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveModal(c.id)}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition border border-slate-100 group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition">
                    <Icon className="text-teal-600" size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-center">{c.title}</h3>
                  <p className="text-slate-500 text-xs text-center mt-2">View details</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOS ALERT */}
      {showSOSAlert && (
        <div className="fixed top-6 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-pulse font-semibold">
          🚨 SOS Alert Activated
        </div>
      )}

      {/* MODALS */}
      {activeModal && (
        <Modal onClose={() => setActiveModal(null)}>
          {renderModal()}
        </Modal>
      )}

      {showSummaryModal && (
        <Modal onClose={() => setShowSummaryModal(false)}>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">AI Medical Summary</h2>
            
            {/* Recently Uploaded Documents */}
            {recentDocs.length > 0 && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-teal-600" />
                  Recently Uploaded Documents
                </h3>
                <div className="space-y-2">
                  {recentDocs.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                      <span className="text-slate-700">{doc.name}</span>
                      <span className="text-slate-500 text-xs">{doc.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Summary Content */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
                {summaryText}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                Download Summary
              </button>
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------- SHARED MODAL -------------------- */

function Modal({ children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-3xl w-full text-slate-900 relative shadow-2xl border border-slate-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* -------------------- VIEWS -------------------- */

function CalendarView({ appointments, onAddAppointment, onDeleteAppointment, onClose }: any) {
  return (
    <AppointmentsModal
      appointments={appointments}
      onClose={onClose}
      onAddAppointment={onAddAppointment}
      onDeleteAppointment={onDeleteAppointment}
    />
  );
}

function EmergencyView({ data, onDelete }: any) {
  return data.length === 0 ? (
    <p className="text-slate-500">No emergency contacts</p>
  ) : (
    data.map((c: any, i: number) => (
      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg mb-3 hover:bg-slate-100 transition">
        <div>
          <p className="font-bold text-slate-900">{c.name}</p>
          <p className="text-sm text-slate-500">{c.relation} • {c.phone}</p>
        </div>
        <button onClick={() => onDelete(i)} className="p-2 hover:bg-red-50 rounded-lg transition">
          <Trash2 className="text-red-500" size={20} />
        </button>
      </div>
    ))
  );
}

function DoctorsView({ data }: any) {
  return data.length === 0 ? (
    <p className="text-slate-500">No doctors</p>
  ) : (
    data.map((d: any, i: number) => (
      <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3 hover:bg-slate-100 transition">
        <p className="font-bold text-slate-900">{d.name}</p>
        <p className="text-sm text-slate-500">{d.speciality}</p>
      </div>
    ))
  );
}

function MedsView({ data }: any) {
  return data.length === 0 ? (
    <p className="text-slate-500">No medications</p>
  ) : (
    data.map((m: any, i: number) => (
      <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3 hover:bg-slate-100 transition">
        <p className="font-bold text-slate-900">{m.name}</p>
        <p className="text-sm text-slate-500">{m.dosage}</p>
      </div>
    ))
  );
}