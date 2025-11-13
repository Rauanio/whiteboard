import clsx from 'clsx';
import { getDoubleHandles, getHandles } from '../domain/svg';
import type { Point } from '../domain/point';

export type DefaultResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type ArrowResizeDirection = 'start' | 'end';

export type ResizeDirection = DefaultResizeDirection | ArrowResizeDirection;

interface ResizablePropsBase<T extends 'default' | 'double'> {
  type: T;
  onHandleMouseDown?: (
    e: React.MouseEvent<SVGElement>,
    dir: T extends 'default' ? DefaultResizeDirection : ArrowResizeDirection
  ) => void;
}

interface ResizableDefaultProps extends ResizablePropsBase<'default'> {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResizableDoubleProps extends ResizablePropsBase<'double'> {
  start: Point;
  end: Point;
}

type ResizableProps = ResizableDefaultProps | ResizableDoubleProps;

export const HANDLE_SIZE = 12;
export const STROKE_WIDTH = 2;

export const Resizable = (props: ResizableProps) => {
  const { type, onHandleMouseDown } = props;
  const handles =
    type === 'default'
      ? getHandles(props.x, props.y, props.width, props.height)
      : getDoubleHandles(props.start, props.end);

  const mappedHandlersStyle: Record<DefaultResizeDirection, string> = {
    'top-right': 'cursor-nesw-resize',
    'top-left': 'cursor-nwse-resize',
    'bottom-right': 'cursor-nwse-resize',
    'bottom-left': 'cursor-nesw-resize',
  };

  return (
    <g>
      {handles.map(({ dir, x, y }) =>
        type === 'default' ? (
          <rect
            key={dir}
            x={x}
            y={y}
            width={HANDLE_SIZE}
            height={HANDLE_SIZE}
            fill="white"
            stroke="#3b82f6"
            strokeWidth={STROKE_WIDTH}
            rx={2}
            className={clsx(
              'pointer-events-auto',
              mappedHandlersStyle[dir as DefaultResizeDirection]
            )}
            onMouseDown={(e) => onHandleMouseDown?.(e, dir as DefaultResizeDirection)}
          />
        ) : (
          <circle
            cx={x}
            cy={y}
            r={5}
            fill="white"
            stroke="#3b82f6"
            className={clsx('pointer-events-auto cursor-pointer')}
            onMouseDown={(e) => onHandleMouseDown?.(e, dir as ArrowResizeDirection)}
          />
        )
      )}
    </g>
  );
};
