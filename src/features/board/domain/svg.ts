import { STROKE_WIDTH } from '@/shared/common/contants';
import {
  HANDLE_SIZE,
  type DefaultResizeDirection,
  type ArrowResizeDirection,
} from '../ui/resizable';
import type { Point } from './point';
import type { StrokeStyle, StrokeWidth } from './types';

export type FreeHandPoints = (number[] | { x: number; y: number; pressure?: number })[];

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

export function getHandles(
  x: number,
  y: number,
  width: number,
  height: number
): { dir: DefaultResizeDirection; x: number; y: number }[] {
  return [
    {
      dir: 'top-left',
      x: x - HANDLE_SIZE,
      y: y - HANDLE_SIZE,
    },
    {
      dir: 'top-right',
      x: x + width,
      y: y - HANDLE_SIZE,
    },
    {
      dir: 'bottom-left',
      x: x - HANDLE_SIZE,
      y: y + height,
    },
    {
      dir: 'bottom-right',
      x: x + width,
      y: y + height,
    },
  ];
}

export function getDoubleHandles(
  start: Point,
  end: Point
): { dir: ArrowResizeDirection; x: number; y: number }[] {
  return [
    { dir: 'start' as const, x: start.x, y: start.y },
    { dir: 'end' as const, x: end.x, y: end.y },
  ];
}

export function flipDirection(
  direction: DefaultResizeDirection,
  axis: 'x' | 'y'
): DefaultResizeDirection {
  const horizontalFlip: Record<DefaultResizeDirection, DefaultResizeDirection> = {
    'top-left': 'top-right',
    'top-right': 'top-left',
    'bottom-left': 'bottom-right',
    'bottom-right': 'bottom-left',
  };

  const verticalFlip: Record<DefaultResizeDirection, DefaultResizeDirection> = {
    'top-left': 'bottom-left',
    'bottom-left': 'top-left',
    'top-right': 'bottom-right',
    'bottom-right': 'top-right',
  };

  if (axis === 'x') return horizontalFlip[direction];
  if (axis === 'y') return verticalFlip[direction];

  return direction;
}

export const getStrokeStyle = (style: StrokeStyle) => {
  switch (style) {
    case 'dashed':
      return '8';
    case 'dotted':
      return '4 4';
    default:
      return '0';
  }
};

export const getStrokeWidth = (width: StrokeWidth) => {
  switch (width) {
    case 'thin':
      return STROKE_WIDTH.thin;
    case 'bold':
      return STROKE_WIDTH.bold;
    case 'extra-bold':
      return STROKE_WIDTH.extraBold;
    default:
      throw new Error('stroke width is not found');
  }
};
