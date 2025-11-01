import clsx from 'clsx';
import { type ReactNode } from 'react';
import type { Rect } from '../domain/rect';

interface SelectionBoxProps extends Omit<Rect, 'width' | 'height'> {
  width?: number;
  height?: number;
  isSelected?: boolean;
  children: ReactNode;
}

export const SelectionBox = ({
  x,
  y,
  width,
  height,
  isSelected,
  children,
}: SelectionBoxProps) => {
  return (
    <div
      style={{
        transform: `translate(${x - 4}px, ${y - 4}px)`,
        width: width ? width + 8 : 'max-content',
        height: height ? height + 8 : 'max-content',
      }}
      className={clsx(
        'absolute  bg-transparent p-1',
        isSelected && 'outline-2 outline-blue-400'
      )}
    >
      {children}
    </div>
  );
};
