import { z } from 'zod';

export const contactSchema = z.object({
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
    .min(10, 'Phone number must be at least 10 characters')
    .trim(),
  category: z.enum(['Work', 'Family', 'Friends', 'Other']),
  message: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;
