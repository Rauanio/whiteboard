import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';
import { getStrokeStyle, getStrokeWidth } from '../../domain/svg';
import clsx from 'clsx';

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
  configuration,
}: Rect & {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<SVGEllipseElement>;
  configuration: NodeConfiguration;
  onClick?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGEllipseElement>) => void;
}) {
  const { background, opacity, stroke, strokeWidth, strokeStyle, layer } = configuration;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;

  return (
    <svg
      className={clsx(
        'absolute left-0 top-0 pointer-events-none overflow-visible',
        layer === 'front' ? 'z-10' : 'z-0'
      )}
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
        <ellipse
          ref={ref}
          data-id={id}
          rx={rx}
          ry={ry}
          cy={cy}
          cx={cx}
          fill={background}
          opacity={opacity[0] / 100}
          stroke={stroke}
          strokeWidth={getStrokeWidth(strokeWidth)}
          stroke-dasharray={getStrokeStyle(strokeStyle)}
          onMouseUp={onMouseUp}
          onClick={onClick}
          onMouseDown={onMouseDown}
          className="cursor-move pointer-events-auto"
        />
      </g>
    </svg>
  );
}
