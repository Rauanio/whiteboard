import type { Rect } from '../domain/rect';
import { type Point } from '../domain/point';
import { useStateHistory } from './history';
import type { FreeHandPoints } from '../domain/svg';

interface NodeBase {
  id: string;
  type: string;
}

interface StickerNode extends NodeBase, Rect {
  type: 'sticker';
  text: string;
}

interface RectangleNode extends NodeBase, Rect {
  type: 'rectangle';
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

export type Node = StickerNode | RectangleNode | ArrowNode | FreeHandNode;

export interface NodeUpdatePosition {
  id: string;
  point?: Point;
  points?: FreeHandPoints;
  type?: 'start' | 'end';
}

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
        ...data,
      },
    ]);
  };

  const addFreeHandNode = (points: FreeHandPoints) => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'free-hand',
        points,
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
        if (node.type === 'sticker' || node.type === 'rectangle') {
          const newPosition = record[node.id];
          if (newPosition) {
            return { ...node, ...newPosition.point };
          }
        }

        if (node.type === 'free-hand') {
          const newPosition = record[node.id];

          return { ...node, points: newPosition.points ?? [] };
        }

        return node;
      })
    );
  };

  console.log(nodes, 'nodes');

  const resizeNodes = (
    position: {
      id: string;
      point: Point;
      width?: number;
      height?: number;
      type?: 'start' | 'end';
    }[]
  ) => {
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

        if (node.type === 'sticker' || node.type === 'rectangle') {
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

  return {
    nodes,
    addStickerNode,
    addRectangleNode,
    addArrowNode,
    addFreeHandNode,
    updateStickerText,
    deleteNodes,
    updateNodesPositions,
    resizeNodes,
    undo,
    redo,
    canRedo,
    canUndo,
  };
};

export type NodesModel = ReturnType<typeof useNodes>;
