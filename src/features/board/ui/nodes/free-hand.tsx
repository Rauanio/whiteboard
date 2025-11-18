import React, { type Ref } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, type FreeHandPoints } from '../../domain/svg';
import { createRectFromFreeHandPoints } from '../../domain/rect';
import { Selectable } from '../selectable';
import clsx from 'clsx';
import type { ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';
import type { StrokeWidth } from '../../domain/types';

interface FreeHandProps {
  id?: string;
  points: FreeHandPoints;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  ref?: Ref<SVGPathElement>;
  configuration: NodeConfiguration;
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
  configuration,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
  onHandleMouseDown,
}: FreeHandProps) => {
  const { layer, stroke, strokeWidth } = configuration;

  const getFreeDrawStrokeWidth = (width: StrokeWidth) => {
    switch (width) {
      case 'thin':
        return 12;
      case 'bold':
        return 16;
      case 'extra-bold':
        return 20;
    }
  };

  const freedrawStroke = getStroke(points, {
    size: getFreeDrawStrokeWidth(strokeWidth),
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(freedrawStroke);
  const { x, y, width, height } = createRectFromFreeHandPoints(freedrawStroke);

  return (
    <svg
      className={clsx(
        'absolute left-0 top-0 pointer-events-none overflow-visible',
        layer === 'front' ? 'z-10' : 'z-0'
      )}
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
          ref={ref}
          data-id={id}
          d={pathData}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          stroke={stroke}
          fill={stroke}
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
