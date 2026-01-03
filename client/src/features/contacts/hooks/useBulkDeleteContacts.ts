import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkDeleteContacts } from '../api/contactApi';

export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteContacts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
