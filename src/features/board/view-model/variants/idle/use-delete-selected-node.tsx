import type { ViewModelProps } from '../../view-model';
import type { IdleViewState } from '../idle';

export const useDeleteSelectedNode = ({ nodesModel, setViewState }: ViewModelProps) => {
  const deleteSelectedNodes = (idleState: IdleViewState) => {
    if (idleState.selectedIds.size > 0) {
      const ids = Array.from(idleState.selectedIds);
      nodesModel.deleteNodes(ids);
      setViewState({
        ...idleState,
        selectedIds: new Set(),
      });
    }
  };

  const handleDeleteNode = (
    idleState: IdleViewState,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      deleteSelectedNodes(idleState);
    }
  };

  return {
    handleDeleteNode,
  };
};
