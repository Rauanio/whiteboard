import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';

export function Diamond({
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
  ref?: Ref<SVGPolygonElement>;
  onClick?: (e: React.MouseEvent<SVGPolygonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPolygonElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPolygonElement>) => void;
}) {
  const top = { x: x + width / 2, y: y };
  const right = { x: x + width, y: y + height / 2 };
  const bottom = { x: x + width / 2, y: y + height };
  const left = { x: x, y: y + height / 2 };

  const points = `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`;

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
        <polygon
          ref={ref}
          data-id={id}
          points={points}
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
