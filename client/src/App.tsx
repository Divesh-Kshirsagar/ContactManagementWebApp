import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ContactForm } from './features/contacts/components/ContactForm';
import { Trash2, Edit, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1/contacts';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const queryClient = useQueryClient();

  // 1. Fetching with Aggregation Logic [cite: 77, 130]
  const { data, isLoading } = useQuery({
    queryKey: ['contacts', page, search],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?page=${page}&limit=5&search=${search}`);
      return response.data; // Expected format: { contacts: [], total: 0 } [cite: 89]
    }
  });

  // 2. Safe Bulk Delete Implementation [cite: 71, 156]
  const bulkDeleteMutation = useMutation({
    mutationFn: () => axios.delete(API_URL, { headers: { 'x-confirm-delete': 'true' } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] })
  });

  const handleOpenEdit = (contact: any) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
          <div className="space-x-4">
            <button 
              onClick={() => bulkDeleteMutation.mutate()}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
            >
              Delete All
            </button>
            <button 
              onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Add Contact
            </button>
          </div>
        </header>

        {/* Search Bar [cite: 132] */}
        <input
          type="text"
          placeholder="Search name, email, or phone..."
          className="w-full p-3 mb-6 border rounded-xl shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Contacts Table [cite: 104, 129] */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.contacts.map((contact: any) => (
                <tr key={contact._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{contact.name}</td>
                  <td className="p-4 text-gray-600">{contact.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {contact.category}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(contact)} className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls [cite: 131, 184] */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-500">Total: {data?.total || 0}</p>
          <div className="space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Form Modal [cite: 116, 133] */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingContact ? 'Edit Contact' : 'New Contact'}</h2>
            <ContactForm 
              initialData={editingContact} 
              onSubmit={(data) => {
                console.log("Submit Data:", data);
                setIsModalOpen(false);
              }} 
            />
            <button onClick={() => setIsModalOpen(false)} className="mt-4 w-full text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}