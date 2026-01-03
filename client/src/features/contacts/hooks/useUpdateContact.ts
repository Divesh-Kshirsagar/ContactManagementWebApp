import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContact } from '../api/contactApi';
import type { UpdateContactData } from '../../../types/contact';

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactData }) =>
      updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', variables.id] });
    },
  });
};
