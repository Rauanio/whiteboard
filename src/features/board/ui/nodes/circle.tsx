import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';

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
  const { background, opacity, stroke, strokeWidth } = configuration;

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
          fill={background}
          stroke={stroke}
          fillOpacity={opacity[0] / 100}
          strokeWidth={strokeWidth}
          onMouseUp={onMouseUp}
          onClick={onClick}
          onMouseDown={onMouseDown}
          className="cursor-move pointer-events-auto"
        />
      </g>
    </svg>
  );
}
