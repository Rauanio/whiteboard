import { resolveRelativePoint, type Point } from '../../domain/point';
import { createRectFromPoints, isRectsIntersecting, type Rect } from '../../domain/rect';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import { selectNodes, type Selection } from '../../domain/selection';
import { createRelativeBase } from '../decorators/resolve-relative';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface SelectionWindowViewState {
  type: 'selection-window';
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds: Selection;
}

export const useSelectionWindowViewModel = ({
  nodesModel,
  canvasRect,
  nodesDimensions,
  setViewState,
  windowPositionModel,
}: ViewModelProps) => {
  const getNodes = (state: SelectionWindowViewState, selectionRect: Rect) => {
    const relativeBase = createRelativeBase(nodesModel.nodes);

    return nodesModel.nodes.map((node) => {
      const nodeDimensions = nodesDimensions[node.id];

      const nodeRect =
        node.type === 'arrow'
          ? createRectFromPoints(
              resolveRelativePoint(relativeBase, node.start),
              resolveRelativePoint(relativeBase, node.end)
            )
          : {
              x: node.x,
              y: node.y,
              width: nodeDimensions?.width,
              height: nodeDimensions?.height,
            };

      return {
        ...node,
        isSelected:
          isRectsIntersecting(nodeRect, selectionRect) ||
          state.initialSelectedIds.has(node.id),
      };
    });
  };

  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);

    const nodes = getNodes(state, rect);

    return {
      nodes: nodes,
      selectionWindow: rect,
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
          const selectedNodesIdsInRect = nodes
            .filter((node) => node.isSelected)
            .map((node) => node.id);

          setViewState(
            goToIdle({
              selectedIds: selectNodes(
                state.initialSelectedIds,
                selectedNodesIdsInRect,
                'add'
              ),
            })
          );
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

export const goToSelectionWindow = ({
  endPoint,
  startPoint,
  initialSelectedIds,
}: {
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds?: Selection;
}): SelectionWindowViewState => {
  return {
    type: 'selection-window',
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
};
