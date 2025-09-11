import type { CSSProperties } from 'react';
import type { WindowPosition } from '../../model/window-position';

export type BackgroundVariant = 'dots' | 'lines';

export interface BackgroundProps {
  windowPosition: WindowPosition;
  variant?: BackgroundVariant;
  gap?: number;
  size?: number;
  lineWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  patternClassName?: string;
  style?: CSSProperties;
}
