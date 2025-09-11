import type { IdleViewState } from '../idle';
import type { ViewModelProps } from '../../view-model';
import { goToEditSticker } from '../edit-sticker';

export const useGoToEditSticker = ({ setViewState }: ViewModelProps) => {
  const handleGoToEditSticker = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent
  ) => {
    if (
      idleState.selectedIds.size === 1 &&
      idleState.selectedIds.has(nodeId) &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      setViewState(goToEditSticker(nodeId));
      return { preventNext: true };
    }

    return {
      preventNext: false,
    };
  };

  return {
    handleGoToEditSticker,
  };
};
