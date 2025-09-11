import { rqClient } from '@/shared/api/instance';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  const createBoardMutation = rqClient.useMutation('post', '/boards', {
    onSettled: async () => {
      await queryClient.invalidateQueries(rqClient.queryOptions('get', '/boards'));
    },
  });

  return {
    createBoard: () => createBoardMutation.mutate({}),
    isPending: createBoardMutation.isPending,
  };
};
