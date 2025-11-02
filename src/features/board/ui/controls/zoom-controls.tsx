import { useState } from 'react';
import type { WindowPositionModel } from '../../model/window-position';
import type { CanvasRect } from '../../hooks/use-canvas-rect';
import { Maximize2, Minimize2, MinusIcon, PlusIcon, ZoomIn } from 'lucide-react';
import { ControlButton } from './control-button';
import { pointOnScreenToCanvas } from '../../domain/screen-to-canvas';
import { diffPoints } from '../../domain/point';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/kit/dropdown-menu';

const dropdownItems = [50, 70, 100, 150, 200];

export const ZoomControls = ({
  canvasRect,
  windowPositionModel,
}: {
  windowPositionModel: WindowPositionModel;
  canvasRect: CanvasRect | undefined;
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const zoomPercentage = Math.round(windowPositionModel.position.zoom * 100);

  const clampZoom = (zoom: number) => Math.min(5, Math.max(0.1, zoom));

  const { position } = windowPositionModel;

  const zoom = ({ scale, percentage }: { scale?: number; percentage?: number }) => {
    if (!canvasRect) {
      return;
    }

    let newZoom = position.zoom;

    if (scale !== undefined) {
      // относительный зум (например, 1.1 или 0.9)
      newZoom = clampZoom(position.zoom * scale);
    }

    if (percentage !== undefined) {
      // абсолютный зум (например, 50, 70, 100…)
      newZoom = clampZoom(percentage / 100);
    }

    const centerScreen = {
      x: canvasRect?.x + canvasRect?.width / 2,
      y: canvasRect.y + canvasRect.height / 2,
    };

    const currentPoint = pointOnScreenToCanvas(centerScreen, position, canvasRect);
    const newPoint = pointOnScreenToCanvas(
      centerScreen,
      { ...position, zoom: newZoom },
      canvasRect
    );

    const diff = diffPoints(currentPoint, newPoint);

    windowPositionModel.setPosition({
      x: position.x - diff.x,
      y: position.y - diff.y,
      zoom: newZoom,
    });
  };

  const onZoomIn = () => zoom({ scale: 1.1 });

  const onZoomOut = () => zoom({ scale: 0.9 });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div className="shadow-md bg-white p-1 flex items-center rounded-md">
      <ControlButton disabled={zoomPercentage <= 10} onClick={onZoomOut}>
        <MinusIcon />
      </ControlButton>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ControlButton size={'default'}>{zoomPercentage}%</ControlButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}{' '}
            {isFullscreen ? 'Exit' : 'Enter'} full screen
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {dropdownItems.map((item) => (
            <DropdownMenuItem onClick={() => zoom({ percentage: item })}>
              <ZoomIn /> {item}%
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ControlButton disabled={zoomPercentage >= 500} onClick={onZoomIn}>
        <PlusIcon />
      </ControlButton>
    </div>
  );
};
