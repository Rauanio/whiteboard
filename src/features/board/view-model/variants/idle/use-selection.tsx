import { selectNodes, type SelectionModifier } from '@/features/board/domain/selection';
import { goToIdle, type IdleViewState } from '../idle';
import type { ViewModelProps } from '../../view-model';

export const useSelection = ({ setViewState }: ViewModelProps) => {
  const selection = (
    lastIdleState: IdleViewState,
    ids: string[],
    modif: SelectionModifier
  ) => {
    setViewState({
      ...lastIdleState,
      selectedIds: selectNodes(lastIdleState.selectedIds, ids, modif),
    });
  };

  const isSelected = (idleState: IdleViewState, nodeId: string) => {
    return idleState.selectedIds.has(nodeId);
  };

  const handleNodeSelect = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent
  ) => {
    console.log(nodeId);

    if (e.ctrlKey || e.shiftKey) {
      selection(idleState, [nodeId], 'toggle');
    } else {
      selection(idleState, [nodeId], 'replace');
    }
  };

  const handleOverlayMouseUp = (idleState: IdleViewState) => {
    if (idleState.onMouseDown) {
      setViewState(
        goToIdle({
          ...idleState,
          selectedIds: selectNodes(idleState.selectedIds, [], 'replace'),
        })
      );
    }
  };

  return {
    isSelected,
    handleNodeSelect,
    handleOverlayMouseUp,
  };
};
