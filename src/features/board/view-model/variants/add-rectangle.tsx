import { distanceFromPoints, type Point } from '../../domain/point';
import { createRectFromPoints } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import { configuration } from '../../model/nodes';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddRectangleViewState {
  type: 'add-rectangle';
  start?: Point;
  end?: Point;
}

export const useAddRectangleViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  return (state: AddRectangleViewState): ViewModel => {
    const rect = state.start && state.end && createRectFromPoints(state.start, state.end);

    const newNodes = rect
      ? [
          ...nodesModel.nodes,
          {
            id: 'drawing-rectangle',
            type: 'rectangle' as const,
            text: '',
            x: rect?.x,
            y: rect.y,
            width: rect?.width,
            height: rect?.height,
            configuration: configuration,
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
            nodesModel.addRectangleNode({
              text: '',
              ...rect,
            });
          }

          if (lockActions.lock) {
            setViewState(goToAddRectangle());
            return;
          }

          setViewState(goToIdle());
        },
      },
      actions: {
        addRectangle: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToAddRectangle = ({
  start,
  end,
}: {
  start?: Point;
  end?: Point;
} = {}): AddRectangleViewState => {
  return {
    type: 'add-rectangle',
    start,
    end,
  };
};
