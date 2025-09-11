import { rqClient } from '@/shared/api/instance';
import { useConfirmDialog } from '@/shared/ui/confirm-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const { openConfirmDialog } = useConfirmDialog();

  const deleteBoardMutation = rqClient.useMutation('delete', '/boards/{boardId}', {
    onSettled: async () => {
      await queryClient.invalidateQueries(rqClient.queryOptions('get', '/boards'));
    },
  });

  const deleteBoard = useCallback(
    async (boardId: string) => {
      const confirmed = await openConfirmDialog({
        title: 'Вы уверены что хотите удалить доску?',
        description: `Это действие не может быть отменено. Это навсегда удалит доску из наших серверов`,
        confirmText: 'Все равно удалить',
      });

      if (confirmed) {
        deleteBoardMutation.mutate({ params: { path: { boardId } } });
      }
    },
    [openConfirmDialog, deleteBoardMutation]
  );

  return {
    deleteBoard,
    getIsPending: (boardId: string) =>
      deleteBoardMutation.isPending &&
      deleteBoardMutation.variables.params.path.boardId === boardId,
  };
};
