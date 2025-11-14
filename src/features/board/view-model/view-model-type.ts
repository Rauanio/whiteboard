import type { ReactNode } from 'react';
import type { Point } from '../domain/point';
import type { Rect } from '../domain/rect';
import type { FreeHandPoints } from '../domain/svg';
import type { WindowPosition } from '../model/window-position';
import type { ResizeDirection } from '../ui/resizable';
import type { NodeConfiguration } from '../model/nodes';

interface ViewModelStickerNode {
  id: string;
  type: 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isSelected?: boolean;
  isEditing?: boolean;
  configuration: NodeConfiguration;
  onTextChange?: (text: string) => void;
  onClick?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
}

type ViewModelRectangleNode = {
  id: string;
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  configuration: NodeConfiguration;
  onClick?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGRectElement>) => void;
};

type ViewModelCircleNode = {
  id: string;
  type: 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGEllipseElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGEllipseElement>) => void;
};

type ViewModelDiamondNode = {
  id: string;
  type: 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<SVGPolygonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPolygonElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPolygonElement>) => void;
};

type ViewModelArrowNode = {
  id: string;
  type: 'arrow';
  start: Point;
  end: Point;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
};

type ViewModelFreeHandNode = {
  id: string;
  type: 'free-hand';
  points: FreeHandPoints;
  isSelected?: boolean;
  noPointerEvents?: boolean;
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
};

export type ViewModelNode =
  | ViewModelStickerNode
  | ViewModelRectangleNode
  | ViewModelCircleNode
  | ViewModelDiamondNode
  | ViewModelFreeHandNode
  | ViewModelArrowNode;

export interface ViewModel {
  nodes: ViewModelNode[];
  selectionWindow?: Rect;
  configurator?: {
    type: ViewModelNode['type'];
    actions: {
      setStrokeStyle?: (stroke: 'solid' | 'dashed' | 'dotted') => void;
    };
  };
  windowPosition?: WindowPosition;
  hints?: ReactNode;
  layout?: {
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    cursor?: string;
  };
  canvas?: {
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
  overlay?: {
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
  window?: {
    onMouseUp?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onMouseWheel?: (e: WheelEvent) => void;
  };
  actions?: {
    lockActions?: ViewModelAction;
    idleState?: ViewModelAction;
    addSticker?: ViewModelAction;
    addRectangle?: ViewModelAction;
    addCircle?: ViewModelAction;
    addDiamond?: ViewModelAction;
    addArrow?: ViewModelAction;
    addFreeHand?: ViewModelAction;
    canvasDragging?: ViewModelAction;
  };
}

export type ViewModelAction = {
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
