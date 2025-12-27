import { X, Stethoscope, Phone } from 'lucide-react';

type Props = {
  doctors: { name: string; phone: string }[];
  onClose: () => void;
};

export function DoctorsModal({ doctors, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#309898]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#309898]/20 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-[#309898]">Your Doctors</h2>
          <button onClick={onClose} className="text-[#FF8000] hover:text-[#309898] transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="w-16 h-16 text-[#309898]/30 mx-auto mb-4" />
              <p className="text-gray-500">No doctors added yet</p>
              <p className="text-sm text-gray-400 mt-2">Add doctors in your medical information</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-[#309898]/30 rounded-lg hover:border-[#309898] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-[#309898]/10 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-[#309898]" />
                    </div>
                    <div>
                      <h3 className="text-[#309898]">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">Healthcare Provider</p>
                    </div>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-[#FF8000] ml-15">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{doctor.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}