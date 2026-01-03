import { Contact } from '../models/contactModel.js';
import { AppError } from '../middlewares/errorHandler.js';
import { CreateContactInput, UpdateContactInput } from '../validators/contactValidation.js';

// Get all contacts with pagination, search, and filtering
export const getContactsAggregated = async (
  page: number, 
  limit: number, 
  search?: string, 
  category?: string
) => {
  const skip = (page - 1) * limit;
  const matchStage: any = {};

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  if (category && category !== 'All') {
    matchStage.category = category;
  }

  const result = await Contact.aggregate([
    { $match: matchStage },
    {
      $facet: {
        data: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }]
      }
    },
    {
      $project: {
        contacts: "$data",
        total: { $arrayElemAt: ["$meta.total", 0] }
      }
    }
  ]);

  return {
    contacts: result[0].contacts,
    total: result[0].total || 0,
    page,
    totalPages: Math.ceil((result[0].total || 0) / limit)
  };
};

// Create a new contact
export const createContact = async (data: CreateContactInput) => {
  const contact = await Contact.create(data);
  return contact;
};

// Get contact by ID
export const getContactById = async (id: string) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new AppError('Contact not found', 404);
  }
  return contact;
};

// Update contact by ID
export const updateContact = async (id: string, data: UpdateContactInput) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  
  if (!contact) {
    throw new AppError('Contact not found', 404);
  }
  
  return contact;
};

// Delete contact by ID
export const deleteContact = async (id: string) => {
  const contact = await Contact.findByIdAndDelete(id);
  
  if (!contact) {
    throw new AppError('Contact not found', 404);
  }
  
  return contact;
};

// Bulk delete contacts
export const bulkDeleteContacts = async (ids: string[]) => {
  const result = await Contact.deleteMany({ _id: { $in: ids } });
  
  if (result.deletedCount === 0) {
    throw new AppError('No contacts found to delete', 404);
  }
  
  return {
    deletedCount: result.deletedCount,
    message: `Successfully deleted ${result.deletedCount} contact(s)`
  };
};
