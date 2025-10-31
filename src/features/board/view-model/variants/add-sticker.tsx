import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddStickerViewState {
  type: 'add-sticker';
}

export const useAddStickerViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
}: ViewModelProps) => {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      cursor: 'cursor-sticker',
    },
    canvas: {
      onClick: (e) => {
        if (!canvasRect) return;

        const point = pointOnScreenToCanvas(
          { x: e.clientX, y: e.clientY },
          windowPositionModel.position,
          canvasRect
        );

        nodesModel.addStickerNode({
          text: 'Default',
          x: point.x,
          y: point.y,
        });
        setViewState(goToIdle());
      },
    },
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
    },
  });
};

export const goToAddSticker = (): AddStickerViewState => {
  return {
    type: 'add-sticker',
  };
};
