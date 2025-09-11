import type { Rect } from '../domain/rect';
import type { WindowPosition } from '../model/window-position';

interface ViewModelStickerNode {
  id: string;
  type: 'sticker';
  x: number;
  y: number;
  text: string;
  isSelected?: boolean;
  isEditing?: boolean;
  onTextChange?: (text: string) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type ViewModelRectangleNode = {
  id: string;
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ViewModelNode = ViewModelStickerNode | ViewModelRectangleNode;

export interface ViewModel {
  nodes: ViewModelNode[];
  selectionWindow?: Rect;
  rectangleWindow?: Rect;
  windowPosition?: WindowPosition;
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
    idleState?: ViewModelAction;
    addSticker?: ViewModelAction;
    addRectangle?: ViewModelAction;
    canvasDragging?: ViewModelAction;
  };
}

export type ViewModelAction = {
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
