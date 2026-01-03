import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '../validation/contactSchema';
import { useCreateContact } from '../hooks/useCreateContact';
import { useUpdateContact } from '../hooks/useUpdateContact';
import { Button, Input, Select, Textarea } from '../../../components/ui';
import type { Contact } from '../../../types/contact';

interface ContactFormProps {
  initialData?: Contact;
  onSuccess?: () => void;
}

export const ContactForm = ({ initialData, onSuccess }: ContactFormProps) => {
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      category: initialData.category,
      message: initialData.message || '',
    } : {
      category: 'Other',
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData._id, data });
      } else {
        await createMutation.mutateAsync(data);
        reset();
      }
      onSuccess?.();
    } catch {
      // Error is handled by React Query
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        {...register("name")}
        label="Full Name *"
        placeholder="e.g., John Doe"
        error={errors.name?.message}
        disabled={isLoading}
      />
      
      <Input
        {...register("email")}
        label="Email Address *"
        type="email"
        placeholder="e.g., john@example.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <Input
        {...register("phone")}
        label="Phone Number *"
        placeholder="e.g., 1234567890"
        error={errors.phone?.message}
        disabled={isLoading}
      />

      <Select
        {...register("category")}
        label="Category"
        error={errors.category?.message}
        disabled={isLoading}
      >
        <option value="Work">💼 Work</option>
        <option value="Family">👨‍👩‍👧‍👦 Family</option>
        <option value="Friends">🤝 Friends</option>
        <option value="Other">📌 Other</option>
      </Select>

      <Textarea
        {...register("message")}
        label="Additional Notes (Optional)"
        placeholder="Any additional information about this contact..."
        rows={4}
        error={errors.message?.message}
        disabled={isLoading}
      />
      
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full py-3"
      >
        {initialData ? 'Update Contact' : 'Create Contact'}
      </Button>

      {(createMutation.isError || updateMutation.isError) && (
        <div className="bg-linear-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-red-700 text-sm mt-1">
                {(createMutation.error || updateMutation.error)?.message || 'Something went wrong'}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};