import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';
import { DotPattern, LinePattern } from './patterns';
import type { BackgroundProps } from './types';

const BackgroundComponent = ({
  windowPosition,
  variant = 'dots',
  gap = 20,
  size = 1,
  lineWidth = 1,
  color = '#e5e7eb',
  bgColor = 'transparent',
  className,
  patternClassName,
  style,
}: BackgroundProps) => {
  const { x, y, zoom } = windowPosition;

  const patternId = `pattern-${variant}`;
  const scaledGap: [number, number] = [gap * zoom, gap * zoom];
  const scaledSize = size * zoom;

  const patternDimensions: [number, number] = scaledGap;

  return (
    <svg
      className={clsx('absolute inset-0 w-full h-full', className)}
      style={
        {
          ...style,
          backgroundColor: bgColor,
        } as CSSProperties
      }
    >
      <pattern
        id={patternId}
        x={-x * zoom}
        y={-y * zoom}
        width={scaledGap[0]}
        height={scaledGap[1]}
        patternUnits="userSpaceOnUse"
      >
        {variant === 'dots' ? (
          <DotPattern color={color} radius={scaledSize} className={patternClassName} />
        ) : (
          <LinePattern
            color={color}
            dimensions={patternDimensions}
            lineWidth={lineWidth}
            variant={variant}
            className={patternClassName}
          />
        )}
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export const Background = memo(BackgroundComponent);
