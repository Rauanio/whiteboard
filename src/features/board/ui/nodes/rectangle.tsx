import clsx from 'clsx';
import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';
import { SelectionBox } from '../selection-box';
import { ResizableBox, type ResizeDirection } from '../resizable-box';

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
  ref?: Ref<HTMLButtonElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<HTMLDivElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <SelectionBox height={height} width={width} isSelected={isSelected} x={x} y={y}>
      {isSelected && <ResizableBox onMouseDown={onHandleMouseDown} />}
      <button
        data-id={id}
        ref={ref}
        className={clsx(
          'rounded-lg bg-white w-full cursor-move h-full border shadow-md border-gray-400'
        )}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      ></button>
    </SelectionBox>
  );
}
