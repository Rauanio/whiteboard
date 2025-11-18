import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';
import { getStrokeStyle, getStrokeWidth } from '../../domain/svg';
import clsx from 'clsx';

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
  configuration,
}: Rect & {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<SVGRectElement>;
  configuration: NodeConfiguration;
  onClick?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGRectElement>) => void;
}) {
  const cx = x + width / 2;
  const cy = y + height / 2;

  const { background, opacity, stroke, strokeWidth, edge, strokeStyle, layer } =
    configuration;

  return (
    <svg
      className={clsx(
        'absolute left-0 top-0 pointer-events-none overflow-visible',
        layer === 'front' ? 'z-10' : 'z-0'
      )}
    >
      <g transform={`rotate(0 ${cx} ${cy})`}>
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
          ref={ref}
          data-id={id}
          x={x}
          y={y}
          width={width}
          height={height}
          rx={edge === 'round' ? 12 : 0}
          fill={background}
          opacity={opacity[0] / 100}
          stroke={stroke}
          strokeWidth={getStrokeWidth(strokeWidth)}
          stroke-dasharray={getStrokeStyle(strokeStyle)}
          strokeLinecap="round"
          strokeLinejoin="round"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={onClick}
          className={'cursor-move pointer-events-auto'}
        />
      </g>
    </svg>
  );
}
