export interface MedicalInfo {
  [key: string]: any;
}

export interface UserData {
  username: string;
  email?: string;
  password?: string;
  medicalInfo?: MedicalInfo;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    height?: string;
    weight?: string;
    contactNumber: string;
    emergencyContacts: { name: string; phone: string; relation: string }[];
  };
  currentMedical: {
    conditions: string[];
    medications: { name: string; dosage: string; frequency: string; course?: string; purpose?: string }[];
    allergies: string[];
    treatments: string[];
    doctors: { name: string; phone: string; speciality: string }[];
  };
  pastMedical: {
    diseases: string[];
    surgeries: { name: string; date?: string }[];
    hospitalizations: { reason: string; date?: string }[];
    injuries: string[];
    childhoodIllnesses: string[];
    pastMedications: string[];
    longTermTreatments: string[];
  };
  familyHistory: { disease: string; relation: string; age?: string; deceased?: boolean; conditions?: string[] }[];
}

export interface DisplayUser extends UserData {
  isMock?: boolean;
}

export interface Document {
  id: string;
  name: string;
  category: 'lab-reports' | 'prescriptions' | 'insurance' | 'bills';
  uploadDate: string;
  owner: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  title: string;
  type?: 'consultation' | 'follow-up' | 'test/scan' | 'procedure' | 'other';
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  expiryDate: string;
}
