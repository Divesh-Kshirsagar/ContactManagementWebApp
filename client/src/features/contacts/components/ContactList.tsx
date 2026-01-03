import { useState, useEffect, useMemo } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useDeleteContact } from '../hooks/useDeleteContact';
import { useBulkDeleteContacts } from '../hooks/useBulkDeleteContacts';
import { Button, Input, Select } from '../../../components/ui';
import type { Contact } from '../../../types/contact';

const CLIENT_SIDE_THRESHOLD = 1000;
const ITEMS_PER_PAGE = 10;

export const ContactList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'Work' | 'Family' | 'Friends' | 'Other'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // First, check total count to determine filtering strategy
  const countQuery = useContacts({ page: 1, limit: 1 });
  const totalContacts = countQuery.data?.pagination.total || 0;

  // Decide filtering strategy based on total count
  const useClientSideFiltering = useMemo(() => {
    return totalContacts > 0 && totalContacts <= CLIENT_SIDE_THRESHOLD;
  }, [totalContacts]);

  // Fetch all contacts if using client-side filtering, otherwise fetch paginated
  const { data, isLoading, error } = useContacts(
    useClientSideFiltering
      ? { page: 1, limit: CLIENT_SIDE_THRESHOLD }
      : { page, limit: ITEMS_PER_PAGE, search, category }
  );
  
  const deleteMutation = useDeleteContact();
  const bulkDeleteMutation = useBulkDeleteContacts();

  // Client-side filtering and pagination
  const filteredAndPaginatedData = useMemo(() => {
    if (!useClientSideFiltering || !data?.data) {
      return data;
    }

    let filtered = data.data;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((contact: Contact) =>
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.phone.includes(search)
      );
    }

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter((contact: Contact) => contact.category === category);
    }

    // Calculate pagination
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit: ITEMS_PER_PAGE,
        total: totalFiltered,
        totalPages,
      },
    };
  }, [useClientSideFiltering, data, search, category, page]);

  // Reset to page 1 when search or category changes (client-side filtering only)
  useEffect(() => {
    if (useClientSideFiltering) {
      setPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const displayData = useClientSideFiltering ? filteredAndPaginatedData : data;

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

  if (isLoading) return <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* Filtering Mode Indicator */}
      {useClientSideFiltering && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
          ⚡ Client-side filtering enabled ({totalContacts} contacts) - Instant search results!
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'All' | 'Work' | 'Family' | 'Friends' | 'Other')}
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Other">Other</option>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-4 rounded-md">
          <span className="text-sm font-medium text-blue-900">{selectedIds.length} selected</span>
          <Button
            onClick={handleBulkDelete}
            variant="danger"
            isLoading={bulkDeleteMutation.isPending}
            className="text-sm"
          >
            Delete Selected
          </Button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Contact List */}
      <div className="space-y-3">{displayData?.data.map((contact: Contact) => (
          <div
            key={contact._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(contact._id)}
                onChange={() => toggleSelection(contact._id)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contact.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contact.phone}
                  </p>
                </div>
                <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">
                  {contact.category}
                </span>
              </div>
              <Button
                onClick={() => handleDelete(contact._id)}
                variant="danger"
                isLoading={deleteMutation.isPending}
                className="text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {displayData?.pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="secondary"
            className="w-full sm:w-auto px-6"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page <span className="font-semibold">{displayData.pagination.page}</span> of <span className="font-semibold">{displayData.pagination.totalPages}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">{displayData.pagination.total}</span> total contacts
          </span>
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= displayData.pagination.totalPages}
            variant="secondary"
            className="w-full sm:w-auto px-6"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
