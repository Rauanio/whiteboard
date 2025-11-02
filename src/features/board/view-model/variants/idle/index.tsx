import { type Point } from '../../../domain/point';
import type { ViewModelProps } from '../../view-model';
import type { ViewModel } from '../../view-model-type';
import { useDeleteSelectedNode } from './use-delete-selected-node';
import { useGoToEditSticker } from './use-go-to-edit-sticker';
import { useGoToSelectionWindow } from './use-go-to-selection-window';
import { useMouseDown } from './use-mouse-down';
import { useSelection } from './use-selection';
import { useGoToNodesDragging } from './use-go-to-nodes-dragging';
import type { ResizeDirection } from '@/features/board/ui/resizable-box';
import { useGoToNodesResizing } from './use-go-to-nodes-resizing';

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
      } & Point)
    | ({
        type: 'resize';
        nodeId: string;
        direction: ResizeDirection;
      } & Point);
}

export const useIdleViewModel = (props: ViewModelProps) => {
  const { nodesModel, setViewState } = props;

  const selection = useSelection(props);
  const deleteNode = useDeleteSelectedNode(props);
  const goToEditSticker = useGoToEditSticker(props);
  const goToSelectionWindow = useGoToSelectionWindow(props);
  const goToNodesDragging = useGoToNodesDragging(props);
  const goToNodesResizing = useGoToNodesResizing(props);
  const mouseDown = useMouseDown(props);

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),
      onMouseDown: (e: React.MouseEvent) => {
        mouseDown.handleNodeMouseDown(idleState, node.id, e);
      },
      onHandleMouseDown: (e, dir) => {
        console.log(e, dir);

        mouseDown.handleResizeMouseDown(idleState, node.id, e, dir);
      },
      onMouseUp: (e: React.MouseEvent) => {
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
        goToNodesResizing.handleWindowMouseMove(idleState, e);
      },
      onMouseUp: () => mouseDown.handleWindowMouseUp(idleState),
    },
    layout: {
      onKeyDown: (e) => {
        deleteNode.handleDeleteNode(idleState, e);
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
