import { pointOnScreenToCanvas } from '@/features/board/domain/screen-to-canvas';
import type { IdleViewState } from '../idle';
import type { ViewModelProps } from '../../view-model';
import { distanceFromPoints } from '@/features/board/domain/point';
import { goToNodesResizing } from '../nodes-resizing';
import { createRectFromFreeHandPoints } from '@/features/board/domain/rect';

export const useGoToNodesResizing = ({
  canvasRect,
  setViewState,
  nodesModel,
  windowPositionModel,
}: ViewModelProps) => {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (idleState.onMouseDown && idleState.onMouseDown.type === 'resize') {
      const node = nodesModel.nodes.find(
        (n) =>
          n.id ===
          (idleState.onMouseDown?.type === 'resize' && idleState.onMouseDown.nodeId)
      );
      if (!node) return;

      const currentPoint = pointOnScreenToCanvas(
        {
          x: e.clientX,
          y: e.clientY,
        },
        windowPositionModel.position,
        canvasRect
      );

      if (distanceFromPoints(idleState.onMouseDown, currentPoint) > 5) {
        let nodeResizingState;
        if (node.type === 'arrow') {
          nodeResizingState = {
            nodeId: idleState.onMouseDown.nodeId,
            direction: idleState.onMouseDown.direction,
            startPoint: {
              x: idleState.onMouseDown.x,
              y: idleState.onMouseDown.y,
            },
            endPoint: currentPoint,
            initialStart: node.start,
            initialEnd: node.end,
          };
        } else if (node.type === 'free-hand') {
          const rect = createRectFromFreeHandPoints(node.points);

          nodeResizingState = {
            nodeId: idleState.onMouseDown.nodeId,
            direction: idleState.onMouseDown.direction,
            startPoint: {
              x: idleState.onMouseDown.x,
              y: idleState.onMouseDown.y,
            },
            endPoint: currentPoint,
            node: rect,
          };
        } else {
          nodeResizingState = {
            nodeId: idleState.onMouseDown.nodeId,
            direction: idleState.onMouseDown.direction,
            startPoint: {
              x: idleState.onMouseDown.x,
              y: idleState.onMouseDown.y,
            },
            endPoint: currentPoint,
            node,
          };
        }

        setViewState(goToNodesResizing(nodeResizingState));
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
};
