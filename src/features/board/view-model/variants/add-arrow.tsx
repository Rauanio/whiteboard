import type React from 'react';
import { type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';

export interface AddArrowViewState {
  type: 'add-arrow';
  start?: Point;
  end?: Point;
}

export const useAddArrowViewModel = ({
  nodesModel,
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelProps) => {
  return (state: AddArrowViewState): ViewModel => {
    const setStartPoint = (e: React.MouseEvent) => {
      setViewState({
        ...state,
        start: pointOnScreenToCanvas(
          {
            x: e.clientX,
            y: e.clientY,
          },
          windowPositionModel.position,
          canvasRect
        ),
      });
    };

    const newNodes = state.start
      ? [
          ...nodesModel.nodes,
          {
            id: 'drawing-arrow',
            type: 'arrow' as const,
            start: state.start,
            end: state.end ?? state.start,
          },
        ]
      : nodesModel.nodes;

    return {
      nodes: newNodes.map((node) => {
        if (node.type !== 'arrow') {
          return {
            ...node,
            onMouseDown: (e: React.MouseEvent) => {
              setStartPoint(e);
            },
          };
        }

        return node;
      }),
      layout: {
        cursor: 'cursor-crosshair',
      },
      overlay: {
        onMouseDown: (e) => {
          setStartPoint(e);
        },
      },
      window: {
        onMouseMove: (e) => {
          if (state.start) {
            const currentPoint = pointOnScreenToCanvas(
              {
                x: e.clientX,
                y: e.clientY,
              },
              windowPositionModel.position,
              canvasRect
            );

            setViewState({
              ...state,
              end: currentPoint,
            });
          }
        },
        onMouseUp: (e) => {
          if (state.start) {
            nodesModel.addArrowNode({
              end: state.end ?? { x: e.clientX, y: e.clientY },
              start: state.start ?? { x: e.clientX, y: e.clientY },
            });
          }
          setViewState(goToIdle());
        },
      },
      actions: {
        addArrow: {
          isActive: true,
          onClick: () => setViewState(goToIdle()),
        },
      },
    };
  };
};

export const goToAddArrow = ({
  start,
}: {
  start?: Point;
} = {}): AddArrowViewState => {
  return {
    type: 'add-arrow',
    start,
    end: start,
  };
};
