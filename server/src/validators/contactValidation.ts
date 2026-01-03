import { z } from 'zod';

// Contact Schema for Create
export const createContactSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters')
      .trim(),
    email: z
      .string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
      .trim(),
    category: z
      .enum(['Work', 'Family', 'Friends', 'Other'])
      .default('Other'),
    message: z
      .string()
      .max(500, 'Message must not exceed 500 characters')
      .optional(),
  }),
});

// Contact Schema for Update
export const updateContactSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid contact ID'),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
      .optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
      .trim()
      .optional(),
    category: z
      .enum(['Work', 'Family', 'Friends', 'Other'])
      .optional(),
    message: z
      .string()
      .max(500, 'Message must not exceed 500 characters')
      .optional(),
  }),
});

// Query Schema for GET requests
export const getContactsSchema = z.object({
  query: z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(5000).default(10), // Increased to 5000 for client-side filtering
    search: z.string().optional(),
    category: z.enum(['All', 'Work', 'Family', 'Friends', 'Other']).optional(),
  }),
});

// Schema for getting single contact
export const getContactByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid contact ID'),
  }),
});

// Schema for deleting single contact
export const deleteContactSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid contact ID'),
  }),
});

// Schema for bulk delete
export const bulkDeleteSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid contact ID'))
      .min(1, 'At least one contact ID is required')
      .max(100, 'Cannot delete more than 100 contacts at once'),
  }),
});

// Export types
export type CreateContactInput = z.infer<typeof createContactSchema>['body'];
export type UpdateContactInput = z.infer<typeof updateContactSchema>['body'];
export type GetContactsQuery = z.infer<typeof getContactsSchema>['query'];
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>['body'];
