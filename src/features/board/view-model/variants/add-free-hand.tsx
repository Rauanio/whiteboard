import type { FreeHandPoints } from '../../domain/svg';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddFreeHandViewState {
  type: 'add-free-hand';
  points: FreeHandPoints;
}

export const useAddFreeHandViewModel = ({ nodesModel, setViewState }: ViewModelProps) => {
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
        cursor: 'cursor-crosshair',
      },
      overlay: {
        onMouseDown: (e) => {
          setViewState({
            ...state,
            points: [[e.pageX, e.pageY]],
          });
        },
      },
      window: {
        onMouseMove: (e) => {
          if (e.buttons !== 1) return;
          setViewState({
            ...state,
            points: [...state.points, [e.pageX, e.pageY]],
          });
        },
        onMouseUp: () => {
          console.log('ON MOUSE UP !');
          
          nodesModel.addFreeHandNode(state.points);
          setViewState(goToIdle());
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
