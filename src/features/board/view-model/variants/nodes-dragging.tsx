import { diffPoints, type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
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
}: ViewModelProps) => {
  const getNodes = (state: NodesDraggingViewState) => {
    return nodesModel.nodes.map((node) => {
      if (state.nodesToDrag.has(node.id)) {
        const diff = diffPoints(state.startPoint, state.endPoint);

        return {
          ...node,
          x: node.x + diff.x,
          y: node.y + diff.y,
          isSelected: true,
        };
      }
      return node;
    });
  };

  return (state: NodesDraggingViewState): ViewModel => {
    const nodes = getNodes(state);

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
          const nodesToDrag = nodes.filter((node) => state.nodesToDrag.has(node.id));

          nodesModel.updateNodePosition(nodesToDrag);

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
