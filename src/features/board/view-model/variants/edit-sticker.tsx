import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface EditStickerViewState {
  type: 'edit-sticker';
  stickerId: string;
  newText?: string;
}

export const useEditStickerViewModel = ({
  nodesModel,
  //   canvasRect,
  setViewState,
}: ViewModelProps) => {
  return (viewState: EditStickerViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => {
      if (node.id === viewState.stickerId) {
        return {
          ...node,
          isSelected: true,
          isEditing: true,
          text: viewState.newText ?? node.text,
          onTextChange: (text: string) => {
            setViewState({
              ...viewState,
              newText: text,
            });
          },
        };
      }

      return node;
    }),
    layout: {
      onKeyDown: (e) => {
        if (e.key === 'Escape') {
          if (viewState.newText) {
            nodesModel.updateStickerText(viewState.stickerId, viewState.newText);
          }
          setViewState(goToIdle());
        }
      },
    },
    overlay: {
      onClick: () => {
        setViewState(goToIdle());
        if (viewState.newText) {
          nodesModel.updateStickerText(viewState.stickerId, viewState.newText);
        }
      },
    },
    actions: {
      idleState: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
    },
  });
};

export const goToEditSticker = (stickerId: string): EditStickerViewState => {
  return {
    type: 'edit-sticker',
    stickerId,
  };
};
