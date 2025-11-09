import React, { type Ref } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, type FreeHandPoints } from '../../domain/svg';

export const FreeHand = ({
  onMouseDown,
  onMouseMove,
  points,
  id,
  //   isSelected,
  ref,
}: {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<SVGSVGElement>;
  points: FreeHandPoints;
  onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove?: (e: React.MouseEvent<SVGSVGElement>) => void;
}) => {
  //   console.log(points, 'p');

  //   const [points, setPoints] = React.useState<FreeHandPoints>([
  //     { x: 0, y: 0, pressure: 0.5 },
  //     { x: 10, y: 5, pressure: 0.7 },
  //     { x: 20, y: 8, pressure: 0.8 },
  //   ]);

  //   function handlePointerDown(e) {
  //     console.log(e.pageX, e.pageY);
  //     e.target.setPointerCapture(e.pointerId);

  //     setPoints([[e.pageX, e.pageY, e.pressure]]);
  //   }

  //   function handlePointerMove(e) {
  //     if (e.buttons !== 1) return;
  //     setPoints([...points, [e.pageX, e.pageY, e.pressure]]);
  //   }

  //   console.log(points, 'points');

  const stroke = getStroke(points, {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });
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
      {points && <path d={pathData} />}
    </svg>
  );
};
