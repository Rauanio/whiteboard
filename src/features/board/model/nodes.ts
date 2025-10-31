import { useState } from 'react';
import type { Rect } from '../domain/rect';
import type { Point } from '../domain/point';

interface NodeBase {
  id: string;
  type: string;
}

interface StickerNode extends NodeBase {
  type: 'sticker';
  text: string;
  x: number;
  y: number;
}

interface RectangleNode extends NodeBase, Rect {
  type: 'rectangle';
  text: string;
}

interface ArrowNode extends NodeBase {
  type: 'arrow';
  start: Point;
  end: Point;
}

type Node = StickerNode | RectangleNode | ArrowNode;

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      text: 'default',
      x: 100,
      y: 200,
      type: 'sticker',
    },
    {
      id: '2',
      text: '',
      width: 100,
      height: 100,
      type: 'rectangle',
      x: 300,
      y: 200,
    },
    {
      id: '3',
      type: 'arrow',
      start: { x: 100, y: 50 },
      end: { x: 200, y: 40 },
    },
  ]);

  const addStickerNode = (data: { text: string; x: number; y: number }) => {
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

  const deleteNodes = (ids: string[]) => {
    setNodes((prev) => prev.filter((node) => !ids.includes(node.id)));
  };

  const updateNodesPositions = (
    positions: {
      id: string;
      point: Point;
      type?: 'start' | 'end';
    }[]
  ) => {
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

        return node;
      })
    );
  };

  return {
    nodes,
    addStickerNode,
    addRectangleNode,
    addArrowNode,
    updateStickerText,
    deleteNodes,
    updateNodesPositions,
  };
};

export type NodesModel = ReturnType<typeof useNodes>;
