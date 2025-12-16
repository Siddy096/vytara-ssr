import { useState } from 'react';
import { X, Shield, Calendar, DollarSign, FileText, Plus } from 'lucide-react';
import { InsurancePolicy } from '../App';

type Props = {
  policies: InsurancePolicy[];
  onClose: () => void;
};

export function InsuranceModal({ policies, onClose }: Props) {
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    policyNumber: '',
    startDate: '',
    endDate: '',
    coverage: '',
    premium: '',
  });

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just close the form since we don't have an onAddPolicy prop
    // You can add this functionality later
    setShowAddForm(false);
    setFormData({
      name: '',
      provider: '',
      policyNumber: '',
      startDate: '',
      endDate: '',
      coverage: '',
      premium: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#309898]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#309898]/20 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-[#309898]">Insurance Policies</h2>
          <button onClick={onClose} className="text-[#FF8000] hover:text-[#309898] transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Add New Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add New Policy
            </button>
          </div>

          {policies.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-[#309898]/30 mx-auto mb-4" />
              <p className="text-gray-500">No insurance policies added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map(policy => (
                <div
                  key={policy.id}
                  className="p-4 border-2 border-[#309898]/30 rounded-lg hover:border-[#309898] hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#309898]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-[#309898]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#309898] mb-1">{policy.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{policy.provider}</p>
                      <div className="flex items-center gap-2 text-xs text-[#FF8000]">
                        <FileText className="w-3 h-3" />
                        <span>{policy.policyNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policy Details Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-4 border-[#FF8000]">
            <div className="p-6 border-b-2 border-[#FF8000]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-[#FF8000]">{selectedPolicy.name}</h2>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="text-[#309898] hover:text-[#FF8000] transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-1">
                  <Shield className="w-5 h-5" />
                  <span>Provider</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedPolicy.provider}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-1">
                  <FileText className="w-5 h-5" />
                  <span>Policy Number</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedPolicy.policyNumber}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-1">
                  <Calendar className="w-5 h-5" />
                  <span>Duration</span>
                </div>
                <p className="text-gray-700 ml-7">
                  {new Date(selectedPolicy.startDate).toLocaleDateString()} - {new Date(selectedPolicy.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#FF8000] mb-1">
                  <Shield className="w-5 h-5" />
                  <span>Coverage</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedPolicy.coverage}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-[#309898] mb-1">
                  <DollarSign className="w-5 h-5" />
                  <span>Premium</span>
                </div>
                <p className="text-gray-700 ml-7">{selectedPolicy.premium}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Policy Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#FF8000]">
            <div className="p-6 border-b-2 border-[#FF8000]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-[#FF8000]">Add New Insurance Policy</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-[#309898] hover:text-[#FF8000] transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddPolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-[#309898] mb-2">Policy Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., Health Insurance"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Provider</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., Blue Cross"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Policy Number</label>
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., POL123456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#309898] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#309898] mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Coverage</label>
                <input
                  type="text"
                  value={formData.coverage}
                  onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., $500,000"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Premium</label>
                <input
                  type="text"
                  value={formData.premium}
                  onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="e.g., $200/month"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-[#309898] to-[#FF8000] text-white rounded-lg hover:shadow-lg transition"
              >
                Add Policy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
