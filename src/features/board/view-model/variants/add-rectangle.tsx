import { distanceFromPoints, type Point } from '../../domain/point';
import { createRectFromPoints } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToAddSticker } from './add-sticker';
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
}: ViewModelProps) => {
  return (state: AddRectangleViewState): ViewModel => {
    const rect = state.start && state.end && createRectFromPoints(state.start, state.end);

    return {
      nodes: nodesModel.nodes,
      rectangleWindow: state.start && rect,
      layout: {
        onKeyDown: (e) => {
          if (e.key === 'Escape') {
            setViewState(goToIdle());
          }
        },
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
          setViewState(goToIdle());
        },
      },
      actions: {
        idleState: {
          isActive: false,
          onClick: () => setViewState(goToIdle()),
        },
        addSticker: {
          isActive: false,
          onClick: () => setViewState(goToAddSticker()),
        },
        addRectangle: {
          isActive: true,
          onClick: () => setViewState(goToAddRectangle()),
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
