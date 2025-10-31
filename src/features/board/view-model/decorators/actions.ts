import { goToAddArrow } from '../variants/add-arrow';
import { goToAddRectangle } from '../variants/add-rectangle';
import { goToAddSticker } from '../variants/add-sticker';
import { goToCanvasDragging } from '../variants/canvas-dragging';
import { goToIdle } from '../variants/idle';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';

export const useActionsDecorator = ({ setViewState }: ViewModelProps) => {
  return (viewModel: ViewModel): ViewModel => ({
    ...viewModel,
    layout: {
      ...viewModel.layout,
      onKeyDown: (e) => {
        if (e.key === 'Escape') {
          setViewState(goToIdle());
        }
        if (e.key === 's') {
          setViewState(goToAddSticker());
        }

        if (e.key === 'r') {
          setViewState(goToAddRectangle());
        }
        if (e.key === 'h') {
          setViewState(goToCanvasDragging());
        }
        if (e.key === 'a') {
          setViewState(goToAddArrow());
        }
        viewModel.layout?.onKeyDown?.(e);
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
        isActive: false,
        onClick: () => setViewState(goToAddRectangle()),
      },
      addArrow: {
        isActive: false,
        onClick: () => setViewState(goToAddArrow()),
      },
      canvasDragging: {
        isActive: false,
        onClick: () => setViewState(goToCanvasDragging()),
      },
      ...viewModel.actions,
    },
  });
};
