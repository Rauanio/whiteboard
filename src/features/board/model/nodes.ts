import type { Rect } from '../domain/rect';
import { type Point } from '../domain/point';
import { useStateHistory } from './history';
import type { FreeHandPoints } from '../domain/svg';
import {
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  DEFAULT_ELEMENT_STROKE_PICKS,
} from '@/shared/common/colors';
import type { Edge, Layer, StrokeStyle, StrokeWidth } from '../domain/types';

export interface NodeConfiguration {
  stroke: string;
  background: string;
  strokeStyle: StrokeStyle;
  strokeWidth: StrokeWidth;
  opacity: number[];
  edge: Edge;
  layer: Layer;
}

interface NodeBase {
  id: string;
  type: string;
  configuration: NodeConfiguration;
}

interface StickerNode extends NodeBase, Rect {
  type: 'sticker';
  text: string;
}

interface RectangleNode extends NodeBase, Rect {
  type: 'rectangle';
}

interface CircleNode extends NodeBase, Rect {
  type: 'circle';
}

interface DiamondNode extends NodeBase, Rect {
  type: 'diamond';
}

interface ArrowNode extends NodeBase {
  type: 'arrow';
  start: Point;
  end: Point;
}

interface FreeHandNode extends NodeBase {
  type: 'free-hand';
  points: FreeHandPoints;
}

export type Node =
  | StickerNode
  | RectangleNode
  | DiamondNode
  | CircleNode
  | ArrowNode
  | FreeHandNode;

export interface NodeUpdatePosition {
  id: string;
  point?: Point;
  points?: FreeHandPoints;
  type?: 'start' | 'end';
}

export interface NodeUpdateResizing {
  id: string;
  point?: Point;
  points?: FreeHandPoints;
  width?: number;
  height?: number;
  type?: 'start' | 'end';
}

export const configuration: NodeConfiguration = {
  strokeStyle: 'solid',
  strokeWidth: 'thin',
  stroke: DEFAULT_ELEMENT_STROKE_PICKS[0],
  background: DEFAULT_ELEMENT_BACKGROUND_PICKS[1],
  opacity: [100],
  edge: 'round',
  layer: 'back',
};

export const useNodes = () => {
  const {
    state: nodes,
    set: setNodes,
    undo,
    redo,
    canRedo,
    canUndo,
  } = useStateHistory<Node[]>([
    {
      id: '1',
      type: 'rectangle',
      height: 200,
      width: 200,
      x: 100,
      y: 100,
      configuration,
    },
    {
      id: '2',
      type: 'circle',
      height: 100,
      width: 100,
      x: 500,
      y: 200,
      configuration,
    },
    {
      id: '3',
      type: 'diamond',
      configuration,
      height: 100,
      width: 100,
      x: 750,
      y: 200,
    },
  ]);

  const addStickerNode = (data: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'sticker',
        configuration: {
          ...configuration,
          background: '#FFEA00',
        },
        ...data,
      },
    ]);
  };

  const updateStickerText = (stickerId: string, text: string) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === stickerId ? { ...node, text } : node))
    );
  };

  const addRectangleNode = (data: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'rectangle',
        configuration,
        ...data,
      },
    ]);
  };

  const addCircleNode = (data: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'circle',
        configuration,
        ...data,
      },
    ]);
  };

  const addDiamondNode = (data: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'diamond',
        configuration,
        ...data,
      },
    ]);
  };

  const addArrowNode = (data: { start: Point; end: Point }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'arrow',
        configuration,
        ...data,
      },
    ]);
  };

  const addFreeHandNode = (data: { points: FreeHandPoints }) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'free-hand',
        configuration,
        ...data,
      },
    ]);
  };

  const deleteNodes = (ids: string[]) => {
    setNodes((prev) => {
      const arrowRelativeIds = prev
        .filter(
          (node) =>
            (node.type === 'arrow' &&
              node.start.relativeTo &&
              ids.includes(node.start.relativeTo)) ||
            (node.type == 'arrow' &&
              node.end.relativeTo &&
              ids.includes(node.end.relativeTo))
        )
        .map((node) => node.id);

      return prev.filter(
        (node) => !ids.includes(node.id) && !arrowRelativeIds.includes(node.id)
      );
    });
  };

  const updateNodesConfiguration = (
    ids: string[],
    configurator: (node: Node) => Node
  ) => {
    setNodes((prev) =>
      prev.map((node) => (ids.includes(node.id) ? configurator(node) : node))
    );
  };

  const updateNodesPositions = (positions: NodeUpdatePosition[]) => {
    const record = Object.fromEntries(
      positions.map((p) => [`${p.id}${p.type ?? ''}`, p])
    );

    setNodes((lastNodes) =>
      lastNodes.map((node) => {
        if (node.type === 'arrow') {
          const newPosition = record[`${node.id}start`];
          const newEndPosition = record[`${node.id}end`];

          return {
            ...node,
            start: newPosition?.point ?? node.start,
            end: newEndPosition?.point ?? node.end,
          };
        }

        if (node.type === 'free-hand') {
          const newPosition = record[node.id];
          if (newPosition) {
            return { ...node, points: newPosition.points ?? [] };
          }
        }

        const newPosition = record[node.id];
        if (newPosition) {
          return { ...node, ...newPosition.point };
        }

        return node;
      })
    );
  };

  const resizeNodes = (position: NodeUpdateResizing[]) => {
    const record = Object.fromEntries(position.map((p) => [`${p.id}${p.type ?? ''}`, p]));

    setNodes((lastNodes) =>
      lastNodes.map((node) => {
        if (node.type === 'arrow') {
          const newStart = record[`${node.id}start`];
          const newEnd = record[`${node.id}end`];

          return {
            ...node,
            start: newStart?.point ?? node.start,
            end: newEnd?.point ?? node.end,
          };
        }

        if (node.type === 'free-hand') {
          const newPosition = record[node.id];

          if (newPosition) {
            return {
              ...node,
              points: newPosition.points ?? [],
            };
          }
        } else {
          const newPosition = record[node.id];

          if (newPosition) {
            return {
              ...node,
              ...newPosition.point,
              height: newPosition?.height ?? node.height,
              width: newPosition?.width ?? node.width,
            };
          }
        }

        return node;
      })
    );
  };

  const duplicateNode = (ids: string[]) => {
    setNodes((prev) => {
      const toDuplicate = prev.filter((n) => ids.includes(n.id));

      const duplicated = toDuplicate.map((node) => {
        if (!(node.type === 'arrow' || node.type === 'free-hand')) {
          return {
            ...node,
            id: crypto.randomUUID(),
            x: node.x + 10,
            y: node.y + 10,
          };
        }
        return node;
      });

      return [...prev, ...duplicated];
    });
  };

  console.log(nodes);

  return {
    nodes,
    addStickerNode,
    addRectangleNode,
    addDiamondNode,
    addCircleNode,
    addArrowNode,
    addFreeHandNode,
    updateStickerText,
    deleteNodes,
    updateNodesConfiguration,
    updateNodesPositions,
    resizeNodes,
    duplicateNode,
    undo,
    redo,
    canRedo,
    canUndo,
  };
};

export type NodesModel = ReturnType<typeof useNodes>;
