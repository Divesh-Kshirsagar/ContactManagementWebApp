import { useState } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useDeleteContact } from '../hooks/useDeleteContact';
import { useBulkDeleteContacts } from '../hooks/useBulkDeleteContacts';
import type { Contact } from '../../../types/contact';

export const ContactList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'Work' | 'Family' | 'Friends' | 'Other'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, error } = useContacts({ page, limit: 10, search, category });
  const deleteMutation = useDeleteContact();
  const bulkDeleteMutation = useBulkDeleteContacts();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Please select contacts to delete');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)?`)) {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      setSelectedIds([]);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2 items-center bg-blue-50 p-3 rounded">
          <span>{selectedIds.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            disabled={bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Contact List */}
      <div className="space-y-2">
        {data?.data.map((contact: Contact) => (
          <div
            key={contact._id}
            className="border p-4 rounded flex items-center gap-4 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(contact._id)}
              onChange={() => toggleSelection(contact._id)}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.email}</p>
              <p className="text-sm text-gray-600">{contact.phone}</p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {contact.category}
              </span>
            </div>
            <button
              onClick={() => handleDelete(contact._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
            ({data.pagination.total} total)
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.pagination.totalPages}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
