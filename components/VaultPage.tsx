import { useState } from 'react';
import { FileText, Receipt, Activity, Shield, Upload, X, ChevronDown, Home, User, Folder } from 'lucide-react';
import { UserData, Document } from '../App';

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

  const handleDeleteDocument = (id: string) => {
    onDeleteDocument(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-xl">★</div>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Vytara - Vault</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition font-medium">
              <Home className="w-4 h-4" />
              Home
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition font-medium">
              <User className="w-4 h-4" />
              Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Family Member Selector */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">Family Member</label>
              <div className="relative">
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none appearance-none bg-white shadow-sm"
                >
                  {owners.map(owner => (
                    <option key={owner.value} value={owner.value}>
                      👤 {owner.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium shadow-md"
              >
                + Upload New Document
              </button>
            </div>

            {/* My Documents Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Documents</h2>
              
              {filteredDocuments.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                  <div className="w-32 h-32 mx-auto mb-6 bg-teal-50 rounded-full flex items-center justify-center">
                    <Upload className="w-16 h-16 text-teal-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Upload your first document</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredDocuments.map(doc => {
                    const category = categories.find(c => c.id === doc.category);
                    const Icon = category?.icon || FileText;
                    
                    return (
                      <div
                        key={doc.id}
                        className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition group relative"
                      >
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        <div className="w-full h-32 rounded-lg flex items-center justify-center mb-3 bg-teal-50">
                          <Icon className="w-12 h-12 text-teal-600" />
                        </div>
                        
                        <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                          {doc.name}
                        </h3>
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

          {/* Right Section - 1/3 width */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Type</h2>
            
            {/* All Documents Card */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full p-5 rounded-2xl border-2 transition text-left ${
                selectedCategory === 'all'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-teal-200 bg-white hover:border-teal-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="w-6 h-6 text-teal-600" />
                  <span className="font-medium text-teal-700">All Documents</span>
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {documents.filter(d => d.owner === selectedOwner).length}
                </span>
              </div>
            </button>

            {/* Category Cards */}
            {categories.map(category => {
              const Icon = category.icon;
              const count = documents.filter(
                d => d.owner === selectedOwner && d.category === category.id
              ).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as Category)}
                  className={`w-full p-5 rounded-2xl border-2 transition text-left ${
                    selectedCategory === category.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-teal-200 bg-white hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-teal-600" />
                      <span className="font-medium text-teal-700">{category.label}</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">© 2024 Vytara. All yrett reserved</p>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Add New Document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Document Name</label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., Blood Test Results"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value as Category })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition">
                <Upload className="w-12 h-12 text-teal-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium mb-1">Drop files here or browse</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}