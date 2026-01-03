import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { Contact } from '../../../types/contact';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ContactCard = ({ 
  contact, 
  isSelected, 
  onToggleSelect, 
  onDelete,
  isDeleting 
}: ContactCardProps) => {
  return (
    <div 
      className={`group relative border rounded-xl p-5 bg-white transition-all duration-200 ${
        isSelected 
          ? 'border-indigo-400 shadow-lg ring-2 ring-indigo-100' 
          : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(contact._id)}
            className="h-5 w-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border-gray-300 rounded-md cursor-pointer transition-all hover:border-indigo-400"
            aria-label={`Select ${contact.name}`}
          />
        </div>
        
        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {contact.name}
              </h3>
              <Badge variant={contact.category as 'Work' | 'Family' | 'Friends' | 'Other'}>
                {contact.category}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Email */}
            <div className="flex items-center gap-2 text-sm text-gray-600 group/item hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a 
                href={`mailto:${contact.email}`}
                className="truncate hover:underline"
              >
                {contact.email}
              </a>
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-gray-600 group/item hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                href={`tel:${contact.phone}`}
                className="hover:underline"
              >
                {contact.phone}
              </a>
            </div>

            {/* Message if exists */}
            {contact.message && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 italic line-clamp-2">
                  "{contact.message}"
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Delete Button */}
        <div className="shrink-0">
          <Button
            onClick={() => onDelete(contact._id)}
            variant="danger"
            isLoading={isDeleting}
            className="text-sm px-4 py-2"
            aria-label={`Delete ${contact.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
