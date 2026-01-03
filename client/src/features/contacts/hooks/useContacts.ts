import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../api/contactApi';
import type { GetContactsParams } from '../../../types/contact';

export const useContacts = (params?: GetContactsParams) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => getContacts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
