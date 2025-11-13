import React, { type Ref } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, type FreeHandPoints } from '../../domain/svg';
import { createRectFromFreeHandPoints } from '../../domain/rect';
import { Selectable } from '../selectable';
import clsx from 'clsx';
import type { ResizeDirection } from '../resizable';

interface FreeHandProps {
  id?: string;
  points: FreeHandPoints;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  ref?: Ref<SVGSVGElement>;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
}

export const FreeHand = ({
  id,
  points,
  isSelected,
  noPointerEvents,
  ref,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
  onHandleMouseDown,
}: FreeHandProps) => {
  const stroke = getStroke(points, {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(stroke);
  const { x, y, width, height } = createRectFromFreeHandPoints(stroke);

  return (
    <svg
      ref={ref}
      data-id={id}
      className="absolute left-0 top-0 pointer-events-none overflow-visible z-1"
      style={{ touchAction: 'none' }}
    >
      <g>
        {isSelected && (
          <Selectable
            height={height}
            width={width}
            x={x}
            y={y}
            onHandleMouseDown={onHandleMouseDown}
          />
        )}

        <path
          d={pathData}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onClick={onClick}
          className={clsx(
            'cursor-move',
            noPointerEvents ? 'pointer-events-none' : 'pointer-events-auto'
          )}
        />
      </g>
    </svg>
  );
};
