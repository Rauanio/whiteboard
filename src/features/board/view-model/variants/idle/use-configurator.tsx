import type { ViewModelProps } from '../../view-model';
import type { ViewModelConfiguratorActions, ViewModelNode } from '../../view-model-type';

export const useConfigurator = ({ nodesModel }: ViewModelProps) => {
  const getSelectedNodes = (selectedIds: Set<string>): ViewModelNode | undefined => {
    if (selectedIds.size > 0) {
      const node = nodesModel.nodes.find((node) => selectedIds.has(node.id));
      return node;
    }
  };

  const getConfiguratorType = (selectedIds: Set<string>) => {
    const node = getSelectedNodes(selectedIds);

    return node ? node.type : 'rectangle';
  };

  const getNodesConfiguration = (selectedIds: Set<string>) => {
    const node = getSelectedNodes(selectedIds);

    return node?.configuration;
  };

  const getConfiguratorActions = (
    selectedIds: Set<string>
  ): ViewModelConfiguratorActions => {
    const ids = Array.from(selectedIds);

    return {
      setStrokeStyle: (strokeStyle) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              strokeStyle,
            },
          };
        });
      },
      setStrokeWidth: (strokeWidth) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              strokeWidth,
            },
          };
        });
      },
      setStroke: (stroke) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              stroke,
            },
          };
        });
      },
      setOpacity: (opacity) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              opacity,
            },
          };
        });
      },
      setBackground: (background) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              background,
            },
          };
        });
      },
      setEdges: (edge) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              edge,
            },
          };
        });
      },
      setLayer: (layer) => {
        nodesModel.updateNodesConfiguration(ids, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              layer,
            },
          };
        });
      },
      deleteNode: () => nodesModel.deleteNodes(ids),

      duplicateNode: () => {
        nodesModel.duplicateNode(ids);
      },
    };
  };

  return { getNodesConfiguration, getConfiguratorType, getConfiguratorActions };
};
