import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';

export function Circle({
  height,
  width,
  x,
  y,
  isSelected,
  ref,
  id,
  onClick,
  onMouseDown,
  onHandleMouseDown,
  onMouseUp,
}: Rect & {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<SVGEllipseElement>;
  onClick?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGEllipseElement>) => void;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;

  return (
    <svg className="absolute left-0 top-0 pointer-events-none overflow-visible">
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
        <ellipse
          ref={ref}
          data-id={id}
          rx={rx}
          ry={ry}
          cy={cy}
          cx={cx}
          fill="white"
          stroke="#99a1af"
          strokeWidth={2}
          onMouseUp={onMouseUp}
          onClick={onClick}
          onMouseDown={onMouseDown}
          className="cursor-move pointer-events-auto"
        />
      </g>
    </svg>
  );
}
