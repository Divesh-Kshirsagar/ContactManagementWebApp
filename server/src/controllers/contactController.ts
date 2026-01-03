import { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contactService.js';

// Get all contacts with pagination, search, and filtering
export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const result = await contactService.getContactsAggregated(
      Number(page),
      Number(limit),
      search as string,
      category as string
    );

    res.status(200).json({
      success: true,
      data: result.contacts,
      pagination: {
        page: result.page,
        limit: Number(limit),
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single contact by ID
export const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Create new contact
export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contact = await contactService.createContact(req.body);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Update contact by ID
export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await contactService.updateContact(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact by ID
export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await contactService.deleteContact(id);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Bulk delete contacts
export const bulkDeleteContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.body;
    const result = await contactService.bulkDeleteContacts(ids);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Health check endpoint
export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};