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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name")}
        label="Name *"
        placeholder="John Doe"
        error={errors.name?.message}
        disabled={isLoading}
      />
      
      <Input
        {...register("email")}
        label="Email *"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <Input
        {...register("phone")}
        label="Phone *"
        placeholder="1234567890"
        error={errors.phone?.message}
        disabled={isLoading}
      />

      <Select
        {...register("category")}
        label="Category"
        error={errors.category?.message}
        disabled={isLoading}
      >
        <option value="Work">Work</option>
        <option value="Family">Family</option>
        <option value="Friends">Friends</option>
        <option value="Other">Other</option>
      </Select>

      <Textarea
        {...register("message")}
        label="Message (Optional)"
        placeholder="Additional notes..."
        rows={4}
        error={errors.message?.message}
        disabled={isLoading}
      />
      
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full"
      >
        {initialData ? 'Update Contact' : 'Create Contact'}
      </Button>

      {(createMutation.isError || updateMutation.isError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">
            Error: {(createMutation.error || updateMutation.error)?.message || 'Something went wrong'}
          </p>
        </div>
      )}
    </form>
  );
};