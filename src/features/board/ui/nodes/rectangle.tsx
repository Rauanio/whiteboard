import clsx from 'clsx';
import type { Rect } from '../../domain/rect';
import type { Ref } from 'react';

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
  onMouseUp,
}: Rect & {
  id?: string;
  isSelected?: boolean;
  ref?: Ref<HTMLButtonElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: width,
        height: height,
      }}
      className={clsx(
        'absolute inset-0 bg-transparent p-1',
        isSelected && 'outline-2 outline-blue-400'
      )}
    >
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
    </div>
  );
}
