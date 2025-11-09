import React, { type Ref } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, type FreeHandPoints } from '../../domain/svg';
import clsx from 'clsx';

export const FreeHand = ({
  onMouseDown,
  onMouseMove,
  points,
  id,
  isSelected,
  ref,
}: {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<SVGSVGElement>;
  points: FreeHandPoints;
  onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove?: (e: React.MouseEvent<SVGSVGElement>) => void;
}) => {
  const stroke = getStroke(points, {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  console.log(isSelected);

  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      ref={ref}
      data-id={id}
      className="absolute left-0 top-0 pointer-events-none overflow-visible z-1"
      onPointerDown={onMouseDown}
      onPointerMove={onMouseMove}
      style={{ touchAction: 'none' }}
    >
      {points && (
        <path
          d={pathData}
          className={clsx('', isSelected && 'outline-2 outline-blue-400')}
        />
      )}
    </svg>
  );
};
