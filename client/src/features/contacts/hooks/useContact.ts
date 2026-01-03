import { useQuery } from '@tanstack/react-query';
import { getContact } from '../api/contactApi';

export const useContact = (id: string) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id),
    enabled: !!id,
  });
};
