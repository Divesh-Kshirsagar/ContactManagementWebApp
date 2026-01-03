import { useState, useEffect, useMemo } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useDeleteContact } from '../hooks/useDeleteContact';
import { useBulkDeleteContacts } from '../hooks/useBulkDeleteContacts';
import { Button, Input, Select, Loader, EmptyState, Card } from '../../../components/ui';
import { ContactCard } from './ContactCard';
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

  if (isLoading) return <Loader />;
  if (error) return (
    <Card className="bg-red-50 border-red-200">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Contacts</h3>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filtering Mode Indicator */}
      {useClientSideFiltering && (
        <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-800">Lightning Fast Search</h4>
              <p className="text-sm text-green-700">Client-side filtering enabled with {totalContacts} contacts - instant results!</p>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="🔍 Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'All' | 'Work' | 'Family' | 'Friends' | 'Other')}
          >
            <option value="All">📁 All Categories</option>
            <option value="Work">💼 Work</option>
            <option value="Family">👨‍👩‍👧‍👦 Family</option>
            <option value="Friends">🤝 Friends</option>
            <option value="Other">📌 Other</option>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="bg-linear-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {selectedIds.length}
              </div>
              <span className="text-sm font-semibold text-indigo-900">
                {selectedIds.length} contact{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={handleBulkDelete}
                variant="danger"
                isLoading={bulkDeleteMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </Button>
              <Button
                onClick={() => setSelectedIds([])}
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Contact List */}
      {displayData?.data && displayData.data.length > 0 ? (
        <div className="space-y-4">
          {displayData.data.map((contact: Contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              isSelected={selectedIds.includes(contact._id)}
              onToggleSelect={toggleSelection}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title={search || category !== 'All' ? 'No contacts found' : 'No contacts yet'}
          description={
            search || category !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first contact using the form'
          }
        />
      )}

      {/* Pagination */}
      {displayData?.pagination && displayData.pagination.totalPages > 1 && (
        <Card className="bg-linear-to-r from-gray-50 to-slate-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="secondary"
              className="w-full sm:w-auto min-w-30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Page</span>
              <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg">
                {displayData.pagination.page}
              </span>
              <span className="text-gray-600">of</span>
              <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg">
                {displayData.pagination.totalPages}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-700 font-semibold">
                {displayData.pagination.total} total
              </span>
            </div>
            
            <Button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= displayData.pagination.totalPages}
              variant="secondary"
              className="w-full sm:w-auto min-w-30"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
