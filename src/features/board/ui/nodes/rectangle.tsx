import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';
import type { NodeConfiguration } from '../../model/nodes';

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

  console.log(configuration, 'conf');

  return (
    <svg className="absolute left-0 top-0 pointer-events-none overflow-visible">
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
          rx={8}
          fill="white"
          stroke="#99a1af"
          strokeWidth={configuration.stroke === 'dashed' ? 5 : 2}
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
