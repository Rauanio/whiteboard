import type { Ref } from 'react';
import { diffPoints, type Point } from '../../domain/point';
import clsx from 'clsx';

export const Arrow = ({
  start,
  end,
  ref,
  isSelected,
  onClick,
  onMouseDown,
  onMouseUp,
}: {
  start: Point;
  end: Point;
  ref: Ref<SVGPathElement>;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
}) => {
  const diff = diffPoints(start, end);
  const angle = Math.atan2(diff.y, diff.x);
  const arrowRightAngle = angle + Math.PI * (1 - 1 / 6);
  const arrowLeftAngle = angle - Math.PI * (1 - 1 / 6);
  const arrowRightDiff = [Math.cos(arrowRightAngle) * 10, Math.sin(arrowRightAngle) * 10];
  const arrowLeftDiff = [Math.cos(arrowLeftAngle) * 10, Math.sin(arrowLeftAngle) * 10];

  return (
    <svg className="absolute left-0 top-0 pointer-events-none overflow-visible">
      <path
        ref={ref}
        className={clsx(
          'pointer-events-auto cursor-move',
          isSelected && 'outline-2 outline-blue-400 '
        )}
        stroke="black"
        strokeWidth={2}
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
    </svg>
  );
};
