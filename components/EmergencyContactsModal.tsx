import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Phone } from 'lucide-react';

type Props = {
  contacts: { name: string; phone: string }[];
  onClose: () => void;
  onUpdateContacts: (contacts: { name: string; phone: string }[]) => void;
};

export function EmergencyContactsModal({ contacts, onClose, onUpdateContacts }: Props) {
  const [editableContacts, setEditableContacts] = useState(contacts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  const handleAdd = () => {
    if (editableContacts.length < 5) {
      setEditableContacts([...editableContacts, { name: '', phone: '' }]);
      setEditingIndex(editableContacts.length);
      setEditForm({ name: '', phone: '' });
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(editableContacts[index]);
  };

  const handleSave = () => {
    if (editingIndex !== null && editForm.name && editForm.phone) {
      const newContacts = [...editableContacts];
      newContacts[editingIndex] = editForm;
      setEditableContacts(newContacts);
      setEditingIndex(null);
      setEditForm({ name: '', phone: '' });
    }
  };

  const handleDelete = (index: number) => {
    const newContacts = editableContacts.filter((_, i) => i !== index);
    setEditableContacts(newContacts);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleSubmit = () => {
    onUpdateContacts(editableContacts.filter(c => c.name && c.phone));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#FF8000]">
        <div className="sticky top-0 bg-white p-6 border-b-2 border-[#FF8000]/20 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-[#FF8000]">Emergency Contacts</h2>
          <button onClick={onClose} className="text-[#309898] hover:text-[#FF8000] transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {editableContacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 border-2 border-[#FF8000]/30 rounded-lg hover:border-[#FF8000] transition"
              >
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-[#309898]/30 focus:border-[#FF8000] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-[#309898] text-white rounded-lg hover:bg-[#309898]/80 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-[#309898]">{contact.name || 'Unnamed Contact'}</h3>
                      <div className="flex items-center gap-2 text-[#FF8000]">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone || 'No phone number'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 text-[#309898] hover:bg-[#309898]/10 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editableContacts.length < 5 && (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF8000] to-[#309898] text-white rounded-lg hover:shadow-lg transition mb-4"
            >
              <Plus className="w-5 h-5" />
              Add Emergency Contact
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-[#309898] text-white rounded-lg hover:bg-[#309898]/80 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
