"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Receipt,
  Activity,
  Shield,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Document = {
  id: string;
  name: string;
  category: "lab-reports" | "prescriptions" | "insurance" | "bills";
  uploadDate: string;
  owner: string;
};

type UserData = {
  personalInfo: {
    fullName: string;
    emergencyContacts: { name: string }[];
  };
};

type Category = "lab-reports" | "prescriptions" | "insurance" | "bills" | "all";

/* ---------------- PAGE ---------------- */

export default function VaultPage() {
  const router = useRouter();

  /* -------- MOCK SAFE DATA (replace later with real data) -------- */
  const userData: UserData = {
    personalInfo: {
      fullName: "Self",
      emergencyContacts: [],
    },
  };

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedOwner, setSelectedOwner] = useState("self");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    category: "lab-reports" as Category,
  });

  /* ---------------- DATA ---------------- */

  const owners = [
    { value: "self", label: userData.personalInfo.fullName },
    ...userData.personalInfo.emergencyContacts.map((c, i) => ({
      value: `contact-${i}`,
      label: c.name,
    })),
  ];

  const categories = [
    { id: "lab-reports", label: "Lab Reports", icon: Activity, color: "#309898" },
    { id: "prescriptions", label: "Prescriptions", icon: FileText, color: "#FF8000" },
    { id: "insurance", label: "Insurance", icon: Shield, color: "#309898" },
    { id: "bills", label: "Bills & Receipts", icon: Receipt, color: "#FF8000" },
  ];

  const filteredDocuments = documents
    .filter((d) => d.owner === selectedOwner)
    .filter((d) => selectedCategory === "all" || d.category === selectedCategory)
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() -
        new Date(a.uploadDate).getTime()
    );

  /* ---------------- HANDLERS ---------------- */

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.name) return;

    setDocuments((prev) => [
      {
        id: Date.now().toString(),
        name: uploadData.name,
        category: uploadData.category as Exclude<Category, "all">,
        uploadDate: new Date().toISOString(),
        owner: selectedOwner,
      },
      ...prev,
    ]);

    setUploadData({ name: "", category: "lab-reports" });
    setShowUploadModal(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#309898]/10 via-white to-[#FF8000]/10">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-[#309898] font-bold text-xl">Vytara · Vault</h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-[#FF8000] text-white rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 bg-[#309898] text-white rounded-lg"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2">
          {/* OWNER */}
          <label className="block mb-2 text-[#309898]">Select Person</label>
          <div className="relative mb-6">
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full border-2 border-[#309898]/30 rounded-lg px-4 py-3"
            >
              {owners.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* DOCUMENTS */}
          <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[400px]">
            {filteredDocuments.length === 0 ? (
              <p className="text-center text-gray-500">No documents found</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border p-4 rounded-xl">
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full bg-[#309898] text-white py-3 rounded-xl"
          >
            + Upload Document
          </button>

          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id as Category)}
                className="w-full bg-white p-4 rounded-xl shadow"
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: c.color }}>{c.label}</span>
                  <Icon style={{ color: c.color }} />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleUpload}
            className="bg-white p-6 rounded-2xl w-full max-w-md"
          >
            <h2 className="text-[#309898] font-bold mb-4">Upload Document</h2>

            <input
              value={uploadData.name}
              onChange={(e) =>
                setUploadData({ ...uploadData, name: e.target.value })
              }
              placeholder="Document name"
              className="w-full border p-3 rounded mb-4"
            />

            <select
              value={uploadData.category}
              onChange={(e) =>
                setUploadData({
                  ...uploadData,
                  category: e.target.value as Category,
                })
              }
              className="w-full border p-3 rounded mb-4"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <button className="w-full bg-gradient-to-r from-[#309898] to-[#FF8000] text-white py-3 rounded-lg">
              Upload
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
