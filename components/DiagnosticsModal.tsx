import { useState } from 'react';
import { X, Search, MapPin, Phone, Activity, Calendar } from 'lucide-react';
import { Appointment } from '../App';

type DiagnosticLab = {
  id: string;
  name: string;
  address: string;
  phone: string;
  tests: string[];
};

type Props = {
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
};

const mockLabs: DiagnosticLab[] = [
  {
    id: '1',
    name: 'QuickTest Diagnostics',
    address: '123 Medical Plaza, Downtown',
    phone: '+1 (555) 111-2222',
    tests: ['CBC', 'ELISA', 'TFT', 'Lipid Profile', 'HbA1c', 'Liver Function Test'],
  },
  {
    id: '2',
    name: 'HealthCheck Labs',
    address: '456 Wellness Center, Midtown',
    phone: '+1 (555) 222-3333',
    tests: ['X-Ray', 'ECG', 'Ultrasound', 'Blood Sugar', 'Kidney Function Test'],
  },
  {
    id: '3',
    name: 'MediScan Diagnostics',
    address: '789 Care Avenue, Uptown',
    phone: '+1 (555) 333-4444',
    tests: ['MRI', 'CT Scan', 'PET Scan', 'Bone Density', 'Mammography'],
  },
  {
    id: '4',
    name: 'PrecisionPath Laboratory',
    address: '321 Health Street, Central',
    phone: '+1 (555) 444-5555',
    tests: ['COVID-19 Test', 'Allergy Panel', 'Hormone Panel', 'Vitamin D', 'Iron Studies'],
  },
];

export function DiagnosticsModal({ onClose, onAddAppointment }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState<DiagnosticLab | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    test: '',
  });

  const filteredLabs = mockLabs.filter(lab => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lab.name.toLowerCase().includes(searchLower) ||
      lab.tests.some(test => test.toLowerCase().includes(searchLower))
    );
  });

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLab && appointmentData.date && appointmentData.time && appointmentData.test) {
      onAddAppointment({
        id: Date.now().toString(),
        date: appointmentData.date,
        time: appointmentData.time,
        title: `${appointmentData.test} at ${selectedLab.name}`,
        type: 'Lab Test',
      });
      setShowAppointmentForm(false);
      setSelectedLab(null);
      setAppointmentData({ date: '', time: '', test: '' });
      alert('Appointment scheduled successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#309898]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#309898]/20 rounded-t-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#309898]">Diagnostic Labs Near You</h2>
            <button onClick={onClose} className="text-[#FF8000] hover:text-[#309898] transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#309898]" />
            <input
              type="text"
              placeholder="Search lab or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredLabs.map(lab => (
              <div
                key={lab.id}
                className="p-4 border-2 border-[#309898]/30 rounded-lg hover:border-[#309898] hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedLab(lab)}
              >
                <h3 className="text-[#309898] mb-2">{lab.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF8000]" />
                    <span>{lab.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FF8000]" />
                    <span>{lab.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Activity className="w-4 h-4 text-[#309898] mt-1" />
                    <div className="flex flex-wrap gap-1">
                      {lab.tests.slice(0, 4).map((test, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#309898]/10 text-[#309898] rounded text-xs"
                        >
                          {test}
                        </span>
                      ))}
                      {lab.tests.length > 4 && (
                        <span className="px-2 py-1 text-[#309898] text-xs">
                          +{lab.tests.length - 4} more
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

      {/* Lab Details Modal */}
      {selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#FF8000]">
            <div className="p-6 border-b-2 border-[#FF8000]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-[#FF8000]">{selectedLab.name}</h2>
                <button
                  onClick={() => {
                    setSelectedLab(null);
                    setShowAppointmentForm(false);
                  }}
                  className="text-[#309898] hover:text-[#FF8000] transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-1">
                  <MapPin className="w-5 h-5" />
                  <span>Address</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedLab.address}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-1">
                  <Phone className="w-5 h-5" />
                  <span>Phone</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedLab.phone}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-2">
                  <Activity className="w-5 h-5" />
                  <span>Available Tests</span>
                </div>
                <div className="ml-7 flex flex-wrap gap-2">
                  {selectedLab.tests.map((test, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#309898]/10 text-[#309898] rounded-lg"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              </div>

              {!showAppointmentForm ? (
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Appointment
                </button>
              ) : (
                <form onSubmit={handleScheduleAppointment} className="space-y-4 p-4 bg-[#309898]/5 rounded-lg">
                  <div>
                    <label className="block text-[#309898] mb-2">Select Test</label>
                    <select
                      value={appointmentData.test}
                      onChange={(e) => setAppointmentData({ ...appointmentData, test: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                      required
                    >
                      <option value="">Choose a test</option>
                      {selectedLab.tests.map((test, idx) => (
                        <option key={idx} value={test}>
                          {test}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#309898] mb-2">Date</label>
                      <input
                        type="date"
                        value={appointmentData.date}
                        onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#309898] mb-2">Time</label>
                      <input
                        type="time"
                        value={appointmentData.time}
                        onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#309898] text-white rounded-lg hover:bg-[#309898]/80 transition"
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
