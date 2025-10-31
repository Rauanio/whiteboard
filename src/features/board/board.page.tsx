import { useNodes } from './model/nodes';
import { useCanvasRect } from './hooks/use-canvas-rect';
import { useLayoutFocus } from './hooks/use-layout-focus';
import { useViewModel } from './view-model/view-model';
import { useWindowEvents } from './hooks/use-window-events';
import { Canvas } from './ui/canvas';
import { SelectionWindow } from './ui/selection-window';
import { Rectangle } from './ui/nodes/rectangle';
import { Sticker } from './ui/nodes/sticker';
import { Layout } from './ui/layout';
import { Overlay } from './ui/overlay';
import { useNodesDimensions } from './hooks/use-nodes-rects';
import { useWindowPositionModel } from './model/window-position';
import { Background } from './ui/background/background';
import { Controls } from './ui/controls/controls';
import { Actions } from './ui/actions';
import { Arrow } from './ui/nodes/arrow';

const BoardPage = () => {
  const nodesModel = useNodes();
  const layoutFocusRef = useLayoutFocus();
  const windowPositionModel = useWindowPositionModel();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { nodeRef, nodesDimensions } = useNodesDimensions();

  const viewModel = useViewModel({
    canvasRect,
    nodesModel,
    nodesDimensions,
    windowPositionModel,
  });

  useWindowEvents(viewModel);

  const windowPosition = viewModel.windowPosition ?? windowPositionModel.position;

  return (
    <Layout
      className={viewModel.layout?.cursor}
      ref={layoutFocusRef}
      onKeyDown={viewModel.layout?.onKeyDown}
    >
      <Background variant="lines" windowPosition={windowPosition} />
      <Canvas
        overlay={
          <Overlay
            onMouseDown={viewModel.overlay?.onMouseDown}
            onMouseUp={viewModel.overlay?.onMouseUp}
            onClick={viewModel.overlay?.onClick}
          />
        }
        windowPosition={windowPosition}
        ref={canvasRef}
        onClick={viewModel.canvas?.onClick}
      >
        {viewModel.nodes.map((node) => {
          if (node.type === 'sticker') {
            return <Sticker key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'rectangle') {
            return <Rectangle key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'arrow') {
            return <Arrow key={node.id} ref={nodeRef} {...node} />;
          }
        })}
        {/* <Arrow isSelected start={{ x: 100, y: 50 }} end={{ x: 200, y: 100 }} /> */}
        {viewModel.selectionWindow && <SelectionWindow {...viewModel.selectionWindow} />}
        {viewModel.rectangleWindow && <Rectangle {...viewModel.rectangleWindow} />}
      </Canvas>

      <Actions actions={viewModel.actions} />
      <Controls canvasRect={canvasRect} windowPositionModel={windowPositionModel} />
    </Layout>
  );
};

export const Component = BoardPage;
