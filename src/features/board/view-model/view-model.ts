import type { NodesModel } from '../model/nodes';
import type { CanvasRect } from '../hooks/use-canvas-rect';
import type { ViewModel } from './view-model-type';
import { useAddStickerViewModel, type AddStickerViewState } from './variants/add-sticker';
import { goToIdle, useIdleViewModel, type IdleViewState } from './variants/idle';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  useSelectionWindowViewModel,
  type SelectionWindowViewState,
} from './variants/selection-window';
import {
  useAddRectangleViewModel,
  type AddRectangleViewState,
} from './variants/add-rectangle';
import type { NodesDimensionsMap } from '../hooks/use-nodes-rects';
import {
  useEditStickerViewModel,
  type EditStickerViewState,
} from './variants/edit-sticker';
import {
  useNodesDraggingViewModel,
  type NodesDraggingViewState,
} from './variants/nodes-dragging';
import {
  useCanvasDraggingViewModel,
  type CanvasDraggingViewState,
} from './variants/canvas-dragging';
import type { WindowPositionModel } from '../model/window-position';
import { useZoomDecorator } from './decorators/zoom';
import { useActionsDecorator } from './decorators/actions';
import { useAddArrowViewModel, type AddArrowViewState } from './variants/add-arrow';
import { useResolveRelativeStaticDecorator } from './decorators/resolve-relative';
import {
  useNodesResizingViewModel,
  type NodesResizingViewState,
} from './variants/nodes-resizing';
import {
  useAddFreeHandViewModel,
  type AddFreeHandViewState,
} from './variants/add-free-hand';

type ViewState =
  | IdleViewState
  | AddStickerViewState
  | AddRectangleViewState
  | AddArrowViewState
  | AddFreeHandViewState
  | EditStickerViewState
  | NodesResizingViewState
  | SelectionWindowViewState
  | NodesDraggingViewState
  | CanvasDraggingViewState;

export interface ViewModelProps {
  setViewState: Dispatch<SetStateAction<ViewState>>;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
  nodesDimensions: NodesDimensionsMap;
  windowPositionModel: WindowPositionModel;
}

export const useViewModel = (props: Omit<ViewModelProps, 'setViewState'>) => {
  const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

  const newProps = {
    ...props,
    setViewState,
  };

  const idleViewModel = useIdleViewModel(newProps);
  const addStickerViewModel = useAddStickerViewModel(newProps);
  const addArrowViewModel = useAddArrowViewModel(newProps);
  const editStickerViewModel = useEditStickerViewModel(newProps);
  const addRectangleViewModel = useAddRectangleViewModel(newProps);
  const addFreeHandViewModel = useAddFreeHandViewModel(newProps);
  const selectionWindowViewModel = useSelectionWindowViewModel(newProps);
  const nodesDraggingViewModel = useNodesDraggingViewModel(newProps);
  const nodesResizingViewModel = useNodesResizingViewModel(newProps);
  const canvasDraggingViewModel = useCanvasDraggingViewModel(newProps);
  const actionsDecorator = useActionsDecorator(newProps);
  const zoomDecorator = useZoomDecorator(newProps);

  let viewModel: ViewModel;

  switch (viewState.type) {
    case 'idle':
      viewModel = actionsDecorator(idleViewModel(viewState));
      break;
    case 'add-sticker':
      viewModel = actionsDecorator(addStickerViewModel());
      break;
    case 'edit-sticker':
      viewModel = editStickerViewModel(viewState);
      break;
    case 'add-rectangle':
      viewModel = actionsDecorator(addRectangleViewModel(viewState));
      break;
    case 'add-arrow':
      viewModel = actionsDecorator(addArrowViewModel(viewState));
      break;
    case 'add-free-hand':
      viewModel = actionsDecorator(addFreeHandViewModel(viewState));
      break;
    case 'selection-window':
      viewModel = selectionWindowViewModel(viewState);
      break;
    case 'nodes-dragging':
      console.log(viewState);
      viewModel = nodesDraggingViewModel(viewState);
      break;
    case 'nodes-resizing':
      console.log(viewState);
      viewModel = nodesResizingViewModel(viewState);
      break;
    case 'canvas-dragging':
      viewModel = actionsDecorator(canvasDraggingViewModel(viewState));
      break;
    default:
      throw new Error('View model is not found');
  }

  viewModel = useResolveRelativeStaticDecorator(viewModel);
  viewModel = zoomDecorator(viewModel);

  return viewModel;
};
