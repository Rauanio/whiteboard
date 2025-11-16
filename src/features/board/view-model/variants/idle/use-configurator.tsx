import type { ViewModelProps } from '../../view-model';
import type { ViewModelConfiguratorActions, ViewModelNode } from '../../view-model-type';
import type { IdleViewState } from '../idle';

export const useConfigurator = ({ nodesModel }: ViewModelProps) => {
  const getSelectedNodes = (state: IdleViewState): ViewModelNode | undefined => {
    if (state.selectedIds.size > 0) {
      const node = nodesModel.nodes.find((node) => state.selectedIds.has(node.id));
      return node;
    }
  };

  const getConfiguratorType = (state: IdleViewState) => {
    const node = getSelectedNodes(state);

    return node ? node.type : 'rectangle';
  };

  const getNodesConfiguration = (state: IdleViewState) => {
    const node = getSelectedNodes(state);

    return node?.configuration;
  };

  const getConfiguratorActions = (state: IdleViewState): ViewModelConfiguratorActions => {
    const selectedIds = Array.from(state.selectedIds);

    return {
      setStrokeStyle: (strokeStyle) => {
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
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
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
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
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
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
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
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
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
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
        nodesModel.updateNodesConfiguration(selectedIds, (node) => {
          return {
            ...node,
            configuration: {
              ...node.configuration,
              edge,
            },
          };
        });
      },
    };
  };

  return { getNodesConfiguration, getConfiguratorType, getConfiguratorActions };
};
