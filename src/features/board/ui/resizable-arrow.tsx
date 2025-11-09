import type { Point } from '../domain/point';

export type ArrowResizeDirection = 'start' | 'end';

export const ResizableArrow = ({
  start,
  end,
  onMouseDown,
}: {
  start: Point;
  end: Point;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>, dir: ArrowResizeDirection) => void;
}) => {
  const handleSize = 16;
  const dotSize = 10;

  const handles = [
    { dir: 'start' as const, x: start.x, y: start.y },
    { dir: 'end' as const, x: end.x, y: end.y },
  ];
  return (
    <>
      {handles.map(({ dir, x, y }) => (
        <foreignObject
          key={dir}
          x={x - handleSize / 2}
          y={y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          className="pointer-events-auto relative overflow-visible"
        >
          <div
            onMouseDown={(e) => onMouseDown?.(e, dir)}
            style={{
              width: dotSize,
              height: dotSize,
            }}
            className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border cursor-pointer rounded-full transition-shadow border-blue-400 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.5)]"
          />
        </foreignObject>
      ))}
    </>
  );
};
