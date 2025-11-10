import type React from 'react';
import { diffPoints, type Point } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';
import { goToIdle } from './idle';
import { createRelativeBase } from '../decorators/resolve-relative';

export interface AddArrowViewState {
  type: 'add-arrow';
  start?: Point;
  end?: Point;
  startRelativeTo?: string;
  endRelativeTo?: string;
}

export const useAddArrowViewModel = ({
  nodesModel,
  setViewState,
  canvasRect,
  windowPositionModel,
  lockActions,
}: ViewModelProps) => {
  return (state: AddArrowViewState): ViewModel => {
    const addArrow = (
      state: AddArrowViewState,
      defaultPoints: {
        start: Point;
        end: Point;
      },
      endRelativeTo?: string
    ) => {
      const relativeBase = createRelativeBase(nodesModel.nodes);

      const newArrow = {
        start:
          state.startRelativeTo && state.start
            ? {
                ...diffPoints(relativeBase[state.startRelativeTo], state.start),
                relativeTo: state.startRelativeTo,
              }
            : state.start ?? defaultPoints.start,
        end:
          endRelativeTo && state.end
            ? {
                ...diffPoints(relativeBase[endRelativeTo], state.end),
                relativeTo: endRelativeTo,
              }
            : state.end ?? defaultPoints.end,
      };
      nodesModel.addArrowNode(newArrow);
    };

    const setStartPoint = (e: React.MouseEvent, startRelativeTo?: string) => {
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
        startRelativeTo,
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
            noPointerEvents: true,
          },
        ]
      : nodesModel.nodes;

    return {
      nodes: newNodes.map((node) => {
        if (node.type !== 'arrow') {
          return {
            ...node,
            onMouseDown: (e: React.MouseEvent) => {
              setStartPoint(e, node.id);
            },
            onMouseUp: (e: React.MouseEvent) => {
              console.log('onMouseUp in sticker');

              addArrow(
                state,
                {
                  end: { x: e.clientX, y: e.clientY },
                  start: { x: e.clientX, y: e.clientY },
                },
                node.id
              );
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
        onMouseUp: (e) => {
          addArrow(state, {
            end: { x: e.clientX, y: e.clientY },
            start: { x: e.clientX, y: e.clientY },
          });
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
        onMouseUp: () => {
          if (lockActions.lock) {
            setViewState(goToAddArrow());
            return;
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
  startRelativeTo,
}: {
  start?: Point;
  startRelativeTo?: string;
} = {}): AddArrowViewState => {
  return {
    type: 'add-arrow',
    start,
    end: start,
    startRelativeTo,
  };
};
