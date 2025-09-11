import { pointOnScreenToCanvas } from '@/features/board/domain/screen-to-canvas';
import type { IdleViewState } from '../idle';
import type { ViewModelProps } from '../../view-model';

export const useMouseDown = ({
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelProps) => {
  const handleOverlayMouseDown = (idleState: IdleViewState, e: React.MouseEvent) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      windowPositionModel.position,
      canvasRect
    );

    setViewState({
      ...idleState,
      onMouseDown: {
        type: 'overlay',
        x: point.x,
        y: point.y,
      },
    });
  };

  const handleNodeMouseDown = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent
  ) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      windowPositionModel.position,
      canvasRect
    );

    setViewState({
      ...idleState,
      onMouseDown: {
        type: 'node',
        nodeId: nodeId,
        x: point.x,
        y: point.y,
      },
    });
  };

  const handleWindowMouseUp = (idleState: IdleViewState) => {
    setViewState({
      ...idleState,
      onMouseDown: undefined,
    });
  };

  const getIsNodeMouseDown = (idleState: IdleViewState, nodeId: string) => {
    return (
      idleState.onMouseDown?.type === 'node' && idleState.onMouseDown.nodeId === nodeId
    );
  };

  return {
    handleWindowMouseUp,
    handleOverlayMouseDown,
    handleNodeMouseDown,
    getIsNodeMouseDown,
  };
};
