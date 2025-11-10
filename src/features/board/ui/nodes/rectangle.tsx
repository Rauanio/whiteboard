import clsx from 'clsx';
import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';

export function Rectangle({
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
  ref?: Ref<SVGSVGElement>;
  onClick?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGRectElement>) => void;
}) {
  return (
    <svg
      ref={ref}
      data-id={id}
      className="absolute left-0 top-0 overflow-visible"
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

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
          fill="white"
          stroke="#99a1af"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          rx={8}
          onMouseUp={onMouseUp}
          onClick={onClick}
          className={clsx('cursor-move shadow-md')}
        />
      </g>
    </svg>
  );
}
