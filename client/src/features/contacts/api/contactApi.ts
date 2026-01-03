import api from '../../../lib/api';
import type {
  Contact,
  CreateContactData,
  UpdateContactData,
  GetContactsParams,
  ContactsResponse,
  ApiResponse,
  BulkDeleteResponse,
} from '../../../types/contact';

// Get all contacts with pagination and filters
export const getContacts = async (params?: GetContactsParams): Promise<ContactsResponse> => {
  const response = await api.get<ContactsResponse>('/contacts', { params });
  return response.data;
};

// Get single contact by ID
export const getContact = async (id: string): Promise<Contact> => {
  const response = await api.get<ApiResponse<Contact>>(`/contacts/${id}`);
  return response.data.data!;
};

// Create new contact
export const createContact = async (data: CreateContactData): Promise<Contact> => {
  const response = await api.post<ApiResponse<Contact>>('/contacts', data);
  return response.data.data!;
};

// Update contact
export const updateContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
  const response = await api.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
  return response.data.data!;
};

// Delete single contact
export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contacts/${id}`);
};

// Bulk delete contacts
export const bulkDeleteContacts = async (ids: string[]): Promise<BulkDeleteResponse> => {
  const response = await api.post<BulkDeleteResponse>('/contacts/bulk-delete', { ids });
  return response.data;
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/healthcheck');
    return response.data.success;
  } catch {
    return false;
  }
};
