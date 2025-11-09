import { type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ArrowResizeDirection } from '../../ui/resizable-arrow';
import type { ResizeDirection } from '../../ui/resizable-box';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface NodesResizingViewState {
  type: 'nodes-resizing';
  startPoint: Point;
  endPoint: Point;
  direction: ResizeDirection | ArrowResizeDirection;
  nodeId: string;
  initialWidth: number;
  initialHeight: number;
  initialX: number;
  initialY: number;
  initialStart: Point;
  initialEnd: Point;
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

      if (node.id === state.nodeId && node.type === 'arrow') {
        const dx = state.endPoint.x - state.startPoint.x;
        const dy = state.endPoint.y - state.startPoint.y;

        if (state.direction === 'start') {
          return {
            ...node,
            start: {
              x: state.initialStart.x + dx,
              y: state.initialStart.y + dy,
            },
            isSelected: true,
          };
        }
        if (state.direction === 'end') {
          return {
            ...node,
            end: {
              x: state.initialEnd.x + dx,
              y: state.initialEnd.y + dy,
            },
            isSelected: true,
          };
        }
      }

      return node;
    });
  };
  return (state: NodesResizingViewState): ViewModel => {
    const nodes = getNodes(state);

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
          const resizedNodes = nodes
            .filter((node) => node.id === state.nodeId)
            .flatMap((node) => {
              if (node.type === 'arrow') {
                return [
                  {
                    id: node.id,
                    point: node.start,
                    type: 'start' as const,
                    width: 0,
                    height: 0,
                  },
                  {
                    id: node.id,
                    point: node.end,
                    type: 'end' as const,
                    width: 0,
                    height: 0,
                  },
                ];
              }

              return [
                {
                  id: node.id,
                  point: {
                    x: node.x,
                    y: node.y,
                  },
                  width: node.width,
                  height: node.height,
                },
              ];
            });

          nodesModel.resizeNodes(resizedNodes);

          setViewState(goToIdle({ selectedIds: new Set([state.nodeId]) }));
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
  initialEnd,
  initialStart,
}: {
  direction: ResizeDirection | ArrowResizeDirection;
  nodeId: string;
  startPoint: Point;
  endPoint: Point;
  initialStart?: Point;
  initialEnd?: Point;
  node?: { x: number; y: number; width: number; height: number };
}): NodesResizingViewState => {
  return {
    type: 'nodes-resizing',
    direction,
    nodeId,
    endPoint,
    startPoint,
    initialStart: initialStart ?? { x: 0, y: 0 },
    initialEnd: initialEnd ?? { x: 0, y: 0 },
    initialWidth: node?.width ?? 0,
    initialHeight: node?.height ?? 0,
    initialX: node?.x ?? 0,
    initialY: node?.y ?? 0,
  };
};
