import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { UserData } from '../App';
import logoImage from 'figma:asset/3356ef9e7b4ecad1a9839c039785983e296f414d.png';

type Props = {
  onComplete: (data: UserData) => void;
  onClose?: () => void;
  initialData?: UserData;
  initialSection?: number;
};

export function MedicalInfoForm({ onComplete, onClose, initialData, initialSection }: Props) {
  const [currentSection, setCurrentSection] = useState(initialSection || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Section 1: Basic Personal Information
  const [personalInfo, setPersonalInfo] = useState(
    initialData?.personalInfo || {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      height: '',
      weight: '',
      contactNumber: '',
      emergencyContacts: [{ name: '', phone: '', relation: '' }],
    }
  );

  // Section 2: Current Medical Status
  const [currentMedical, setCurrentMedical] = useState(
    initialData?.currentMedical || {
      conditions: [''],
      medications: [{ name: '', dosage: '', frequency: '', course: '', purpose: '' }],
      allergies: [''],
      treatments: [''],
      doctors: [{ name: '', phone: '', speciality: '' }],
    }
  );

  // Section 3: Past Medical History
  const [pastMedical, setPastMedical] = useState(
    initialData?.pastMedical || {
      diseases: [''],
      surgeries: [{ name: '', date: '' }],
      hospitalizations: [{ reason: '', date: '' }],
      injuries: [''],
      childhoodIllnesses: [''],
      pastMedications: [''],
      longTermTreatments: [''],
    }
  );

  // Section 4: Family Medical History
  const [familyHistory, setFamilyHistory] = useState(
    initialData?.familyHistory && initialData.familyHistory.length > 0
      ? initialData.familyHistory
      : [{ disease: '', relation: '' }]
  );

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const calculateBMI = (height: string, weight: string) => {
    if (!height || !weight) return '';

    const weightKg = parseFloat(weight.replace(/[^\d.]/g, ''));
    if (isNaN(weightKg) || weightKg <= 0) return '';

    const heightCm = parseFloat(height.replace(/[^\d.]/g, ''));
    if (isNaN(heightCm) || heightCm <= 0) return '';

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const validateSection = (section: number) => {
    const newErrors: Record<string, string> = {};

    if (section === 1) {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!personalInfo.gender) newErrors.gender = 'Gender is required';
      if (!personalInfo.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!personalInfo.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
      else if (!validatePhoneNumber(personalInfo.contactNumber)) newErrors.contactNumber = 'Please enter a valid 10-digit phone number';

      // Validate emergency contact phone numbers
      personalInfo.emergencyContacts.forEach((contact, index) => {
        if (contact.phone.trim() && !validatePhoneNumber(contact.phone)) {
          newErrors[`emergencyPhone${index}`] = `Emergency contact ${index + 1}: Please enter a valid 10-digit phone number`;
        }
      });
    }

    if (section === 2) {
      // Validate doctor phone numbers
      currentMedical.doctors.forEach((doctor, index) => {
        if (doctor.phone.trim() && !validatePhoneNumber(doctor.phone)) {
          newErrors[`doctorPhone${index}`] = `Doctor ${index + 1}: Please enter a valid 10-digit phone number`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 4) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    const data: UserData = {
      username: initialData?.username || '',
      email: initialData?.email || '',
      personalInfo: {
        ...personalInfo,
        emergencyContacts: personalInfo.emergencyContacts.filter(c => c.name && c.phone && c.relation),
      },
      currentMedical: {
        conditions: currentMedical.conditions.filter(c => c.trim()),
        medications: currentMedical.medications.filter(m => m.name.trim() && m.dosage.trim() && m.frequency.trim() && m.course.trim() && m.purpose.trim()),
        allergies: currentMedical.allergies.filter(a => a.trim()),
        treatments: currentMedical.treatments.filter(t => t.trim()),
        doctors: currentMedical.doctors.filter(d => d.name.trim() && d.phone.trim()),
      },
      pastMedical: {
        diseases: pastMedical.diseases.filter(d => d.trim()),
        surgeries: pastMedical.surgeries.filter(s => s.name.trim()),
        hospitalizations: pastMedical.hospitalizations.filter(h => h.reason.trim()),
        injuries: pastMedical.injuries.filter(i => i.trim()),
        childhoodIllnesses: pastMedical.childhoodIllnesses.filter(c => c.trim()),
        pastMedications: pastMedical.pastMedications.filter(m => m.trim()),
        longTermTreatments: pastMedical.longTermTreatments.filter(t => t.trim()),
      },
      familyHistory: familyHistory.filter(f => f.disease.trim() && f.relation.trim()),
    };
    
    onComplete(data);
  };

  const addEmergencyContact = () => {
    if (personalInfo.emergencyContacts.length < 5) {
      setPersonalInfo({
        ...personalInfo,
        emergencyContacts: [...personalInfo.emergencyContacts, { name: '', phone: '', relation: '' }],
      });
    }
  };

  const removeEmergencyContact = (index: number) => {
    const newContacts = personalInfo.emergencyContacts.filter((_, i) => i !== index);
    setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
  };

  const removeCondition = (index: number) => {
    const newConditions = currentMedical.conditions.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, conditions: newConditions });
  };

  const removeMedication = (index: number) => {
    const newMedications = currentMedical.medications.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, medications: newMedications });
  };

  const removeAllergy = (index: number) => {
    const newAllergies = currentMedical.allergies.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, allergies: newAllergies });
  };

  const removeTreatment = (index: number) => {
    const newTreatments = currentMedical.treatments.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, treatments: newTreatments });
  };

  const removeDoctor = (index: number) => {
    const newDoctors = currentMedical.doctors.filter((_, i) => i !== index);
    setCurrentMedical({ ...currentMedical, doctors: newDoctors });
  };

  const removeDisease = (index: number) => {
    const newDiseases = pastMedical.diseases.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, diseases: newDiseases });
  };

  const removeSurgery = (index: number) => {
    const newSurgeries = pastMedical.surgeries.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, surgeries: newSurgeries });
  };

  const removeHospitalization = (index: number) => {
    const newHospitalizations = pastMedical.hospitalizations.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, hospitalizations: newHospitalizations });
  };

  const removeInjury = (index: number) => {
    const newInjuries = pastMedical.injuries.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, injuries: newInjuries });
  };

  const removeChildhoodIllness = (index: number) => {
    const newIllnesses = pastMedical.childhoodIllnesses.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, childhoodIllnesses: newIllnesses });
  };

  const removePastMedication = (index: number) => {
    const newMedications = pastMedical.pastMedications.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, pastMedications: newMedications });
  };

  const removeLongTermTreatment = (index: number) => {
    const newTreatments = pastMedical.longTermTreatments.filter((_, i) => i !== index);
    setPastMedical({ ...pastMedical, longTermTreatments: newTreatments });
  };

  const removeFamilyHistory = (index: number) => {
    const newHistory = familyHistory.filter((_, i) => i !== index);
    setFamilyHistory(newHistory);
  };

  const addField = (section: string, field: string) => {
    if (section === 'current') {
      if (field === 'conditions') {
        setCurrentMedical({ ...currentMedical, conditions: [...currentMedical.conditions, ''] });
      } else if (field === 'medications') {
        setCurrentMedical({
          ...currentMedical,
          medications: [...currentMedical.medications, { name: '', dosage: '', frequency: '', course: '', purpose: '' }],
        });
      } else if (field === 'allergies') {
        setCurrentMedical({ ...currentMedical, allergies: [...currentMedical.allergies, ''] });
      } else if (field === 'treatments') {
        setCurrentMedical({ ...currentMedical, treatments: [...currentMedical.treatments, ''] });
      } else if (field === 'doctors') {
        setCurrentMedical({ ...currentMedical, doctors: [...currentMedical.doctors, { name: '', phone: '', speciality: '' }] });
      }
    } else if (section === 'past') {
      if (field === 'diseases') {
        setPastMedical({ ...pastMedical, diseases: [...pastMedical.diseases, ''] });
      } else if (field === 'surgeries') {
        setPastMedical({
          ...pastMedical,
          surgeries: [...pastMedical.surgeries, { name: '', date: '' }],
        });
      } else if (field === 'hospitalizations') {
        setPastMedical({
          ...pastMedical,
          hospitalizations: [...pastMedical.hospitalizations, { reason: '', date: '' }],
        });
      } else if (field === 'injuries') {
        setPastMedical({ ...pastMedical, injuries: [...pastMedical.injuries, ''] });
      } else if (field === 'childhoodIllnesses') {
        setPastMedical({
          ...pastMedical,
          childhoodIllnesses: [...pastMedical.childhoodIllnesses, ''],
        });
      } else if (field === 'pastMedications') {
        setPastMedical({
          ...pastMedical,
          pastMedications: [...pastMedical.pastMedications, ''],
        });
      } else if (field === 'longTermTreatments') {
        setPastMedical({
          ...pastMedical,
          longTermTreatments: [...pastMedical.longTermTreatments, ''],
        });
      }
    } else if (section === 'family') {
      setFamilyHistory([...familyHistory, { disease: '', relation: '' }]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#309898]/20 via-white to-[#FF8000]/20 flex items-center justify-center p-4 overflow-y-auto z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 my-8 border-4 border-[#309898] relative max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="flex justify-center mb-3">
          <img src={logoImage} alt="Vytara Logo" className="w-28 h-28" />
        </div>
        
        <h2 className="text-center text-[#309898] mb-1">Medical Information</h2>
        <p className="text-center text-gray-600 mb-4 text-sm">Section {currentSection}/4</p>

        <div className="min-h-[400px]">
          {/* Section 1: Basic Personal Information */}
          {currentSection === 1 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Basic Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#309898] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Gender *</label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Blood Group *</label>
                  <select
                    value={personalInfo.bloodGroup}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Height (cm)</label>
                  <input
                    type="text"
                    placeholder="e.g., 170"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, height: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Weight (kg)</label>
                  <input
                    type="text"
                    placeholder="e.g., 70"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, weight: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">BMI</label>
                  <input
                    type="text"
                    value={calculateBMI(personalInfo.height, personalInfo.weight)}
                    readOnly
                    placeholder="Auto-calculated"
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    value={personalInfo.contactNumber}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, contactNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Emergency Contacts</label>
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    disabled={personalInfo.emergencyContacts.length >= 5}
                    className="text-[#FF8000] hover:text-[#309898] disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {personalInfo.emergencyContacts.map((contact, index) => (
                  <div key={index} className="mb-3">
                    <div className="grid grid-cols-3 gap-2 mb-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].name = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].phone = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Relation"
                        value={contact.relation}
                        onChange={(e) => {
                          const newContacts = [...personalInfo.emergencyContacts];
                          newContacts[index].relation = e.target.value;
                          setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {index === 0 ? (
                          <span className="text-xs text-[#309898] font-semibold bg-[#309898]/10 px-3 py-1 rounded-lg">Primary Contact</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newContacts = [...personalInfo.emergencyContacts];
                              const [movedContact] = newContacts.splice(index, 1);
                              newContacts.unshift(movedContact);
                              setPersonalInfo({ ...personalInfo, emergencyContacts: newContacts });
                            }}
                            className="text-xs px-3 py-1 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                      {personalInfo.emergencyContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmergencyContact(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {errors[`emergencyPhone${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`emergencyPhone${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Current Medical Status */}
          {currentSection === 2 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Current Medical Status</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Current Diagnosed Conditions</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'conditions')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter condition"
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...currentMedical.conditions];
                        newConditions[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, conditions: newConditions });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {currentMedical.conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
  <div className="flex items-center justify-between mb-2">
    <label className="block text-[#309898]">Current Medications</label>
    <button
      type="button"
      onClick={() => addField('current', 'medications')}
      className="text-[#FF8000] hover:text-[#309898]"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>

  {currentMedical.medications.map((med, index) => (
    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-2">
        <input
          type="text"
          placeholder="Name"
          value={med.name}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].name = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Dosage"
          value={med.dosage}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].dosage = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Frequency"
          value={med.frequency}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].frequency = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Course"
          value={med.course}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].course = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Purpose"
          value={med.purpose}
          onChange={(e) => {
            const newMeds = [...currentMedical.medications];
            newMeds[index].purpose = e.target.value;
            setCurrentMedical({ ...currentMedical, medications: newMeds });
          }}
          className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
        />
      </div>
      {currentMedical.medications.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => removeMedication(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  ))}
</div>


              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Allergies</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'allergies')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.allergies.map((allergy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter allergy"
                      value={allergy}
                      onChange={(e) => {
                        const newAllergies = [...currentMedical.allergies];
                        newAllergies[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, allergies: newAllergies });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {currentMedical.allergies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Ongoing Treatments / Therapies</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'treatments')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.treatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter treatment"
                      value={treatment}
                      onChange={(e) => {
                        const newTreatments = [...currentMedical.treatments];
                        newTreatments[index] = e.target.value;
                        setCurrentMedical({ ...currentMedical, treatments: newTreatments });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {currentMedical.treatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatment(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Current Doctor / Physician</label>
                  <button
                    type="button"
                    onClick={() => addField('current', 'doctors')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {currentMedical.doctors.map((doctor, index) => (
                  <div key={index} className="mb-3">
                    <div className="grid grid-cols-3 gap-2 mb-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={doctor.name}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].name = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={doctor.phone}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].phone = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Speciality"
                        value={doctor.speciality}
                        onChange={(e) => {
                          const newDoctors = [...currentMedical.doctors];
                          newDoctors[index].speciality = e.target.value;
                          setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        {index === 0 ? (
                          <span className="text-xs text-[#309898] font-semibold bg-[#309898]/10 px-3 py-1 rounded-lg">Primary Doctor</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newDoctors = [...currentMedical.doctors];
                              const [movedDoctor] = newDoctors.splice(index, 1);
                              newDoctors.unshift(movedDoctor);
                              setCurrentMedical({ ...currentMedical, doctors: newDoctors });
                            }}
                            className="text-xs px-3 py-1 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                      {currentMedical.doctors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDoctor(index)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Past Medical History */}
          {currentSection === 3 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Past Medical History</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Previous Diagnosed Diseases</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'diseases')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.diseases.map((disease, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter disease"
                      value={disease}
                      onChange={(e) => {
                        const newDiseases = [...pastMedical.diseases];
                        newDiseases[index] = e.target.value;
                        setPastMedical({ ...pastMedical, diseases: newDiseases });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.diseases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDisease(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Surgeries</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'surgeries')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.surgeries.map((surgery, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Surgery name"
                      value={surgery.name}
                      onChange={(e) => {
                        const newSurgeries = [...pastMedical.surgeries];
                        newSurgeries[index].name = e.target.value;
                        setPastMedical({ ...pastMedical, surgeries: newSurgeries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    <input
                      type="date"
                      value={surgery.date}
                      onChange={(e) => {
                        const newSurgeries = [...pastMedical.surgeries];
                        newSurgeries[index].date = e.target.value;
                        setPastMedical({ ...pastMedical, surgeries: newSurgeries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.surgeries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSurgery(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Hospitalizations</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'hospitalizations')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.hospitalizations.map((hosp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Reason"
                      value={hosp.reason}
                      onChange={(e) => {
                        const newHosps = [...pastMedical.hospitalizations];
                        newHosps[index].reason = e.target.value;
                        setPastMedical({ ...pastMedical, hospitalizations: newHosps });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    <input
                      type="date"
                      value={hosp.date}
                      onChange={(e) => {
                        const newHosps = [...pastMedical.hospitalizations];
                        newHosps[index].date = e.target.value;
                        setPastMedical({ ...pastMedical, hospitalizations: newHosps });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.hospitalizations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHospitalization(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Injuries</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'injuries')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.injuries.map((injury, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter injury"
                      value={injury}
                      onChange={(e) => {
                        const newInjuries = [...pastMedical.injuries];
                        newInjuries[index] = e.target.value;
                        setPastMedical({ ...pastMedical, injuries: newInjuries });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.injuries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInjury(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Childhood Illnesses</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'childhoodIllnesses')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.childhoodIllnesses.map((illness, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter illness"
                      value={illness}
                      onChange={(e) => {
                        const newIllnesses = [...pastMedical.childhoodIllnesses];
                        newIllnesses[index] = e.target.value;
                        setPastMedical({ ...pastMedical, childhoodIllnesses: newIllnesses });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.childhoodIllnesses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChildhoodIllness(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Past Medications Taken</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'pastMedications')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.pastMedications.map((med, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter medication"
                      value={med}
                      onChange={(e) => {
                        const newMeds = [...pastMedical.pastMedications];
                        newMeds[index] = e.target.value;
                        setPastMedical({ ...pastMedical, pastMedications: newMeds });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.pastMedications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePastMedication(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Long-term Treatments Previously Taken</label>
                  <button
                    type="button"
                    onClick={() => addField('past', 'longTermTreatments')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {pastMedical.longTermTreatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter treatment"
                      value={treatment}
                      onChange={(e) => {
                        const newTreatments = [...pastMedical.longTermTreatments];
                        newTreatments[index] = e.target.value;
                        setPastMedical({ ...pastMedical, longTermTreatments: newTreatments });
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {pastMedical.longTermTreatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLongTermTreatment(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Family Medical History */}
          {currentSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-[#FF8000] mb-4">Family Medical History</h3>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[#309898]">Diseases and Relation</label>
                  <button
                    type="button"
                    onClick={() => addField('family', '')}
                    className="text-[#FF8000] hover:text-[#309898]"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {familyHistory.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Disease"
                      value={item.disease}
                      onChange={(e) => {
                        const newHistory = [...familyHistory];
                        newHistory[index].disease = e.target.value;
                        setFamilyHistory(newHistory);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Relation (e.g., Father, Mother)"
                      value={item.relation}
                      onChange={(e) => {
                        const newHistory = [...familyHistory];
                        newHistory[index].relation = e.target.value;
                        setFamilyHistory(newHistory);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    {familyHistory.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyHistory(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-8">
          {currentSection < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
            >
              Confirm and Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}