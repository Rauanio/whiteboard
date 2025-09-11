import type { BackgroundVariant } from './types';

interface DotPatternProps {
  radius: number;
  className?: string;
  color: string;
}

export function DotPattern({ radius, color, className }: DotPatternProps) {
  return <circle fill={color} cx={radius} cy={radius} r={radius} className={className} />;
}

interface LinePatternProps {
  dimensions: [number, number];
  lineWidth: number;
  variant: BackgroundVariant;
  className?: string;
  color: string;
}

export function LinePattern({
  dimensions,
  lineWidth,
  className,
  color,
}: LinePatternProps) {
  return (
    <path
      strokeWidth={lineWidth}
      stroke={color}
      d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${
        dimensions[0]
      }`}
      className={className}
    />
  );
}
