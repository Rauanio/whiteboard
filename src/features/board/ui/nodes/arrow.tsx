import type { Ref } from 'react';
import { type Point } from '../../domain/point';
import clsx from 'clsx';
import { Resizable, type ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';

export const Arrow = ({
  start,
  end,
  ref,
  isSelected,
  noPointerEvents,
  configuration,
  onClick,
  onMouseDown,
  onHandleMouseDown,
  onMouseUp,
}: {
  start: Point;
  end: Point;
  ref: Ref<SVGGElement>;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  configuration: NodeConfiguration;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
}) => {
  return (
    <svg className="absolute left-0 top-0 pointer-events-none overflow-visible z-1">
      <g
        ref={ref}
        className={clsx(
          'cursor-move',
          noPointerEvents ? 'pointer-events-none' : 'pointer-events-auto'
        )}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            strokeLinejoin="round"
            stroke="black"
            strokeLinecap="round"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 L 5 5 Z" />
          </marker>
        </defs>
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="black"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          markerEnd="url(#arrow)"
        />
      </g>

      {isSelected && (
        <Resizable
          type="double"
          start={start}
          end={end}
          onHandleMouseDown={onHandleMouseDown}
        />
      )}
    </svg>
  );
};
