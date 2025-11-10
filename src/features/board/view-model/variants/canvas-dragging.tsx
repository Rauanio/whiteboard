import { diffPoints, type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface CanvasDraggingViewState {
  type: 'canvas-dragging';
  startPoint?: Point;
  endPoint?: Point;
}

export const useCanvasDraggingViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  return (state: CanvasDraggingViewState): ViewModel => {
    const { startPoint, endPoint } = state;

    const handlePointerToCanvas = (e: MouseEvent | React.MouseEvent): Point =>
      pointOnScreenToCanvas(
        { x: e.clientX, y: e.clientY },
        windowPositionModel.position,
        canvasRect
      );

    const diff = startPoint && endPoint && diffPoints(startPoint, endPoint);

    return {
      nodes: nodesModel.nodes,
      windowPosition: diff
        ? {
            x: windowPositionModel.position.x - diff.x,
            y: windowPositionModel.position.y - diff.y,
            zoom: windowPositionModel.position.zoom,
          }
        : undefined,
      layout: {
        cursor: diff ? 'cursor-grabbing' : 'cursor-grab',
      },
      overlay: {
        onMouseDown: (e) => {
          setViewState({
            ...state,
            startPoint: handlePointerToCanvas(e),
          });
        },
      },
      window: {
        onMouseMove: (e) => {
          const currentPoint = handlePointerToCanvas(e);

          setViewState({
            ...state,
            endPoint: currentPoint,
          });
        },
        onMouseUp: () => {
          if (diff) {
            windowPositionModel.setPosition({
              x: windowPositionModel.position.x - diff.x,
              y: windowPositionModel.position.y - diff.y,
              zoom: windowPositionModel.position.zoom,
            });
            setViewState({
              ...state,
              endPoint: undefined,
              startPoint: undefined,
            });
          }
        },
      },
      actions: {
        canvasDragging: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
        lockActions: {
          isActive: lockActions.lock,
        },
      },
    };
  };
};

export const goToCanvasDragging = ({
  endPoint,
  startPoint,
}: {
  startPoint?: Point;
  endPoint?: Point;
} = {}): CanvasDraggingViewState => {
  return {
    type: 'canvas-dragging',
    startPoint,
    endPoint,
  };
};
