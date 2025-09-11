import { type Point } from '../../../domain/point';
import type { ViewModelProps } from '../../view-model';
import type { ViewModel } from '../../view-model-type';
import { useDeleteSelectedNode } from './use-delete-selected-node';
import { useGoToAddSticker } from './use-go-to-add-sticker';
import { useGoToEditSticker } from './use-go-to-edit-sticker';
import { useGoToSelectionWindow } from './use-go-to-selection-window';
import { useMouseDown } from './use-mouse-down';
import { useSelection } from './use-selection';
import { useGoToNodesDragging } from './use-go-to-nodes-dragging';
import { useGoToAddRectangle } from './use-go-to-add-rectangle';
import { useGoToCanvasDragging } from './use-go-to-canvas-dragging';

export interface IdleViewState {
  type: 'idle';
  selectedIds: Set<string>;
  onMouseDown?:
    | ({
        type: 'overlay';
      } & Point)
    | ({
        type: 'node';
        nodeId: string;
      } & Point);
}

export const useIdleViewModel = (props: ViewModelProps) => {
  const { nodesModel, setViewState } = props;

  const selection = useSelection(props);
  const deleteNode = useDeleteSelectedNode(props);
  const goToAddSticker = useGoToAddSticker(props);
  const goToEditSticker = useGoToEditSticker(props);
  const goToAddRectangle = useGoToAddRectangle(props);
  const goToSelectionWindow = useGoToSelectionWindow(props);
  const goToNodesDragging = useGoToNodesDragging(props);
  const goToCanvasDragging = useGoToCanvasDragging(props);
  const mouseDown = useMouseDown(props);

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),
      onMouseDown: (e) => {
        mouseDown.handleNodeMouseDown(idleState, node.id, e);
      },
      onMouseUp: (e) => {
        if (!mouseDown.getIsNodeMouseDown(idleState, node.id)) {
          return;
        }
        const clickResult = goToEditSticker.handleGoToEditSticker(idleState, node.id, e);
        if (clickResult.preventNext) return;

        selection.handleNodeSelect(idleState, node.id, e);
      },
    })),
    overlay: {
      onMouseDown: (e) => mouseDown.handleOverlayMouseDown(idleState, e),
      onMouseUp: () => selection.handleOverlayMouseUp(idleState),
    },
    window: {
      onMouseMove: (e) => {
        goToSelectionWindow.handleWindowMouseMove(idleState, e);
        goToNodesDragging.handleWindowMouseMove(idleState, e);
      },
      onMouseUp: () => mouseDown.handleWindowMouseUp(idleState),
    },
    layout: {
      onKeyDown: (e) => {
        goToAddSticker.handleKeyDown(e);
        goToAddRectangle.handleKeyDown(e);
        goToCanvasDragging.handleKeyDown(e);
        deleteNode.handleDeleteNode(idleState, e);
      },
    },
    actions: {
      idleState: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
      addSticker: {
        isActive: false,
        onClick: () => goToAddSticker.handleActionClick(),
      },
      addRectangle: {
        isActive: false,
        onClick: () => goToAddRectangle.handleActionClick(),
      },
      canvasDragging: {
        isActive: false,
        onClick: () => goToCanvasDragging.handleActionClick(),
      },
    },
  });
};

export const goToIdle = ({
  selectedIds,
}: {
  selectedIds?: Set<string>;
} = {}): IdleViewState => {
  return {
    type: 'idle',
    selectedIds: selectedIds ?? new Set(),
  };
};
