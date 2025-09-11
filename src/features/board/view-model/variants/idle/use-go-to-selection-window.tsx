import { distanceFromPoints } from '@/features/board/domain/point';
import { pointOnScreenToCanvas } from '@/features/board/domain/screen-to-canvas';
import { goToSelectionWindow } from '../selection-window';
import type { ViewModelProps } from '../../view-model';
import type { IdleViewState } from '../idle';

export const useGoToSelectionWindow = ({
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelProps) => {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (idleState.onMouseDown) {
      const currentPoint = pointOnScreenToCanvas(
        {
          x: e.clientX,
          y: e.clientY,
        },
        windowPositionModel.position,
        canvasRect
      );

      if (distanceFromPoints(idleState.onMouseDown, currentPoint) > 10) {
        setViewState(
          goToSelectionWindow({
            startPoint: idleState.onMouseDown,
            endPoint: currentPoint,
            initialSelectedIds: e.shiftKey ? idleState.selectedIds : undefined,
          })
        );
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
};
