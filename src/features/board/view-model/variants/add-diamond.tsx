import { distanceFromPoints, type Point } from '../../domain/point';
import { createRectFromPoints } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import { configuration } from '../../model/nodes';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddDiamondViewState {
  type: 'add-diamond';
  start?: Point;
  end?: Point;
}

export const useAddDiamondViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  return (state: AddDiamondViewState): ViewModel => {
    const rect = state.start && state.end && createRectFromPoints(state.start, state.end);

    const newNodes = rect
      ? [
          ...nodesModel.nodes,
          {
            id: 'drawing-diamond',
            type: 'diamond' as const,
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
            nodesModel.addDiamondNode({
              ...rect,
            });
          }

          if (lockActions.lock) {
            setViewState(goToAddDiamond());
            return;
          }

          setViewState(goToIdle());
        },
      },
      actions: {
        addDiamond: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToAddDiamond = ({
  start,
  end,
}: {
  start?: Point;
  end?: Point;
} = {}): AddDiamondViewState => {
  return {
    type: 'add-diamond',
    start,
    end,
  };
};
