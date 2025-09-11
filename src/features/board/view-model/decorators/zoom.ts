import { diffPoints } from '../../domain/point';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import type { CanvasRect } from '../../hooks/use-canvas-rect';
import type { WindowPositionModel } from '../../model/window-position';
import type { ViewModelProps } from '../view-model';
import type { ViewModel } from '../view-model-type';

export const useZoomDecorator = ({ windowPositionModel, canvasRect }: ViewModelProps) => {
  return (viewModel: ViewModel): ViewModel => {
    function applyZoom(
      windowPositionModel: WindowPositionModel,
      canvasRect: CanvasRect | undefined,
      newZoom: number,
      screenPoint?: { x: number; y: number }
    ) {
      if (!canvasRect) return;

      const clampedZoom = Math.min(5, Math.max(0.1, newZoom));

      const centerScreen = screenPoint ?? {
        x: canvasRect.x + canvasRect.width / 2,
        y: canvasRect.y + canvasRect.height / 2,
      };

      const currentPoint = pointOnScreenToCanvas(
        centerScreen,
        windowPositionModel.position,
        canvasRect
      );
      const newPoint = pointOnScreenToCanvas(
        centerScreen,
        { ...windowPositionModel.position, zoom: clampedZoom },
        canvasRect
      );

      const diff = diffPoints(currentPoint, newPoint);

      windowPositionModel.setPosition({
        x: windowPositionModel.position.x - diff.x,
        y: windowPositionModel.position.y - diff.y,
        zoom: clampedZoom,
      });
    }

    return {
      ...viewModel,
      window: {
        ...viewModel.window,
        onMouseWheel: (e) => {
          e.preventDefault();

          viewModel.window?.onMouseWheel?.(e);

          const scaleFactor = 1 - e.deltaY * 0.001;

          const newZoom = windowPositionModel.position.zoom * scaleFactor;

          applyZoom(windowPositionModel, canvasRect, newZoom, {
            x: e.clientX,
            y: e.clientY,
          });
        },
        onKeyDown: (e) => {
          if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
            e.preventDefault();
            applyZoom(
              windowPositionModel,
              canvasRect,
              windowPositionModel.position.zoom * 1.1
            );
          }

          if (e.ctrlKey && (e.key === '-' || e.key === '_')) {
            e.preventDefault();
            applyZoom(
              windowPositionModel,
              canvasRect,
              windowPositionModel.position.zoom * 0.9
            );
          }

          if (e.ctrlKey && e.key === '0') {
            e.preventDefault();
            applyZoom(windowPositionModel, canvasRect, 1);
          }
        },
      },
    };
  };
};
