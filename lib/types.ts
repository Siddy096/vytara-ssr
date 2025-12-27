export interface MedicalInfo {
  [key: string]: any;
}

export type UserData = {
  username: string;
  email: string;
  password?: string;

  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    height: string;
    weight: string;
    contactNumber: string;
    emergencyContacts: {
      name: string;
      phone: string;
      relation: string;
    }[];
  };

  currentMedical: {
    conditions: string[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      course: string;
      purpose: string;
    }[];
    allergies: string[];
    treatments: string[];
    doctors: {
      name: string;
      phone: string;
      speciality: string;
    }[];
  };

  pastMedical: {
    diseases: string[];
    surgeries: { name: string; date: string }[];
    hospitalizations: { reason: string; date: string }[];
    injuries: string[];
    childhoodIllnesses: string[];
    pastMedications: string[];
    longTermTreatments: string[];
  };

  familyHistory: {
    disease: string;
    relation: string;
  }[];
};

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
  type: string;
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  expiryDate: string;
}
