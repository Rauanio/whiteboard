import { addPoints, diffPoints, isRelativePoint, type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { NodeUpdatePosition } from '../../model/nodes';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface NodesDraggingViewState {
  type: 'nodes-dragging';
  startPoint: Point;
  endPoint: Point;
  nodesToDrag: Set<string>;
}

export const useNodesDraggingViewModel = ({
  nodesModel,
  canvasRect,
  setViewState,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  const getNodes = (state: NodesDraggingViewState) => {
    return nodesModel.nodes.map((node) => {
      if (state.nodesToDrag.has(node.id)) {
        const diff = diffPoints(state.startPoint, state.endPoint);

        if (node.type === 'arrow') {
          return {
            ...node,
            start: isRelativePoint(node.start) ? node.start : addPoints(node.start, diff),
            end: isRelativePoint(node.end) ? node.end : addPoints(node.end, diff),
            isSelected: true,
          };
        }

        if (node.type === 'free-hand') {
          const movedPoints = node.points.map((p) => {
            const point = Array.isArray(p) ? { x: p[0], y: p[1] } : p;
            return addPoints(point, diff);
          });

          return {
            ...node,
            points: movedPoints,
            isSelected: true,
          };
        }

        return {
          ...node,
          ...addPoints(node, diff),
          isSelected: true,
        };
      }
      return node;
    });
  };

  return (state: NodesDraggingViewState): ViewModel => {
    const nodes = getNodes(state);
    console.log(state.nodesToDrag);

    return {
      nodes: nodes,
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
          const nodesToDrag = nodes
            .filter((node) => state.nodesToDrag.has(node.id))
            .flatMap((node): NodeUpdatePosition[] => {
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
                },
              ];
            });

          nodesModel.updateNodesPositions(nodesToDrag);

          setViewState(
            goToIdle({
              selectedIds: state.nodesToDrag,
            })
          );
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

export const goToNodesDragging = ({
  endPoint,
  startPoint,
  nodesToDrag,
}: {
  startPoint: Point;
  endPoint: Point;
  nodesToDrag: Set<string>;
}): NodesDraggingViewState => {
  return {
    type: 'nodes-dragging',
    startPoint,
    endPoint,
    nodesToDrag,
  };
};
