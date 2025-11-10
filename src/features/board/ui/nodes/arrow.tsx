// TODO Переделать стрелку использую <marker> и <line>

import type { Ref } from 'react';
import { diffPoints, type Point } from '../../domain/point';
import { ResizableArrow, type ArrowResizeDirection } from '../resizable-arrow';
import clsx from 'clsx';

export const Arrow = ({
  start,
  end,
  ref,
  isSelected,
  noPointerEvents,
  onClick,
  onMouseDown,
  onHandleMouseDown,
  onMouseUp,
}: {
  start: Point;
  end: Point;
  ref: Ref<SVGPathElement>;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onHandleMouseDown?: (
    e: React.MouseEvent<HTMLDivElement>,
    dir: ArrowResizeDirection
  ) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
}) => {
  const diff = diffPoints(start, end);
  const angle = Math.atan2(diff.y, diff.x);
  const arrowRightAngle = angle + Math.PI * (1 - 1 / 6);
  const arrowLeftAngle = angle - Math.PI * (1 - 1 / 6);
  const arrowRightDiff = [Math.cos(arrowRightAngle) * 16, Math.sin(arrowRightAngle) * 16];
  const arrowLeftDiff = [Math.cos(arrowLeftAngle) * 16, Math.sin(arrowLeftAngle) * 16];

  console.log(start);

  return (
    <svg className="absolute left-0 top-0 pointer-events-none overflow-visible z-1">
      <path
        ref={ref}
        className={clsx(
          'cursor-move',
          noPointerEvents ? 'pointer-events-none' : 'pointer-events-auto'
        )}
        stroke="black"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        d={`
          M ${start.x} ${start.y} L ${end.x} ${end.y} 
          M ${end.x} ${end.y} L ${end.x + arrowRightDiff[0]} ${end.y + arrowRightDiff[1]} 
          L ${end.x + -5 * Math.cos(angle)} ${end.y + -5 * Math.sin(angle)}
          L ${end.x + arrowLeftDiff[0]} ${end.y + arrowLeftDiff[1]}
          L ${end.x} ${end.y}
          `}
      />

      {isSelected && (
        <ResizableArrow start={start} end={end} onMouseDown={onHandleMouseDown} />
      )}
    </svg>
  );
};
