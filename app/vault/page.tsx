import { useState } from 'react';
import { FileText, Receipt, Activity, Shield, Upload, X, ChevronDown, Sparkles, Check } from 'lucide-react';
import { UserData, Document } from '../App';
import logoImage from 'figma:asset/3356ef9e7b4ecad1a9839c039785983e296f414d.png';

type Props = {
  userData: UserData;
  onNavigateToHome: () => void;
  onNavigateToProfile: () => void;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onDeleteDocument: (id: string) => void;
};

type Category = 'lab-reports' | 'prescriptions' | 'insurance' | 'bills' | 'all';

export function VaultPage({
  userData,
  onNavigateToHome,
  onNavigateToProfile,
  documents,
  onAddDocument,
  onDeleteDocument,
}: Props) {
  const [selectedOwner, setSelectedOwner] = useState('self');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'lab-reports' as Category,
  });


  const owners = [
    { value: 'self', label: userData.personalInfo.fullName },
    ...userData.personalInfo.emergencyContacts.map((contact, idx) => ({
      value: `contact-${idx}`,
      label: contact.name,
    })),
  ];

  const categories = [
    { id: 'lab-reports', label: 'Lab Reports', icon: Activity, color: '#309898' },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, color: '#FF8000' },
    { id: 'insurance', label: 'Insurance', icon: Shield, color: '#309898' },
    { id: 'bills', label: 'Bills & Receipts', icon: Receipt, color: '#FF8000' },
  ];

  const filteredDocuments = documents
    .filter(doc => doc.owner === selectedOwner)
    .filter(doc => selectedCategory === 'all' || doc.category === selectedCategory)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadData.name && uploadData.category !== 'all') {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: uploadData.name,
        category: uploadData.category as Exclude<Category, 'all'>,
        uploadDate: new Date().toISOString(),
        owner: selectedOwner,
      };
      onAddDocument(newDoc);
      setUploadData({ name: '', category: 'lab-reports' });
      setShowUploadModal(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#309898]/10 via-white to-[#FF8000]/10">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Vytara Logo" className="w-20 h-20" />
            <h1 className="text-[#309898]">Vytara - Vault</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateToHome}
              className="px-4 py-2 bg-[#FF8000] text-white rounded-lg hover:bg-[#FF8000]/80 transition"
            >
              Home
            </button>
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2 bg-[#309898] text-white rounded-lg hover:bg-[#309898]/80 transition"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Owner Selector */}
            <div className="mb-8">
              <label className="block text-[#309898] mb-2">Select Person</label>
              <div className="relative">
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none appearance-none bg-white pr-10 cursor-pointer"
                >
                  {owners.map((owner) => (
                    <option key={owner.value} value={owner.value}>
                      {owner.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#309898] pointer-events-none" />
              </div>
            </div>

            {/* All Documents Section with Actions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#FF8000]">
                  {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.label}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#309898] text-white rounded-lg hover:bg-[#309898]/80 transition"
                  >
                    <Upload className="w-4 h-4" />
                    Add New
                  </button>
                </div>
              </div>


            </div>

            {/* Documents Display Area */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-[#309898]/30 min-h-[500px]">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No documents found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map((doc) => {
                    const category = categories.find((c) => c.id === doc.category);
                    const Icon = category?.icon || FileText;

                    return (
                      <div
                        key={doc.id}
                        className="relative bg-white rounded-xl shadow p-4 border-2 border-gray-200 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: category?.color }} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDocument(doc.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="text-gray-800 mb-1 text-sm">{doc.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Category Filters */}
          <div className="space-y-4">
            {/* All Documents Card */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left bg-white rounded-2xl shadow-lg p-6 border-4 transition ${
                selectedCategory === 'all'
                  ? 'border-[#309898]'
                  : 'border-[#309898]/20 hover:border-[#309898]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#309898] mb-1">All Documents</p>
                  <p className="text-[#309898] text-3xl">{documents.filter(doc => doc.owner === selectedOwner).length}</p>
                </div>
                <FileText className="w-8 h-8 text-[#309898]" />
              </div>
            </button>

            {/* Category Cards */}
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = documents.filter(
                doc => doc.owner === selectedOwner && doc.category === cat.id
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  className={`w-full text-left bg-white rounded-2xl shadow-lg p-6 border-4 transition ${
                    selectedCategory === cat.id
                      ? `border-[${cat.color}]`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedCategory === cat.id ? cat.color : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: cat.color }} className="mb-1">
                        {cat.label}
                      </p>
                      <p className="text-3xl" style={{ color: cat.color }}>
                        {count}
                      </p>
                    </div>
                    <Icon className="w-8 h-8" style={{ color: cat.color }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border-4 border-[#309898]">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-[#309898] mb-6">Upload Document</h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-[#309898] mb-2">Document Name</label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                  placeholder="Enter document name"
                  required
                />
              </div>

              <div>
                <label className="block text-[#309898] mb-2">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value as Category })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#309898] mb-2">File</label>
                <div className="border-2 border-dashed border-[#309898]/30 rounded-lg p-8 text-center hover:border-[#FF8000] transition cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-[#309898] mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#309898] to-[#FF8000] text-white py-3 rounded-lg hover:shadow-lg transition"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}