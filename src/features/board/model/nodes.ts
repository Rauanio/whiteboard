import { useState } from 'react';
import type { Rect } from '../domain/rect';

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

type Node = StickerNode | RectangleNode;

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

  const deleteNodes = (ids: string[]) => {
    setNodes((prev) => prev.filter((node) => !ids.includes(node.id)));
  };

  const updateNodePosition = (positions: { id: string; x: number; y: number }[]) => {
    const record = Object.fromEntries(positions.map((p) => [p.id, p]));

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const newPosition = record[node.id];

        if (newPosition) {
          return {
            ...node,
            x: newPosition.x,
            y: newPosition.y,
          };
        }
        return node;
      })
    );
  };

  return {
    nodes,
    addStickerNode,
    updateStickerText,
    addRectangleNode,
    deleteNodes,
    updateNodePosition,
  };
};

export type NodesModel = ReturnType<typeof useNodes>;
