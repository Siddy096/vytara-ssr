"use client";

import { useRouter } from "next/navigation";
import { VaultPage } from "@/components/VaultPage";

// TEMP mock data (replace later with DB)
const mockUser = {
  personalInfo: {
    fullName: "Demo User",
    emergencyContacts: [],
  },
  currentMedical: {
    doctors: [],
    medications: [],
  },
};

export default function Page() {
  const router = useRouter();

  return (
    <VaultPage
      userData={mockUser as any}
      documents={[]}
      onAddDocument={() => {}}
      onDeleteDocument={() => {}}
      onNavigateToHome={() => router.push("/home")}
      onNavigateToProfile={() => router.push("/profile")}
    />
  );
}
