import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { FreeHandPoints } from '../../domain/svg';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddFreeHandViewState {
  type: 'add-free-hand';
  points: FreeHandPoints;
}

export const useAddFreeHandViewModel = ({
  nodesModel,
  setViewState,
  windowPositionModel,
  canvasRect,
}: ViewModelProps) => {
  return (state: AddFreeHandViewState): ViewModel => {
    const newNodes = state.points
      ? [
          ...nodesModel.nodes,
          {
            id: 'drawing-free-fand',
            type: 'free-hand' as const,
            points: state.points,
            noPointerEvents: true,
          },
        ]
      : nodesModel.nodes;

    return {
      nodes: newNodes,
      layout: {
        cursor: 'cursor-pencil',
      },
      hints: <>Click and drag, release when you're finished</>,
      overlay: {
        onMouseDown: (e) => {
          const point = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            windowPositionModel.position,
            canvasRect
          );
          setViewState({
            ...state,
            points: [[point.x, point.y]],
          });
        },
      },
      window: {
        onMouseMove: (e) => {
          if (e.buttons !== 1) return;
          const point = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            windowPositionModel.position,
            canvasRect
          );

          setViewState({
            ...state,
            points: [...state.points, [point.x, point.y]],
          });
        },
        onMouseUp: () => {
          nodesModel.addFreeHandNode({
            points: state.points,
          });
        },
      },
      actions: {
        addFreeHand: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToAddFreeHand = ({
  points,
}: {
  points?: FreeHandPoints;
} = {}): AddFreeHandViewState => {
  return {
    type: 'add-free-hand',
    points: points ?? [],
  };
};
