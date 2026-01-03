import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContact } from '../api/contactApi';
import { CreateContactData } from '../../../types/contact';

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactData) => createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
