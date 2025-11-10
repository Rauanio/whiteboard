import { Resizable, type ResizeDirection } from './resizable';

interface SelectableProps {
  width: number;
  height: number;
  x: number;
  y: number;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
}

export const Selectable = ({
  height,
  width,
  x,
  y,
  onHandleMouseDown,
}: SelectableProps) => {
  return (
    <>
      <rect
        x={x - 6}
        y={y - 6}
        width={width + 12}
        height={height + 12}
        fill="transparent"
        stroke="#3b82f6"
        strokeWidth={2}
        rx={4}
        ry={4}
      />

      <Resizable
        type="default"
        height={height}
        width={width}
        x={x}
        y={y}
        onHandleMouseDown={onHandleMouseDown}
      />
    </>
  );
};
