import { useState } from 'react';
import { X, Search, MapPin, Phone, Building2, Calendar } from 'lucide-react';
import { Appointment } from '../App';

type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  facilities: string[];
};

type Props = {
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
};

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '100 Hospital Drive, Downtown',
    phone: '+1 (555) 100-1000',
    facilities: ['MRI', 'CT Scan', 'Ultrasound', 'X-Ray', 'Emergency', 'ICU'],
  },
  {
    id: '2',
    name: 'St. Mary\'s Medical Center',
    address: '200 Care Street, Midtown',
    phone: '+1 (555) 200-2000',
    facilities: ['PET Scan', 'MRI', 'CT Scan', 'Cardiology', 'Neurology', 'Oncology'],
  },
  {
    id: '3',
    name: 'Regional Healthcare Complex',
    address: '300 Wellness Boulevard, Uptown',
    phone: '+1 (555) 300-3000',
    facilities: ['Ultrasound', 'Mammography', 'Endoscopy', 'Dialysis', 'Surgery'],
  },
  {
    id: '4',
    name: 'Community Health Hospital',
    address: '400 Medical Plaza, Suburb',
    phone: '+1 (555) 400-4000',
    facilities: ['X-Ray', 'ECG', 'Blood Bank', 'Pharmacy', 'Lab Services'],
  },
];

export function HospitalsModal({ onClose, onAddAppointment }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    facility: '',
  });

  const filteredHospitals = mockHospitals.filter(hospital => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hospital.name.toLowerCase().includes(searchLower) ||
      hospital.facilities.some(facility => facility.toLowerCase().includes(searchLower))
    );
  });

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHospital && appointmentData.date && appointmentData.time && appointmentData.facility) {
      onAddAppointment({
        id: Date.now().toString(),
        date: appointmentData.date,
        time: appointmentData.time,
        title: `${appointmentData.facility} at ${selectedHospital.name}`,
        type: 'Hospital',
      });
      setShowAppointmentForm(false);
      setSelectedHospital(null);
      setAppointmentData({ date: '', time: '', facility: '' });
      alert('Appointment scheduled successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#FF8000]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#FF8000]/20 rounded-t-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#FF8000]">Hospitals Near You</h2>
            <button onClick={onClose} className="text-[#309898] hover:text-[#FF8000] transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FF8000]" />
            <input
              type="text"
              placeholder="Search hospital or facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#FF8000]/30 focus:border-[#309898] focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredHospitals.map(hospital => (
              <div
                key={hospital.id}
                className="p-4 border-2 border-[#FF8000]/30 rounded-lg hover:border-[#FF8000] hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedHospital(hospital)}
              >
                <h3 className="text-[#FF8000] mb-2">{hospital.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#309898]" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#309898]" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Building2 className="w-4 h-4 text-[#FF8000] mt-1" />
                    <div className="flex flex-wrap gap-1">
                      {hospital.facilities.slice(0, 4).map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#FF8000]/10 text-[#FF8000] rounded text-xs"
                        >
                          {facility}
                        </span>
                      ))}
                      {hospital.facilities.length > 4 && (
                        <span className="px-2 py-1 text-[#FF8000] text-xs">
                          +{hospital.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#309898]">
            <div className="p-6 border-b-2 border-[#309898]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-[#309898]">{selectedHospital.name}</h2>
                <button
                  onClick={() => {
                    setSelectedHospital(null);
                    setShowAppointmentForm(false);
                  }}
                  className="text-[#FF8000] hover:text-[#309898] transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-1">
                  <MapPin className="w-5 h-5" />
                  <span>Address</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedHospital.address}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-1">
                  <Phone className="w-5 h-5" />
                  <span>Phone</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedHospital.phone}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-2">
                  <Building2 className="w-5 h-5" />
                  <span>Available Facilities</span>
                </div>
                <div className="ml-7 flex flex-wrap gap-2">
                  {selectedHospital.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FF8000]/10 text-[#FF8000] rounded-lg"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {!showAppointmentForm ? (
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF8000] to-[#309898] text-white rounded-lg hover:shadow-lg transition"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Appointment
                </button>
              ) : (
                <form onSubmit={handleScheduleAppointment} className="space-y-4 p-4 bg-[#FF8000]/5 rounded-lg">
                  <div>
                    <label className="block text-[#FF8000] mb-2">Select Facility</label>
                    <select
                      value={appointmentData.facility}
                      onChange={(e) => setAppointmentData({ ...appointmentData, facility: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-[#FF8000]/30 focus:border-[#309898] focus:outline-none"
                      required
                    >
                      <option value="">Choose a facility</option>
                      {selectedHospital.facilities.map((facility, idx) => (
                        <option key={idx} value={facility}>
                          {facility}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#FF8000] mb-2">Date</label>
                      <input
                        type="date"
                        value={appointmentData.date}
                        onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#FF8000]/30 focus:border-[#309898] focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#FF8000] mb-2">Time</label>
                      <input
                        type="time"
                        value={appointmentData.time}
                        onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#FF8000]/30 focus:border-[#309898] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
                    >
                      Confirm Appointment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAppointmentForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
