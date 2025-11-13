import { distanceFromPoints, type Point } from '../../domain/point';
import { createRectFromPoints } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddCircleViewState {
  type: 'add-circle';
  start?: Point;
  end?: Point;
}

export const useAddCircleViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  return (state: AddCircleViewState): ViewModel => {
    const rect = state.start && state.end && createRectFromPoints(state.start, state.end);

    const newNodes = rect
      ? [
          ...nodesModel.nodes,
          {
            id: 'drawing-circle',
            type: 'circle' as const,
            text: '',
            x: rect?.x,
            y: rect.y,
            width: rect?.width,
            height: rect?.height,
          },
        ]
      : nodesModel.nodes;

    return {
      nodes: newNodes,
      layout: {
        cursor: 'cursor-crosshair',
      },
      overlay: {
        onMouseDown: (e) => {
          setViewState({
            ...state,
            start: pointOnScreenToCanvas(
              {
                x: e.clientX,
                y: e.clientY,
              },
              windowPositionModel.position,
              canvasRect
            ),
          });
        },
      },
      window: {
        onMouseMove: (e) => {
          if (state.start) {
            const currentPoint = pointOnScreenToCanvas(
              {
                x: e.clientX,
                y: e.clientY,
              },
              windowPositionModel.position,
              canvasRect
            );

            if (distanceFromPoints(state.start, currentPoint) > 10) {
              setViewState({
                ...state,
                end: currentPoint,
              });
            }
          }
        },
        onMouseUp: () => {
          if (rect) {
            nodesModel.addCircleNode({
              ...rect,
            });
          }

          if (lockActions.lock) {
            setViewState(goToAddCircle());
            return;
          }

          setViewState(goToIdle());
        },
      },
      actions: {
        addCircle: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToAddCircle = ({
  start,
  end,
}: {
  start?: Point;
  end?: Point;
} = {}): AddCircleViewState => {
  return {
    type: 'add-circle',
    start,
    end,
  };
};
