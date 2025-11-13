import { diffPoints, type Point } from '../../domain/point';
import { createRectFromFreeHandPoints } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { NodeUpdateResizing } from '../../model/nodes';
import type { ResizeDirection } from '../../ui/resizable';
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
  initialStart: Point;
  initialEnd: Point;
}

export const useNodesResizingViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  const getNodes = (state: NodesResizingViewState) => {
    return nodesModel.nodes.map((node) => {
      const diff = diffPoints(state.startPoint, state.endPoint);

      if (node.id === state.nodeId && node.type === 'arrow') {
        if (state.direction === 'start') {
          return {
            ...node,
            start: {
              x: state.initialStart.x + diff.x,
              y: state.initialStart.y + diff.y,
            },
            isSelected: true,
          };
        }
        if (state.direction === 'end') {
          return {
            ...node,
            end: {
              x: state.initialEnd.x + diff.x,
              y: state.initialEnd.y + diff.y,
            },
            isSelected: true,
          };
        }
      }

      if (node.id === state.nodeId && node.type === 'free-hand') {
        let scaleX = 1;
        let scaleY = 1;
        let offsetX = state.initialX;
        let offsetY = state.initialY;
        switch (state.direction) {
          case 'bottom-right':
            scaleX = (state.initialWidth + diff.x) / state.initialWidth;
            scaleY = (state.initialHeight + diff.y) / state.initialHeight;
            offsetX = state.initialX;
            offsetY = state.initialY;
            break;

          case 'bottom-left':
            scaleX = (state.initialWidth - diff.x) / state.initialWidth;
            scaleY = (state.initialHeight + diff.y) / state.initialHeight;
            offsetX = state.initialX + state.initialWidth;
            offsetY = state.initialY;
            break;

          case 'top-right':
            scaleX = (state.initialWidth + diff.x) / state.initialWidth;
            scaleY = (state.initialHeight - diff.y) / state.initialHeight;
            offsetX = state.initialX;
            offsetY = state.initialY + state.initialHeight;
            break;

          case 'top-left':
            scaleX = (state.initialWidth - diff.x) / state.initialWidth;
            scaleY = (state.initialHeight - diff.y) / state.initialHeight;
            offsetX = state.initialX + state.initialWidth;
            offsetY = state.initialY + state.initialHeight;
            break;
        }

        const newPoints = node.points.map((p) => {
          const px = Array.isArray(p) ? p[0] : p.x;
          const py = Array.isArray(p) ? p[1] : p.y;

          return {
            x: offsetX + (px - offsetX) * scaleX,
            y: offsetY + (py - offsetY) * scaleY,
          };
        });

        const { x, y, width, height } = createRectFromFreeHandPoints(newPoints);

        return {
          ...node,
          points: newPoints,
          x,
          y,
          width,
          height,
          isSelected: true,
        };
      }

      // For other node shapes
      if (node.id === state.nodeId) {
        let newWidth = state.initialWidth;
        let newHeight = state.initialHeight;
        let newX = state.initialX;
        let newY = state.initialY;

        switch (state.direction) {
          case 'bottom-right':
            newWidth = state.initialWidth + diff.x;
            newHeight = state.initialHeight + diff.y;
            break;
          case 'bottom-left':
            newWidth = state.initialWidth - diff.x;
            newHeight = state.initialHeight + diff.y;
            newX = state.initialX + diff.x;
            break;
          case 'top-right':
            newWidth = state.initialWidth + diff.x;
            newHeight = state.initialHeight - diff.y;
            newY = state.initialY + diff.y;
            break;
          case 'top-left':
            newWidth = state.initialWidth - diff.x;
            newHeight = state.initialHeight - diff.y;
            newX = state.initialX + diff.x;
            newY = state.initialY + diff.y;
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
            .flatMap((node): NodeUpdateResizing[] => {
              console.log(node);

              if (node.type === 'arrow') {
                return [
                  {
                    id: node.id,
                    point: node.start,
                    type: 'start' as const,
                  },
                  {
                    id: node.id,
                    point: node.end,
                    type: 'end' as const,
                  },
                ];
              }

              if (node.type === 'free-hand') {
                return [
                  {
                    id: node.id,
                    points: node.points,
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
        lockActions: {
          isActive: lockActions.lock,
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
  direction: ResizeDirection;
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
