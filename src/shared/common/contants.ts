export const STROKE_WIDTH = {
  thin: 1,
  bold: 2,
  extraBold: 4,
} as const;

export const ZOOM_STEP = 0.1;
export const DROPDOWN_ZOOM_STEPS = [50, 70, 100, 150, 200];
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 500;

export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_GRID_STEP = 5;

export const DEFAULT_FONT_SIZE = 20;
// export const DEFAULT_FONT_FAMILY: FontFamilyValues = FONT_FAMILY.Excalifont;
export const DEFAULT_TEXT_ALIGN = 'left';
export const DEFAULT_VERTICAL_ALIGN = 'top';

export const CURSOR_TYPE = {
  TEXT: 'text',
  CROSSHAIR: 'crosshair',
  GRABBING: 'grabbing',
  GRAB: 'grab',
  POINTER: 'pointer',
  MOVE: 'move',
  AUTO: '',
};
