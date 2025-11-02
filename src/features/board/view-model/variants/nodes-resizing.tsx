// import { addPoints, diffPoints, isRelativePoint, type Point } from '../../domain/point';
// import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import { type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ResizeDirection } from '../../ui/resizable-box';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface NodesResizingViewState {
  type: 'nodes-resizing';
  startPoint: Point;
  endPoint: Point;
  direction: ResizeDirection;
  nodeId: string;
  initialWidth: number;
  initialHeight: number;
  initialX: number;
  initialY: number;
}

export const useNodesResizingViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
}: ViewModelProps) => {
  const getNodes = (state: NodesResizingViewState) => {
    return nodesModel.nodes.map((node) => {
      if (
        node.id === state.nodeId &&
        (node.type === 'rectangle' || node.type === 'sticker')
      ) {
        const dx = state.endPoint.x - state.startPoint.x;
        const dy = state.endPoint.y - state.startPoint.y;

        let newWidth = state.initialWidth;
        let newHeight = state.initialHeight;
        let newX = state.initialX;
        let newY = state.initialY;

        switch (state.direction) {
          case 'bottom-right':
            newWidth = state.initialWidth + dx;
            newHeight = state.initialHeight + dy;
            break;
          case 'bottom-left':
            newWidth = state.initialWidth - dx;
            newHeight = state.initialHeight + dy;
            newX = state.initialX + dx;
            break;
          case 'top-right':
            newWidth = state.initialWidth + dx;
            newHeight = state.initialHeight - dy;
            newY = state.initialY + dy;
            break;
          case 'top-left':
            newWidth = state.initialWidth - dx;
            newHeight = state.initialHeight - dy;
            newX = state.initialX + dx;
            newY = state.initialY + dy;
            break;
        }

        return {
          ...node,
          width: Math.max(node.type === 'sticker' ? 67 : 30, newWidth),
          height: Math.max(node.type === 'sticker' ? 56 : 30, newHeight),
          x: newX,
          y: newY,
          isSelected: true,
        };
      }

      return node;
    });
  };
  return (state: NodesResizingViewState): ViewModel => {
    const nodes = getNodes(state);

    console.log(state);

    return {
      nodes,
      window: {
        onMouseMove: (e) => {
          const currentPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            windowPositionModel.position,
            canvasRect
          );

          setViewState({
            ...state,
            endPoint: currentPoint,
          });
        },
        onMouseUp: () => {
          const resizedNode = nodes.find(
            (node) =>
              (node.type === 'rectangle' || node.type === 'sticker') &&
              node.id === state.nodeId
          );

          if (resizedNode?.type === 'rectangle' || resizedNode?.type === 'sticker') {
            nodesModel.resizeNode({
              id: resizedNode.id,
              width: resizedNode.width,
              height: resizedNode.height,
              x: resizedNode.x,
              y: resizedNode.y,
            });
          }

          setViewState(goToIdle());
        },
      },
      actions: {
        idleState: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToNodesResizing = ({
  direction,
  nodeId,
  startPoint,
  endPoint,
  node,
}: {
  direction: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  nodeId: string;
  startPoint: Point;
  endPoint: Point;
  node: { x: number; y: number; width: number; height: number };
}): NodesResizingViewState => {
  return {
    type: 'nodes-resizing',
    direction,
    nodeId,
    endPoint,
    startPoint,
    initialWidth: node.width,
    initialHeight: node.height,
    initialX: node.x,
    initialY: node.y,
  };
};
