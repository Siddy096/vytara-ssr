import { X } from 'lucide-react';
import { UserData } from '../App';

interface ProfileModalProps {
  user: UserData;
  onClose: () => void;
}

export default function ProfileModal({ user, onClose }: ProfileModalProps) {
  const { medicalInfo } = user;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2>Profile Information</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div>
            <h3 className="text-[#309898] mb-3 pb-2 border-b-2 border-[#309898]/20">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="text-gray-900">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {medicalInfo && (
            <>
              {/* Basic Personal Information */}
              <div>
                <h3 className="text-[#FF8000] mb-3 pb-2 border-b-2 border-[#FF8000]/20">
                  Basic Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="text-gray-900">{medicalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="text-gray-900">{medicalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="text-gray-900">{medicalInfo.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Group</p>
                    <p className="text-gray-900">{medicalInfo.bloodGroup || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Height</p>
                    <p className="text-gray-900">{medicalInfo.height ? `${medicalInfo.height} cm` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="text-gray-900">{medicalInfo.weight ? `${medicalInfo.weight} kg` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Number</p>
                    <p className="text-gray-900">{medicalInfo.contactNumber}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Emergency Contacts</p>
                  <div className="space-y-2">
                    {medicalInfo.emergencyContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">{contact.name || 'N/A'}</span>
                        <span className="text-gray-600">{contact.phone || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medical Status */}
              <div>
                <h3 className="text-[#309898] mb-3 pb-2 border-b-2 border-[#309898]/20">
                  Current Medical Status
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 mb-1">Current Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {medicalInfo.currentConditions.filter(c => c).map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-[#309898]/10 text-[#309898] rounded-full">
                          {condition}
                        </span>
                      ))}
                      {medicalInfo.currentConditions.filter(c => c).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Current Medications</p>
                    <div className="space-y-2">
                      {medicalInfo.currentMedications.filter(m => m.name).map((med, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{med.name}</span>
                          {med.dosage && <span className="text-gray-600"> - {med.dosage}</span>}
                          {med.frequency && <span className="text-gray-600"> ({med.frequency})</span>}
                        </div>
                      ))}
                      {medicalInfo.currentMedications.filter(m => m.name).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {medicalInfo.allergies.filter(a => a).map((allergy, index) => (
                        <span key={index} className="px-3 py-1 bg-red-50 text-red-600 rounded-full">
                          {allergy}
                        </span>
                      ))}
                      {medicalInfo.allergies.filter(a => a).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Ongoing Treatments</p>
                    <div className="flex flex-wrap gap-2">
                      {medicalInfo.ongoingTreatments.filter(t => t).map((treatment, index) => (
                        <span key={index} className="px-3 py-1 bg-[#FF8000]/10 text-[#FF8000] rounded-full">
                          {treatment}
                        </span>
                      ))}
                      {medicalInfo.ongoingTreatments.filter(t => t).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Current Doctors</p>
                    <div className="flex flex-wrap gap-2">
                      {medicalInfo.currentDoctors.filter(d => d).map((doctor, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {doctor}
                        </span>
                      ))}
                      {medicalInfo.currentDoctors.filter(d => d).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Medical History */}
              <div>
                <h3 className="text-[#FF8000] mb-3 pb-2 border-b-2 border-[#FF8000]/20">Past Medical History</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 mb-1">Previous Diseases</p>
                    <div className="flex flex-wrap gap-2">
                      {medicalInfo.previousDiseases.filter(d => d).map((disease, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {disease}
                        </span>
                      ))}
                      {medicalInfo.previousDiseases.filter(d => d).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Past Surgeries</p>
                    <div className="space-y-2">
                      {medicalInfo.pastSurgeries.filter(s => s.name).map((surgery, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-lg flex justify-between">
                          <span className="text-gray-900">{surgery.name}</span>
                          <span className="text-gray-600">{surgery.date}</span>
                        </div>
                      ))}
                      {medicalInfo.pastSurgeries.filter(s => s.name).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Hospitalizations</p>
                    <div className="space-y-2">
                      {medicalInfo.hospitalizations.filter(h => h.reason).map((hosp, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-lg flex justify-between">
                          <span className="text-gray-900">{hosp.reason}</span>
                          <span className="text-gray-600">{hosp.date}</span>
                        </div>
                      ))}
                      {medicalInfo.hospitalizations.filter(h => h.reason).length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Medical History */}
              <div>
                <h3 className="text-[#309898] mb-3 pb-2 border-b-2 border-[#309898]/20">
                  Family Medical History
                </h3>
                <div className="space-y-2">
                  {medicalInfo.familyHistory.filter(f => f.disease).map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                      <span className="text-gray-900">{item.disease}</span>
                      <span className="text-gray-600">{item.relation}</span>
                    </div>
                  ))}
                  {medicalInfo.familyHistory.filter(f => f.disease).length === 0 && (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
