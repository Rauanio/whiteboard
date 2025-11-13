import { goToAddArrow } from '../variants/add-arrow';
import { goToAddCircle } from '../variants/add-circle';
import { goToAddFreeHand } from '../variants/add-free-hand';
import { goToAddRectangle } from '../variants/add-rectangle';
import { goToAddSticker } from '../variants/add-sticker';
import { goToCanvasDragging } from '../variants/canvas-dragging';
import { goToIdle } from '../variants/idle';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';

export const useActionsDecorator = ({ setViewState, lockActions }: ViewModelProps) => {
  return (viewModel: ViewModel): ViewModel => ({
    ...viewModel,
    layout: {
      ...viewModel.layout,
      onKeyDown: (e) => {
        if (e.key === 'Escape' || e.key === '1') {
          setViewState(goToIdle());
        }
        if (e.key === 'h' || e.key === '2') {
          setViewState(goToCanvasDragging());
        }
        if (e.key === 's' || e.key === '3') {
          setViewState(goToAddSticker());
        }
        if (e.key === 'r' || e.key === '4') {
          setViewState(goToAddRectangle());
        }
        if (e.key === 'a' || e.key === '7') {
          setViewState(goToAddArrow());
        }
        if (e.key === 'f' || e.key === '9') {
          setViewState(goToAddFreeHand());
        }
        viewModel.layout?.onKeyDown?.(e);
      },
    },
    actions: {
      lockActions: {
        isActive: lockActions.lock,
        onClick: () => lockActions.setLock((prev) => !prev),
      },
      idleState: {
        isActive: false,
        onClick: () => setViewState(goToIdle()),
      },
      addSticker: {
        isActive: false,
        onClick: () => setViewState(goToAddSticker()),
      },
      addRectangle: {
        isActive: false,
        onClick: () => setViewState(goToAddRectangle()),
      },
      addCircle: {
        isActive: false,
        onClick: () => setViewState(goToAddCircle()),
      },
      addArrow: {
        isActive: false,
        onClick: () => setViewState(goToAddArrow()),
      },
      addFreeHand: {
        isActive: false,
        onClick: () => setViewState(goToAddFreeHand()),
      },
      canvasDragging: {
        isActive: false,
        onClick: () => setViewState(goToCanvasDragging()),
      },
      ...viewModel.actions,
    },
  });
};
