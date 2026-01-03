export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  category: 'Work' | 'Family' | 'Friends' | 'Other';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
  category?: 'Work' | 'Family' | 'Friends' | 'Other';
  message?: string;
}

export interface UpdateContactData {
  name?: string;
  email?: string;
  phone?: string;
  category?: 'Work' | 'Family' | 'Friends' | 'Other';
  message?: string;
}

export interface GetContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: 'All' | 'Work' | 'Family' | 'Friends' | 'Other';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  errors?: Array<{ field: string; message: string }>;
}

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: PaginationMeta;
}

export interface BulkDeleteResponse {
  success: boolean;
  deletedCount: number;
  message: string;
}
