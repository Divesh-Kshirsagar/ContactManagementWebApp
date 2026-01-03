import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '../validation/contactSchema';
import { useCreateContact } from '../hooks/useCreateContact';
import { useUpdateContact } from '../hooks/useUpdateContact';
import type { Contact } from '../../../types/contact';

interface ContactFormProps {
  initialData?: Contact;
  onSuccess?: () => void;
}

export const ContactForm = ({ initialData, onSuccess }: ContactFormProps) => {
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
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
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input 
          {...register("name")} 
          placeholder="Name" 
          className="border p-2 w-full rounded"
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <input 
          {...register("email")} 
          placeholder="Email" 
          type="email"
          className="border p-2 w-full rounded"
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input 
          {...register("phone")} 
          placeholder="Phone" 
          className="border p-2 w-full rounded"
          disabled={isLoading}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <select 
          {...register("category")} 
          className="border p-2 w-full rounded"
          disabled={isLoading}
        >
          <option value="Work">Work</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <textarea 
          {...register("message")} 
          placeholder="Message (optional)" 
          className="border p-2 w-full rounded"
          rows={4}
          disabled={isLoading}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isLoading || isSubmitting}
      >
        {isLoading ? 'Submitting...' : initialData ? 'Update Contact' : 'Create Contact'}
      </button>

      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-red-500 text-sm">
          Error: {(createMutation.error || updateMutation.error)?.message || 'Something went wrong'}
        </p>
      )}
    </form>
  );
};