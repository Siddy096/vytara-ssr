import { useState } from 'react';
import { X, Search, MapPin, Phone, Package } from 'lucide-react';

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone: string;
  medicines: string[];
};

type Props = {
  onClose: () => void;
};

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'HealthPlus Pharmacy',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    medicines: ['Aspirin', 'Ibuprofen', 'Paracetamol', 'Amoxicillin', 'Omeprazole', 'Metformin'],
  },
  {
    id: '2',
    name: 'MediCare Drugstore',
    address: '456 Oak Avenue, Uptown',
    phone: '+1 (555) 234-5678',
    medicines: ['Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Metoprolol', 'Amlodipine'],
  },
  {
    id: '3',
    name: 'WellCare Pharmacy',
    address: '789 Pine Road, Suburb',
    phone: '+1 (555) 345-6789',
    medicines: ['Gabapentin', 'Hydrochlorothiazide', 'Losartan', 'Sertraline', 'Pantoprazole'],
  },
  {
    id: '4',
    name: 'CityMed Pharmacy',
    address: '321 Elm Street, Central',
    phone: '+1 (555) 456-7890',
    medicines: ['Clopidogrel', 'Escitalopram', 'Rosuvastatin', 'Albuterol', 'Furosemide'],
  },
];

export function PharmacyModal({ onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const filteredPharmacies = mockPharmacies.filter(pharmacy => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pharmacy.name.toLowerCase().includes(searchLower) ||
      pharmacy.medicines.some(med => med.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#FF8000]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#FF8000]/20 rounded-t-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#FF8000]">Pharmacies Near You</h2>
            <button onClick={onClose} className="text-[#309898] hover:text-[#FF8000] transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#309898]" />
            <input
              type="text"
              placeholder="Search pharmacy or medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredPharmacies.map(pharmacy => (
              <div
                key={pharmacy.id}
                className="p-4 border-2 border-[#FF8000]/30 rounded-lg hover:border-[#FF8000] hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedPharmacy(pharmacy)}
              >
                <h3 className="text-[#309898] mb-2">{pharmacy.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF8000]" />
                    <span>{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FF8000]" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Package className="w-4 h-4 text-[#309898] mt-1" />
                    <div className="flex flex-wrap gap-1">
                      {pharmacy.medicines.slice(0, 4).map((med, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#309898]/10 text-[#309898] rounded text-xs"
                        >
                          {med}
                        </span>
                      ))}
                      {pharmacy.medicines.length > 4 && (
                        <span className="px-2 py-1 text-[#309898] text-xs">
                          +{pharmacy.medicines.length - 4} more
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

      {/* Pharmacy Details Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-4 border-[#309898]">
            <div className="p-6 border-b-2 border-[#309898]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-[#309898]">{selectedPharmacy.name}</h2>
                <button
                  onClick={() => setSelectedPharmacy(null)}
                  className="text-[#FF8000] hover:text-[#309898] transition"
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
                <p className="text-gray-700 ml-7">{selectedPharmacy.address}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-1">
                  <Phone className="w-5 h-5" />
                  <span>Phone</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedPharmacy.phone}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-2">
                  <Package className="w-5 h-5" />
                  <span>Available Medicines</span>
                </div>
                <div className="ml-7 flex flex-wrap gap-2">
                  {selectedPharmacy.medicines.map((med, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#309898]/10 text-[#309898] rounded-lg"
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
