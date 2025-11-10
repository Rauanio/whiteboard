import React, { type Ref } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, type FreeHandPoints } from '../../domain/svg';
import { createRectFromFreeHandPoints } from '../../domain/rect';
import clsx from 'clsx';
import type { ResizeDirection } from '../resizable-box';

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
  onHandleMouseDown?: (e: React.MouseEvent<SVGRectElement>, dir: ResizeDirection) => void;
}

/**
 * FreeHand + рамка выделения + 4 угловых resize-хэндла.
 */
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
  const { x, y, width, height } = createRectFromFreeHandPoints(points);

  const HADNLE_SIZE = 8;
  const half = HADNLE_SIZE / 2;

  const handles = [
    { dir: 'top-left' as const, cx: x - half, cy: y - half },
    { dir: 'top-right' as const, cx: x + width + half, cy: y - half },
    { dir: 'bottom-left' as const, cx: x - half, cy: y + height + half },
    { dir: 'bottom-right' as const, cx: x + width + half, cy: y + height + half },
  ];

  return (
    <svg
      ref={ref}
      data-id={id}
      className="absolute left-0 top-0 overflow-visible"
      style={{ touchAction: 'none' }}
    >
      <g>
        {isSelected && (
          <>
            {/* рамка */}
            <rect
              x={x - 4}
              y={y - 4}
              width={width + 8}
              height={height + 8}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={2}
              rx={4}
              ry={4}
            />

            {/* 4 угловых resize-хэндла */}
            {handles.map(({ dir, cx, cy }) => (
              <rect
                key={dir}
                x={cx - half}
                y={cy - half}
                width={HADNLE_SIZE}
                height={HADNLE_SIZE}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={1}
                rx={2}
                className="cursor-pointer pointer-events-auto "
                onMouseDown={(e) => onHandleMouseDown?.(e, dir)}
              />
            ))}
          </>
        )}

        {/* основной путь */}
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
