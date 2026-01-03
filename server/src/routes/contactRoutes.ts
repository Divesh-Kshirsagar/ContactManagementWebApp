import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createContactSchema,
  updateContactSchema,
  getContactsSchema,
  getContactByIdSchema,
  deleteContactSchema,
  bulkDeleteSchema,
} from '../validators/contactValidation.js';

const router = Router();

// Health check route
router.get('/healthcheck', contactController.healthCheck);

// Get all contacts (with pagination, search, filter)
router.get(
  '/contacts',
  validateRequest(getContactsSchema),
  contactController.getContacts
);

// Get single contact by ID
router.get(
  '/contacts/:id',
  validateRequest(getContactByIdSchema),
  contactController.getContactById
);

// Create new contact
router.post(
  '/contacts',
  validateRequest(createContactSchema),
  contactController.createContact
);

// Update contact by ID
router.put(
  '/contacts/:id',
  validateRequest(updateContactSchema),
  contactController.updateContact
);

// Delete single contact
router.delete(
  '/contacts/:id',
  validateRequest(deleteContactSchema),
  contactController.deleteContact
);

// Bulk delete contacts
router.post(
  '/contacts/bulk-delete',
  validateRequest(bulkDeleteSchema),
  contactController.bulkDeleteContacts
);

export default router;
