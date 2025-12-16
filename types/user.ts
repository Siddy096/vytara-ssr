export type UserData = {
  username: string;
  email: string;

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
