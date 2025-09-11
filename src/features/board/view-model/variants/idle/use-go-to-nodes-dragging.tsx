import { pointOnScreenToCanvas } from '@/features/board/domain/screen-to-canvas';
import type { IdleViewState } from '../idle';
import type { ViewModelProps } from '../../view-model';
import { distanceFromPoints } from '@/features/board/domain/point';
import { goToNodesDragging } from '../nodes-dragging';

export const useGoToNodesDragging = ({
  canvasRect,
  setViewState,
  windowPositionModel,
}: ViewModelProps) => {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (idleState.onMouseDown && idleState.onMouseDown.type === 'node') {
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
          goToNodesDragging({
            startPoint: idleState.onMouseDown,
            endPoint: currentPoint,
            nodesToDrag: new Set([
              ...idleState.selectedIds,
              idleState.onMouseDown.nodeId,
            ]),
          })
        );
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
};
